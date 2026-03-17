import '@logseq/libs'
import { createRoot } from 'react-dom/client'

import { settingsSchema } from './settings'
import { setupProps } from './services'
import { ReadwiseContainer } from './components'

const main = async () => {
  logseq.UI.showMsg('logseq-readwise-plugin loaded')

  const el = document.getElementById('app')
  if (!el) return
  const root = createRoot(el)
  root.render(<ReadwiseContainer />)

  logseq.App.registerUIItem('toolbar', {
    key: 'logseq-readwise-plugin',
    template: `<a class="button" data-on-click="syncHighlights"><i class="ti ti-letter-r"></i></a>`,
  })

  logseq.provideModel({
    syncHighlights() {
      logseq.showMainUI()
    },
  })

  logseq.App.registerCommandPalette(
    {
      key: 'readwise:setup-props',
      label: 'Readwise: Setup properties',
    },
    async () => await setupProps(),
  )

  logseq.App.registerCommandPalette(
    {
      key: 'readwise:sync',
      label: 'Readwise: Reset sync timestamp',
    },
    () =>
      logseq.updateSettings({
        lastSyncTimestamp: '',
      }),
  )
}

logseq.useSettingsSchema(settingsSchema).ready(main).catch(console.error)
