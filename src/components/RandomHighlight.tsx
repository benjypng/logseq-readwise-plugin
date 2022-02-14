import React from 'react';
import { scrollToRandomHighlight } from '../services/randomHighlightsUtilities';

const RandomHighlight = () => {
  const gotoRandomHighlight = () => {
    scrollToRandomHighlight();
  };

  return (
    <div className="flex flex-col py-2 bg-white">
      <div className="flex flex-row justify-between">
        <p className="text-2xl font-bold">Optional: </p>
        <button
          onClick={gotoRandomHighlight}
          className="p-3 bg-green-600 text-white"
        >
          Get a Random Highlight from your Readwise Highlights!
        </button>
      </div>
    </div>
  );
};

export default RandomHighlight;
