import process from 'node:process'
import { getStore } from '@netlify/blobs'
import { runDeployment } from '../../scripts/lib/indexnow-deploy.mjs'

// Netlify verifies event signatures before invoking this handler. There is no
// public "submit arbitrary URLs" endpoint or overlapping deployment webhook.
const notify = event => runDeployment(event, {
  env: process.env,
  storeFactory: () => getStore({ name: 'savor-indexnow', consistency: 'strong' }),
})
export default {
  async deploySucceeded(event) { await notify(event) },
  // Our review workflow pins production, publishes the verified deploy, then
  // unlocks it. The same ledger makes overlapping events harmless.
  async deployUnlocked(event) { await notify(event) },
}
