import assert from 'node:assert/strict'
import fs from 'node:fs'

const html = fs.readFileSync('dist/blog/salt-pork-blaff/index.html', 'utf8')
const metadata = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]))
const recipe = metadata.find(item => item['@type'] === 'Recipe')
assert.ok(recipe, 'Server HTML must expose Recipe data for Savor and Pinterest')
assert.equal(recipe.recipeIngredient.length, 16)
assert.equal(recipe.recipeInstructions.length, 7)
assert.ok(recipe.recipeIngredient[0].includes('30 g ordinary salt'))
for (const [i, step] of recipe.recipeInstructions.entries()) {
  assert.ok(step.name && step.text)
  assert.equal(step.url, `${recipe.url}#step-${i + 1}`)
  assert.ok(html.includes(`id="step-${i + 1}"`))
}
assert.ok(html.includes(`savor://create?url=${encodeURIComponent(recipe.url)}`))
assert.ok(html.includes('https://www.pinterest.com/pin/create/button/?'))
assert.ok(html.includes(encodeURIComponent(recipe.image)))
assert.ok(fs.existsSync(`public${new URL(recipe.image).pathname}`))
assert.ok(html.includes('my interpretation'))
assert.doesNotMatch(html, /Recipe in development|not yet been kitchen-tested|AI-generated illustration/)
console.log('Blaff recipe metadata, seven step anchors, save links, image and revised copy verified')
