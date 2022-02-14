import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';
import { handleClosePopup } from './handleClosePopup';

export const pluginBar = () => {
  // Set preferred date format
  window.setTimeout(async () => {
    const userConfigs = await logseq.App.getUserConfigs();

    const preferredDateFormat: string = userConfigs.preferredDateFormat;
    const orgOrMarkdown: string = userConfigs.preferredFormat;

    logseq.updateSettings({
      preferredDateFormat: preferredDateFormat,
      orgOrMarkdown: orgOrMarkdown,
    });

    console.log(
      `Settings updated to ${preferredDateFormat} and ${orgOrMarkdown}}`
    );
  }, 3000);

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
