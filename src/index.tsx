import '@logseq/libs';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import highlight from './randomHighlight';

const main = async () => {
  console.log('Readwise plugin loaded');
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('app')
  );

  const randomHighlight = async () => {
    const hl = await highlight.getRandomHighlight();
    const page = await logseq.Editor.getPage(hl.pageId);

    if (hl.content === '## [[Readwise Highlights]]') {
      await randomHighlight();
    } else {
      return { content: hl.content, pageName: page.originalName };
    }
  };

  // Insert renderer upon slash command
  logseq.Editor.registerSlashCommand('random highlight', async () => {
    const highlight = await randomHighlight();

    await logseq.Editor.insertAtEditingCursor(
      `> **${highlight.pageName}**
      ${highlight.content}`
    );
  });

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
    key: 'logseq-readwise-plugin',
    template: `
        <a data-on-click="show"
          class="button">
          <i class="ti ti-book"></i>
        </a>
  `,
  });
};

logseq.ready(main).catch(console.error);
