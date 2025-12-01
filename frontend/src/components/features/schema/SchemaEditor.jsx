import React, { useState, useEffect } from 'react';
import { Save, Trash2, Plus, Database } from 'lucide-react';
import Button from '../../common/Button';
import Card from '../../common/Card';
import Badge from '../../common/Badge';

const SchemaEditor = ({ table, schema, onSave }) => {
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        if (table && schema && schema[table]) {
            const tableData = schema[table];
            const cols = tableData.columns.map(col => ({
                name: col,
                type: tableData.column_types[col],
                nullable: tableData.nullable[col],
                isPrimaryKey: tableData.primary_keys.includes(col)
            }));
            setColumns(cols);
        }
    }, [table, schema]);

    const handleAddColumn = () => {
        setColumns([...columns, {
            name: 'new_column',
            type: 'VARCHAR(255)',
            nullable: true,
            isPrimaryKey: false
        }]);
    };

    const handleDeleteColumn = (idx) => {
        setColumns(columns.filter((_, i) => i !== idx));
    };

    const handleUpdateColumn = (idx, field, value) => {
        const newCols = [...columns];
        newCols[idx][field] = value;
        setColumns(newCols);
    };

    if (!table) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <Database className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-400 mb-2">No Table Selected</h3>
                    <p className="text-slate-600">Select a table from the sidebar to edit its schema</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <Card
                title={
                    <div className="flex items-center gap-3">
                        <span>Edit Table:</span>
                        <Badge variant="primary" size="lg">{table}</Badge>
                    </div>
                }
                actions={
                    <>
                        <Button variant="danger" size="sm" icon={Trash2}>
                            Delete Table
                        </Button>
                        <Button variant="primary" size="sm" icon={Save} onClick={() => onSave(table, columns)}>
                            Save Changes
                        </Button>
                    </>
                }
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-950 text-slate-200 uppercase text-xs font-bold border-b border-slate-800">
                            <tr>
                                <th className="p-4 rounded-tl-lg">Column Name</th>
                                <th className="p-4">Data Type</th>
                                <th className="p-4 text-center">Nullable</th>
                                <th className="p-4 text-center">Primary Key</th>
                                <th className="p-4 rounded-tr-lg text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {columns.map((col, idx) => (
                                <tr key={idx} className="hover:bg-slate-800/50 transition group">
                                    <td className="p-4">
                                        <input
                                            type="text"
                                            value={col.name}
                                            onChange={(e) => handleUpdateColumn(idx, 'name', e.target.value)}
                                            className="w-full bg-transparent border border-transparent hover:border-slate-700 focus:border-blue-500 rounded-lg px-3 py-2 text-white outline-none transition"
                                        />
                                    </td>
                                    <td className="p-4">
                                        <input
                                            type="text"
                                            value={col.type}
                                            onChange={(e) => handleUpdateColumn(idx, 'type', e.target.value)}
                                            className="w-full bg-transparent border border-transparent hover:border-slate-700 focus:border-blue-500 rounded-lg px-3 py-2 text-blue-300 outline-none transition"
                                        />
                                    </td>
                                    <td className="p-4 text-center">
                                        <input
                                            type="checkbox"
                                            checked={col.nullable}
                                            onChange={(e) => handleUpdateColumn(idx, 'nullable', e.target.checked)}
                                            className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 cursor-pointer"
                                        />
                                    </td>
                                    <td className="p-4 text-center">
                                        <input
                                            type="checkbox"
                                            checked={col.isPrimaryKey}
                                            onChange={(e) => handleUpdateColumn(idx, 'isPrimaryKey', e.target.checked)}
                                            className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 cursor-pointer"
                                        />
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => handleDeleteColumn(idx)}
                                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-6 flex justify-center">
                        <Button variant="secondary" icon={Plus} onClick={handleAddColumn}>
                            Add Column
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default SchemaEditor;
