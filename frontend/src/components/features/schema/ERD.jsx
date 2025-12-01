import React, { useEffect, useCallback } from "react";
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
import "./ERD.css";

// Table Node Component
const TableNode = ({ data }) => (
  <div className="table-node bg-white border-2 border-slate-200 rounded-lg shadow-sm min-w-[250px] overflow-hidden">
    <div className="table-header bg-slate-100 p-2 border-b border-slate-200 flex justify-between items-center">
      <span className="table-name font-bold text-slate-800">{data.tableName}</span>
      {data.rowCount !== undefined && (
        <span className="row-count text-xs text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">{data.rowCount} rows</span>
      )}
    </div>
    <div className="table-content p-2">
      {data.columns.map((col) => (
        <div key={col.name} className="column-row flex items-center justify-between py-1 relative group">
          <div className="column-info flex items-center gap-2 overflow-hidden">
            <span className="column-name text-sm font-medium text-slate-700 truncate" title={col.name}>{col.name}</span>
            <span className="column-type text-xs text-slate-400">{col.type}</span>
          </div>
          <div
            className="column-constraints flex gap-1 ml-2"
          >
            {col.isPrimary && (
              <span
                className="constraint pk text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1 rounded"
                title="Primary Key"
              >
                PK
              </span>
            )}
            {col.isForeignKey && (
              <span
                className="constraint fk text-[10px] font-bold text-blue-600 bg-blue-100 px-1 rounded"
                title="Foreign Key"
              >
                FK
              </span>
            )}
            {col.nullable && (
              <span
                className="constraint not-null text-[10px] font-bold text-slate-400 bg-slate-100 px-1 rounded"
                title="Nullable"
              >
                NULL
              </span>
            )}
          </div>
          {col.isPrimary && (
            <Handle
              type="source"
              position={Position.Right}
              id={`source-${data.tableName}-${col.name}`}
              className="!bg-emerald-500 !w-2 !h-2"
            />
          )}
          {col.isForeignKey && (
            <Handle
              type="target"
              position={Position.Left}
              id={`target-${data.tableName}-${col.name}`}
              className="!bg-blue-500 !w-2 !h-2"
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

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  useEffect(() => {
    if (!schema) return;

    const newNodes = [];
    const newEdges = [];
    const tables = Object.entries(schema);
    const cols = Math.ceil(Math.sqrt(tables.length));
    const TABLE_WIDTH = 350; // Adjusted width
    const TABLE_HEIGHT = 150;
    const COLUMN_HEIGHT = 30;

    tables.forEach(([tableName, details], index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;

      const tableHeight = details.columns.length * COLUMN_HEIGHT + 60;
      const x = col * (TABLE_WIDTH + 100);
      const y = row * (tableHeight + 100);

      const columnsWithMetadata = details.columns.map((colName) => ({
        name: colName,
        type: details.column_types[colName],
        isPrimary: details.primary_keys.includes(colName),
        isForeignKey:
          details.foreign_keys.some((fk) => fk.column === colName) ||
          details.primary_keys.includes(colName), // Logic from original code, might need review
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
        // Basic heuristic for relation type
        if (details.primary_keys.includes(fk.column)) relationType = "1:1";

        // Find target table name (handling potential schema prefix issues)
        const targetTableName = Object.keys(schema).find(
          (table) => table === fk.ref_table || table.endsWith(`.${fk.ref_table}`)
        );

        if (targetTableName) {
          newEdges.push({
            id: `edge-${tableName}-${targetTableName}-${fk.column}`,
            source: tableName,
            sourceHandle: `source-${tableName}-${fk.column}`,
            target: targetTableName,
            targetHandle: `target-${targetTableName}-${fk.ref_column}`,
            label: `${fk.column} → ${fk.ref_column}`,
            type: "smoothstep",
            animated: true,
            style: { stroke: relationshipColors[relationType], strokeWidth: 2 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: relationshipColors[relationType],
            },
          });
        }
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [schema, setNodes, setEdges]);

  return (
    <div className="w-full h-full bg-slate-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={2}
        attributionPosition="bottom-right"
      >
        <Controls showInteractive={false} className="!bg-white !border-slate-200 !shadow-lg !rounded-lg" />
        <MiniMap
          nodeColor="#3b82f6"
          nodeStrokeWidth={3}
          zoomable
          pannable
          className="!bg-white !border-slate-200 !shadow-lg !rounded-lg"
        />
        <Background color="#cbd5e1" gap={20} size={1} />
      </ReactFlow>
    </div>
  );
}
