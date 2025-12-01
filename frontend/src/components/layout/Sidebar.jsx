import React, { useState } from 'react';
import { Database, Table, Plus, Settings, Layers, Search, ChevronRight, FolderOpen } from 'lucide-react';
import Badge from '../common/Badge';

const Sidebar = ({ tables = [], onSelectTable, onCreateTable, onCreateDatabase, selectedTable }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(false);

    const filteredTables = tables.filter(table =>
        table.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={`${isCollapsed ? 'w-16' : 'w-72'} h-full bg-slate-900 text-slate-50 flex flex-col border-r border-slate-800 transition-all duration-300 shadow-xl`}>
            {/* Header */}
            <div className="p-4 border-b border-slate-800">
                {!isCollapsed && (
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <FolderOpen className="w-5 h-5 text-blue-500" />
                            <span className="font-semibold text-slate-200">Database</span>
                        </div>
                        <Badge variant="primary" size="sm">{tables.length}</Badge>
                    </div>
                )}

                {!isCollapsed && (
                    <button
                        onClick={onCreateDatabase}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white p-2.5 rounded-lg transition font-medium shadow-lg shadow-blue-500/20"
                    >
                        <Plus className="w-4 h-4" /> New Database
                    </button>
                )}
            </div>

            {/* Search */}
            {!isCollapsed && (
                <div className="p-4 border-b border-slate-800">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search tables..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                    </div>
                </div>
            )}

            {/* Tables List */}
            <div className="flex-1 overflow-y-auto p-4">
                {!isCollapsed && (
                    <>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">
                                Tables & Collections
                            </span>
                            <button
                                onClick={onCreateTable}
                                className="p-1 hover:bg-slate-800 rounded transition"
                                title="Add Table"
                            >
                                <Plus className="w-4 h-4 text-slate-400 hover:text-white" />
                            </button>
                        </div>

                        <ul className="space-y-1">
                            {filteredTables.map((table) => (
                                <li key={table}>
                                    <button
                                        onClick={() => onSelectTable(table)}
                                        className={`w-full flex items-center justify-between gap-2 p-2.5 rounded-lg text-left transition group ${selectedTable === table
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <Table className={`w-4 h-4 flex-shrink-0 ${selectedTable === table ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'
                                                }`} />
                                            <span className="truncate text-sm font-medium">{table}</span>
                                        </div>
                                        <ChevronRight className={`w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition ${selectedTable === table ? 'opacity-100' : ''
                                            }`} />
                                    </button>
                                </li>
                            ))}
                            {filteredTables.length === 0 && (
                                <li className="text-slate-600 text-sm italic p-2 text-center">
                                    {searchQuery ? 'No tables found' : 'No tables available'}
                                </li>
                            )}
                        </ul>
                    </>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800">
                {!isCollapsed && (
                    <button className="w-full flex items-center gap-2 p-2.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition text-sm font-medium">
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
