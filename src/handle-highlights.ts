import utils from './utils';

const getHighlightsForBook = async (
  booklist,
  highlightlist,
  width,
  elemBar,
  elemText,
  progressDiv
) => {
  console.log('Processing highlights');

  // Go to each page that has a latest updated date and populate each page
  for (let b of booklist) {
    // Go to page
    logseq.App.pushState('page', { name: `${b.title} (Readwise)` });
    const currPage = await logseq.Editor.getCurrentPage();
    const pageBlockTree = await logseq.Editor.getCurrentPageBlocksTree();

    console.log(`Updating ${b.title}`);
    progressDiv.innerHTML = `Updating ${b.title} ...`;

    // Change progress bar
    const interval = 100 / booklist.length;
    width = width + interval;
    elemBar.style.width = width + '%';
    elemText.innerHTML = parseFloat(width).toFixed(2) + '%';

    // get highlights for this book from the highlight list
    let latestHighlights = highlightlist.filter(highlight => highlight.book_id === b.id);

    if (latestHighlights.length === 0) {
      console.log("No highlights found for '" + b.title + "'");
      continue;
    }

    // Prepare latest highlights for logeq insertion
    let latestHighlightsArr;
    if (b.source === 'kindle') {
      latestHighlightsArr = latestHighlights.map((h) => ({
        content: `${h.text}
                location:: [${h.location}](kindle://book?action=open&asin=${
          b.asin
        }&location=${h.location})
                on:: [[${utils.getDateForPage(new Date(h.highlighted_at))}]]
                `,
      }));
    } else {
      latestHighlightsArr = latestHighlights.map((h) => ({
        content: `${h.text}
                link:: [${h.url}](${h.url})
                on:: [[${utils.getDateForPage(new Date(h.highlighted_at))}]]
                `,
      }));
    }

    // Check if page is empty. If empty, create the basic template. If not empty, update only the Readwise Highlights section
    if (pageBlockTree.length === 0) {
      const headerBlock = await logseq.Editor.insertBlock(
        currPage.name,
        'Fetching highlights...',
        {
          isPageBlock: true,
        }
      );

      // Check for if there are no highlights in that partcular book
      if (latestHighlights.length === 0) {
        await logseq.Editor.updateBlock(
          headerBlock.uuid,
          `As of ${utils.blockTitle()}, there are no new highlights in this book.`
        );
        continue;
      }

      // Insert image
      const imageBlock = await logseq.Editor.insertBlock(
        headerBlock.uuid,
        `![book_image](${b.cover_image_url})`,
        { sibling: true }
      );

      // Insert highlights block
      const highlightsBlock = await logseq.Editor.insertBlock(
        imageBlock.uuid,
        `## [[Readwise Highlights]]`,
        { sibling: true }
      );

      await logseq.Editor.insertBatchBlock(
        highlightsBlock.uuid,
        latestHighlightsArr,
        {
          sibling: false,
        }
      );

      await logseq.Editor.updateBlock(
        headerBlock.uuid,
        `retrieved:: ${utils.blockTitle()}
              author:: [[${b.author}]]
              category:: [[${b.category}]]
              source:: [[${b.source}]]
              `
      );
    } else {
      // Insert only new highlights in Readwise Highlights block
      let highlightsBlock = pageBlockTree.filter(
        (b) => b.content == '## [[Readwise Highlights]]'
      );

      // Check for if unable to find Readwise Highlights block
      if (!highlightsBlock[0]) {
        console.log(
          `${b.title} had changes made to its [[Readwise Highlights]] block.`
        );
        const lastBlock = pageBlockTree[pageBlockTree.length - 1];
        highlightsBlock[0] = await logseq.Editor.insertBlock(
          lastBlock.uuid,
          `## [[Readwise Highlights]]`,
          { sibling: true }
        );
      }

      await logseq.Editor.insertBatchBlock(
        highlightsBlock[0].uuid,
        latestHighlightsArr,
        {
          sibling: false,
        }
      );

      const headerBlock = pageBlockTree[0];

      await logseq.Editor.updateBlock(
        headerBlock['uuid'],
        `retrieved:: ${utils.blockTitle()}
              author:: [[${b.author}]]
              category:: [[${b.category}]]
              source:: [[${b.source}]]
              `
      );
    }
  }
  logseq.App.showMsg(
    'Highlights imported! If you made any changes to the [[Readwise Highlights]] block before you synced, you may need to revist those pages to remove duplicate higlights. Please refer to the console in Developer Tools for these pages. '
  );

  // Reset progress bar
  width = 0;
  elemBar.style.width = width + '%';
  elemText.innerHTML = parseFloat(width).toFixed(2) + '%';
  progressDiv.innerHTML = "";
};

export default { getHighlightsForBook };
