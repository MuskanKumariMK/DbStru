import { useState, useContext } from "react";
import { Database, Table, Code, Sun, Moon, Cog, History } from "lucide-react";
import ConnectionForm from "./ConnectionForm";
import TableList from "./TableList";
import { ThemeContext } from "../context/ThemeContext";
import "./Sidebar.css";
import Button from "./ui/Button";
import Textarea from "./ui/Textarea";
import CodeSection from "./CodeSection";

export default function Sidebar({ onConnect, schema, onExecuteSQL }) {
  const [openPanel, setOpenPanel] = useState(null); // "connect", "tables", "code"
  const [code, setCode] = useState("");
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handlePanelToggle = (panel) => {
    setOpenPanel(openPanel === panel ? null : panel);
  };

  return (
    <div className="sidebar-container">
      {/* Left Icon Column */}
      <div className="sidebar-icons">
        <div
          className={`sidebar-icon ${openPanel === "connect" ? "active" : ""}`}
          onClick={() => handlePanelToggle("connect")}
          title="Database Connection"
        >
          <Database size={28} />
        </div>

        <div
          className={`sidebar-icon ${openPanel === "tables" ? "active" : ""}`}
          onClick={() => handlePanelToggle("tables")}
          title="Tables Schema"
        >
          <Table size={28} />
        </div>

        <div
          className={`sidebar-icon ${openPanel === "code" ? "active" : ""}`}
          onClick={() => handlePanelToggle("code")}
          title="Create Table / SQL Editor"
        >
          <Code size={28} />
        </div>

        <div className="theme-toggle">
          <div
            className="sidebar-icon"
            onClick={toggleTheme}
            title="Toggle Theme"
          >
            {theme === "light" ? <Moon size={24} /> : <Sun size={24} />}
          </div>
        </div>
      </div>

      {/* Right Slide-in Panel */}
      <div className={`sidebar-panel ${openPanel ? "" : "closed"}`}>
        {openPanel && (
          <div className="panel-content">
            {openPanel === "connect" && (
              <ConnectionForm onConnect={onConnect} />
            )}

            {openPanel === "tables" && (
              <>
                {schema ? (
                  <TableList schema={schema} />
                ) : (
                  <p>No schema loaded. Connect to a database.</p>
                )}
              </>
            )}

            {openPanel === "code" && (
              <CodeSection onExecute={(sql) => onExecuteSQL(sql)} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
