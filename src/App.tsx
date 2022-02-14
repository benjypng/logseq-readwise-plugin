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

interface LogseqSettings {
  token: string;
  latestRetrieved: string;
  sortRecentFirst: boolean;
  retrievedTime: boolean;
}

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
  const { token, latestRetrieved, sortRecentFirst, retrievedTime } =
    logseq.settings;

  const [logseqSettings, setLogseqSettings] = useState<LogseqSettings>({
    token: token,
    latestRetrieved: latestRetrieved,
    sortRecentFirst: sortRecentFirst,
    retrievedTime: retrievedTime,
  });

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
    // Get total number of highlights to show on dashboard
    getTotalNumberOfHighlightsAndBooks(token, setPluginSettings);

    // Load latest books
    loadFromReadwise(token, pageSize, setPluginSettings, pluginSettings);

    setPluginSettings((currSettings) => ({
      ...currSettings,
      loaded: true,
    }));
  }, []);

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
          loadFromReadwise={() =>
            loadFromReadwise(token, pageSize, setPluginSettings, pluginSettings)
          }
          setLogseqSettings={setLogseqSettings}
          latestRetrieved={latestRetrieved}
          logseqSettings={logseqSettings}
          noOfBooks={noOfBooks}
          noOfHighlights={noOfHighlights}
          noOfNewSources={noOfNewSources}
        />
        {/* BASICS END */}
        <hr className="border 2px solid black" />
        {/* CUSTOMISE START */}
        <Customise />
        {/* CUSTOMISE END */}
        <hr className="border 2px solid black" />
        {/* SYNC START */}
        <Sync
          loadFromReadwise={() =>
            loadFromReadwise(token, pageSize, setPluginSettings, pluginSettings)
          }
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
