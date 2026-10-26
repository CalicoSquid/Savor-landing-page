import { SAVOR_ORIGINALS } from '../src/data/originals.js'
// Production-bundle browser regression for theme navigation and transitions.
// Run after npm run build. No extra browser packages; uses local Chrome/CDP.
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import http from 'node:http'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { setTimeout as delay } from 'node:timers/promises'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const profile = await fs.mkdtemp(path.join(root, '.homepage-browser-'))
const server = http.createServer(async (req, res) => {
  try {
    let filename = path.resolve(dist, `.${new URL(req.url, 'http://localhost').pathname}`)
    if (filename !== dist && !filename.startsWith(`${dist}${path.sep}`)) throw new Error('Outside preview')
    if ((await fs.stat(filename)).isDirectory()) filename = path.join(filename, 'index.html')
    res.setHeader('Content-Type', ({ '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.webp': 'image/webp' })[path.extname(filename)] || 'application/octet-stream')
    res.end(await fs.readFile(filename))
  } catch { res.statusCode = 404; res.end('Not found') }
})
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
const base = `http://127.0.0.1:${server.address().port}`
const child = spawn(process.env.BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--disable-gpu', '--no-first-run', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank',
], { windowsHide: true, stdio: 'ignore' })
let socket
try {
  let port
  for (let i = 0; i < 150; i++) {
    try { port = Number((await fs.readFile(path.join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]); break } catch { await delay(100) }
  }
  assert.ok(port, 'Chrome must start')
  const target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find(item => item.type === 'page')
  socket = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }))
  let id = 0
  const pending = new Map()
  const errors = []
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data)
    if (message.id) {
      const task = pending.get(message.id)
      pending.delete(message.id)
      if (message.error) task.reject(new Error(JSON.stringify(message.error)))
      else task.resolve(message.result)
    } else if (message.method === 'Runtime.exceptionThrown') errors.push(JSON.stringify(message.params.exceptionDetails))
    else if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') {
      const text = message.params.args.map(arg => arg.value || arg.description || '').join(' ')
      if (/hydrat|Minified React error/i.test(text)) errors.push(text)
    }
  })
  const command = (method, params = {}) => new Promise((resolve, reject) => {
    pending.set(++id, { resolve, reject })
    socket.send(JSON.stringify({ id, method, params }))
  })
  const evaluate = async expression => {
    const result = await command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text)
    return result.result.value
  }
  const navigate = async route => { await command('Page.navigate', { url: `${base}${route}` }); await delay(700) }
  const colour = () => evaluate('document.documentElement.style.getPropertyValue("--primary")')
  const pick = name => evaluate(`document.querySelector('[aria-label="Use ${name} theme"]').click()`)
  const screenshot = async name => {
    const shot = await command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
    await fs.writeFile(path.join(root, `${name}.local.png`), Buffer.from(shot.data, 'base64'))
  }
  await command('Runtime.enable')
  const googleRequests=[];
  const contentTypes={'.html':'text/html','.js':'application/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.woff':'font/woff'};
  socket.addEventListener('message', async event=>{
    const message=JSON.parse(event.data);
    if(message.method!=='Fetch.requestPaused')return;
    const {requestId,request}=message.params;
    try {
      const url=new URL(request.url);
      if(url.hostname==='www.googletagmanager.com'){
        googleRequests.push(request.url);
        await command('Fetch.fulfillRequest',{requestId,responseCode:200,responseHeaders:[{name:'content-type',value:'application/javascript'}],body:Buffer.from('// Test stub: no analytics requests leave the browser.').toString('base64')});
      }else if(url.hostname==='getsavor.recipes'){
        let filename=path.resolve(dist,'.'+decodeURIComponent(url.pathname));
        assert.ok(filename.startsWith(dist+path.sep)||filename===dist);
        if((await fs.stat(filename)).isDirectory())filename=path.join(filename,'index.html');
        const body=await fs.readFile(filename);
        await command('Fetch.fulfillRequest',{requestId,responseCode:200,responseHeaders:[{name:'content-type',value:contentTypes[path.extname(filename)]||'application/octet-stream'}],body:body.toString('base64')});
      }else await command('Fetch.failRequest',{requestId,errorReason:'BlockedByClient'});
    }catch{await command('Fetch.fulfillRequest',{requestId,responseCode:404,body:''});}
  });
  await command('Fetch.enable',{patterns:[{urlPattern:'*'}]});
  await command('Page.navigate',{url:'https://getsavor.recipes/originals/?email=private@example.com'}); await delay(900);
  assert.equal(await evaluate('document.querySelectorAll(".analytics-consent").length'),1);
  assert.equal(googleRequests.length,0,'No Google request before consent');
  await command('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  assert.ok(await evaluate('document.documentElement.scrollWidth<=innerWidth'));
  await screenshot('website-analytics-consent-mobile');
  await evaluate('[...document.querySelectorAll(".analytics-consent button")].find(b=>b.textContent==="No thanks").click()');
  assert.equal(googleRequests.length,0,'No Google request after rejecting');
  await evaluate('document.querySelector(".analytics-settings").click()');
  await evaluate('[...document.querySelectorAll(".analytics-consent button")].find(b=>b.textContent==="Allow analytics").click()'); await delay(150);
  assert.equal(googleRequests.length,1);
  assert.ok(googleRequests[0].includes('G-FVYNQFT5Y9'));
  assert.ok(!googleRequests[0].includes('G-3XL43BMRQS'));
  assert.equal(await evaluate('dataLayer.filter(c=>c[0]==="event"&&c[1]==="page_view").length'),1);
  assert.ok(!await evaluate('JSON.stringify(dataLayer).includes("private@example.com")'));
  await evaluate(`document.querySelector('.originals-filters a[href*="autopilot"]').click()`); await delay(100);
  assert.equal(await evaluate('document.querySelectorAll(".originals-card").length'),SAVOR_ORIGINALS.filter(r=>r.series==='Dinner on Autopilot').length);
  assert.equal(await evaluate('dataLayer.filter(c=>c[0]==="event"&&c[1]==="series_filter").length'),1);
  assert.equal(await evaluate('dataLayer.filter(c=>c[0]==="event"&&c[1]==="page_view").length'),1);
  await evaluate('document.addEventListener("click",e=>{if(e.target.closest("a"))e.preventDefault()});const a=document.createElement("a");a.href="https://play.google.com/store/apps/details?id=com.calicosquid.savorrecipes";a.textContent="Get the app";document.body.appendChild(a);a.click()');
  assert.equal(await evaluate('dataLayer.filter(c=>c[0]==="event"&&c[1]==="app_store_click").length'),1);
  await evaluate('document.cookie="_ga=test; Path=/";document.querySelector(".analytics-settings").click()');
  await evaluate('[...document.querySelectorAll(".analytics-consent button")].find(b=>b.textContent==="No thanks").click()');
  const eventCount=await evaluate('dataLayer.filter(c=>c[0]==="event").length');
  await evaluate(`document.querySelector('.originals-filters a[href*="cupboard"]').click()`);await delay(100);
  assert.equal(await evaluate('dataLayer.filter(c=>c[0]==="event").length'),eventCount);
  assert.ok(!await evaluate('document.cookie.includes("_ga=")'));
  await command('Page.reload');await delay(700);
  assert.equal(await evaluate('document.querySelectorAll("script[src*=googletagmanager]").length'),0);
  assert.deepEqual(errors,[],'No runtime or hydration errors');
  await command('Browser.close');
  console.log('Website analytics browser checks passed: opt-in, reject, withdrawal/reload, correct stream, no pre-consent Google requests, no query data, click/filter events and mobile layout.');
} finally {socket?.close();child.kill();server.close();}
