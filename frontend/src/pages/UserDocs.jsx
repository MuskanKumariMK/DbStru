import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Database, Table, Edit, Trash2, Eye, BookOpen, Code } from 'lucide-react';

const UserDocs = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Header */}
            <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Database className="w-8 h-8 text-blue-500" />
                        <h1 className="text-2xl font-bold">Database Intelligence Engine</h1>
                    </div>
                    <div className="flex gap-4">
                        <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition">
                            <Home className="w-4 h-4" />
                            <span>Back to App</span>
                        </Link>
                        <Link to="/docs/developer" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition">
                            <Code className="w-4 h-4" />
                            <span>Developer Docs</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="prose prose-invert max-w-none">
                    {/* Introduction */}
                    <section className="mb-16">
                        <h2 className="text-4xl font-bold mb-6 text-blue-400">User Documentation</h2>
                        <p className="text-lg text-slate-300 mb-4">
                            Welcome to the Database Intelligence Engine! This powerful tool allows you to visualize, create, and manage database schemas across multiple database systems.
                        </p>
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-6">
                            <h3 className="text-xl font-semibold mb-3 text-blue-400">✨ Key Features</h3>
                            <ul className="space-y-2 text-slate-300">
                                <li>🔗 Connect to MySQL, PostgreSQL, MongoDB, and SQL Server databases</li>
                                <li>📊 Visualize database schemas with interactive ERD diagrams</li>
                                <li>🗄️ Create new databases and tables</li>
                                <li>✏️ Edit table structures (add, modify, remove columns)</li>
                                <li>🗑️ Delete tables with confirmation</li>
                                <li>🔔 Real-time notifications for all operations</li>
                            </ul>
                        </div>
                    </section>

                    {/* Getting Started */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                            <BookOpen className="w-8 h-8 text-blue-500" />
                            Getting Started
                        </h2>

                        <h3 className="text-2xl font-semibold mb-4 text-blue-400">System Requirements</h3>
                        <ul className="list-disc list-inside text-slate-300 mb-6 space-y-2">
                            <li>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
                            <li>Access to a database server (MySQL, PostgreSQL, MongoDB, or SQL Server)</li>
                            <li>Database credentials (username and password)</li>
                        </ul>

                        <h3 className="text-2xl font-semibold mb-4 text-blue-400">Connecting to a Database</h3>
                        <p className="text-slate-300 mb-4">
                            When you first open the application, you'll see a connection modal. Enter your database connection string in the appropriate format:
                        </p>

                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-6">
                            <h4 className="text-lg font-semibold mb-3 text-green-400">Connection String Formats</h4>
                            <div className="space-y-4">
                                <div>
                                    <p className="font-semibold text-blue-400 mb-2">MySQL:</p>
                                    <code className="block bg-slate-950 p-3 rounded text-green-400 text-sm">
                                        mysql://username:password@localhost:3306/database_name
                                    </code>
                                </div>
                                <div>
                                    <p className="font-semibold text-blue-400 mb-2">PostgreSQL:</p>
                                    <code className="block bg-slate-950 p-3 rounded text-green-400 text-sm">
                                        postgresql://username:password@localhost:5432/database_name
                                    </code>
                                </div>
                                <div>
                                    <p className="font-semibold text-blue-400 mb-2">MongoDB:</p>
                                    <code className="block bg-slate-950 p-3 rounded text-green-400 text-sm">
                                        mongodb://username:password@localhost:27017/database_name
                                    </code>
                                </div>
                                <div>
                                    <p className="font-semibold text-blue-400 mb-2">SQL Server:</p>
                                    <code className="block bg-slate-950 p-3 rounded text-green-400 text-sm">
                                        mssql://username:password@localhost:1433/database_name
                                    </code>
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
                            <p className="text-yellow-400 font-semibold mb-2">⚠️ Security Note</p>
                            <p className="text-slate-300">
                                Never share your connection strings publicly. They contain sensitive credentials. Use environment variables or secure vaults in production environments.
                            </p>
                        </div>
                    </section>

                    {/* Database Operations */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                            <Database className="w-8 h-8 text-blue-500" />
                            Database Operations
                        </h2>

                        <h3 className="text-2xl font-semibold mb-4 text-blue-400">Creating a Database</h3>
                        <ol className="list-decimal list-inside text-slate-300 mb-6 space-y-2">
                            <li>Click the <strong className="text-blue-400">"New Database"</strong> button in the sidebar</li>
                            <li>Enter a database name (alphanumeric characters and underscores only)</li>
                            <li>Click <strong className="text-blue-400">"Create Database"</strong></li>
                            <li>You'll see a success notification when the database is created</li>
                        </ol>

                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                            <p className="text-blue-400 font-semibold mb-2">💡 Tip</p>
                            <p className="text-slate-300">
                                Database names must contain only letters, numbers, and underscores. Special characters and spaces are not allowed.
                            </p>
                        </div>
                    </section>

                    {/* Table Management */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                            <Table className="w-8 h-8 text-blue-500" />
                            Table Management
                        </h2>

                        <h3 className="text-2xl font-semibold mb-4 text-blue-400">Creating a Table</h3>
                        <ol className="list-decimal list-inside text-slate-300 mb-6 space-y-2">
                            <li>Click the <strong className="text-blue-400">+</strong> button next to "Tables & Collections" in the sidebar</li>
                            <li>Enter a table name</li>
                            <li>Define your columns:
                                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                                    <li><strong>Name:</strong> Column name (alphanumeric and underscores)</li>
                                    <li><strong>Type:</strong> Data type (INT, VARCHAR, TEXT, etc.)</li>
                                    <li><strong>Nullable:</strong> Can the column contain NULL values?</li>
                                    <li><strong>Primary Key:</strong> Is this column a primary key?</li>
                                    <li><strong>Auto Increment:</strong> Auto-increment for numeric types</li>
                                </ul>
                            </li>
                            <li>Click <strong className="text-blue-400">"Add Column"</strong> to add more columns</li>
                            <li>Click <strong className="text-blue-400">"Create Table"</strong> to create the table</li>
                        </ol>

                        <h3 className="text-2xl font-semibold mb-4 text-blue-400 flex items-center gap-2">
                            <Edit className="w-6 h-6" />
                            Editing a Table
                        </h3>
                        <ol className="list-decimal list-inside text-slate-300 mb-6 space-y-2">
                            <li>Click on a table name in the sidebar</li>
                            <li>The Schema Editor will open automatically</li>
                            <li>Make your changes:
                                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                                    <li>Edit column names, types, or constraints directly in the table</li>
                                    <li>Click <strong className="text-blue-400">"Add Column"</strong> to add new columns</li>
                                    <li>Click the trash icon to remove a column</li>
                                </ul>
                            </li>
                            <li>Click <strong className="text-blue-400">"Save Changes"</strong> to apply your modifications</li>
                            <li>The schema will refresh automatically</li>
                        </ol>

                        <h3 className="text-2xl font-semibold mb-4 text-blue-400 flex items-center gap-2">
                            <Trash2 className="w-6 h-6" />
                            Deleting a Table
                        </h3>
                        <ol className="list-decimal list-inside text-slate-300 mb-6 space-y-2">
                            <li>Select a table from the sidebar</li>
                            <li>In the Schema Editor, click <strong className="text-red-400">"Delete Table"</strong></li>
                            <li>Confirm the deletion in the modal dialog</li>
                            <li>The table will be permanently deleted</li>
                        </ol>

                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
                            <p className="text-red-400 font-semibold mb-2">⚠️ Warning</p>
                            <p className="text-slate-300">
                                Deleting a table is permanent and cannot be undone. All data in the table will be lost. Always backup important data before deletion.
                            </p>
                        </div>
                    </section>

                    {/* ERD Visualization */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                            <Eye className="w-8 h-8 text-blue-500" />
                            ERD Visualization
                        </h2>
                        <p className="text-slate-300 mb-4">
                            The Entity Relationship Diagram (ERD) view provides a visual representation of your database schema:
                        </p>
                        <ul className="list-disc list-inside text-slate-300 mb-6 space-y-2">
                            <li><strong className="text-blue-400">Tables:</strong> Displayed as cards showing table name and columns</li>
                            <li><strong className="text-blue-400">Relationships:</strong> Foreign key relationships shown as connecting lines</li>
                            <li><strong className="text-blue-400">Primary Keys:</strong> Highlighted with a key icon</li>
                            <li><strong className="text-blue-400">Data Types:</strong> Shown for each column</li>
                        </ul>
                        <p className="text-slate-300">
                            Click the <strong className="text-blue-400">"ERD"</strong> button in the top navigation to view the diagram.
                        </p>
                    </section>

                    {/* Troubleshooting */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold mb-6 text-red-400">Troubleshooting</h2>

                        <div className="space-y-6">
                            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                                <h3 className="text-xl font-semibold mb-3 text-blue-400">Connection Failed</h3>
                                <p className="text-slate-300 mb-3"><strong>Problem:</strong> Unable to connect to the database</p>
                                <p className="text-slate-300 mb-2"><strong>Solutions:</strong></p>
                                <ul className="list-disc list-inside text-slate-300 space-y-1 ml-4">
                                    <li>Verify your connection string format is correct</li>
                                    <li>Check that the database server is running</li>
                                    <li>Ensure your username and password are correct</li>
                                    <li>Verify network connectivity to the database server</li>
                                    <li>Check firewall settings</li>
                                </ul>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                                <h3 className="text-xl font-semibold mb-3 text-blue-400">Permission Denied</h3>
                                <p className="text-slate-300 mb-3"><strong>Problem:</strong> Cannot create or modify database objects</p>
                                <p className="text-slate-300 mb-2"><strong>Solutions:</strong></p>
                                <ul className="list-disc list-inside text-slate-300 space-y-1 ml-4">
                                    <li>Ensure your database user has CREATE, ALTER, and DROP privileges</li>
                                    <li>Contact your database administrator for proper permissions</li>
                                    <li>Use a user account with sufficient privileges</li>
                                </ul>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                                <h3 className="text-xl font-semibold mb-3 text-blue-400">Invalid Table/Column Names</h3>
                                <p className="text-slate-300 mb-3"><strong>Problem:</strong> Error when creating tables or columns</p>
                                <p className="text-slate-300 mb-2"><strong>Solutions:</strong></p>
                                <ul className="list-disc list-inside text-slate-300 space-y-1 ml-4">
                                    <li>Use only alphanumeric characters and underscores</li>
                                    <li>Avoid reserved keywords (SELECT, TABLE, etc.)</li>
                                    <li>Don't start names with numbers</li>
                                    <li>Keep names under 64 characters</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* FAQ */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold mb-6 text-blue-400">Frequently Asked Questions</h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-blue-400">Q: Can I connect to multiple databases at once?</h3>
                                <p className="text-slate-300">A: Currently, you can connect to one database at a time. To switch databases, refresh the page and enter a new connection string.</p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-blue-400">Q: Are my database credentials stored?</h3>
                                <p className="text-slate-300">A: No, credentials are only used for the current session and are not stored permanently. You'll need to reconnect when you refresh the page.</p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-blue-400">Q: Can I undo a table deletion?</h3>
                                <p className="text-slate-300">A: No, table deletions are permanent. Always backup important data before deleting tables.</p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-blue-400">Q: What database types are supported?</h3>
                                <p className="text-slate-300">A: MySQL, PostgreSQL, MongoDB, and SQL Server are supported. The interface adapts to each database type's specific features.</p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-blue-400">Q: Can I view and edit table data?</h3>
                                <p className="text-slate-300">A: Data browsing and editing features are planned for future releases. Currently, you can manage schemas and structures.</p>
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <section className="border-t border-slate-800 pt-8">
                        <p className="text-slate-400 text-center">
                            Need more help? Check out the{' '}
                            <Link to="/docs/developer" className="text-blue-400 hover:text-blue-300 underline">
                                Developer Documentation
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

export default UserDocs;
