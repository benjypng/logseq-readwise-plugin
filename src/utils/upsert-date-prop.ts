import { format, parse, parseISO } from 'date-fns'

export const upsertDateProperty = (value: string) => {
  const formatted = format(
    parseISO(value) || parse(value, 'yyyy-MM-dd', new Date()),
    'yyyy-MM-dd',
  )
  return logseq.Editor.createJournalPage(formatted)
}
