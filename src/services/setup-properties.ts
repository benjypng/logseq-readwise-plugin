import { READWISE_PAGE_PROPS, READWISE_TAG } from '../constants'

export const setupProps = async () => {
  try {
    const loadingMsg = await logseq.UI.showMsg(
      'Setting up schema. Please wait...',
      'warning',
      { timeout: 0 },
    )

    const existingTag = await logseq.Editor.getTag(READWISE_TAG)
    if (!existingTag) {
      await logseq.Editor.createTag(READWISE_TAG)
    }

    for (const { key, schema } of READWISE_PAGE_PROPS) {
      await logseq.Editor.upsertProperty(key, schema, { name: key })
    }

    for (const { key } of READWISE_PAGE_PROPS) {
      await logseq.Editor.addTagProperty(READWISE_TAG, key)
    }

    logseq.updateSettings({ propsConfigured: true })

    logseq.UI.closeMsg(loadingMsg)
    await logseq.UI.showMsg('Readwise schema setup completed.', 'success')
  } catch (err) {
    console.error('Failed to setup properties:', err)
    logseq.UI.showMsg(`Failed to setup properties: ${err}`, 'error')
  }
}
