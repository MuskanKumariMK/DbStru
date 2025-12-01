import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Code, BookOpen, Database, Layers, GitBranch, FileCode, Zap } from 'lucide-react';

const DeveloperDocs = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Header */}
            <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Code className="w-8 h-8 text-blue-500" />
                        <h1 className="text-2xl font-bold">Developer Documentation</h1>
                    </div>
                    <div className="flex gap-4">
                        <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition">
                            <Home className="w-4 h-4" />
                            <span>Back to App</span>
                        </Link>
                        <Link to="/docs" className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg transition">
                            <BookOpen className="w-4 h-4" />
                            <span>User Docs</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="prose prose-invert max-w-none">
                    {/* Introduction */}
                    <section className="mb-16">
                        <h2 className="text-4xl font-bold mb-6 text-blue-400">Developer Documentation</h2>
                        <p className="text-lg text-slate-300 mb-6">
                            Welcome to the Database Intelligence Engine developer documentation. This guide will help you understand the architecture, code flow, and how to extend the application.
                        </p>
                    </section>

                    {/* Architecture Overview */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                            <Layers className="w-8 h-8 text-blue-500" />
                            Architecture Overview
                        </h2>

                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-6">
                            <h3 className="text-xl font-semibold mb-4 text-blue-400">Technology Stack</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold text-green-400 mb-2">Frontend</h4>
                                    <ul className="list-disc list-inside text-slate-300 space-y-1">
                                        <li>React 18</li>
                                        <li>React Router DOM (routing)</li>
                                        <li>Axios (HTTP client)</li>
                                        <li>Tailwind CSS (styling)</li>
                                        <li>Lucide React (icons)</li>
                                        <li>React Flow (ERD diagrams)</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-green-400 mb-2">Backend</h4>
                                    <ul className="list-disc list-inside text-slate-300 space-y-1">
                                        <li>FastAPI (Python web framework)</li>
                                        <li>Pydantic (data validation)</li>
                                        <li>Database adapters (MySQL, PostgreSQL, MongoDB, SQL Server)</li>
                                        <li>Uvicorn (ASGI server)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-6">
                            <h3 className="text-xl font-semibold mb-4 text-blue-400">System Architecture</h3>
                            <pre className="bg-slate-950 p-4 rounded text-sm overflow-x-auto">
                                {`┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                     │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Pages      │  │  Components  │  │   Services   │      │
│  │              │  │              │  │              │      │
│  │ - MainApp    │  │ - Modals     │  │ - dbService  │      │
│  │ - UserDocs   │  │ - Sidebar    │  │ - api        │      │
│  │ - DevDocs    │  │ - Topbar     │  │              │      │
│  │              │  │ - ERD        │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                     Backend (FastAPI)                       │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ API Endpoints│  │   Schemas    │  │  DB Manager  │      │
│  │              │  │              │  │              │      │
│  │ - /schema    │  │ - Pydantic   │  │ - Adapter    │      │
│  │ - /create-db │  │   Models     │  │   Factory    │      │
│  │ - /create-   │  │              │  │              │      │
│  │   table      │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Database Adapters                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │  MySQL  │  │PostgreSQL│  │ MongoDB │  │SQL Server│       │
│  │ Adapter │  │ Adapter  │  │ Adapter │  │ Adapter  │       │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Database Servers                         │
└─────────────────────────────────────────────────────────────┘`}
                            </pre>
                        </div>
                    </section>

                    {/* Frontend Architecture */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                            <FileCode className="w-8 h-8 text-blue-500" />
                            Frontend Architecture
                        </h2>

                        <h3 className="text-2xl font-semibold mb-4 text-blue-400">Directory Structure</h3>
                        <pre className="bg-slate-900 p-4 rounded text-sm mb-6 overflow-x-auto">
                            {`frontend/
├── src/
│   ├── components/
│   │   ├── common/           # Reusable components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── ConnectionModal.jsx
│   │   │   ├── CreateDatabaseModal.jsx
│   │   │   ├── CreateTableModal.jsx
│   │   │   ├── ConfirmModal.jsx
│   │   │   └── NotificationProvider.jsx
│   │   ├── features/         # Feature-specific components
│   │   │   └── schema/
│   │   │       ├── ERD.jsx
│   │   │       └── SchemaEditor.jsx
│   │   └── layout/           # Layout components
│   │       ├── Topbar.jsx
│   │       ├── Sidebar.jsx
│   │       └── Footer.jsx
│   ├── pages/                # Page components
│   │   ├── MainApp.jsx
│   │   ├── UserDocs.jsx
│   │   └── DeveloperDocs.jsx
│   ├── services/             # API services
│   │   ├── api.js
│   │   └── dbService.js
│   ├── App.jsx               # Root component with routing
│   └── main.jsx              # Entry point`}
                        </pre>

                        <h3 className="text-2xl font-semibold mb-4 text-blue-400">Component Hierarchy</h3>
                        <pre className="bg-slate-900 p-4 rounded text-sm mb-6 overflow-x-auto">
                            {`App (Router)
├── NotificationProvider
│   └── MainApp
│       ├── ConnectionModal (if not connected)
│       └── (if connected)
│           ├── Topbar
│           ├── Sidebar
│           ├── Main Content
│           │   ├── ERD (view: erd)
│           │   ├── SchemaEditor (view: editor)
│           │   └── Analytics (view: analytics)
│           ├── Footer
│           └── Modals
│               ├── CreateDatabaseModal
│               ├── CreateTableModal
│               └── ConfirmModal
├── UserDocs
└── DeveloperDocs`}
                        </pre>

                        <h3 className="text-2xl font-semibold mb-4 text-blue-400">State Management</h3>
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-6">
                            <p className="text-slate-300 mb-4">
                                The application uses React's built-in state management with hooks:
                            </p>
                            <ul className="list-disc list-inside text-slate-300 space-y-2">
                                <li><strong className="text-blue-400">useState:</strong> Local component state</li>
                                <li><strong className="text-blue-400">useContext:</strong> Notification system (NotificationProvider)</li>
                                <li><strong className="text-blue-400">useEffect:</strong> Side effects and data fetching</li>
                            </ul>
                        </div>

                        <h3 className="text-2xl font-semibold mb-4 text-blue-400">Key State in MainApp</h3>
                        <pre className="bg-slate-900 p-4 rounded text-sm mb-6 overflow-x-auto">
                            {`const [schema, setSchema] = useState(null);           // Database schema
const [isConnected, setIsConnected] = useState(false); // Connection status
const [connectionString, setConnectionString] = useState(""); // DB connection
const [activeView, setActiveView] = useState("erd");   // Current view
const [selectedTable, setSelectedTable] = useState(null); // Selected table
const [showCreateDbModal, setShowCreateDbModal] = useState(false);
const [showCreateTableModal, setShowCreateTableModal] = useState(false);
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);`}
                        </pre>
                    </section>

                    {/* Backend Architecture */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                            <Database className="w-8 h-8 text-blue-500" />
                            Backend Architecture
                        </h2>

                        <h3 className="text-2xl font-semibold mb-4 text-blue-400">Directory Structure</h3>
                        <pre className="bg-slate-900 p-4 rounded text-sm mb-6 overflow-x-auto">
                            {`backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── api.py          # API router
│   │       └── endpoints/
│   │           └── db.py       # Database endpoints
│   ├── schemas/
│   │   ├── connection.py       # Connection schemas
│   │   └── table_operations.py # Table operation schemas
│   ├── services/
│   │   ├── db_manager.py       # Database manager
│   │   └── adapters/
│   │       ├── base.py         # Base adapter
│   │       ├── mysql.py        # MySQL adapter
│   │       ├── postgres.py     # PostgreSQL adapter
│   │       ├── mongodb.py      # MongoDB adapter
│   │       └── sqlserver.py    # SQL Server adapter
│   └── main.py                 # FastAPI app`}
                        </pre>

                        <h3 className="text-2xl font-semibold mb-4 text-blue-400">Adapter Pattern</h3>
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-6">
                            <p className="text-slate-300 mb-4">
                                The application uses the Adapter Pattern to support multiple database types:
                            </p>
                            <pre className="bg-slate-950 p-4 rounded text-sm overflow-x-auto">
                                {`class BaseAdapter(ABC):
    @abstractmethod
    def connect(self, connection_string: str):
        pass
    
    @abstractmethod
    def fetch_schema(self, conn) -> dict:
        pass
    
    @abstractmethod
    def create_database(self, conn, db_name: str) -> bool:
        pass
    
    @abstractmethod
    def create_table(self, conn, table_name: str, columns: List[Dict]) -> bool:
        pass
    
    @abstractmethod
    def alter_table(self, conn, table_name: str, operations: List[Dict]) -> bool:
        pass
    
    @abstractmethod
    def drop_table(self, conn, table_name: str) -> bool:
        pass
    
    @abstractmethod
    def get_table_data(self, conn, table_name: str, limit: int, offset: int) -> Dict:
        pass`}
                            </pre>
                        </div>
                    </section>

                    {/* Code Flow */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                            <GitBranch className="w-8 h-8 text-blue-500" />
                            Code Flow Diagrams
                        </h2>

                        <h3 className="text-2xl font-semibold mb-4 text-blue-400">Database Connection Flow</h3>
                        <pre className="bg-slate-900 p-4 rounded text-sm mb-6 overflow-x-auto">
                            {`User enters connection string
        ↓
ConnectionModal → handleConnect()
        ↓
dbService.testConnection(connectionString)
        ↓
POST /api/test-connection
        ↓
DBManager.connect(connection_string)
        ↓
DBManager.get_db_type() → Detect database type
        ↓
DBManager.get_adapter(db_type) → Get appropriate adapter
        ↓
adapter.connect(connection_string) → Establish connection
        ↓
Return success/failure
        ↓
If success: dbService.getSchema(connectionString)
        ↓
POST /api/schema
        ↓
DBManager.fetch_schema(connection_string)
        ↓
adapter.fetch_schema(conn) → Query database metadata
        ↓
Return schema object
        ↓
Update state: setSchema(data), setIsConnected(true)
        ↓
Show notification: "Successfully connected"`}
                        </pre>

                        <h3 className="text-2xl font-semibold mb-4 text-blue-400">Table Creation Flow</h3>
                        <pre className="bg-slate-900 p-4 rounded text-sm mb-6 overflow-x-auto">
                            {`User clicks "+" button
        ↓
setShowCreateTableModal(true)
        ↓
CreateTableModal opens
        ↓
User defines table name and columns
        ↓
User clicks "Create Table"
        ↓
Validation (table name, column names)
        ↓
handleCreateTable(tableName, columns)
        ↓
dbService.createTable(connectionString, tableName, columns)
        ↓
POST /api/create-table
        ↓
Validate request with Pydantic (CreateTableRequest)
        ↓
DBManager.connect(connection_string)
        ↓
adapter.create_table(conn, table_name, columns)
        ↓
Build CREATE TABLE SQL statement
        ↓
Execute SQL
        ↓
Commit transaction
        ↓
Return success
        ↓
Show notification: "Table created successfully"
        ↓
refreshSchema() → Update UI with new table
        ↓
Close modal`}
                        </pre>

                        <h3 className="text-2xl font-semibold mb-4 text-blue-400">Table Update Flow</h3>
                        <pre className="bg-slate-900 p-4 rounded text-sm mb-6 overflow-x-auto">
                            {`User modifies columns in SchemaEditor
        ↓
User clicks "Save Changes"
        ↓
handleSaveSchema(table, newColumns)
        ↓
Compare old vs new columns
        ↓
Generate operations array:
  - type: 'add' for new columns
  - type: 'modify' for changed columns
  - type: 'drop' for removed columns
        ↓
dbService.updateTable(connectionString, table, operations)
        ↓
POST /api/update-table
        ↓
Validate request (UpdateTableRequest)
        ↓
adapter.alter_table(conn, table_name, operations)
        ↓
For each operation:
  - ALTER TABLE ... ADD COLUMN
  - ALTER TABLE ... MODIFY COLUMN
  - ALTER TABLE ... DROP COLUMN
        ↓
Commit transaction
        ↓
Return success
        ↓
Show notification: "Table updated successfully"
        ↓
refreshSchema() → Update UI`}
                        </pre>
                    </section>

                    {/* API Reference */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                            <Zap className="w-8 h-8 text-blue-500" />
                            API Reference
                        </h2>

                        <div className="space-y-6">
                            {/* Test Connection */}
                            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                                <h3 className="text-xl font-semibold mb-3 text-green-400">POST /api/test-connection</h3>
                                <p className="text-slate-300 mb-4">Test database connection</p>
                                <div className="space-y-3">
                                    <div>
                                        <p className="font-semibold text-blue-400 mb-2">Request Body:</p>
                                        <pre className="bg-slate-950 p-3 rounded text-sm overflow-x-auto">
                                            {`{
  "connection_string": "mysql://user:pass@localhost:3306/mydb"
}`}
                                        </pre>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-blue-400 mb-2">Response:</p>
                                        <pre className="bg-slate-950 p-3 rounded text-sm overflow-x-auto">
                                            {`{
  "status": "success",
  "message": "Connected successfully to mysql"
}`}
                                        </pre>
                                    </div>
                                </div>
                            </div>

                            {/* Get Schema */}
                            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                                <h3 className="text-xl font-semibold mb-3 text-green-400">POST /api/schema</h3>
                                <p className="text-slate-300 mb-4">Fetch database schema</p>
                                <div className="space-y-3">
                                    <div>
                                        <p className="font-semibold text-blue-400 mb-2">Request Body:</p>
                                        <pre className="bg-slate-950 p-3 rounded text-sm overflow-x-auto">
                                            {`{
  "connection_string": "mysql://user:pass@localhost:3306/mydb"
}`}
                                        </pre>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-blue-400 mb-2">Response:</p>
                                        <pre className="bg-slate-950 p-3 rounded text-sm overflow-x-auto">
                                            {`{
  "users": {
    "columns": ["id", "username", "email"],
    "column_types": {
      "id": "INT",
      "username": "VARCHAR(255)",
      "email": "VARCHAR(255)"
    },
    "nullable": {
      "id": false,
      "username": false,
      "email": true
    },
    "primary_keys": ["id"],
    "foreign_keys": [],
    "row_count": 42
  }
}`}
                                        </pre>
                                    </div>
                                </div>
                            </div>

                            {/* Create Database */}
                            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                                <h3 className="text-xl font-semibold mb-3 text-green-400">POST /api/create-database</h3>
                                <p className="text-slate-300 mb-4">Create a new database</p>
                                <div className="space-y-3">
                                    <div>
                                        <p className="font-semibold text-blue-400 mb-2">Request Body:</p>
                                        <pre className="bg-slate-950 p-3 rounded text-sm overflow-x-auto">
                                            {`{
  "connection_string": "mysql://user:pass@localhost:3306/",
  "database_name": "new_database"
}`}
                                        </pre>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-blue-400 mb-2">Response:</p>
                                        <pre className="bg-slate-950 p-3 rounded text-sm overflow-x-auto">
                                            {`{
  "status": "success",
  "message": "Database 'new_database' created successfully"
}`}
                                        </pre>
                                    </div>
                                </div>
                            </div>

                            {/* Create Table */}
                            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                                <h3 className="text-xl font-semibold mb-3 text-green-400">POST /api/create-table</h3>
                                <p className="text-slate-300 mb-4">Create a new table</p>
                                <div className="space-y-3">
                                    <div>
                                        <p className="font-semibold text-blue-400 mb-2">Request Body:</p>
                                        <pre className="bg-slate-950 p-3 rounded text-sm overflow-x-auto">
                                            {`{
  "connection_string": "mysql://user:pass@localhost:3306/mydb",
  "table_name": "products",
  "columns": [
    {
      "name": "id",
      "type": "INT",
      "nullable": false,
      "isPrimaryKey": true,
      "autoIncrement": true
    },
    {
      "name": "name",
      "type": "VARCHAR(255)",
      "nullable": false,
      "isPrimaryKey": false,
      "autoIncrement": false
    },
    {
      "name": "price",
      "type": "DECIMAL(10,2)",
      "nullable": false,
      "isPrimaryKey": false,
      "autoIncrement": false
    }
  ]
}`}
                                        </pre>
                                    </div>
                                </div>
                            </div>

                            {/* Update Table */}
                            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                                <h3 className="text-xl font-semibold mb-3 text-green-400">POST /api/update-table</h3>
                                <p className="text-slate-300 mb-4">Modify table structure</p>
                                <div className="space-y-3">
                                    <div>
                                        <p className="font-semibold text-blue-400 mb-2">Request Body:</p>
                                        <pre className="bg-slate-950 p-3 rounded text-sm overflow-x-auto">
                                            {`{
  "connection_string": "mysql://user:pass@localhost:3306/mydb",
  "table_name": "products",
  "operations": [
    {
      "type": "add",
      "column": {
        "name": "description",
        "type": "TEXT",
        "nullable": true
      }
    },
    {
      "type": "modify",
      "column": {
        "name": "price",
        "type": "DECIMAL(12,2)",
        "nullable": false
      }
    },
    {
      "type": "drop",
      "columnName": "old_column"
    }
  ]
}`}
                                        </pre>
                                    </div>
                                </div>
                            </div>

                            {/* Delete Table */}
                            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                                <h3 className="text-xl font-semibold mb-3 text-red-400">DELETE /api/delete-table</h3>
                                <p className="text-slate-300 mb-4">Delete a table</p>
                                <div className="space-y-3">
                                    <div>
                                        <p className="font-semibold text-blue-400 mb-2">Request Body:</p>
                                        <pre className="bg-slate-950 p-3 rounded text-sm overflow-x-auto">
                                            {`{
  "connection_string": "mysql://user:pass@localhost:3306/mydb",
  "table_name": "old_table"
}`}
                                        </pre>
                                    </div>
                                </div>
                            </div>

                            {/* Get Table Data */}
                            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                                <h3 className="text-xl font-semibold mb-3 text-green-400">GET /api/table-data/{'{table_name}'}</h3>
                                <p className="text-slate-300 mb-4">Fetch paginated table data</p>
                                <div className="space-y-3">
                                    <div>
                                        <p className="font-semibold text-blue-400 mb-2">Query Parameters:</p>
                                        <pre className="bg-slate-950 p-3 rounded text-sm overflow-x-auto">
                                            {`connection_string: string (required)
limit: integer (default: 100, max: 1000)
offset: integer (default: 0)`}
                                        </pre>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-blue-400 mb-2">Response:</p>
                                        <pre className="bg-slate-950 p-3 rounded text-sm overflow-x-auto">
                                            {`{
  "data": [
    {"id": 1, "username": "john", "email": "john@example.com"},
    {"id": 2, "username": "jane", "email": "jane@example.com"}
  ],
  "columns": [
    {"name": "id", "type": "INT"},
    {"name": "username", "type": "VARCHAR(255)"},
    {"name": "email", "type": "VARCHAR(255)"}
  ],
  "total": 42,
  "limit": 100,
  "offset": 0,
  "hasMore": false
}`}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Extension Guide */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold mb-6 text-blue-400">Extension Guide</h2>

                        <h3 className="text-2xl font-semibold mb-4 text-blue-400">Adding a New Database Adapter</h3>
                        <p className="text-slate-300 mb-4">
                            To add support for a new database type, follow these steps:
                        </p>

                        <ol className="list-decimal list-inside text-slate-300 mb-6 space-y-4">
                            <li className="mb-2">
                                <strong className="text-blue-400">Create a new adapter file</strong>
                                <pre className="bg-slate-900 p-3 rounded text-sm mt-2 overflow-x-auto">
                                    {`# backend/app/services/adapters/newdb.py

from .base import BaseAdapter
from typing import List, Dict, Any

class NewDBAdapter(BaseAdapter):
    def connect(self, connection_string: str):
        # Implement connection logic
        pass
    
    def fetch_schema(self, conn) -> dict:
        # Implement schema fetching
        pass
    
    def create_database(self, conn, db_name: str) -> bool:
        # Implement database creation
        pass
    
    def create_table(self, conn, table_name: str, columns: List[Dict[str, Any]]) -> bool:
        # Implement table creation
        pass
    
    def alter_table(self, conn, table_name: str, operations: List[Dict[str, Any]]) -> bool:
        # Implement table alteration
        pass
    
    def drop_table(self, conn, table_name: str) -> bool:
        # Implement table deletion
        pass
    
    def get_table_data(self, conn, table_name: str, limit: int = 100, offset: int = 0) -> Dict[str, Any]:
        # Implement data fetching
        pass`}
                                </pre>
                            </li>

                            <li className="mb-2">
                                <strong className="text-blue-400">Register the adapter in DBManager</strong>
                                <pre className="bg-slate-900 p-3 rounded text-sm mt-2 overflow-x-auto">
                                    {`# backend/app/services/db_manager.py

from .adapters.newdb import NewDBAdapter

class DBManager:
    @staticmethod
    def get_db_type(connection_string: str) -> str:
        cs = connection_string.lower()
        # Add detection logic
        if "newdb" in cs:
            return "newdb"
        # ... existing code
    
    @staticmethod
    def get_adapter(db_type: str):
        if db_type == "newdb":
            return NewDBAdapter()
        # ... existing code`}
                                </pre>
                            </li>

                            <li>
                                <strong className="text-blue-400">Test the adapter</strong> with your database
                            </li>
                        </ol>

                        <h3 className="text-2xl font-semibold mb-4 text-blue-400">Adding a New Feature</h3>
                        <ol className="list-decimal list-inside text-slate-300 mb-6 space-y-2">
                            <li>Create backend API endpoint in <code className="bg-slate-800 px-2 py-1 rounded">backend/app/api/v1/endpoints/db.py</code></li>
                            <li>Add Pydantic schema if needed in <code className="bg-slate-800 px-2 py-1 rounded">backend/app/schemas/</code></li>
                            <li>Implement adapter methods in all database adapters</li>
                            <li>Add service method in <code className="bg-slate-800 px-2 py-1 rounded">frontend/src/services/dbService.js</code></li>
                            <li>Create UI component in <code className="bg-slate-800 px-2 py-1 rounded">frontend/src/components/</code></li>
                            <li>Integrate into MainApp or appropriate page</li>
                            <li>Add notifications for success/error feedback</li>
                            <li>Test thoroughly</li>
                        </ol>
                    </section>

                    {/* Prerequisites */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold mb-6 text-blue-400">Development Setup</h2>

                        <h3 className="text-2xl font-semibold mb-4 text-blue-400">Prerequisites</h3>
                        <ul className="list-disc list-inside text-slate-300 mb-6 space-y-2">
                            <li>Node.js 16+ and npm</li>
                            <li>Python 3.8+</li>
                            <li>Database server (MySQL, PostgreSQL, MongoDB, or SQL Server)</li>
                            <li>Git</li>
                        </ul>

                        <h3 className="text-2xl font-semibold mb-4 text-blue-400">Installation</h3>
                        <div className="space-y-4 mb-6">
                            <div>
                                <p className="font-semibold text-blue-400 mb-2">1. Clone the repository</p>
                                <pre className="bg-slate-900 p-3 rounded text-sm">
                                    {`git clone <repository-url>
cd DbStru`}
                                </pre>
                            </div>

                            <div>
                                <p className="font-semibold text-blue-400 mb-2">2. Setup Backend</p>
                                <pre className="bg-slate-900 p-3 rounded text-sm">
                                    {`cd backend
python -m venv venv
venv\\Scripts\\activate  # Windows
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt`}
                                </pre>
                            </div>

                            <div>
                                <p className="font-semibold text-blue-400 mb-2">3. Setup Frontend</p>
                                <pre className="bg-slate-900 p-3 rounded text-sm">
                                    {`cd frontend
npm install`}
                                </pre>
                            </div>
                        </div>

                        <h3 className="text-2xl font-semibold mb-4 text-blue-400">Running Locally</h3>
                        <div className="space-y-4 mb-6">
                            <div>
                                <p className="font-semibold text-blue-400 mb-2">Start Backend (Terminal 1)</p>
                                <pre className="bg-slate-900 p-3 rounded text-sm">
                                    {`cd backend
uvicorn app.main:app --reload`}
                                </pre>
                                <p className="text-slate-400 text-sm mt-2">Backend runs on http://localhost:8000</p>
                            </div>

                            <div>
                                <p className="font-semibold text-blue-400 mb-2">Start Frontend (Terminal 2)</p>
                                <pre className="bg-slate-900 p-3 rounded text-sm">
                                    {`cd frontend
npm run dev`}
                                </pre>
                                <p className="text-slate-400 text-sm mt-2">Frontend runs on http://localhost:5173</p>
                            </div>
                        </div>

                        <h3 className="text-2xl font-semibold mb-4 text-blue-400">Building for Production</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="font-semibold text-blue-400 mb-2">Build Frontend</p>
                                <pre className="bg-slate-900 p-3 rounded text-sm">
                                    {`cd frontend
npm run build`}
                                </pre>
                            </div>

                            <div>
                                <p className="font-semibold text-blue-400 mb-2">Run Production Backend</p>
                                <pre className="bg-slate-900 p-3 rounded text-sm">
                                    {`cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000`}
                                </pre>
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <section className="border-t border-slate-800 pt-8">
                        <p className="text-slate-400 text-center">
                            Questions? Check the{' '}
                            <Link to="/docs" className="text-blue-400 hover:text-blue-300 underline">
                                User Documentation
                            </Link>
                            {' '}or return to the{' '}
                            <Link to="/" className="text-blue-400 hover:text-blue-300 underline">
                                Application
                            </Link>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default DeveloperDocs;
