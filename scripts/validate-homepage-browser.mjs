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
    } else if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text)
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
  await navigate('/')
  assert.equal(await colour(), '#FF6D00')
  assert.deepEqual(await evaluate('[...document.querySelectorAll(".savor-page > section")].slice(0,4).map(x=>x.className)'), ['hero', 'home-tools', 'same-kitchen', 'features'])
  assert.equal(await evaluate('document.querySelector(".home-app-details").open'), false)

  for (const width of [1440, 390, 320]) {
    await command('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: width < 500 })
    await delay(150)
    assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'), `No horizontal overflow at ${width}px`)
    assert.ok(await evaluate('[...document.querySelectorAll(".theme-card")].every(x=>x.scrollWidth <= x.clientWidth+1)'), `Theme labels fit at ${width}px`)
    const height = await evaluate('document.querySelector(".flavors").getBoundingClientRect().height')
    // Tiny phones stack the icon above its name to keep the labels legible.
    assert.ok(height < (width > 1000 ? 380 : width < 360 ? 570 : 530), `Theme picker stays compact: ${height}`)
    if (width !== 320) await screenshot(`homepage-intro-${width}`)
  }
  await command('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false })
  await evaluate('window.scrollTo({top:document.querySelector(".same-kitchen").getBoundingClientRect().top+scrollY-80,behavior:"instant"})')
  await screenshot('homepage-kitchen-desktop')
  await evaluate('window.scrollTo({top:document.querySelector(".flavors").getBoundingClientRect().top+scrollY-100,behavior:"instant"})')
  const position = await evaluate('scrollY')
  await pick('Blueberry')
  await delay(80)
  assert.equal(await colour(), '#FF6D00', 'Do not change colour before the animation covers the page')
  await delay(1200)
  assert.equal(await colour(), '#3949AB')
  assert.ok(Math.abs((await evaluate('scrollY')) - position) < 3, 'Selection must preserve reading position')
  assert.equal(await evaluate('document.querySelector(".theme-burst")'), null)
  await screenshot('homepage-theme-desktop')
  await command('Page.reload')
  await delay(800)
  assert.equal(await colour(), '#3949AB', 'Preference survives reload')
  await navigate('/originals/')
  assert.equal(await colour(), '#3949AB', 'Preference follows full page navigation')
  await navigate('/')
  await evaluate('document.querySelector(".theme-preference-note button").click()')
  await delay(1000)
  assert.equal(await colour(), '#FF6D00', 'Reset restores the brand default')
  await pick('Blueberry'); await delay(60); await pick('Blackberry'); await delay(1000)
  assert.equal(await colour(), '#6A1B9A', 'Latest selection wins during rapid clicks')
  await command('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  const reducedPosition = await evaluate('scrollY')
  await pick('Lime'); await delay(120)
  assert.equal(await colour(), '#8BC34A')
  assert.equal(await evaluate('document.querySelector(".theme-burst")'), null, 'Reduced motion has no colour flood')
  assert.ok(Math.abs((await evaluate('scrollY')) - reducedPosition) < 3)
  await evaluate('sessionStorage.clear()'); await command('Page.reload'); await delay(700)
  assert.equal(await colour(), '#FF6D00', 'A fresh tab preference starts in Tangerine')
  await evaluate('sessionStorage.setItem("savor-theme-session","unknown")'); await command('Page.reload'); await delay(700)
  assert.equal(await colour(), '#FF6D00', 'Invalid stored preferences fall back safely')
  await command('Page.addScriptToEvaluateOnNewDocument', { source: 'Object.defineProperty(Storage.prototype,"getItem",{value(){throw new Error("Blocked storage")}});Object.defineProperty(Storage.prototype,"setItem",{value(){throw new Error("Blocked storage")}})' })
  await command('Page.reload'); await delay(700)
  await pick('Feijoa'); await delay(150)
  assert.equal(await colour(), '#00796B', 'Colour still works when browser storage is blocked')
  await command('Emulation.setDeviceMetricsOverride', { width: 390, height: 1000, deviceScaleFactor: 1, mobile: true })
  await evaluate('window.scrollTo({top:document.querySelector(".flavors").getBoundingClientRect().top+scrollY-80,behavior:"instant"})')
  await delay(150)
  await screenshot('homepage-theme-mobile')
  assert.deepEqual(errors, [], 'No runtime or hydration errors')
  await command('Browser.close')
  console.log('Homepage layouts, compact picker, animation timing, scroll preservation, navigation/reload persistence, reset, rapid clicks, reduced motion and blocked storage passed')
} finally {
  socket?.close()
  child.kill()
  server.close()
}
