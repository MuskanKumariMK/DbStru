import React, { useState } from "react";
import ERD from "./components/features/schema/ERD";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import Footer from "./components/layout/Footer";
import SchemaEditor from "./components/features/schema/SchemaEditor";
import ConnectionModal from "./components/common/ConnectionModal";
import { dbService } from "./services/dbService";

function App() {
  const [schema, setSchema] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState("erd");
  const [selectedTable, setSelectedTable] = useState(null);

  const handleConnect = async (connectionString) => {
    setIsLoading(true);
    setError(null);
    try {
      await dbService.testConnection(connectionString);
      const data = await dbService.getSchema(connectionString);

      setSchema(data);
      setIsConnected(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to connect to database");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTable = (table) => {
    setSelectedTable(table);
    setActiveView("editor");
  };

  const handleSaveSchema = (table, newColumns) => {
    console.log("Saving schema for", table, newColumns);
    setSchema(prev => ({
      ...prev,
      [table]: {
        ...prev[table],
        columns: newColumns.map(c => c.name),
        column_types: newColumns.reduce((acc, c) => ({ ...acc, [c.name]: c.type }), {}),
        nullable: newColumns.reduce((acc, c) => ({ ...acc, [c.name]: c.nullable }), {}),
        primary_keys: newColumns.filter(c => c.isPrimaryKey).map(c => c.name)
      }
    }));
    alert("Schema updated locally (Backend implementation pending)");
  };

  if (!isConnected) {
    return (
      <ConnectionModal
        onConnect={handleConnect}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white overflow-hidden font-sans">
      {/* Topbar */}
      <Topbar currentView={activeView} onViewChange={setActiveView} />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          tables={schema ? Object.keys(schema) : []}
          selectedTable={selectedTable}
          onSelectTable={handleSelectTable}
          onCreateTable={() => alert("Create Table feature pending")}
          onCreateDatabase={() => alert("Create Database feature pending")}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-hidden relative bg-slate-950">
          {activeView === 'erd' ? (
            <ERD schema={schema} />
          ) : activeView === 'editor' ? (
            <div className="h-full overflow-auto p-6">
              <SchemaEditor
                table={selectedTable}
                schema={schema}
                onSave={handleSaveSchema}
              />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-300 mb-2">Analytics Coming Soon</h2>
                <p className="text-slate-500">Database analytics and insights will be available here</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
