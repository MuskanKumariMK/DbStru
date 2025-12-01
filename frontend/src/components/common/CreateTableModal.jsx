import React, { useState } from 'react';
import { X, Table, Plus, Trash2, AlertCircle } from 'lucide-react';
import Button from './Button';
import Input from './Input';

const CreateTableModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
    const [tableName, setTableName] = useState('');
    const [columns, setColumns] = useState([
        { name: 'id', type: 'INT', nullable: false, isPrimaryKey: true, autoIncrement: true }
    ]);
    const [error, setError] = useState('');

    const dataTypes = [
        'INT', 'BIGINT', 'VARCHAR(255)', 'VARCHAR(100)', 'TEXT',
        'BOOLEAN', 'DATE', 'DATETIME', 'TIMESTAMP', 'DECIMAL(10,2)', 'FLOAT'
    ];

    const handleAddColumn = () => {
        setColumns([...columns, {
            name: 'new_column',
            type: 'VARCHAR(255)',
            nullable: true,
            isPrimaryKey: false,
            autoIncrement: false
        }]);
    };

    const handleRemoveColumn = (index) => {
        if (columns.length > 1) {
            setColumns(columns.filter((_, i) => i !== index));
        }
    };

    const handleColumnChange = (index, field, value) => {
        const newColumns = [...columns];
        newColumns[index][field] = value;
        setColumns(newColumns);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!tableName.trim()) {
            setError('Table name is required');
            return;
        }

        if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
            setError('Table name must contain only alphanumeric characters and underscores');
            return;
        }

        if (columns.length === 0) {
            setError('At least one column is required');
            return;
        }

        for (const col of columns) {
            if (!col.name.trim()) {
                setError('All columns must have a name');
                return;
            }
            if (!/^[a-zA-Z0-9_]+$/.test(col.name)) {
                setError(`Column name "${col.name}" must contain only alphanumeric characters and underscores`);
                return;
            }
        }

        onSubmit(tableName, columns);
    };

    const handleClose = () => {
        setTableName('');
        setColumns([
            { name: 'id', type: 'INT', nullable: false, isPrimaryKey: true, autoIncrement: true }
        ]);
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-slate-900 rounded-xl shadow-2xl border border-slate-800 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600/20 rounded-lg">
                            <Table className="w-5 h-5 text-blue-500" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Create New Table</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-white"
                        disabled={isLoading}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-6">
                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Table Name
                            </label>
                            <Input
                                type="text"
                                value={tableName}
                                onChange={(e) => setTableName(e.target.value)}
                                placeholder="users"
                                disabled={isLoading}
                                autoFocus
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="block text-sm font-medium text-slate-300">
                                    Columns
                                </label>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    icon={Plus}
                                    onClick={handleAddColumn}
                                    disabled={isLoading}
                                >
                                    Add Column
                                </Button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-950 text-slate-300 text-xs uppercase">
                                        <tr>
                                            <th className="p-3 text-left">Name</th>
                                            <th className="p-3 text-left">Type</th>
                                            <th className="p-3 text-center">Nullable</th>
                                            <th className="p-3 text-center">Primary Key</th>
                                            <th className="p-3 text-center">Auto Increment</th>
                                            <th className="p-3 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {columns.map((col, index) => (
                                            <tr key={index} className="hover:bg-slate-800/50">
                                                <td className="p-3">
                                                    <input
                                                        type="text"
                                                        value={col.name}
                                                        onChange={(e) => handleColumnChange(index, 'name', e.target.value)}
                                                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        disabled={isLoading}
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <select
                                                        value={col.type}
                                                        onChange={(e) => handleColumnChange(index, 'type', e.target.value)}
                                                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        disabled={isLoading}
                                                    >
                                                        {dataTypes.map(type => (
                                                            <option key={type} value={type}>{type}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={col.nullable}
                                                        onChange={(e) => handleColumnChange(index, 'nullable', e.target.checked)}
                                                        className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                                        disabled={isLoading}
                                                    />
                                                </td>
                                                <td className="p-3 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={col.isPrimaryKey}
                                                        onChange={(e) => handleColumnChange(index, 'isPrimaryKey', e.target.checked)}
                                                        className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                                        disabled={isLoading}
                                                    />
                                                </td>
                                                <td className="p-3 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={col.autoIncrement}
                                                        onChange={(e) => handleColumnChange(index, 'autoIncrement', e.target.checked)}
                                                        className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                                        disabled={isLoading || col.type.toUpperCase().includes('VARCHAR') || col.type.toUpperCase().includes('TEXT')}
                                                    />
                                                </td>
                                                <td className="p-3 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveColumn(index)}
                                                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                        disabled={isLoading || columns.length === 1}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 p-6 border-t border-slate-800 bg-slate-950">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            icon={Table}
                            disabled={isLoading}
                            className="flex-1"
                        >
                            {isLoading ? 'Creating...' : 'Create Table'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTableModal;
