import React from "react";
import "./TableList.css";

const TableList = ({ schema }) => {
  return (
    <div className="tables-list">
      {Object.entries(schema).map(([tableName, details]) => (
        <div key={tableName} className="table-preview">
          <strong className="table-preview-header">{tableName}</strong>
          {details.columns.map((colName) => (
            <div key={colName} className="column-item">
              <span className="column-name">{colName}</span>
              <span className="column-type">
                {details.column_types[colName]}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableList;
