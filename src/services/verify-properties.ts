import { READWISE_PAGE_PROPS, READWISE_TAG } from '../constants'

export const getMissingSetupItems = async (): Promise<string[]> => {
  const missing: string[] = []

  const tag = await logseq.Editor.getTag(READWISE_TAG)
  if (!tag) {
    missing.push(`#${READWISE_TAG} tag`)
  }

  for (const { key } of READWISE_PAGE_PROPS) {
    const property = await logseq.Editor.getProperty(key)
    if (!property) {
      missing.push(key)
    }
  }

  return missing
}
