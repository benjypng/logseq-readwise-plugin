import React, { useEffect, useState } from 'react';
import highlight from './services/randomHighlightsUtilities';
import {
  getTotalNumberOfHighlightsAndBooks,
  loadFromReadwise,
} from './services/utilities';
import Basics from './components/Basics';
import Customise from './components/Customise';
import Sync from './components/Sync';
import RandomHighlight from './components/RandomHighlight';

interface PluginSettings {
  pageSize: number;
  noOfBooks: number;
  noOfHighlights: number;
  noOfNewSources: number;
  bookList: any[];
  sync: boolean;
  loaded: boolean;
  isRefreshing: boolean;
  errorLoading: boolean;
}

const App = () => {
  const { token } = logseq.settings;

  const [pluginSettings, setPluginSettings] = useState<PluginSettings>({
    pageSize: 1000,
    noOfBooks: 0,
    noOfHighlights: 0,
    noOfNewSources: 0,
    bookList: [],
    sync: false,
    loaded: false,
    isRefreshing: false,
    errorLoading: false,
  });

  const {
    pageSize,
    noOfBooks,
    noOfHighlights,
    noOfNewSources,
    bookList,
    sync,
    loaded,
  } = pluginSettings;

  useEffect(() => {
    async () => {
      // Get total number of highlights to show on dashboard
      await getTotalNumberOfHighlightsAndBooks(token, setPluginSettings);

      // Load latest books
      await loadFromReadwise(token, pageSize, setPluginSettings);
    };
  });

  const terminate = () => {
    window.location.reload();
    logseq.hideMainUI();
  };

  return (
    <div className="flex justify-center overflow-scroll">
      <div
        className="absolute top-3 bg-white rounded-lg p-3 w-2/3 border font-serif
"
      >
        {/* BASICS START */}
        <Basics
          noOfBooks={noOfBooks}
          noOfHighlights={noOfHighlights}
          noOfNewSources={noOfNewSources}
          pageSize={pageSize}
          setPluginSettings={setPluginSettings}
        />
        {/* BASICS END */}
        <hr className="border 2px solid black" />
        {/* CUSTOMISE START */}
        <Customise />
        {/* CUSTOMISE END */}
        <hr className="border 2px solid black" />
        {/* SYNC START */}
        <Sync
          loaded={loaded}
          sync={sync}
          terminate={terminate}
          bookList={bookList}
          token={token}
          setPluginSettings={setPluginSettings}
        />
        {/* SYNC END */}

        {/* RANDOM HIGHLIGHT START */}
        <RandomHighlight />
        {/* RANDOM HIGHLIGHT END */}
      </div>
    </div>
  );
};

export default App;
