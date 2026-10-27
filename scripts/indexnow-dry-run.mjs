import fs from 'node:fs'
import process from 'node:process'
import { planChanges, submitIndexNow } from './lib/indexnow.js'

// Deliberately has no --send flag. Local development cannot notify IndexNow.
const [previousPath, currentPath = 'dist/indexnow-manifest.json'] = process.argv.slice(2)
const current = JSON.parse(fs.readFileSync(currentPath, 'utf8'))
const previous = previousPath && previousPath !== '-' ? JSON.parse(fs.readFileSync(previousPath, 'utf8')) : null
const changes = planChanges(previous?.entries, current.entries)
console.log(JSON.stringify({ mode: 'dry-run', baseline: !previous, changed: changes }, null, 2))
await submitIndexNow(changes.map(change => change.url), { dryRun: true })
