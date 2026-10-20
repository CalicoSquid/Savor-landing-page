// Run after generate-safety-printables.mjs. Chrome is needed only when refreshing
// checked-in PDFs, not for deployment or the normal production build.
import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { setTimeout as delay } from 'node:timers/promises'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const profile = path.join(root, '.safety-print-browser')
await fs.mkdir(profile, { recursive: true })
await fs.rm(path.join(profile, 'DevToolsActivePort'), { force: true })
const chrome = process.env.BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const child = spawn(chrome, ['--headless=new', '--disable-gpu', '--no-first-run', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' })
let socket
try {
  let port
  for (let i = 0; i < 100; i++) {
    try { port = Number((await fs.readFile(path.join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]); break } catch { await delay(100) }
  }
  if (!port) throw new Error('Chrome did not expose its local debugging endpoint')
  const pages = await (await fetch(`http://127.0.0.1:${port}/json`)).json()
  const target = pages.find(page => page.type === 'page')
  socket = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }))
  let id = 0
  const pending = new Map()
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data)
    if (!message.id) return
    const operation = pending.get(message.id)
    pending.delete(message.id)
    if (message.error) operation.reject(new Error(JSON.stringify(message.error)))
    else operation.resolve(message.result)
  })
  const command = (method, params = {}) => new Promise((resolve, reject) => {
    pending.set(++id, { resolve, reject })
    socket.send(JSON.stringify({ id, method, params }))
  })
  for (const slug of ['kitchen-closing-checklist', 'leftover-labels', 'fridge-reference', 'kitchen-close-down-kit']) {
    await command('Page.navigate', { url: pathToFileURL(path.join(root, 'public', 'printables', `${slug}.html`)).href })
    await delay(150)
    await command('Runtime.evaluate', { expression: 'document.fonts.ready', awaitPromise: true })
    for (const [size, paperWidth, paperHeight] of [['a4', 8.2677, 11.6929], ['letter', 8.5, 11]]) {
      const pdf = await command('Page.printToPDF', { printBackground: false, displayHeaderFooter: false, paperWidth, paperHeight, marginTop: .433, marginBottom: .433, marginLeft: .433, marginRight: .433, preferCSSPageSize: false })
      const filename = path.join(root, 'public', 'printables', `${slug}-${size}.pdf`)
      await fs.writeFile(filename, Buffer.from(pdf.data, 'base64'))
      console.log(path.basename(filename))
    }
  }
  await command('Browser.close')
} finally {
  socket?.close()
  child.kill()
}
