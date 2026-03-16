import '@logseq/libs'

import { createReadwiseClient } from './api'
import { fakeExport } from './dev/fake-data'
import { setupProps } from './services/setup-properties'
import { syncHighlights } from './services/sync-highlights'
import { settingsSchema } from './settings'

const main = async () => {
  logseq.UI.showMsg('logseq-readwise-plugin loaded')

  logseq.App.registerCommandPalette(
    {
      key: 'readwise:setup-properties',
      label: 'Readwise: Setup Properties',
    },
    () => setupProps(),
  )

  logseq.App.registerCommandPalette(
    {
      key: 'readwise:sync-fake',
      label: 'Readwise: Sync Fake Highlights (Dev)',
    },
    async () => {
      try {
        const loadingMsg = await logseq.UI.showMsg(
          'Syncing fake highlights…',
          'warning',
          { timeout: 0 },
        )

        await syncHighlights(fakeExport)

        logseq.UI.closeMsg(loadingMsg)
        await logseq.UI.showMsg(
          `Synced ${fakeExport.results.length} fake book(s).`,
          'success',
        )
      } catch (err) {
        console.error('Fake sync failed:', err)
        logseq.UI.showMsg(`Fake sync failed: ${err}`, 'error')
      }
    },
  )

  logseq.App.registerCommandPalette(
    {
      key: 'readwise:sync',
      label: 'Readwise: Sync Highlights',
    },
    async () => {
      const token = logseq.settings?.apiToken as string
      if (!token) {
        logseq.UI.showMsg(
          'Please set your Readwise API token in settings.',
          'error',
        )
        return
      }

      const client = createReadwiseClient(token)

      try {
        const loadingMsg = await logseq.UI.showMsg(
          'Syncing highlights from Readwise…',
          'warning',
          { timeout: 0 },
        )

        const exported = await client.exportAllHighlights(
          logseq.settings?.lastSyncTimestamp
            ? { updatedAfter: logseq.settings.lastSyncTimestamp as string }
            : {},
        )

        await syncHighlights(exported)

        logseq.UI.closeMsg(loadingMsg)
        await logseq.UI.showMsg(
          `Synced ${exported.results.length} book(s) from Readwise.`,
          'success',
        )
      } catch (err) {
        console.error('Readwise sync failed:', err)
        logseq.UI.showMsg(`Sync failed: ${err}`, 'error')
      }
    },
  )
}

logseq.useSettingsSchema(settingsSchema).ready(main).catch(console.error)
