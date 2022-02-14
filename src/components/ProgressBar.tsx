import React from 'react';

const ProgressBar = ({ progressPercentage }) => {
  return (
    <React.Fragment>
      <p className="text-right">{progressPercentage}%</p>
      <div className="h-2 w-full bg-gray-300">
        <div
          style={{ width: `${progressPercentage}%` }}
          className={`h-full ${
            progressPercentage < 70 ? 'bg-red-600' : 'bg-green-600'
          }`}
        ></div>
      </div>
    </React.Fragment>
  );
};

export default ProgressBar;
