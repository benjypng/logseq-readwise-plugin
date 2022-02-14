import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';
import { handleClosePopup } from './handleClosePopup';

export const pluginBar = () => {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('app')
  );

  logseq.provideModel({
    show() {
      logseq.showMainUI();
    },
  });

  handleClosePopup();

  // Register UI
  logseq.App.registerUIItem('toolbar', {
    key: 'logseq-readwise-plugin',
    template: `
            <a data-on-click="show" class="button">
              <i class="ti ti-book"></i>
            </a>
      `,
  });
};
