import utils from './utils';
import axios from 'axios';

const getHighlightsForBook = async (
  latestBookList,
  token,
  width,
  elemBar,
  elemText,
  coolingOffDiv
) => {
  console.log('Getting highlights');

  const getHighlightsForBook = async (b) => {
    const response = await axios({
      method: 'get',
      url: 'https://readwise.io/api/v2/highlights/',
      headers: {
        Authorization: `Token ${token}`,
      },
      params: {
        book_id: b.id,
      },
    });

    return response;
  };

  // Go to each page that has a latest updated date and populate each page
  for (let b of latestBookList) {
    // Go to page
    logseq.App.pushState('page', { name: `${b.title} (Readwise)` });
    const currPage = await logseq.Editor.getCurrentPage();
    const pageBlockTree = await logseq.Editor.getCurrentPageBlocksTree();

    console.log(`Updating ${b.title}`);

    // Change progress bar
    const interval = 100 / latestBookList.length;
    width = width + interval;
    elemBar.style.width = width + '%';
    elemText.innerHTML = parseFloat(width).toFixed(2) + '%';

    // Implement retry after if trying to get too many sources at one time.
    let highlightsForBook;
    try {
      highlightsForBook = await getHighlightsForBook(b);
    } catch (e) {
      console.log(e);
      coolingOffDiv.innerHTML =
        'Please wait for Readwise cooling off to complete.';
      const retryAfter =
        parseInt(e.response.headers['retry-after']) * 1000 + 5000;
      await utils.sleep(retryAfter);
      highlightsForBook = await getHighlightsForBook(b);
      coolingOffDiv.innerHTML = '';
    }

    // Filter out only latest highlights
    const latestHighlights = highlightsForBook.data.results.filter(
      (b) => new Date(b.updated) > new Date(logseq.settings['latestRetrieved'])
    );

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
      const highlightsBlock = pageBlockTree.filter(
        (b) => b.content == '## [[Readwise Highlights]]'
      );

      const headerBlock = pageBlockTree[0];

      await logseq.Editor.insertBatchBlock(
        highlightsBlock[0].uuid,
        latestHighlightsArr,
        {
          sibling: false,
        }
      );

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
  logseq.App.showMsg('Highlights imported!');

  // Reset progress bar
  width = 0;
  elemBar.style.width = width + '%';
  elemText.innerHTML = parseFloat(width).toFixed(2) + '%';

  if (latestBookList.length > 0) {
    logseq.updateSettings({
      latestRetrieved: latestBookList[0].last_highlight_at,
    });
  }
};

export default { getHighlightsForBook };
