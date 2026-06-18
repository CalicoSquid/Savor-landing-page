// optimize-assets.mjs — one-shot WebP conversion for the Savor site.
//   npm i -D sharp && node optimize-assets.mjs
//
// Converts the *used* PNGs to WebP (replacing the source file) and rewrites
// every reference in src/ and index.html. Deliberately KEEPS as PNG:
//   • images/savor-final.png  — Open Graph / social-share image (best compat)
//   • icons/icon-default.png  — favicon + apple-touch-icon (best compat)
//   • potluck/play2.png       — official Google Play badge
//
// Safe to re-run: already-converted files are skipped.
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'

const PUB = 'public'

const CONVERT = [
  'screenshots/found.png', 'screenshots/scan.png', 'screenshots/recipe.png', 'screenshots/community.png',
  'potluck/outer.png', 'potluck/spinner.png', 'potluck/savor-logo.png', 'potluck/potluck-icon.png', 'potluck/wordmark2.png',
  'images/Savor.png', 'images/Savor_white.png', 'images/logo_W.png', 'images/ssss.png',
  'forage/forage-icon.png', 'forage/forage-icon-bg.png',
  ...['Tangerine','Watermelon','Nectarine','Grapefruit','Cranberry','Lime','Feijoah','Blueberry','Dragonfruit','Blackberry','Plum','Coconut']
    .map(n => `icons/icon-${n}.png`),
]

// 1 ─ Convert PNG → WebP
let before = 0, after = 0, n = 0
for (const rel of CONVERT) {
  const src = path.join(PUB, rel)
  if (!fs.existsSync(src)) continue
  const out = src.replace(/\.png$/i, '.webp')
  const bsz = fs.statSync(src).size
  await sharp(src).webp({ quality: 85, effort: 6 }).toFile(out)
  after += fs.statSync(out).size
  before += bsz
  fs.unlinkSync(src)
  n++
}

// 2 ─ Rewrite references (explicit paths)
const sourceFiles = []
;(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name)
    if (e.isDirectory()) walk(p)
    else if (/\.(jsx?|css|html)$/.test(e.name)) sourceFiles.push(p)
  }
})('src')
sourceFiles.push('index.html')

const explicit = CONVERT.filter(f => !f.startsWith('icons/icon-'))
  .map(f => '/' + f)
for (const file of sourceFiles) {
  if (!fs.existsSync(file)) continue
  let txt = fs.readFileSync(file, 'utf-8')
  let changed = false
  for (const p of explicit) {
    if (txt.includes(p)) { txt = txt.split(p).join(p.replace(/\.png$/, '.webp')); changed = true }
  }
  if (changed) fs.writeFileSync(file, txt)
}

// 3 ─ getIcon helper → .webp (covers the 12 theme icons, used dynamically)
const tu = 'src/utils/themeUtils.js'
if (fs.existsSync(tu)) {
  let t = fs.readFileSync(tu, 'utf-8')
  t = t.replace('icon-${name}.png', 'icon-${name}.webp').replace('icon-Feijoah.png', 'icon-Feijoah.webp')
  fs.writeFileSync(tu, t)
}

const mb = b => (b / 1048576).toFixed(2)
console.log(`✓ converted ${n} files: ${mb(before)} MB → ${mb(after)} MB  (${Math.round((1 - after / before) * 100)}% smaller)`)
console.log('✓ references rewritten in src/ + index.html (kept: savor-final, icon-default, play2 as PNG)')
console.log('→ run a build to verify, then delete the source PNGs are already removed.')
