import { ExportedBook } from '../types'

export const upsertBookProperties = async (
  pageUuid: string,
  book: ExportedBook,
) => {
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
