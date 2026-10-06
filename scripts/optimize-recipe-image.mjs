import sharp from 'sharp'
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const [input, output] = process.argv.slice(2)
if (!input || !output || path.extname(output).toLowerCase() !== '.webp') {
  throw new Error('Usage: node scripts/optimize-recipe-image.mjs INPUT OUTPUT.webp')
}
await fs.mkdir(path.dirname(output), { recursive: true })
await sharp(input).rotate()
  .resize({ width: 1200, height: 1500, fit: 'inside', withoutEnlargement: true })
  .webp({ quality: 82, effort: 6 }).toFile(output)
const originalBytes = (await fs.stat(input)).size
const optimizedBytes = (await fs.stat(output)).size
const { width, height } = await sharp(output).metadata()
console.log(JSON.stringify({ output, width, height, originalBytes, optimizedBytes,
  reduction: `${Math.round(100 * (1 - optimizedBytes / originalBytes))}%` }))
