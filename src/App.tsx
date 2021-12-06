import React from 'react';
import './App.css';
import axios from 'axios';
import handleHighlights from './handle-highlights';

export default class App extends React.Component {
  state = {
    token: logseq.settings['token'],
    latestRetrieved: logseq.settings['latestRetrieved'],
    noOfBooks: '',
    noOfHighlights: '',
    noOfNewHighlights: '',
    booklist: [],
    latestBookList: [],
    sync: false,
    loaded: false,
    isRefreshing: false,
    errorLoading: '',
  };

  componentDidMount = async () => {
    this.loadFromReadwise();
  };

  loadFromReadwise = async () => {
    console.log(this.state.latestRetrieved);

    this.setState({
      noOfBooks: '',
      noOfHighlights: '',
      noOfNewHighlights: '',
      booklist: [],
      latestBookList: [],
      errorLoading: false,
    });

    try {
      const booklist = await axios({
        method: 'get',
        url: 'https://readwise.io/api/v2/books/',
        headers: {
          Authorization: `Token ${logseq.settings['token']}`,
        },
      });

      const highlightsList = await axios({
        method: 'get',
        url: 'https://readwise.io/api/v2/highlights/',
        headers: {
          Authorization: `Token ${logseq.settings['token']}`,
        },
      });

      // Filter out books where there are highlights newer than the last retrieved date
      const latestBookList = booklist.data.results.filter(
        (b) =>
          new Date(b.updated) > new Date(logseq.settings['latestRetrieved'])
      );

      this.setState({
        noOfBooks: booklist.data['count'],
        booklist: booklist.data.results,
        noOfHighlights: highlightsList.data['count'],
        noOfNewHighlights: latestBookList.length,
        latestBookList: latestBookList,
        loaded: true,
      });
    } catch (e) {
      this.setState({ errorLoading: true });
    }
  };

  syncReadwise = () => {
    this.setState({
      sync: 'true',
    });

    let i = 0;
    if (i == 0) {
      i = 1;
      var elem = document.getElementById('myProgress');
      var width = 1;

      ////////////////////////////////////////////
      ///// STEP 1: CREATE TABLE OF CONTENTS /////
      ////////////////////////////////////////////

      const { booklist, latestBookList, latestRetrieved } = this.state;

      handleHighlights.createReadwiseToc(latestRetrieved, booklist);

      ///////////////////////////////////////////////////////////
      ///// STEP 2: GO TO EACH PAGE AND POPULATE HIGHLIGHTS /////
      ///////////////////////////////////////////////////////////

      handleHighlights.getHighlightsForBook(
        latestBookList,
        width,
        elem,
        booklist
      );
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

  saveToken = () => {
    logseq.updateSettings({ token: this.state.token });
    this.loadFromReadwise();
  };

  syncOnlyTOC = () => {
    const { latestRetrieved, booklist } = this.state;
    handleHighlights.createReadwiseToc(latestRetrieved, booklist);
  };

  refreshSources = () => {
    this.loadFromReadwise();
  };

  firstTime = () => {
    logseq.updateSettings({ latestRetrieved: '1970-01-01T00:00:00Z' });
  };

  render() {
    return (
      <div className="flex justify-center">
        <div className="absolute top-3 bg-white rounded-lg p-3 w-100 border">
          {/* First row */}
          <div className="flex justify-between">
            <button
              onClick={this.firstTime}
              className="text-black border border-black px-2 mb-2 mr-2 mt-3 rounded-md text-left"
            >
              Click here if you are using this plugin for the first time
            </button>
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
              Wrong API token entered. Please try again.
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
                  {this.state.noOfNewHighlights}
                </span>
                <span className="font-semibold mr-2 text-left flex-auto">
                  Number of new sources to sync{' '}
                  <button
                    onClick={this.refreshSources}
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
            <div className="bg-white">
              Please note that syncing more than 20 sources will take a longer
              time because of Readwise's API limits.
            </div>
            <div className="my-2">
              {/* Only show when setState has completed. */}
              {this.state.loaded && !this.state.sync && (
                <React.Fragment>
                  <button
                    onClick={this.syncOnlyTOC}
                    className="border border-blue-500 bg-white text-blue-500 px-2 py-1 rounded mr-2"
                  >
                    Sync only Table of Contents
                  </button>
                  <button
                    onClick={this.syncReadwise}
                    className="border bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Sync New Sources
                  </button>
                </React.Fragment>
              )}

              {/* Only show when Syncing */}
              {this.state.sync && (
                <button
                  onClick={this.terminate}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Stop Syncing
                </button>
              )}

              {/* Start progress bar */}
              <div className="relative pt-1 mt-3">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-black border border-black">
                  <div
                    id="myProgress"
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-white"
                  ></div>
                </div>
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
