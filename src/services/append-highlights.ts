import { ExportedBook } from '../types'

export const appendHighlights = async (
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
