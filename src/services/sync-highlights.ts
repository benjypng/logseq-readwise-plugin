import type { ExportedBook, ExportResponse } from '../types'

const READWISE_PAGES_QUERY = `[:find (pull ?b [*])
  :where
  [?p :block/name "readwise"]
  [?b :block/refs ?p]]`

const buildBookIdToPageMap = async (): Promise<Map<number, string>> => {
  const results = await logseq.DB.datascriptQuery(READWISE_PAGES_QUERY)
  const map = new Map<number, string>()

  for (const [page] of results) {
    if (!page?.uuid) continue
    const rwId = await logseq.Editor.getBlockProperty(page.uuid, 'rw-id')
    if (rwId != null) {
      map.set(Number(rwId), page.uuid)
    }
  }

  return map
}

const upsertBookProperties = async (pageUuid: string, book: ExportedBook) => {
  await logseq.Editor.upsertBlockProperty(pageUuid, 'rw-id', book.user_book_id)
  if (book.author) {
    const authors = book.author
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean)
    for (const author of authors) {
      await logseq.Editor.createPage(author, {}, { redirect: false })
      await logseq.Editor.upsertBlockProperty(pageUuid, 'rw-author', author)
    }
  }
  if (book.readable_title) {
    await logseq.Editor.upsertBlockProperty(
      pageUuid,
      'rw-readable-title',
      book.readable_title,
    )
  }
  await logseq.Editor.upsertBlockProperty(
    pageUuid,
    'rw-category',
    book.category,
  )
  if (book.source) {
    await logseq.Editor.upsertBlockProperty(pageUuid, 'rw-source', book.source)
  }
  if (book.cover_image_url) {
    await logseq.Editor.upsertBlockProperty(
      pageUuid,
      'rw-cover-image',
      book.cover_image_url,
    )
  }
  if (book.unique_url) {
    await logseq.Editor.upsertBlockProperty(
      pageUuid,
      'rw-unique-url',
      book.unique_url,
    )
  }
  await logseq.Editor.upsertBlockProperty(
    pageUuid,
    'rw-readwise-url',
    book.readwise_url,
  )
  if (book.source_url) {
    await logseq.Editor.upsertBlockProperty(
      pageUuid,
      'rw-source-url',
      book.source_url,
    )
  }
  if (book.external_id) {
    await logseq.Editor.upsertBlockProperty(
      pageUuid,
      'rw-external-id',
      book.external_id,
    )
  }
  if (book.asin) {
    await logseq.Editor.upsertBlockProperty(pageUuid, 'rw-asin', book.asin)
  }
  if (book.document_note) {
    await logseq.Editor.upsertBlockProperty(
      pageUuid,
      'rw-document-note',
      book.document_note,
    )
  }
  if (book.summary) {
    await logseq.Editor.upsertBlockProperty(
      pageUuid,
      'rw-summary',
      book.summary,
    )
  }
}

const appendHighlights = async (
  pageUuid: string,
  highlights: ExportedBook['highlights'],
) => {
  const pageBlocks = await logseq.Editor.getPageBlocksTree(pageUuid)
  const existingTexts = new Set(pageBlocks?.map((b) => b.content) ?? [])

  for (const highlight of highlights) {
    const content = `${highlight.text} ([Location](${highlight.readwise_url}))`
    if (existingTexts.has(content)) continue
    await logseq.Editor.appendBlockInPage(pageUuid, content)
  }
}

export const syncHighlights = async (data: ExportResponse) => {
  const bookIdToPage = await buildBookIdToPageMap()

  for (const book of data.results) {
    const existingPageUuid = bookIdToPage.get(book.user_book_id)

    if (existingPageUuid) {
      // Subsequent sync — append new highlights to existing page
      await appendHighlights(existingPageUuid, book.highlights)
    } else {
      // Initial sync — create page, set properties, add highlights
      const page = await logseq.Editor.createPage(
        book.title,
        {},
        { redirect: false },
      )
      if (!page) continue

      await logseq.Editor.addBlockTag(page.uuid, 'Readwise')
      await upsertBookProperties(page.uuid, book)
      await appendHighlights(page.uuid, book.highlights)
    }
  }

  logseq.updateSettings({ lastSyncTimestamp: new Date().toISOString() })
}
