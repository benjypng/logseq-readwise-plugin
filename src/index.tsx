import '@logseq/libs';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const main = () => {
  console.log('Readwise plugin loaded');
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('app')
  );

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
