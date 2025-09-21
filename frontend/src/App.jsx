import { useState } from "react";
import ERD from "./pages/ERD";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import Button from "./components/ui/Button";

export default function App() {
  const [schema, setSchema] = useState(null);
  const [status, setStatus] = useState("disconnected");
  const [error, setError] = useState(null);

  const handleConnect = async (connString) => {
    setStatus("connecting");
    setError(null);
    console.log("ConnectionString Sending:", connString);

    try {
      console.log("Sending request to backend...");
      const res = await axios.post("http://127.0.0.1:8000/api/schema", {
        connection_string: connString,
      });
      console.log("Backend response:", res.data);
      setSchema(res.data);
      setStatus("connected");
    } catch (err) {
      console.error("Axios error:", err.response || err.message);
      setError("❌ Failed to connect. Check your connection string.");
      setStatus("error");
    }
  };

  const handleExecuteSQL = async (sql) => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/execute", {
        sql,
      });
      setSchema(res.data); // updated schema returned from backend
    } catch (err) {
      console.error("SQL Execution failed:", err);
      setError("❌ Failed to execute SQL");
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <Sidebar
        onConnect={handleConnect}
        schema={schema}
        onExecuteSQL={handleExecuteSQL}
      />

      {/* Main Area */}
      <main className="flex-1 p-4 overflow-auto">
        {/* Status Bar */}
        <div className="mb-4 text-sm">
          Status:{" "}
          <span
            className={`font-medium ${
              status === "connected"
                ? "text-green-500"
                : status === "connecting"
                ? "text-yellow-500"
                : status === "error"
                ? "text-red-500"
                : "text-gray-500"
            }`}
          >
            {status}
          </span>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-md bg-red-100 px-3 py-2 text-red-700 dark:bg-red-800 dark:text-red-300">
            {error}
          </div>
        )}

        {/* ERD / Placeholder */}
        {schema ? (
          <ERD schema={schema} />
        ) : (
          <p className="text-gray-600 dark:text-gray-400">
            No schema loaded. Connect to a database.
          </p>
        )}
      </main>
    </div>
  );
}
