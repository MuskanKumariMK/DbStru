import React, { useState } from 'react';
import { Database, Server, Sparkles } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';

const ConnectionModal = ({ onConnect, isLoading, error }) => {
    const [connString, setConnString] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (connString.trim()) {
            onConnect(connString);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950/95 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="bg-gradient-to-br from-blue-600 to-blue-500 p-4 rounded-2xl inline-flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20 ring-4 ring-slate-800">
                            <Database className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                            Connect to Database
                        </h2>
                        <p className="text-slate-400 text-sm">
                            Enter your connection string to visualize and manage your schema
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            type="text"
                            value={connString}
                            onChange={(e) => setConnString(e.target.value)}
                            placeholder="mysql://user:pass@host/db"
                            icon={Server}
                            label="Connection String"
                            error={error}
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            disabled={isLoading || !connString.trim()}
                            icon={isLoading ? null : Sparkles}
                            className="w-full"
                        >
                            {isLoading ? 'Connecting...' : 'Connect Database'}
                        </Button>
                    </form>

                    {/* Supported Databases */}
                    <div className="mt-8 pt-6 border-t border-slate-800">
                        <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider mb-3 text-center">
                            Supported Databases
                        </p>
                        <div className="grid grid-cols-4 gap-3">
                            {['MySQL', 'PostgreSQL', 'MongoDB', 'SQL Server'].map((db) => (
                                <div
                                    key={db}
                                    className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-center hover:border-blue-500/50 transition cursor-help group"
                                    title={db}
                                >
                                    <span className="text-xs text-slate-400 group-hover:text-blue-400 transition font-medium">
                                        {db}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConnectionModal;
