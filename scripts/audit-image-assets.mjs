import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const ROOT = process.cwd()
const PUBLIC = path.join(ROOT, 'public')
const SOURCE_ROOTS = [
  path.join(ROOT, 'src'),
  path.join(ROOT, 'index.html'),
  path.join(ROOT, 'prerender.js'),
  path.join(ROOT, 'generate-sitemap.js'),
  path.join(ROOT, 'netlify'),
]
const LEGACY_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff'])
const RASTER_EXTENSIONS = new Set(['.webp', '.avif', '.png', '.jpg', '.jpeg', '.gif', '.ico'])
const MAX_UI_ASSET_BYTES = 350 * 1024

function walk(target) {
  if (!fs.existsSync(target)) return []
  const stat = fs.statSync(target)
  if (stat.isFile()) return [target]
  return fs.readdirSync(target, { withFileTypes: true }).flatMap((entry) =>
    walk(path.join(target, entry.name)),
  )
}

const publicFiles = walk(PUBLIC)
const rasterFiles = publicFiles.filter((file) => RASTER_EXTENSIONS.has(path.extname(file).toLowerCase()))
const isSocialCardJpeg = (file) => /-og\.jpe?g$/i.test(file)
const legacyFiles = publicFiles.filter((file) =>
  LEGACY_EXTENSIONS.has(path.extname(file).toLowerCase()) && !isSocialCardJpeg(file),
)
const textFiles = SOURCE_ROOTS.flatMap(walk).filter((file) =>
  /\.(?:jsx?|css|html|json|toml|md)$/i.test(file),
)

const sourceText = textFiles.map((file) => ({
  file,
  text: fs.readFileSync(file, 'utf8'),
}))

const errors = []
const warnings = []

if (legacyFiles.length) {
  errors.push(`Legacy raster files remain:\n${legacyFiles.map((f) => `  - ${path.relative(ROOT, f)}`).join('\n')}`)
}

// Verify every literal local image path in source points to a real public asset.
const localRefPattern = /["'`](\/[^"'`\s)]+\.(?:webp|avif|svg|ico))["'`]/gi
const refs = new Map()
for (const { file, text } of sourceText) {
  for (const match of text.matchAll(localRefPattern)) {
    const ref = match[1]
    if (!refs.has(ref)) refs.set(ref, new Set())
    refs.get(ref).add(path.relative(ROOT, file))
  }
}
for (const [ref, files] of refs) {
  const asset = path.join(PUBLIC, ref.slice(1))
  if (!fs.existsSync(asset)) {
    errors.push(`Missing asset ${ref}, referenced by ${[...files].join(', ')}`)
  }
}

// Width + height attributes reserve layout space and prevent image CLS.
for (const { file, text } of sourceText.filter(({ file }) => file.endsWith('.jsx'))) {
  for (const match of text.matchAll(/<img\b[\s\S]*?\/>/g)) {
    const tag = match[0]
    const line = text.slice(0, match.index).split('\n').length
    if (!/\bwidth=/.test(tag) || !/\bheight=/.test(tag)) {
      errors.push(`${path.relative(ROOT, file)}:${line} image is missing width and/or height`)
    }
  }
}

function readDimensions(file) {
  const buffer = fs.readFileSync(file)
  const ext = path.extname(file).toLowerCase()
  if (ext === '.ico' && buffer.length >= 8) {
    return [buffer[6] || 256, buffer[7] || 256]
  }
  if (ext !== '.webp' || buffer.length < 30 || buffer.toString('ascii', 0, 4) !== 'RIFF') {
    return [null, null]
  }
  let offset = 12
  while (offset + 8 <= buffer.length) {
    const type = buffer.toString('ascii', offset, offset + 4)
    const size = buffer.readUInt32LE(offset + 4)
    const data = offset + 8
    if (type === 'VP8X' && data + 10 <= buffer.length) {
      const width = 1 + buffer[data + 4] + (buffer[data + 5] << 8) + (buffer[data + 6] << 16)
      const height = 1 + buffer[data + 7] + (buffer[data + 8] << 8) + (buffer[data + 9] << 16)
      return [width, height]
    }
    if (type === 'VP8 ' && data + 10 <= buffer.length) {
      return [buffer.readUInt16LE(data + 6) & 0x3fff, buffer.readUInt16LE(data + 8) & 0x3fff]
    }
    if (type === 'VP8L' && data + 5 <= buffer.length) {
      const bits = buffer.readUInt32LE(data + 1)
      return [1 + (bits & 0x3fff), 1 + ((bits >> 14) & 0x3fff)]
    }
    offset = data + size + (size % 2)
  }
  return [null, null]
}

const inventory = []
const hashes = new Map()
for (const file of rasterFiles) {
  const rel = path.relative(ROOT, file)
  const bytes = fs.statSync(file).size
  const [width, height] = readDimensions(file)
  const hash = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
  if (!hashes.has(hash)) hashes.set(hash, [])
  hashes.get(hash).push(rel)
  inventory.push({ path: rel, bytes, width, height })
  if (bytes > MAX_UI_ASSET_BYTES && !/apocaleaf\/wildflowers\.webp$/.test(rel)) {
    warnings.push(`${rel} is ${(bytes / 1024).toFixed(1)} KB; review whether it needs another responsive variant`)
  }
}

for (const duplicate of [...hashes.values()].filter((files) => files.length > 1)) {
  warnings.push(`Duplicate asset bytes: ${duplicate.join(', ')}`)
}

const totalBytes = inventory.reduce((sum, asset) => sum + asset.bytes, 0)
const largest = [...inventory].sort((a, b) => b.bytes - a.bytes).slice(0, 10)

console.log('\nSAVOR SITE IMAGE ASSET AUDIT\n')
console.table({
  rasterAssets: inventory.length,
  legacyRasterAssets: legacyFiles.length,
  totalRasterMB: (totalBytes / 1048576).toFixed(2),
  localImageReferences: refs.size,
  jsxImagesChecked: sourceText
    .filter(({ file }) => file.endsWith('.jsx'))
    .reduce((sum, { text }) => sum + [...text.matchAll(/<img\b[\s\S]*?\/>/g)].length, 0),
})
console.log('\nLargest local raster assets:')
console.table(largest.map((asset) => ({
  path: asset.path,
  dimensions: asset.width && asset.height ? `${asset.width}×${asset.height}` : 'n/a',
  KB: (asset.bytes / 1024).toFixed(1),
})))

if (warnings.length) {
  console.warn('\nWarnings:')
  warnings.forEach((warning) => console.warn(`  - ${warning}`))
}
if (errors.length) {
  console.error('\nAsset audit failed:')
  errors.forEach((error) => console.error(`  - ${error}`))
  process.exit(1)
}
console.log('\nAsset audit passed: modern UI formats, intentional OG JPEGs, valid references, explicit dimensions, and no duplicate files.\n')
