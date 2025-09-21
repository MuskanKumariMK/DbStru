import React, { useState } from "react";

const CodeSection = ({ onExecute }) => {
  const [code, setCode] = useState("");

  return (
    <div className="w-full">
      <h4 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
        Create Table / SQL Editor
      </h4>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Write your CREATE TABLE statement here..."
        rows={15}
        className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm text-gray-900 placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500
                   dark:focus:ring-blue-400 dark:focus:border-blue-400"
      />

      <button
        onClick={() => onExecute(code)}
        className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-white font-medium
                   hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                   dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-900
                   transition-colors duration-200"
      >
        Execute / Preview
      </button>
    </div>
  );
};

export default CodeSection;
