const SYNC_PREFIX = 'Last synced: '

export const getLastSyncTimestamp = async (): Promise<string | undefined> => {
  const page = await logseq.Editor.getPage('Readwise')
  if (!page) return undefined

  const blocks = await logseq.Editor.getPageBlocksTree(page.uuid)
  if (!blocks) return undefined

  for (let i = blocks.length - 1; i >= 0; i--) {
    const content = blocks[i]?.content
    if (content?.startsWith(SYNC_PREFIX)) {
      return content.slice(SYNC_PREFIX.length)
    }
  }

  return undefined
}

export const appendSyncTimestamp = async (): Promise<void> => {
  const page = await logseq.Editor.getPage('Readwise')
  if (!page) return

  const timestamp = new Date().toISOString()
  await logseq.Editor.appendBlockInPage(page.uuid, `${SYNC_PREFIX}${timestamp}`)
}

export const resetSyncTimestamp = async (): Promise<void> => {
  const page = await logseq.Editor.getPage('Readwise')
  if (!page) return

  const blocks = await logseq.Editor.getPageBlocksTree(page.uuid)
  if (!blocks) return

  for (const block of blocks) {
    if (block.content?.startsWith(SYNC_PREFIX)) {
      await logseq.Editor.removeBlock(block.uuid)
    }
  }
}
