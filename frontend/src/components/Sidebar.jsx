import { useState } from "react";
import { Database, Table, Code } from "lucide-react"; // icons
import ConnectionForm from "./ConnectionForm";

export default function Sidebar({ onConnect, schema }) {
  const [openPanel, setOpenPanel] = useState(null); // "connect", "tables", "code"
  const [code, setCode] = useState("");

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Left Icon Column */}
      <div
        style={{
          width: 50,
          backgroundColor: "#f8f8f8",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 10,
          borderRight: "1px solid #ddd",
        }}
      >
        <div
          className="sidebar-icon"
          onClick={() =>
            setOpenPanel(openPanel === "connect" ? null : "connect")
          }
          title="Database Connection"
          style={{ marginBottom: 15, cursor: "pointer" }}
        >
          <Database size={28} />
        </div>

        <div
          className="sidebar-icon"
          onClick={() => setOpenPanel(openPanel === "tables" ? null : "tables")}
          title="Tables Schema"
          style={{ marginBottom: 15, cursor: "pointer" }}
        >
          <Table size={28} />
        </div>

        <div
          className="sidebar-icon"
          onClick={() => setOpenPanel(openPanel === "code" ? null : "code")}
          title="Create Table / SQL Editor"
          style={{ marginBottom: 15, cursor: "pointer" }}
        >
          <Code size={28} />
        </div>
      </div>

      {/* Right Slide-in Panel */}
      {openPanel && (
        <div
          style={{
            width: 300,
            padding: "10px",
            overflowY: "auto",
            backgroundColor: "#fff",
            borderRight: "1px solid #ddd",
          }}
        >
          {openPanel === "connect" && <ConnectionForm onConnect={onConnect} />}

          {openPanel === "tables" && (
            <>
              {schema ? (
                <div className="tables-list">
                  {Object.entries(schema).map(([tableName, details]) => (
                    <div
                      key={tableName}
                      className="table-preview"
                      style={{
                        marginBottom: 15,
                        border: "1px solid #ccc",
                        borderRadius: 6,
                        padding: 8,
                      }}
                    >
                      <strong style={{ display: "block", marginBottom: 4 }}>
                        {tableName}
                      </strong>
                      {details.columns.map((colName) => (
                        <div
                          key={colName}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: 13,
                            padding: "2px 0",
                          }}
                        >
                          <span>{colName}</span>
                          <span style={{ color: "#3b82f6" }}>
                            {details.column_types[colName]}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: 13, color: "#666" }}>
                  No schema loaded. Connect to a database.
                </p>
              )}
            </>
          )}

          {openPanel === "code" && (
            <div>
              <h4 style={{ marginBottom: 8 }}>Create Table / SQL Editor</h4>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Write your CREATE TABLE statement here..."
                rows={15}
                style={{
                  width: "100%",
                  resize: "vertical",
                  padding: "8px",
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  fontFamily: "monospace",
                  fontSize: 13,
                }}
              />
              <button
                onClick={() => console.log("SQL Code:", code)}
                style={{
                  marginTop: 10,
                  width: "100%",
                  padding: 8,
                  backgroundColor: "#3b82f6",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                Execute / Preview
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
