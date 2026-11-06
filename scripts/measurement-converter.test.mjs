import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import crypto from 'node:crypto'
import { convertRecipeText, convertMeasurement, ENGINE_VERSION } from '../src/lib/measurementConverter.js'
import { normaliseConversionDataset } from '../src/lib/conversionData.js'

const reviewed = normaliseConversionDataset({
  schemaVersion: 1, engineVersion: ENGINE_VERSION, cookingCupMl: 240,
  entries: [
    { name: 'flour', cupToGrams: 120, reviewStatus: 'reference', preparation: 'unsifted' },
    { name: 'milk', cupToMl: 240, reviewStatus: 'direct' },
  ],
})

test('generated engine fingerprint matches its source', () => {
  const file = fs.readFileSync(new URL('../src/lib/measurementConverter.js', import.meta.url), 'utf8').replace(/\r\n/g, '\n')
  const [, fingerprint] = file.match(/Source SHA-256: ([a-f0-9]+)/)
  const canonical = file.split('\n').slice(2).join('\n').replace('export {', 'module.exports = {')
  assert.equal(crypto.createHash('sha256').update(canonical).digest('hex'), fingerprint)
})

test('cached established ingredient values remain enabled without source metadata', () => {
  const legacy = normaliseConversionDataset({ schemaVersion: 1, entries: [{ name: 'flour', cupToGrams: 120 }] })
  assert.equal(convertRecipeText('1 cup flour', 'metric', legacy).output, '120 g flour')
  assert.deepEqual(convertRecipeText('1 cup flour', 'metric', legacy).reviewLines, [])
  assert.equal(convertMeasurement(1, 'cup', 'g', 'flour', legacy).ok, true)
  assert.equal(convertRecipeText('1 cup flour', 'metric', reviewed).output, '120 g flour')
})

test('public recipe and quick tool agree on cooking volumes', () => {
  assert.equal(convertMeasurement(1, 'cup', 'ml', 'milk', reviewed).value, 240)
  assert.equal(convertRecipeText('1 cup milk', 'metric', reviewed).output, '240 ml milk')
  assert.equal(convertRecipeText('15 ml milk', 'us', reviewed).output, '1 tbsp milk')
})

test('public tool preserves embedded weights, ranges and package counts', () => {
  assert.equal(convertRecipeText('1 side of salmon, approximately 1–1.5kg', 'us', reviewed).output, '1 side of salmon, approximately 2.2–3.31 lb')
  assert.equal(convertRecipeText('2 x 400g cans tomatoes', 'us', reviewed).output, '2 x 14.1 oz cans tomatoes')
  assert.equal(convertRecipeText('1 cup peanut butter powder', 'metric', reviewed).output, '1 cup peanut butter powder')
  assert.equal(convertRecipeText('1 cup shredded cheese', 'metric', null).output, '1 cup shredded cheese')
})

test('reviewed form restrictions protect the public recipe and quick converters with cached data', () => {
  const cached = normaliseConversionDataset({ schemaVersion: 1, entries: [
    { name: 'cardamom', cupToGrams: 130 }, { name: 'allspice', cupToGrams: 125 },
    { name: 'coriander', cupToGrams: 142 }, { name: 'fresh coriander', cupToGrams: 20 },
    { name: 'raspberry jelly', cupToGrams: 320 }, { name: 'psyllium husk', cupToGrams: 140 },
    { name: 'psyllium husk powder', cupToGrams: 140 },
  ] })
  for (const name of ['whole cardamom', 'whole allspice', 'whole psyllium husk', 'psyllium husk', 'coriander', 'raspberry jelly']) {
    const input = `1 cup ${name}`
    const recipe = convertRecipeText(input, 'metric', cached)
    assert.equal(recipe.output, input)
    assert.deepEqual(recipe.reviewLines, [1])
    assert.equal(convertMeasurement(1, 'cup', 'g', name, cached).ok, false)
    assert.equal(convertMeasurement(1, 'g', 'cup', name, cached).ok, false)
    assert.equal(convertRecipeText(`1 kg ${name}`, 'us', cached).output, `2.2 lb ${name}`)
  }
  assert.equal(convertRecipeText('1 tbsp psyllium husk powder', 'metric', cached).output, '8.75 g psyllium husk powder')
  assert.equal(convertRecipeText('1 cup fresh coriander', 'metric', cached).output, '20 g fresh coriander')
  assert.equal(convertRecipeText('1 cup raspberry jelly spread', 'metric', cached).output, '320 g raspberry jelly spread')
})
