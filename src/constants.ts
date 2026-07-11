import type { ReadwisePageProp } from './types'

export const READWISE_TAG = 'Readwise'

export const READWISE_PAGE_PROPS: ReadwisePageProp[] = [
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

const pluginPropertyNamespace = () =>
  `plugin.property.${logseq.baseInfo?.id ?? 'logseq-readwise-plugin'}`

export const readwisePagesQuery = () => `[:find ?uuid ?rw-id
  :where
  [?tag :block/name "${READWISE_TAG.toLowerCase()}"]
  [?page :block/tags ?tag]
  [?page :block/uuid ?uuid]
  [?page :${pluginPropertyNamespace()}/rw-id ?value-block]
  [?value-block :logseq.property/value ?rw-id]]`
