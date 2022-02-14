import '@logseq/libs';
import './App.css';
import { pluginBar } from './services/pluginBar';
import { getRandomHighlight } from './services/randomHighlightsUtilities';

const main = async () => {
  console.log('Readwise plugin loaded');

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

  // PLUGIN BAR ICON
  pluginBar();
};

logseq.ready(main).catch(console.error);
