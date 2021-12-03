import '@logseq/libs';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import axios from 'axios';
import './utils';
import utils from './utils';

const main = () => {
  console.log('Readwise plugin loaded');

  // For UI to insert settings
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('app')
  );

  logseq.provideModel({
    async getBooks() {
      ////////////////////////////////////////////
      ///// STEP 1: CREATE TABLE OF CONTENTS /////
      ////////////////////////////////////////////

      // Get list of books from Readwise
      const booklist = await axios({
        method: 'get',
        url: 'https://readwise.io/api/v2/books/',
        headers: {
          Authorization: `Token udhQHKj5MZ2bsLzKKXd2NT0VE2NTDkHZHS0bXfYCvfAn8KI8re`,
        },
      });

      // Check against retrieved date
      if (
        new Date(booklist.data.results[0].updated) <=
        new Date(logseq.settings?.lastRetrieved)
      ) {
        logseq.App.showMsg(`There are no new highlights!`);
        return;
      }

      logseq.updateSettings({
        lastRetrieved: booklist.data.results[0].updated,
      });

      // Map list of books into logseq compatible array
      const booklistArr = booklist.data.results.map((b) => ({
        content: `[[${b.title}]]
        author:: [[${b.author}]]
        `,
      }));

      // Create Title for Table of Contents
      logseq.App.pushState('page', { name: utils.pageName });

      const currPage = await logseq.Editor.getCurrentPage();
      const pageBlockTree = await logseq.Editor.getCurrentPageBlocksTree();

      // Check if page is populated. If it is, clear page and re-insert the blocks
      let targetBlock;
      if (pageBlockTree.length > 0) {
        targetBlock = pageBlockTree[0];
        await logseq.Editor.removeBlock(targetBlock.uuid);
      }

      targetBlock = await logseq.Editor.insertBlock(
        currPage.name,
        'Fetching books ...',
        {
          isPageBlock: true,
        }
      );

      await logseq.Editor.insertBatchBlock(targetBlock.uuid, booklistArr, {
        sibling: false,
      });

      await logseq.Editor.updateBlock(
        targetBlock.uuid,
        `Retrieved: ${utils.blockTitle()}`
      );

      ///////////////////////////////////////////////////////////
      ///// STEP 2: GO TO EACH PAGE AND POPULATE HIGHLIGHTS /////
      ///////////////////////////////////////////////////////////

      // Go to each page and populate each page
      for (let b = 0; b < 3; b++) {
        logseq.App.pushState('page', { name: booklist.data.results[b].title });

        console.log(`Updating ${booklist.data.results[b].title}`);

        const response = await axios({
          method: 'get',
          url: 'https://readwise.io/api/v2/highlights/',
          headers: {
            Authorization: `Token udhQHKj5MZ2bsLzKKXd2NT0VE2NTDkHZHS0bXfYCvfAn8KI8re`,
          },
          params: {
            book_id: booklist.data.results[b].id,
          },
        });

        const currPage = await logseq.Editor.getCurrentPage();
        const pageBlockTree = await logseq.Editor.getCurrentPageBlocksTree();

        let targetBlock;

        if (pageBlockTree.length > 0) {
          targetBlock = pageBlockTree[0];
          await logseq.Editor.removeBlock(targetBlock.uuid);
        }

        targetBlock = await logseq.Editor.insertBlock(
          currPage.name,
          'Fetching highlights ...',
          {
            isPageBlock: true,
          }
        );

        if (response.data.results.length === 0) {
          await logseq.Editor.updateBlock(
            targetBlock.uuid,
            `As of ${utils.blockTitle()}, there are no highlights in this book.`
          );
          continue;
        }

        const highlightsArr = response.data.results.map((h) => ({
          content: `${h.text}
            location:: [${h.location}](kindle://book?action=open&asin=${
            booklist.data.results[b].asin
          }&location=${h.location})
            on:: [[${utils.getDateForPage(new Date(h.highlighted_at))}]]
            `,
        }));

        await logseq.Editor.insertBatchBlock(targetBlock.uuid, highlightsArr, {
          sibling: false,
        });

        await logseq.Editor.updateBlock(
          targetBlock.uuid,
          `Retrieved: ${utils.blockTitle()}`
        );
      }

      logseq.App.showMsg('Highlights imported!');
    },
  });

  // Create UI for inserting env variables in settings
  const createModel = () => {
    return {
      show() {
        logseq.showMainUI();
      },
    };
  };

  logseq.provideModel(createModel());

  // Register UI
  logseq.App.registerUIItem('toolbar', {
    key: 'logseq-todoist-plugin',
    template: `
        <a data-on-click="getBooks"
          class="button">
          <i class="ti ti-book"></i>
        </a>
  `,
  });
};

logseq.ready(main).catch(console.error);
