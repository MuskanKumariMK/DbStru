import React, { useCallback } from "react";
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
  <div className="table-node">
    <div className="table-header">
      <span className="table-name">{data.tableName}</span>
      {data.rowCount !== undefined && (
        <span className="row-count">{data.rowCount} rows</span>
      )}
    </div>
    <div className="table-content">
      {data.columns.map((col) => (
        <div key={col.name} className="column-row">
          <div className="column-info">
            <span className="column-name">{col.name}</span>
            <span className="column-type">{col.type}</span>
          </div>
          <div
            className="column-constraints"
            style={{ marginLeft: "auto", display: "flex", gap: "6px" }}
          >
            {col.isPrimary && (
              <span className="constraint pk" style={{ color: "#10b981" }}>
                PK
              </span>
            )}
            {col.isForeignKey && (
              <span className="constraint fk" style={{ color: "#3b82f6" }}>
                FK
              </span>
            )}
            {col.nullable && (
              <span
                className="constraint not-null"
                style={{ color: "#4483ef" }}
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
            />
          )}
          {col.isForeignKey && (
            <Handle
              type="target"
              position={Position.Left}
              id={`target-${data.tableName}-${col.name}`}
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
      const x = col * (TABLE_WIDTH + 50);
      const y = row * (tableHeight + 50);

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
    <div className="erd-container">
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
        <Controls showInteractive={false} />
        <MiniMap nodeColor="#3b82f6" nodeStrokeWidth={3} zoomable pannable />
        <Background color="#e2e8f0" gap={20} />
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
// DATABASE=RestomMinderDb;
// UID=sa;
// PWD=admin@123;
