import utils from './utils';
import axios from 'axios';

const createReadwiseToc = async (latestRetrieved, booklist) => {
  // Check against retrieved date
  if (new Date(booklist[0].updated) <= new Date(latestRetrieved)) {
    logseq.App.showMsg(`There are no new highlights!`);
    return;
  }

  // Map list of books into logseq compatible array
  const booklistArr = booklist.map((b) => ({
    content: `[[${b.title}]]
            author:: [[${b.author}]]
            `,
  }));

  // Create Title for Table of Contents
  logseq.App.pushState('page', { name: utils.pageName });

  const currPage = await logseq.Editor.getCurrentPage();
  const pageBlockTree = await logseq.Editor.getCurrentPageBlocksTree();

  // Check if page is populated. If it is, clear page and re-insert the blocks
  if (pageBlockTree.length > 0) {
    utils.clearPage(pageBlockTree);
  }

  const targetBlock = await logseq.Editor.insertBlock(
    currPage.name,
    'Fetching books ...',
    {
      isPageBlock: true,
    }
  );

  await logseq.Editor.insertBatchBlock(targetBlock.uuid, booklistArr, {
    sibling: true,
  });

  await logseq.Editor.updateBlock(
    targetBlock.uuid,
    `retrieved:: ${utils.blockTitle()}`
  );
};

const getHighlightsForBook = async (latestBookList, width, elem, booklist) => {
  // Go to each page that has a latest updated date and populate each page
  for (let b of latestBookList) {
    logseq.App.pushState('page', { name: b.title });

    console.log(`Updating ${b.title}`);

    let interval = 100 / latestBookList.length;
    width = width + interval;
    elem.style.width = width + '%';

    // await utils.sleep(parseInt(retryAfter) + 1000);

    let response;
    try {
      // Get highlights for each book
      response = await axios({
        method: 'get',
        url: 'https://readwise.io/api/v2/highlights/',
        headers: {
          Authorization: `Token ${logseq.settings['token']}`,
        },
        params: {
          book_id: b.id,
        },
      });
    } catch (e) {
      let retryAfter = parseInt(e.response.headers['retry-after']) * 1000;
      await utils.sleep(retryAfter + 1000);
    }

    const currPage = await logseq.Editor.getCurrentPage();
    const pageBlockTree = await logseq.Editor.getCurrentPageBlocksTree();

    // Check if page is populated. If it is, clear page and re-insert the blocks
    if (pageBlockTree.length > 0) {
      utils.clearPage(pageBlockTree);
    }

    // Insert placeholder for retrieved date
    const headerBlock = await logseq.Editor.insertBlock(
      currPage.name,
      'Fetching highlights...',
      {
        isPageBlock: true,
      }
    );

    // Insert image
    const imageBlock = await logseq.Editor.insertBlock(
      headerBlock.uuid,
      `![book_image](${b.cover_image_url})`,
      { sibling: true }
    );

    // Check for if there are no highlights in that partcular book
    if (response.data.results.length === 0) {
      await logseq.Editor.updateBlock(
        headerBlock.uuid,
        `As of ${utils.blockTitle()}, there are no highlights in this book.`
      );
      continue;
    }

    // Insert highlights block
    const highlightsBlock = await logseq.Editor.insertBlock(
      imageBlock.uuid,
      `[[Readwise Highlights]]`,
      { sibling: true }
    );

    // Get highlights array
    const highlightsArr = response.data.results.map((h) => ({
      content: `${h.text}
                location:: [${h.location}](kindle://book?action=open&asin=${
        b.asin
      }&location=${h.location})
                on:: [[${utils.getDateForPage(new Date(h.highlighted_at))}]]
                `,
    }));

    await logseq.Editor.insertBatchBlock(highlightsBlock.uuid, highlightsArr, {
      sibling: false,
    });

    await logseq.Editor.updateBlock(
      headerBlock.uuid,
      `retrieved:: ${utils.blockTitle()}
              full-title:: [[${b.title}]]
              author:: [[${b.author}]]
              category:: [[${b.category}]]
              source:: [[${b.source}]]
              `
    );
  }

  logseq.App.showMsg('Highlights imported!');

  logseq.updateSettings({
    latestRetrieved: booklist[0].updated,
  });
};

export default { createReadwiseToc, getHighlightsForBook };
