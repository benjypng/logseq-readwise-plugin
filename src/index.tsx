import '@logseq/libs';
import './App.css';
import { bookView } from './services/bookView';
import { pluginBar } from './services/pluginBar';
import { getRandomHighlight } from './services/randomHighlightsUtilities';

const main = async () => {
  console.log('Readwise plugin loaded');

  if (!logseq.settings.template) {
    logseq.updateSettings({
      template: {
        customTitle: '%title% (Readwise)',
        metaData: '',
        height: '200',
        width: '200',
        sectionHeader: '## [[Readwise Highlights]]',
      },
    });
  }

  if (!logseq.settings.latestRetrieved) {
    logseq.updateSettings({
      latestRetrieved: '1970-01-01T00:00:00Z',
    });
  }

  if (!logseq.settings.token) {
    logseq.updateSettings({
      token: '12345',
    });
  }

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

    // PLUGIN BAR ICON
    pluginBar();
  }, 3000);

  // RANDOM HIGHLIGHT
  const randomHighlight = async () => {
    const hl = await getRandomHighlight();
    const page = await logseq.Editor.getPage(hl.pageId);

    if (hl.content === logseq.settings.template.sectionHeader) {
      await randomHighlight();
    } else {
      return { content: hl.content, pageName: page.originalName };
    }
  };

  logseq.Editor.registerSlashCommand('Random highlight', async () => {
    const highlight = await randomHighlight();

    await logseq.Editor.insertAtEditingCursor(
      `> **${highlight.pageName}**
          ${highlight.content}`
    );
  });

  // BOOK RENDERER
  const uniqueIdentifier = () =>
    Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '');

  logseq.Editor.registerSlashCommand('Book renderer', async () => {
    await logseq.Editor.insertAtEditingCursor(
      `{{renderer :bookRenderer_${uniqueIdentifier()}}}`
    );
  });

  bookView();
};

logseq.ready(main).catch(console.error);
