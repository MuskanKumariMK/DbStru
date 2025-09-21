// Table Node Component with TailwindCSS
const TableNode = ({ data }) => (
  <div
    className="w-[550px] rounded-lg border border-gray-300 bg-white shadow-md 
               dark:border-gray-700 dark:bg-gray-800"
  >
    {/* Table Header */}
    <div
      className="flex items-center justify-between rounded-t-md bg-gray-100 px-3 py-2 
                    text-sm font-semibold text-gray-800 dark:bg-gray-700 dark:text-gray-100"
    >
      <span>{data.tableName}</span>
      {data.rowCount !== undefined && (
        <span className="text-xs text-gray-600 dark:text-gray-300">
          {data.rowCount} rows
        </span>
      )}
    </div>

    {/* Table Columns */}
    <div className="divide-y divide-gray-200 dark:divide-gray-600">
      {data.columns.map((col) => (
        <div
          key={col.name}
          className="flex items-center justify-between px-3 py-1.5 text-sm
                     hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          {/* Column Info */}
          <div className="flex flex-col">
            <span className="font-medium text-gray-800 dark:text-gray-100">
              {col.name}
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {col.type}
            </span>
          </div>

          {/* Constraints */}
          <div className="flex gap-2 ml-auto text-xs">
            {col.isPrimary && (
              <span className="font-bold text-green-500">PK</span>
            )}
            {col.isForeignKey && (
              <span className="font-bold text-blue-500">FK</span>
            )}
            {col.nullable && <span className="text-indigo-400">NULL</span>}
          </div>

          {/* Handles for React Flow */}
          {col.isPrimary && (
            <Handle
              type="source"
              position={Position.Right}
              id={`source-${data.tableName}-${col.name}`}
              className="!bg-green-500"
            />
          )}
          {col.isForeignKey && (
            <Handle
              type="target"
              position={Position.Left}
              id={`target-${data.tableName}-${col.name}`}
              className="!bg-blue-500"
            />
          )}
        </div>
      ))}
    </div>
  </div>
);
