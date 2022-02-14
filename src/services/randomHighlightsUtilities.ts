export const getRandomHighlight = async () => {
  const getRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const sectionHeader = logseq.settings.template.sectionHeader
    .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '')
    .toLowerCase()
    .trim();

  const readwiseHighlights = await logseq.DB
    .datascriptQuery(`[:find (pull ?b [*])
    :where
        [?b :block/path-refs [:block/name "${sectionHeader}"]]
]`);

  const readwiseHighlightsArr = readwiseHighlights.map((a) => ({
    pageId: a[0].page['id'],
    content: a[0].content,
    uuid: a[0].uuid['$uuid$'],
  }));

  const randomNumber = getRandomNumber(0, readwiseHighlightsArr.length - 1);

  return readwiseHighlightsArr[randomNumber];
};

export const scrollToRandomHighlight = async () => {
  logseq.hideMainUI();

  const randomHighlight = await getRandomHighlight();

  if (randomHighlight.content === logseq.settings.template.sectionHeader) {
    await scrollToRandomHighlight();
  } else {
    const page = await logseq.Editor.getPage(randomHighlight['pageId']);

    console.log(page.name);

    logseq.Editor.scrollToBlockInPage(page.name, randomHighlight['uuid']);
  }
};

export default { getRandomHighlight, scrollToRandomHighlight };
