import React, { useState } from "react";
import ERD from "../components/features/schema/ERD";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import Footer from "../components/layout/Footer";
import SchemaEditor from "../components/features/schema/SchemaEditor";
import ConnectionModal from "../components/common/ConnectionModal";
import CreateDatabaseModal from "../components/common/CreateDatabaseModal";
import CreateTableModal from "../components/common/CreateTableModal";
import ConfirmModal from "../components/common/ConfirmModal";
import { useNotification } from "../components/common/NotificationProvider";
import { dbService } from "../services/dbService";

function MainApp() {
    const [schema, setSchema] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionString, setConnectionString] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeView, setActiveView] = useState("erd");
    const [selectedTable, setSelectedTable] = useState(null);

    // Modal states
    const [showCreateDbModal, setShowCreateDbModal] = useState(false);
    const [showCreateTableModal, setShowCreateTableModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [tableToDelete, setTableToDelete] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    const notify = useNotification();

    const handleConnect = async (connectionString) => {
        setIsLoading(true);
        setError(null);
        try {
            await dbService.testConnection(connectionString);
            const data = await dbService.getSchema(connectionString);

            setSchema(data);
            setConnectionString(connectionString);
            setIsConnected(true);
            notify.success("Successfully connected to database");
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.detail || "Failed to connect to database";
            setError(errorMsg);
            notify.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const refreshSchema = async () => {
        if (!connectionString) return;
        try {
            const data = await dbService.getSchema(connectionString);
            setSchema(data);
        } catch (err) {
            console.error("Error refreshing schema:", err);
            notify.error("Failed to refresh schema");
        }
    };

    const handleCreateDatabase = async (databaseName) => {
        setModalLoading(true);
        try {
            await dbService.createDatabase(connectionString, databaseName);
            notify.success(`Database "${databaseName}" created successfully`);
            setShowCreateDbModal(false);
        } catch (err) {
            console.error(err);
            notify.error(err.response?.data?.detail || "Failed to create database");
        } finally {
            setModalLoading(false);
        }
    };

    const handleCreateTable = async (tableName, columns) => {
        setModalLoading(true);
        try {
            await dbService.createTable(connectionString, tableName, columns);
            notify.success(`Table "${tableName}" created successfully`);
            setShowCreateTableModal(false);
            await refreshSchema();
        } catch (err) {
            console.error(err);
            notify.error(err.response?.data?.detail || "Failed to create table");
        } finally {
            setModalLoading(false);
        }
    };

    const handleSelectTable = (table) => {
        setSelectedTable(table);
        setActiveView("editor");
    };

    const handleSaveSchema = async (table, newColumns) => {
        try {
            const oldColumns = schema[table].columns;
            const operations = [];

            newColumns.forEach(newCol => {
                if (!oldColumns.includes(newCol.name)) {
                    operations.push({
                        type: 'add',
                        column: newCol
                    });
                } else {
                    const oldType = schema[table].column_types[newCol.name];
                    const oldNullable = schema[table].nullable[newCol.name];
                    if (oldType !== newCol.type || oldNullable !== newCol.nullable) {
                        operations.push({
                            type: 'modify',
                            column: newCol
                        });
                    }
                }
            });

            oldColumns.forEach(oldColName => {
                if (!newColumns.find(nc => nc.name === oldColName)) {
                    operations.push({
                        type: 'drop',
                        columnName: oldColName
                    });
                }
            });

            if (operations.length === 0) {
                notify.info("No changes detected");
                return;
            }

            await dbService.updateTable(connectionString, table, operations);
            notify.success(`Table "${table}" updated successfully`);
            await refreshSchema();
        } catch (err) {
            console.error(err);
            notify.error(err.response?.data?.detail || "Failed to update table");
        }
    };

    const handleDeleteTable = async () => {
        if (!tableToDelete) return;

        setModalLoading(true);
        try {
            await dbService.deleteTable(connectionString, tableToDelete);
            notify.success(`Table "${tableToDelete}" deleted successfully`);
            setShowDeleteConfirm(false);
            setTableToDelete(null);
            setSelectedTable(null);
            setActiveView("erd");
            await refreshSchema();
        } catch (err) {
            console.error(err);
            notify.error(err.response?.data?.detail || "Failed to delete table");
        } finally {
            setModalLoading(false);
        }
    };

    const confirmDeleteTable = (tableName) => {
        setTableToDelete(tableName);
        setShowDeleteConfirm(true);
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
            <Topbar currentView={activeView} onViewChange={setActiveView} />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    tables={schema ? Object.keys(schema) : []}
                    selectedTable={selectedTable}
                    onSelectTable={handleSelectTable}
                    onCreateTable={() => setShowCreateTableModal(true)}
                    onCreateDatabase={() => setShowCreateDbModal(true)}
                />

                {activeView === 'erd' ? (
                    <ERD schema={schema} />
                ) : activeView === 'editor' ? (
                    <div className="h-full overflow-auto p-6">
                        <SchemaEditor
                            table={selectedTable}
                            schema={schema}
                            onSave={handleSaveSchema}
                            onDelete={confirmDeleteTable}
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
            </div>

            <Footer />

            <CreateDatabaseModal
                isOpen={showCreateDbModal}
                onClose={() => setShowCreateDbModal(false)}
                onSubmit={handleCreateDatabase}
                isLoading={modalLoading}
            />

            <CreateTableModal
                isOpen={showCreateTableModal}
                onClose={() => setShowCreateTableModal(false)}
                onSubmit={handleCreateTable}
                isLoading={modalLoading}
            />

            <ConfirmModal
                isOpen={showDeleteConfirm}
                onClose={() => {
                    setShowDeleteConfirm(false);
                    setTableToDelete(null);
                }}
                onConfirm={handleDeleteTable}
                title="Delete Table"
                message={`Are you sure you want to delete the table "${tableToDelete}"? This action cannot be undone.`}
                confirmText="Delete"
                confirmVariant="danger"
                isLoading={modalLoading}
            />
        </div>
    );
}

export default MainApp;
