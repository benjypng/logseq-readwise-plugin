import { READWISE_TAG, readwisePagesQuery } from '../constants'
import type { ExportedBook } from '../types'
import { appendHighlights, upsertBookProperties } from '.'

export const buildBookIdToPageMap = async (): Promise<Map<number, string>> => {
  const results = await logseq.DB.datascriptQuery(readwisePagesQuery())
  const map = new Map<number, string>()

  for (const [uuid, rawId] of results ?? []) {
    const rwId = Number(rawId)
    if (uuid && !Number.isNaN(rwId)) {
      map.set(rwId, String(uuid))
    }
  }

  return map
}

export const syncBook = async (
  book: ExportedBook,
  bookIdToPage: Map<number, string>,
) => {
  const existingPageUuid = bookIdToPage.get(book.user_book_id)

  if (existingPageUuid) {
    await appendHighlights(existingPageUuid, book.highlights)
    return
  }

  const page = await logseq.Editor.createPage(
    book.title,
    {},
    { redirect: false },
  )
  if (!page) return

  await logseq.Editor.addBlockTag(page.uuid, READWISE_TAG)
  await upsertBookProperties(page.uuid, book)
  await appendHighlights(page.uuid, book.highlights)
  bookIdToPage.set(book.user_book_id, page.uuid)
}
