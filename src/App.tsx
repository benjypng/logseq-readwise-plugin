import React from 'react';
import './App.css';
import axios from 'axios';
import handleHighlights from './handle-highlights';
import utils from './utils';

export default class App extends React.Component {
  state = {
    token: logseq.settings['token'],
    latestRetrieved: logseq.settings['latestRetrieved'],
    noOfBooks: '',
    noOfHighlights: '',
    noOfNewSources: '',
    booklist: [],
    highlightlist: [],
    latestBookList: [],
    syncTime: '',
    sync: false,
    loaded: false,
    isRefreshing: false,
    errorLoading: '',
  };

  componentDidMount = async () => {
    this.loadFromReadwise();
  };

  loadFromReadwise = async () => {
    const progressDiv = document.getElementById('progressDiv');

    progressDiv.innerHTML = "Refreshing Sources....  This may take a minute...";

    console.log(this.state.latestRetrieved);

    this.setState({
      noOfBooks: '',
      noOfHighlights: '',
      noOfNewSources: '',
      booklist: [],
      highlightlist: [],
      latestBookList: [],
      errorLoading: false,
    });

    let currentTime = new Date(Date.now()).toISOString();

    const pageSize = 1000;
    const lastRetrieved = new Date(this.state.latestRetrieved);
    try {
      let booklist = await utils.getAllResults('books', this.state.token, {page_size: pageSize, num_highlights__gt: 0, updated__gt: lastRetrieved});

      let highlightlist = await utils.getAllResults('highlights', this.state.token, {page_size: pageSize, updated__gt: lastRetrieved});

      this.setState({
        noOfBooks: booklist.length,
        booklist: booklist,
        highlightlist: highlightlist,
        noOfHighlights: highlightlist.length,
        noOfNewSources: booklist.length,
        loaded: true,
        syncTime: currentTime,
      });
    } catch (e) {
      this.setState({ errorLoading: true });
    }

    progressDiv.innerHTML = "";
  };

  syncReadwise = async () => {
    this.setState({
      sync: 'true',
    });

    let i = 0;
    if (i == 0) {
      i = 1;
      const elemBar = document.getElementById('myProgress');
      const elemText = document.getElementById('textPercent');
      const progressDiv = document.getElementById('progressDiv');
      const width = 0;

      const { booklist, highlightlist } = this.state;

      await handleHighlights.getHighlightsForBook(
        booklist,
        highlightlist,
        width,
        elemBar,
        elemText,
        progressDiv
      );

      logseq.updateSettings({
        // set latestRetrieved to the time we started the sync
        latestRetrieved: this.state.syncTime 
      });

      this.setState({
        latestRetrieved: this.state.syncTime
      });

      await this.loadFromReadwise();
    }

    this.setState({
      sync: false,
    });
  };

  hide = () => {
    logseq.hideMainUI();
  };

  terminate = () => {
    window.location.reload();
    logseq.hideMainUI();
  };

  handleInput = (e: any) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  saveToken = async () => {
    await logseq.updateSettings({ token: this.state.token });
    await this.loadFromReadwise();
  };

  firstTime = async () => {
    logseq.updateSettings({
      latestRetrieved: '1970-01-01T00:00:00Z',
    });
    this.setState({
      latestRetrieved: logseq.settings['latestRetrieved'],
    });
    console.log(this.state.latestRetrieved);
  };

  render() {
    return (
      <div className="flex justify-center">
        <div className="absolute top-3 bg-white rounded-lg p-3 w-100 border">
          {/* First row */}
          <div className="flex justify-between">
            <div id="initialLoadWait" className="text-sm text-red-500"></div>
            {!this.state.latestRetrieved && (
              <button
                onClick={this.firstTime}
                className="text-black border border-black px-2 mb-2 mr-2 mt-3 rounded-md text-left"
              >
                Click here if you are using this plugin for the first time
              </button>
            )}
            <button onClick={this.hide} className="z-50">
              <svg
                className="fill-current text-black"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
              >
                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
              </svg>
            </button>
          </div>

          <hr className="my-3" />

          {/* Token row */}
          <div className="flex flex-row py-2">
            <input
              placeholder="Key in your Readwise API Token"
              type="text"
              name="token"
              value={this.state.token}
              onChange={this.handleInput}
              className="border border-gray-200 hover:border-blue-500 w-60 px-3 py-1 focus:border-blue-500 focus:border-b-4"
            />
            <button
              onClick={this.saveToken}
              className="text-blue-500 font-bold pl-3"
            >
              Save Token
            </button>
          </div>
          {this.state.errorLoading && (
            <p className="text-red-500 text-sm mt-0">
              Error loading data. Please refer to developer tools.
            </p>
          )}

          {/* Sources and highlights row */}
          <div className="flex flex-start flex-col">
            <div className="text-center">
              <div className="p-2 bg-white items-center text-black flex">
                <span className="flex rounded-full bg-white uppercase px-2 py-1 text-xs font-bold mr-3 border border-black">
                  {this.state.noOfBooks}
                </span>
                <span className="font-semibold mr-2 text-left flex-auto">
                  Total number of sources
                </span>
              </div>
            </div>

            <div className="text-center">
              <div className="p-2 bg-white items-center text-black flex">
                <span className="flex rounded-full bg-white uppercase px-2 py-1 text-xs font-bold mr-3 border border-black">
                  {this.state.noOfHighlights}
                </span>
                <span className="font-semibold mr-2 text-left flex-auto">
                  Total number of highlights
                </span>
              </div>
            </div>

            <div className="text-center">
              <div className="p-2 bg-white items-center text-black flex">
                <span className="flex rounded-full bg-white uppercase px-2 py-1 text-xs font-bold mr-3 border border-black">
                  {this.state.noOfNewSources}
                </span>
                <span className="font-semibold mr-2 text-left flex-auto">
                  Number of new sources to sync{' '}
                  <button
                    onClick={this.loadFromReadwise}
                    className="text-blue-500 font-bold pl-3"
                  >
                    Refresh
                  </button>
                </span>
              </div>
            </div>
          </div>
          {/* End information row */}

          {/* Start sync row */}
          <div className="mt-3 border-black border-4 bg-white px-2 py-3 flex flex-col">
            <div className="my-2">
              {/* Only show when setState has completed. */}
              {this.state.loaded && !this.state.sync && (
                <button
                  onClick={this.syncReadwise}
                  className="border bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Sync New Sources
                </button>
              )}

              {/* Only show when Syncing */}
              {this.state.sync && (
                <button
                  onClick={this.terminate}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Stop Syncing (please reload plugin)
                </button>
              )}

              <div id="progressDiv" className="text-blue-500 text-sm"></div>

              {/* Start progress bar */}
              <div className="relative pt-1 mt-3">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-black border border-black">
                  <div
                    id="myProgress"
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-white w-0"
                  ></div>
                </div>
                <p
                  className="text-right text-black text-sm"
                  id="textPercent"
                ></p>
              </div>
              {/* End progress bar */}
            </div>
          </div>
          {/* End sync row */}
        </div>
      </div>
    );
  }
}
