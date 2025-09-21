import React, { useCallback, useContext } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  MarkerType,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
} from "react-flow-renderer";
import { ThemeContext } from "../context/ThemeContext";

// ✅ TailwindCSS Table Node
const TableNode = ({ data }) => (
  <div
    className="w-[550px] rounded-lg border border-gray-300 bg-white shadow-md
               dark:border-gray-700 dark:bg-gray-800"
  >
    {/* Table Header */}
    <div
      className="flex items-center justify-between rounded-t-lg bg-gray-100 px-3 py-2 
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
          <div className="ml-auto flex gap-2 text-xs">
            {col.isPrimary && (
              <span className="font-bold text-green-500">PK</span>
            )}
            {col.isForeignKey && (
              <span className="font-bold text-blue-500">FK</span>
            )}
            {col.nullable && <span className="text-indigo-400">NULL</span>}
          </div>

          {/* React Flow Handles */}
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

const nodeTypes = { tableNode: TableNode };

const relationshipColors = {
  "1:1": "#10b981",
  "1:N": "#3b82f6",
  "N:N": "#8b5cf6",
};

export default function ERD({ schema }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { theme } = useContext(ThemeContext);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  React.useEffect(() => {
    if (!schema) return;

    const newNodes = [];
    const newEdges = [];
    const tables = Object.entries(schema);
    const cols = Math.ceil(Math.sqrt(tables.length));
    const TABLE_WIDTH = 550;
    const COLUMN_HEIGHT = 30;

    tables.forEach(([tableName, details], index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      const tableHeight = details.columns.length * COLUMN_HEIGHT + 60;
      const x = col * (TABLE_WIDTH + 150);
      const y = row * (tableHeight + 100);

      const columnsWithMetadata = details.columns.map((colName) => ({
        name: colName,
        type: details.column_types[colName],
        isPrimary: details.primary_keys.includes(colName),
        isForeignKey:
          details.foreign_keys.some((fk) => fk.column === colName) ||
          details.primary_keys.includes(colName),
        nullable: details.nullable[colName],
      }));

      newNodes.push({
        id: tableName,
        type: "tableNode",
        data: {
          tableName,
          columns: columnsWithMetadata,
          rowCount: details.row_count,
        },
        position: { x, y },
        draggable: true,
      });

      details.foreign_keys.forEach((fk) => {
        let relationType = "1:N";
        if (fk.isUnique && details.primary_keys.includes(fk.column))
          relationType = "1:1";
        if (fk.isManyToMany) relationType = "N:N";

        const targetTableName = Object.keys(schema).find((t) =>
          t.endsWith(fk.ref_table)
        );

        newEdges.push({
          id: `edge-${tableName}-${targetTableName}-${fk.column}`,
          source: tableName,
          sourceHandle: `source-${tableName}-${fk.column}`,
          target: targetTableName,
          targetHandle: `target-${targetTableName}-${fk.ref_column}`,
          label: `${fk.column} → ${fk.ref_column} (${relationType})`,
          type: "smoothstep",
          animated: relationType === "1:N",
          style: {
            stroke: relationshipColors[relationType],
            strokeWidth: 2,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: relationshipColors[relationType],
          },
        });
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [schema]);

  return (
    <div className="erd-container h-screen w-full bg-gray-50 dark:bg-gray-900">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.2}
        maxZoom={1.5}
      >
        <Controls
          showInteractive={false}
          style={{ filter: theme === "dark" ? "invert(1)" : "none" }}
        />
        <MiniMap
          nodeColor={(node) =>
            relationshipColors[node.data.relationType] || "#3b82f6"
          }
          nodeStrokeWidth={3}
          pannable
        />
        <Background color={theme === "dark" ? "#2d3748" : "#e2e8f0"} gap={20} />
      </ReactFlow>
    </div>
  );
}

// DRIVER={ODBC Driver 17 for SQL Server};
// SERVER=DESKTOP-MOQH8H5\SQLEXPRESS;
// DATABASE=employee;
// UID=sa;
// PWD=admin@123;

// DRIVER={ODBC Driver 17 for SQL Server};
// SERVER=KHUSHI\SQLEXPRESS;
// DATABASE=RestoMinderDb;
// UID=sa;
// PWD=admin@123;
