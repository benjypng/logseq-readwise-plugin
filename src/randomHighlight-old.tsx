const getRandomHighlight = async () => {
  const getAllReferencesFromPages = await logseq.DB
    .datascriptQuery(`[:find ?page ?ref-page-name
  :where
  [?p :block/journal? false]
  [?p :block/name ?page]
  [?block :block/page ?p]
  [?block :block/refs ?ref-page]
  [?ref-page :block/name ?ref-page-name]])]`);

  // Filter out arrays where they mention readwise highlights or where they mention kindle
  const tweetSources = getAllReferencesFromPages.filter(
    (a) => a[1] == 'readwise highlights'
  );

  const kindleSources = getAllReferencesFromPages.filter(
    (a) => a[1] == 'kindle'
  );

  const allSources = kindleSources.concat(tweetSources);

  const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Find page that randomSource is pointing to
  const randomSourcePage = await logseq.DB.datascriptQuery(`[:find ?block-name
    :where
    [?block-name :block/name "${
      allSources[getRandomNumber(0, allSources.length - 1)][0]
    }"]]`);

  // Get logseq page based on above
  const page = await logseq.Editor.getPage(randomSourcePage[0][0], {
    includeChildren: true,
  });

  // Go to page
  logseq.App.pushState('page', { name: page.name });

  // Get page blocks tree to find highlights block "## Readwise Highlights"
  const pbt = await logseq.Editor.getCurrentPageBlocksTree();

  // Find highlights block
  const highlightsBlock = pbt.filter(
    (a) => a.content === '## [[Readwise Highlights]]'
  );

  const randomHighlight = getRandomNumber(
    0,
    highlightsBlock[0].children.length - 1
  );

  // Scroll to random highlight
  await logseq.Editor.scrollToBlockInPage(
    page.name,
    highlightsBlock[0].children[randomHighlight]['uuid']
  );

  logseq.hideMainUI();
};

export default getRandomHighlight;
