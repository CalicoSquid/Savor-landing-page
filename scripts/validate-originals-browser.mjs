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
  await navigate('/originals/');
  await evaluate('Promise.all([...document.querySelectorAll(".originals-card img")].map(async i=>{i.src=new URL(i.src).pathname;i.loading="eager";await i.decode()}))');
  assert.equal(await evaluate('document.querySelectorAll(".originals-card").length'),SAVOR_ORIGINALS.length);
  for (const width of [1440,390,320]) {
    await command('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<500});
    await delay(150);
    assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'),'No overflow at '+width);
    assert.ok(await evaluate('[...document.querySelectorAll(".originals-card img")].every(i=>i.complete && i.naturalWidth>0)'));
    if(width!==320) await screenshot('originals-collection-'+width);
  }
  for(const series of ['autopilot','cupboard']) {
    await evaluate(`document.querySelector('.originals-filters a[href*="${series}"]').click()`);
    await delay(200);
    assert.equal(await evaluate('document.querySelectorAll(".originals-card").length'),SAVOR_ORIGINALS.filter(r=>r.series===(series==='autopilot'?'Dinner on Autopilot':'Back of the Cupboard')).length);
    assert.ok(await evaluate('location.search.includes("'+series+'")'));
    assert.equal(await evaluate('document.querySelector(".originals-filters [aria-current=page]").textContent'),series==='autopilot'?'Dinner on Autopilot':'Back of the Cupboard');
  }
  await command('Page.reload'); await delay(700);
  assert.equal(await evaluate('document.querySelectorAll(".originals-card").length'),SAVOR_ORIGINALS.filter(r=>r.series==='Back of the Cupboard').length);
  await evaluate('document.querySelector(".originals-filters a").click()'); await delay(200);
  assert.equal(await evaluate('document.querySelectorAll(".originals-card").length'),SAVOR_ORIGINALS.length);
  await navigate('/originals/?series=invalid&page=-1');
  assert.equal(await evaluate('document.querySelectorAll(".originals-card").length'),SAVOR_ORIGINALS.length);
  await navigate('/blog/smash-burgers-pickle-mustard-sauce/');
  assert.equal(await evaluate('document.querySelectorAll("#recipe ol li").length'),6);
  assert.equal(await evaluate('document.querySelector(".smash-recipe-figure img").naturalWidth'),1440);
  assert.ok(await evaluate('document.querySelector(".smash-recipe-figure figcaption").textContent.includes("Iron Kitchen Inc.")'));
  assert.ok(await evaluate(`document.querySelector('.smash-partner-links a[href="https://ironkitcheninc.com/pages/iron-kitchen-x-savor"]')!==null`));
  assert.ok(await evaluate(`document.querySelector('.smash-partner-links a[href="/iron-kitchen/"]')!==null`));
  for (const width of [1440,390,320]) {
    await command('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<500});
    await delay(100);
    assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'),'Burger article has no overflow at '+width);
    if(width!==320) await screenshot('smash-burgers-'+width);
  }
  assert.deepEqual(errors,[],'No runtime or hydration errors');
  await command('Browser.close');
  console.log('Originals browser checks passed: series filters, reload, invalid query, image loading and desktop/mobile layouts.');
} finally {
  socket?.close(); child.kill(); server.close();
}
