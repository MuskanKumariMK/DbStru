import React from "react";

const TableList = ({ schema }) => {
  return (
    <div className="space-y-4">
      {Object.entries(schema).map(([tableName, details]) => (
        <div
          key={tableName}
          className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm
                     dark:border-gray-700 dark:bg-gray-800"
        >
          <strong className="block text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {tableName}
          </strong>

          <div className="space-y-1">
            {details.columns.map((colName) => (
              <div
                key={colName}
                className="flex justify-between rounded-md bg-gray-50 px-2 py-1 text-sm
                           text-gray-800 dark:bg-gray-700 dark:text-gray-200"
              >
                <span className="font-medium">{colName}</span>
                <span className="italic text-gray-600 dark:text-gray-400">
                  {details.column_types[colName]}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableList;
