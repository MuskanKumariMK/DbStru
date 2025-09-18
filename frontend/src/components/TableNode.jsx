import { Handle, Position } from "react-flow-renderer";

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
          </div>
          {col.isPrimary && (
            <Handle
              type="source"
              position={Position.Right}
              id={`source-${col.name}`}
              style={{ top: 12 + idx * 30, background: "#10b981" }}
            />
          )}
          {col.isForeignKey && (
            <Handle
              type="target"
              position={Position.Left}
              id={`target-${col.name}`}
              style={{ top: 12 + idx * 30, background: "#3b82f6" }}
            />
          )}
        </div>
      ))}
    </div>
  </div>
);
