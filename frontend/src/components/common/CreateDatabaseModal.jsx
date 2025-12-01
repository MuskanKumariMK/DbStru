import React, { useState } from 'react';
import { X, Database, AlertCircle } from 'lucide-react';
import Button from './Button';
import Input from './Input';

const CreateDatabaseModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
    const [databaseName, setDatabaseName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!databaseName.trim()) {
            setError('Database name is required');
            return;
        }

        if (!/^[a-zA-Z0-9_]+$/.test(databaseName)) {
            setError('Database name must contain only alphanumeric characters and underscores');
            return;
        }

        onSubmit(databaseName);
    };

    const handleClose = () => {
        setDatabaseName('');
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-900 rounded-xl shadow-2xl border border-slate-800 w-full max-w-md mx-4 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600/20 rounded-lg">
                            <Database className="w-5 h-5 text-blue-500" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Create New Database</h2>
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
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Database Name
                        </label>
                        <Input
                            type="text"
                            value={databaseName}
                            onChange={(e) => setDatabaseName(e.target.value)}
                            placeholder="my_database"
                            disabled={isLoading}
                            autoFocus
                        />
                        <p className="mt-2 text-xs text-slate-500">
                            Only alphanumeric characters and underscores are allowed
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 pt-4">
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
                            icon={Database}
                            disabled={isLoading}
                            className="flex-1"
                        >
                            {isLoading ? 'Creating...' : 'Create Database'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateDatabaseModal;
