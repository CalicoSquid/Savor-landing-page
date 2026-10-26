import { PINTEREST_RECIPES } from '../src/data/pinterest.js'
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
    if (new URL(req.url,'http://localhost').pathname.startsWith('/r/')) {res.setHeader('Content-Type','text/html');res.end(await fs.readFile(path.join(dist,'app.html')));return;}
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
  for(const [slug,pin] of Object.entries(PINTEREST_RECIPES)) {
    await navigate('/blog/'+slug+'/');
    assert.equal(await evaluate(`document.querySelector('meta[property="og:title"]').content`),pin.title);
    assert.equal(await evaluate(`document.querySelector('meta[property="og:description"]').content`),pin.description);
    const saved=await evaluate('Object.fromEntries(new URL(document.querySelector(".pinterest-share a").href).searchParams)');
    assert.equal(saved.description,pin.description);
    assert.equal(saved.url,'https://getsavor.recipes/blog/'+slug+'/');
    assert.equal(await evaluate('document.querySelector("#recipe img").alt'),pin.altText);
    await evaluate('Object.defineProperty(navigator,"clipboard",{configurable:true,value:{writeText:async text=>{window.__copied=text}}})');
    await evaluate('document.querySelector(".pinterest-copy summary").click()');
    await evaluate(`document.querySelector('[aria-label="Copy Pin alt text"]').click()`);
    assert.equal(await evaluate('window.__copied'),pin.altText);
    await evaluate(`document.querySelector('[aria-label="Copy Pin title"]').click()`);
    assert.equal(await evaluate('window.__copied'),pin.title);
    for(const width of [1440,390,320]) {
      await command('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<500});await delay(100);
      assert.ok(await evaluate('document.documentElement.scrollWidth<=innerWidth'),slug+' fits '+width);
      if(slug==='smash-burgers-pickle-mustard-sauce' && width!==320){await evaluate('document.querySelector(".pinterest-share").scrollIntoView({behavior:"instant",block:"start"})');await screenshot('pinterest-burger-'+width);}
    }
  }
  socket.addEventListener('message',async event=>{
    const message=JSON.parse(event.data);if(message.method!=='Fetch.requestPaused')return;
    const {requestId,request}=message.params;
    const id=JSON.parse(request.postData||'{}').variables?.id;
    const recipe={id,name:'Test Soup & Beans',description:'A simple soup with beans and vegetables.',image:id==='broken-photo'?'/missing.jpg':'/blog/smoky-tomato-rice-rustic.jpg',ingredients:['Beans'],instructions:['Cook.'],times:{total:{minutes:30}},recipeYield:'4 servings',sourceUrl:'https://publisher.example/soup',imageCredit:{photographer:'Test Photographer'}};
    await command('Fetch.fulfillRequest',{requestId,responseCode:200,responseHeaders:[{name:'content-type',value:'application/json'},{name:'access-control-allow-origin',value:'*'},{name:'access-control-allow-methods',value:'POST, OPTIONS'},{name:'access-control-allow-headers',value:'content-type'}],body:Buffer.from(JSON.stringify({data:{publicRecipe:recipe}})).toString('base64')});
  });
  await command('Fetch.enable',{patterns:[{urlPattern:'*graphql*'}]});
  for(const id of ['test-photo','broken-photo']) {
    await navigate('/r/'+id);await delay(500);
    const saved=await evaluate('Object.fromEntries(new URL(document.querySelector(".pinterest-share a").href).searchParams)');
    assert.ok(saved.description.includes('Total time: 30 minutes'));
    assert.ok(saved.description.includes('publisher.example'));
    assert.ok(saved.description.includes('Photo: Test Photographer'));
    assert.equal(Boolean(saved.media),id==='test-photo');
    await evaluate('document.querySelector(".pinterest-copy summary").click()');
    assert.ok(await evaluate('document.documentElement.scrollWidth<=innerWidth'),'Shared Pin text fits phone width');
  }
  assert.deepEqual(errors,[],'No runtime or hydration errors');await command('Browser.close');
  console.log('Pinterest browser checks passed: five Originals, metadata, Save descriptions, copy controls, mobile layout, shared recipes and failed-image fallback.');
}finally{socket?.close();child.kill();server.close();}
