import { useState } from "react";

const ConnectionForm = ({ onConnect }) => {
  const [connString, setConnString] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (connString.trim()) {
      onConnect(connString);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4">
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
        SQL Server Connection
      </h3>

      <textarea
        value={connString}
        onChange={(e) => setConnString(e.target.value)}
        placeholder="Paste your SQL Server connection string..."
        rows={4}
        className="resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono text-sm text-gray-900 placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500
                   dark:focus:ring-blue-400 dark:focus:border-blue-400"
      />

      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white
                   hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                   dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-900
                   transition-colors duration-200"
      >
        Connect
      </button>
    </form>
  );
};

export default ConnectionForm;
