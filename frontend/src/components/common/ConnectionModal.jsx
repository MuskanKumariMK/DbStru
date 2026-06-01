import React, { useState } from 'react';
import { Database, Server, Sparkles } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';

const DB_TYPES = [
    { value: 'sqlserver', label: 'SQL Server' },
    { value: 'mysql', label: 'MySQL' },
    { value: 'postgresql', label: 'PostgreSQL' },
    { value: 'mongodb', label: 'MongoDB' }
];

const DEFAULT_FIELDS = {
    host: 'localhost',
    port: '',
    database: '',
    username: '',
    password: '',
    instance: ''
};

const CONNECTION_EXAMPLES = {
    sqlserver: 'mssql://user:pass@localhost:1433/database?driver=ODBC+Driver+17+for+SQL+Server',
    mysql: 'mysql://user:pass@localhost:3306/database',
    postgresql: 'postgresql://user:pass@localhost:5432/database',
    mongodb: 'mongodb://user:pass@localhost:27017/database'
};

const buildConnectionString = (type, fields) => {
    const host = fields.host.trim() || 'localhost';
    const port = fields.port.trim();
    const database = fields.database.trim() || '';
    const user = encodeURIComponent(fields.username.trim());
    const pass = encodeURIComponent(fields.password);

    switch (type) {
        case 'sqlserver': {
            const server = fields.instance.trim()
                ? `${host}\\${fields.instance.trim()}`
                : port
                    ? `${host},${port}`
                    : host;
            return `mssql://${user}:${pass}@${server}/${database}?driver=ODBC+Driver+17+for+SQL+Server`;
        }
        case 'mysql':
            return `mysql://${user}:${pass}@${host}:${port || '3306'}/${database}`;
        case 'postgresql':
            return `postgresql://${user}:${pass}@${host}:${port || '5432'}/${database}`;
        case 'mongodb':
            return `mongodb://${user}:${pass}@${host}:${port || '27017'}/${database}`;
        default:
            return '';
    }
};

const ConnectionModal = ({ onConnect, isLoading, error }) => {
    const [dbType, setDbType] = useState('sqlserver');
    const [fields, setFields] = useState(DEFAULT_FIELDS);
    const [activeTab, setActiveTab] = useState('fields');
    const [rawString, setRawString] = useState('');

    const generatedString = buildConnectionString(dbType, fields);
    const connectionString = activeTab === 'raw' ? rawString : generatedString;

    const handleFieldChange = (name, value) => {
        setFields((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (connectionString.trim()) {
            onConnect(connectionString);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950/95 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-full sm:max-w-2xl mx-4 sm:mx-auto relative overflow-hidden max-h-[calc(100vh-2rem)]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>

                <div className="relative z-10 overflow-y-auto max-h-[calc(100vh-4rem)] pr-1">
                    <div className="text-center mb-8">
                        <div className="bg-gradient-to-br from-blue-600 to-blue-500 p-4 rounded-2xl inline-flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20 ring-4 ring-slate-800">
                            <Database className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                            Connect to Database
                        </h2>
                        <p className="text-slate-400 text-sm">
                            Choose a database type, fill the fields, or paste your raw connection string.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Database Type</label>
                                <select
                                    value={dbType}
                                    onChange={(e) => setDbType(e.target.value)}
                                    className="block w-full pr-10 py-3 border border-slate-700 rounded-lg bg-slate-950 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {DB_TYPES.map((item) => (
                                        <option key={item.value} value={item.value}>{item.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col items-stretch justify-end gap-2 sm:items-end">
                                <div className="inline-flex w-full flex-col sm:flex-row rounded-xl border border-slate-700 bg-slate-950 overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('fields')}
                                        className={`w-full px-4 py-3 text-sm font-medium transition ${activeTab === 'fields' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
                                    >
                                        Fields
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('raw')}
                                        className={`w-full px-4 py-3 text-sm font-medium transition ${activeTab === 'raw' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
                                    >
                                        Raw String
                                    </button>
                                </div>
                            </div>
                        </div>

                        {activeTab === 'fields' ? (
                            <>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <Input
                                        label="Host"
                                        value={fields.host}
                                        onChange={(e) => handleFieldChange('host', e.target.value)}
                                        placeholder="localhost"
                                        icon={Server}
                                    />
                                    <Input
                                        label="Port"
                                        value={fields.port}
                                        onChange={(e) => handleFieldChange('port', e.target.value)}
                                        placeholder={dbType === 'sqlserver' ? '1433' : dbType === 'mysql' ? '3306' : dbType === 'postgresql' ? '5432' : '27017'}
                                        icon={Server}
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <Input
                                        label="Username"
                                        value={fields.username}
                                        onChange={(e) => handleFieldChange('username', e.target.value)}
                                        placeholder="db user"
                                    />
                                    <Input
                                        label="Password"
                                        type="password"
                                        value={fields.password}
                                        onChange={(e) => handleFieldChange('password', e.target.value)}
                                        placeholder="db password"
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <Input
                                        label="Database"
                                        value={fields.database}
                                        onChange={(e) => handleFieldChange('database', e.target.value)}
                                        placeholder="database name"
                                    />
                                    {dbType === 'sqlserver' && (
                                        <Input
                                            label="Instance (optional)"
                                            value={fields.instance}
                                            onChange={(e) => handleFieldChange('instance', e.target.value)}
                                            placeholder="SQLEXPRESS"
                                        />
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Generated Connection String</label>
                                    <textarea
                                        readOnly
                                        value={generatedString}
                                        rows={3}
                                        className="block w-full resize-none rounded-lg border border-slate-700 bg-slate-950 p-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Raw Connection String</label>
                                <textarea
                                    value={rawString}
                                    onChange={(e) => setRawString(e.target.value)}
                                    rows={6}
                                    placeholder={CONNECTION_EXAMPLES[dbType]}
                                    className="block w-full resize-none rounded-lg border border-slate-700 bg-slate-950 p-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            disabled={isLoading || !connectionString.trim()}
                            icon={isLoading ? null : Sparkles}
                            className="w-full"
                        >
                            {isLoading ? 'Connecting...' : 'Connect Database'}
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-800">
                        <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider mb-3 text-center">
                            Example connection string formats
                        </p>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {DB_TYPES.map((item) => (
                                <div key={item.value} className="bg-slate-950 border border-slate-800 rounded-lg p-4 break-words">
                                    <p className="text-sm text-slate-400 font-semibold mb-2">{item.label}</p>
                                    <pre className="text-xs text-slate-200 bg-slate-900 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap break-all">{CONNECTION_EXAMPLES[item.value]}</pre>
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
