<div className="flex justify-center">
  <div className="absolute top-3 bg-indigo-900 rounded-lg p-3 w-100">
    {/* Close button */}
    <div className="flex justify-between">
      <button
        onClick={this.firstTime}
        type="button"
        className="bg-indigo-900 rounded-md inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 mb-2"
      >
        Click here if using this plugin for the first time.
      </button>
      <button
        onClick={this.hide}
        type="button"
        className="bg-indigo-900 rounded-md inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 mb-2"
      >
        <img src={exitIcon} className="p-0 m-0" />
      </button>
    </div>

    {/* Token row */}
    <div className="flex flex-row">
      <input
        className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
        type="text"
        name="token"
        value={this.state.token}
        onChange={this.handleInput}
      />
      <button
        onClick={this.saveToken}
        className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded ml-3"
      >
        Save Token
      </button>
    </div>

    {/* Information row */}
    <div className="bg-indigo-900 text-center py-2 lg:px-4">
      <div
        className="p-2 bg-indigo-800 items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex"
        role="alert"
      >
        <span className="flex rounded-full bg-indigo-500 uppercase px-2 py-1 text-xs font-bold mr-3">
          {this.state.noOfBooks}
        </span>
        <span className="font-semibold mr-2 text-left flex-auto">
          Total number of sources
        </span>
      </div>
    </div>

    <div className="bg-indigo-900 text-center py-2 lg:px-4">
      <div
        className="p-2 bg-indigo-800 items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex"
        role="alert"
      >
        <span className="flex rounded-full bg-indigo-500 uppercase px-2 py-1 text-xs font-bold mr-3">
          {this.state.noOfHighlights}
        </span>
        <span className="font-semibold mr-2 text-left flex-auto">
          Total number of highlights
        </span>
      </div>
    </div>

    <div className="bg-indigo-900 text-center py-2 lg:px-4">
      <div
        className="p-2 bg-indigo-800 items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex"
        role="alert"
      >
        <span className="flex rounded-full bg-indigo-500 uppercase px-2 py-1 text-xs font-bold mr-3">
          {this.state.noOfNewHighlights}
        </span>
        <span className="font-semibold mr-2 text-left flex-auto">
          Number of new sources to sync
        </span>
        <span>
          <button onClick={this.refreshSources} className="p-0 m-0">
            <img src={refreshIcon} className="p-0 m-0 hover:border-blue-500" />
          </button>
        </span>
      </div>
    </div>

    {/* Synchronisation section */}
    <div className="bg-purple-500 text-white font-bold rounded-t px-4 py-2 mb-2">
      Please note that synchronising more than 20 sources can take a longer time
      due to Readwise's API limits.
    </div>
    <div className="border border-t-0 border-purple-400 rounded-b bg-red-100 px-4 py-3 text-purple-700">
      {/* Only show when setState has completed */}
      {this.state.loaded && !this.state.sync && (
        <React.Fragment>
          <button
            onClick={this.syncReadwise}
            className="inline-flex items-center h-10 px-5 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800 mr-3"
          >
            Sync New Sources
          </button>
          <button
            onClick={this.syncOnlyTOC}
            className="inline-flex items-center h-10 px-5 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800"
          >
            Sync only Table of Contents
          </button>
        </React.Fragment>
      )}

      {/* Only show when Syncing */}
      {this.state.sync && (
        <button
          onClick={this.terminate}
          className="inline-flex items-center h-10 px-5 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800"
        >
          Stop Syncing
        </button>
      )}

      <div className="relative pt-1 mt-3">
        <div className="overflow-hidden h-2 text-xs flex rounded bg-black">
          <div
            id="myProgress"
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-black"
          ></div>
        </div>
      </div>
    </div>
  </div>
</div>;
