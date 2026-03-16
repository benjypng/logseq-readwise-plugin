import { ReadwisePageProp } from '../types'

export const setupProps = async () => {
  const readwisePageProps: ReadwisePageProp[] = [
    { key: 'rw-id', schema: { type: 'number' } },
    { key: 'rw-author', schema: { type: 'node', cardinality: 'many' } },
    { key: 'rw-readable-title', schema: { type: 'default' } },
    { key: 'rw-category', schema: { type: 'node' } },
    { key: 'rw-source', schema: { type: 'default' } },
    { key: 'rw-cover-image', schema: { type: 'url' } },
    { key: 'rw-unique-url', schema: { type: 'url' } },
    { key: 'rw-readwise-url', schema: { type: 'url' } },
    { key: 'rw-source-url', schema: { type: 'url' } },
    { key: 'rw-external-id', schema: { type: 'default' } },
    { key: 'rw-asin', schema: { type: 'default' } },
    { key: 'rw-document-note', schema: { type: 'default' } },
    { key: 'rw-summary', schema: { type: 'default' } },
  ]

  try {
    const loadingMsg = await logseq.UI.showMsg(
      'Setting up schema. Please wait...',
      'warning',
      { timeout: 0 },
    )

    await logseq.Editor.createTag('Readwise')

    const allPropsInLs = await logseq.Editor.getAllProperties()
    const existingIdentifiers = new Set(allPropsInLs?.map((prop) => prop.ident))

    const pluginName = 'logseq-readwise-plugin'
    const propsToCreate = readwisePageProps.filter(({ key }) => {
      const fullIdentifier = `:plugin.property.${pluginName}/${key}`
      return !existingIdentifiers.has(fullIdentifier)
    })

    for (const { key, schema } of propsToCreate) {
      await logseq.Editor.upsertProperty(key, schema, { name: key })
    }

    for (const { key } of readwisePageProps) {
      await logseq.Editor.addTagProperty('Readwise', key)
    }

    logseq.UI.closeMsg(loadingMsg)
    await logseq.UI.showMsg('Readwise schema setup completed.', 'success')
  } catch (err) {
    console.error('Failed to setup properties:', err)
    logseq.UI.showMsg(`Failed to setup properties: ${err}`, 'error')
  }
}
