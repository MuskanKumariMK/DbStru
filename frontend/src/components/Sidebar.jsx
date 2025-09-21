import { useState, useContext } from "react";
import { Database, Table, Code, Sun, Moon } from "lucide-react";
import ConnectionForm from "./ConnectionForm";
import TableList from "./TableList";
import { ThemeContext } from "../context/ThemeContext";

import CodeSection from "./CodeSection";

export default function Sidebar({ onConnect, schema, onExecuteSQL }) {
  const [openPanel, setOpenPanel] = useState(null); // "connect", "tables", "code"
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handlePanelToggle = (panel) => {
    setOpenPanel(openPanel === panel ? null : panel);
  };

  return (
    <div className="flex h-screen">
      {/* Left Icon Column */}
      <div className="flex flex-col items-center gap-4 bg-gray-100 p-3 dark:bg-gray-900">
        <div
          className={`cursor-pointer rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-700 ${
            openPanel === "connect"
              ? "bg-gray-200 dark:bg-gray-700"
              : "bg-transparent"
          }`}
          onClick={() => handlePanelToggle("connect")}
          title="Database Connection"
        >
          <Database size={24} className="text-gray-800 dark:text-gray-200" />
        </div>

        <div
          className={`cursor-pointer rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-700 ${
            openPanel === "tables"
              ? "bg-gray-200 dark:bg-gray-700"
              : "bg-transparent"
          }`}
          onClick={() => handlePanelToggle("tables")}
          title="Tables Schema"
        >
          <Table size={24} className="text-gray-800 dark:text-gray-200" />
        </div>

        <div
          className={`cursor-pointer rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-700 ${
            openPanel === "code"
              ? "bg-gray-200 dark:bg-gray-700"
              : "bg-transparent"
          }`}
          onClick={() => handlePanelToggle("code")}
          title="Create Table / SQL Editor"
        >
          <Code size={24} className="text-gray-800 dark:text-gray-200" />
        </div>

        {/* Theme Toggle */}
        <div
          className="mt-auto cursor-pointer rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={toggleTheme}
          title="Toggle Theme"
        >
          {theme === "light" ? (
            <Moon size={22} className="text-gray-800 dark:text-gray-200" />
          ) : (
            <Sun size={22} className="text-gray-800 dark:text-gray-200" />
          )}
        </div>
      </div>

      {/* Right Slide-in Panel */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          openPanel ? "w-80" : "w-0"
        } overflow-hidden bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700`}
      >
        {openPanel && (
          <div className="p-4 h-full overflow-y-auto">
            {openPanel === "connect" && (
              <ConnectionForm onConnect={onConnect} />
            )}

            {openPanel === "tables" && (
              <>
                {schema ? (
                  <TableList schema={schema} />
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    No schema loaded. Connect to a database.
                  </p>
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
