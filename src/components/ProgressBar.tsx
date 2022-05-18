import React from "react";

const ProgressBar = ({ progressPercentage }) => {
  return (
    <React.Fragment>
      <p className="text-right">{progressPercentage.toFixed(2)}%</p>
      <div className="h-2 w-full bg-gray-300">
        <div
          style={{ width: `${progressPercentage}%` }}
          className={`h-full ${
            progressPercentage < 70 ? "bg-yellow-300" : "bg-green-600"
          }`}
        ></div>
      </div>
    </React.Fragment>
  );
};

export default ProgressBar;
