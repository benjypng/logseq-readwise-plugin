import utils from './utils';
import axios from 'axios';

const getHighlightsForBook = async (latestBookList, width, elem) => {
  console.log('Getting highlights');

  // Go to each page that has a latest updated date and populate each page
  for (let b of latestBookList) {
    logseq.App.pushState('page', { name: b.title });

    console.log(`Updating ${b.title}`);

    // Change progress bar
    let interval = 100 / latestBookList.length;
    width = width + interval;
    elem.style.width = width + '%';

    try {
      const currPage = await logseq.Editor.getCurrentPage();
      const pageBlockTree = await logseq.Editor.getCurrentPageBlocksTree();

      // Get highlights for each book
      const highlightsForBook = await axios({
        method: 'get',
        url: 'https://readwise.io/api/v2/highlights/',
        headers: {
          Authorization: `Token ${logseq.settings['token']}`,
        },
        params: {
          book_id: b.id,
        },
      });

      const latestHighlights = highlightsForBook.data.results.filter(
        (b) =>
          new Date(b.updated) > new Date(logseq.settings['latestRetrieved'])
      );

      // Get highlights array
      const latestHighlightsArr = latestHighlights.map((h) => ({
        content: `${h.text}
                            location:: [${
                              h.location
                            }](kindle://book?action=open&asin=${
          b.asin
        }&location=${h.location})
                            on:: [[${utils.getDateForPage(
                              new Date(h.highlighted_at)
                            )}]]
                            `,
      }));

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
          `[[Readwise Highlights]]`,
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
                full-title:: [[${b.title}]]
                author:: [[${b.author}]]
                category:: [[${b.category}]]
                source:: [[${b.source}]]
                `
        );
      } else {
        const highlightsBlock = pageBlockTree.filter(
          (b) => b.content == '[[Readwise Highlights]]'
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
                full-title:: [[${b.title}]]
                author:: [[${b.author}]]
                category:: [[${b.category}]]
                source:: [[${b.source}]]
                `
        );
      }
    } catch (e) {
      console.log(e);
      const retryAfter =
        parseInt(e.response.headers['retry-after']) * 1000 + 5000;
      await utils.sleep(retryAfter);
    }
  }

  logseq.App.showMsg('Highlights imported!');

  // Reset progress bar
  width = 1;
  elem.style.width = width + '%';

  logseq.updateSettings({
    latestRetrieved: latestBookList[0].updated,
  });
};

export default { getHighlightsForBook };
