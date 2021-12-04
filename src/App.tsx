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
  };

  componentDidMount = async () => {
    console.log(this.state.latestRetrieved);

    const booklist = await axios({
      method: 'get',
      url: 'https://readwise.io/api/v2/books/',
      headers: {
        Authorization: `Token ${logseq.settings['token']}`,
      },
    });

    this.setState({
      noOfBooks: booklist.data['count'],
    });

    this.setState({
      booklist: booklist.data.results,
    });

    const highlightsList = await axios({
      method: 'get',
      url: 'https://readwise.io/api/v2/highlights/',
      headers: {
        Authorization: `Token ${logseq.settings['token']}`,
      },
    });

    this.setState({
      noOfHighlights: highlightsList.data['count'],
    });

    // Filter out books where there are highlights newer than the last retrieved date
    const latestBookList = booklist.data.results.filter(
      (b) => new Date(b.updated) > new Date(logseq.settings['latestRetrieved'])
    );

    this.setState({
      noOfNewHighlights: latestBookList.length,
    });

    this.setState({
      latestBookList: latestBookList,
    });

    this.setState({
      loaded: true,
    });
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
  };

  syncOnlyTOC = () => {
    const { latestRetrieved, booklist } = this.state;
    handleHighlights.createReadwiseToc(latestRetrieved, booklist);
  };

  render() {
    return (
      <React.Fragment>
        <div id="wrapper">
          <div id="load-readwise">
            <p>
              <label htmlFor="token">Token</label>:{''}
              <input
                type="text"
                name="token"
                value={this.state.token}
                onChange={this.handleInput}
              />
              <button onClick={this.saveToken}>Save Token</button>
            </p>
            <h3>Total no. of sources: {this.state.noOfBooks}</h3>
            <h3>Total no. of highlights: {this.state.noOfHighlights}</h3>
            <h3>No. of new sources to sync: {this.state.noOfNewHighlights}</h3>
            <p>
              Please note that synchronising more than 20 sources can take a
              longer time due to Readwise's API limits.
            </p>
            <div id="progressBar">
              <div id="myProgress"></div>
            </div>

            {/* Exit button that always shows */}
            <button onClick={this.hide}>Exit</button>

            {/* Only show when setState has completed */}
            {this.state.loaded && !this.state.sync && (
              <React.Fragment>
                <button onClick={this.syncReadwise}>Sync Readwise</button>
                <button onClick={this.syncOnlyTOC}>Sync only TOC</button>
              </React.Fragment>
            )}

            {/* Only show when Syncing */}
            {this.state.sync && (
              <button onClick={this.terminate}>Stop Syncing</button>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
