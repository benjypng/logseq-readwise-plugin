export const READWISE_PAGES_QUERY = `[:find (pull ?b [*])
  :where
  [?p :block/name "readwise"]
  [?b :block/refs ?p]]`
