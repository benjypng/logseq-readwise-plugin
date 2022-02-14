import React from 'react';
import { getDateForPageWithoutBrackets } from 'logseq-dateutils';
import { loadFromReadwise } from '../services/utilities';

const Basics = (props: {
  loadFromReadwise: Function;
  setLogseqSettings: Function;
  latestRetrieved: string;
  logseqSettings: { token: string };
  noOfBooks: number;
  noOfHighlights: number;
  noOfNewSources: number;
}) => {
  const {
    loadFromReadwise,
    setLogseqSettings,
    latestRetrieved,
    logseqSettings,
    noOfBooks,
    noOfHighlights,
    noOfNewSources,
  } = props;

  const { preferredDateFormat } = logseq.settings;

  const handleLogseqSettingsInput = (e: any) => {
    setLogseqSettings({ ...logseqSettings, [e.target.name]: e.target.value });
  };

  const saveToken = () => {
    logseq.updateSettings({ token: logseqSettings.token });
    logseq.App.showMsg('Token saved!', 'success');
  };

  const hide = () => {
    logseq.hideMainUI();
  };

  return (
    <div className="flex flex-col py-2 bg-white">
      <div className="flex flex-row justify-between">
        <p className="text-2xl font-bold">Step 1: The Basics</p>
        <button onClick={hide} className="z-50 -mt-8">
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
      <p>
        Last Retrieved:{' '}
        {getDateForPageWithoutBrackets(
          new Date(latestRetrieved),
          preferredDateFormat
        )}{' '}
        @ {new Date(latestRetrieved).getHours()}:
        {new Date(latestRetrieved).getMinutes()}
      </p>
      <div className="flex flex-row">
        <input
          placeholder="Key in your Readwise API Token"
          type="text"
          name="token"
          value={logseqSettings.token}
          onChange={handleLogseqSettingsInput}
          className="border border-gray-200 hover:border-blue-500 w-full px-3 py-1 focus:border-blue-500 focus:border-b-4"
        />
        <button onClick={saveToken} className="text-blue-500 font-bold pl-3">
          Save Token
        </button>
      </div>
      {/* Sources and highlights row */}
      <div className="flex flex-start flex-col">
        <div className="text-center">
          <div className="p-2 bg-white items-center text-black flex">
            <span className="flex rounded-full bg-white uppercase px-2 py-1 text-xs font-bold mr-3 border border-black">
              {noOfBooks}
            </span>
            <span className="font-semibold mr-2 text-left flex-auto">
              Total number of sources
            </span>
          </div>
        </div>

        <div className="text-center">
          <div className="p-2 bg-white items-center text-black flex">
            <span className="flex rounded-full bg-white uppercase px-2 py-1 text-xs font-bold mr-3 border border-black">
              {noOfHighlights}
            </span>
            <span className="font-semibold mr-2 text-left flex-auto">
              Total number of highlights
            </span>
          </div>
        </div>

        <div className="text-center">
          <div className="p-2 bg-white items-center text-black flex flex-row justify-between">
            <span className="flex rounded-full bg-white uppercase px-2 py-1 text-xs font-bold mr-3 border border-black">
              {noOfNewSources}
            </span>
            <span className="font-semibold mr-2 text-left flex-auto">
              Number of new sources to sync
            </span>
            <button
              onClick={() => {
                loadFromReadwise();
              }}
              className="text-blue-500 font-bold pl-3"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
      {/* End information row */}
    </div>
  );
};

export default Basics;
