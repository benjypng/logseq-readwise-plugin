import { ExportedBook } from '../types'

export const appendHighlights = async (
  pageUuid: string,
  highlights: ExportedBook['highlights'],
) => {
  const pageBlocks = await logseq.Editor.getPageBlocksTree(pageUuid)
  const existingTexts = new Set(pageBlocks?.map((b) => b.content) ?? [])

  for (const highlight of highlights) {
    const text = highlight.text.replace(/#(\w+)/g, '[[$1]]')
    const content = `${text} ([Location](${highlight.readwise_url}))`
    if (existingTexts.has(content)) continue
    await logseq.Editor.appendBlockInPage(pageUuid, content)
  }
}
