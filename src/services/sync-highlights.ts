import { READWISE_PAGES_QUERY } from '../constants'
import type { ExportedBook } from '../types'
import { appendHighlights, upsertBookProperties } from '.'

export const buildBookIdToPageMap = async (): Promise<Map<number, string>> => {
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

export const syncBook = async (
  book: ExportedBook,
  bookIdToPage: Map<number, string>,
) => {
  const existingPageUuid = bookIdToPage.get(book.user_book_id)

  if (existingPageUuid) {
    await appendHighlights(existingPageUuid, book.highlights)
  } else {
    const page = await logseq.Editor.createPage(
      book.title,
      {},
      { redirect: false },
    )
    if (!page) return

    await logseq.Editor.addBlockTag(page.uuid, 'Readwise')
    await upsertBookProperties(page.uuid, book)
    await appendHighlights(page.uuid, book.highlights)
  }
}
