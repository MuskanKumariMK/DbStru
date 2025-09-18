import React, { useState, useCallback } from "react";
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
import axios from "axios";
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
      {data.columns.map((col, idx) => (
        <div key={col.name} className="column-row">
          <div className="column-info">
            <span className="column-name">{col.name}</span>
            <span className="column-type">{col.type}</span>
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

export default function ERD() {
  const [connString, setConnString] = useState("");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const fetchSchema = async () => {
    if (!connString.trim()) {
      setError("Please enter a valid connection string.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setConnectionStatus("connecting");

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/schema", {
        connection_string: connString,
      });
      const schema = res.data;
      console.log("Respose from backend:", schema);
      const newNodes = [];
      const newEdges = [];
      const tables = Object.entries(schema);
      const cols = Math.ceil(Math.sqrt(tables.length));
      const TABLE_WIDTH = 550;
      const TABLE_HEIGHT = 150; // approximate height per table; increase if many columns
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

        const randomOffset = () => Math.random() * 50 - 25;
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

          // Use full table name as returned by backend
          const targetTableName = Object.keys(schema).find(
            (table) => table.endsWith(fk.ref_table) // match full table name
          );

          newEdges.push({
            id: `edge-${tableName}-${targetTableName}-${fk.column}`,
            source: tableName, // current table, e.g., dbo.CustomerNotifications
            sourceHandle: `source-${tableName}-${fk.column}`,
            target: targetTableName, // must match node ID exactly, e.g., dbo.Customers
            targetHandle: `target-${targetTableName}-${fk.ref_column}`,
            label: `${fk.column} → ${fk.ref_column} (${relationType})`,
            type: "smoothstep",
            animated: relationType === "1:N",
            style: { stroke: relationshipColors[relationType], strokeWidth: 2 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: relationshipColors[relationType],
            },
          });
        });
      });

      setNodes(newNodes);
      setEdges(newEdges);
      setConnectionStatus("connected");
      console.log(
        "Nodes:",
        newNodes.map((n) => n.id)
      );
      console.log(
        "Edges:",
        newEdges.map((e) => `${e.source} -> ${e.target}`)
      );
    } catch (err) {
      console.error(err);
      setError("Failed to connect. Check your connection string or server.");
      setConnectionStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="erd-container">
      <div className="toolbar">
        <input
          type="text"
          value={connString}
          onChange={(e) => setConnString(e.target.value)}
          placeholder="Enter SQL Server connection string"
          style={{
            flex: 1,
            padding: "6px 12px",
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />
        <button onClick={fetchSchema} disabled={isLoading}>
          {isLoading ? "Connecting..." : "Connect & Load Schema"}
        </button>
      </div>

      <div className="connection-status">
        Status:{" "}
        <span className={`status-indicator ${connectionStatus}`}>
          {connectionStatus}
        </span>
      </div>

      {error && (
        <div className="error-panel">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

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
// DATABASE=RestoMinderDb;
// UID=sa;
// PWD=admin@123;
