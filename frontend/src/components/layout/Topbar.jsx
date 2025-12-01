import React from 'react';
import { Database, Bell, Settings, User, Search } from 'lucide-react';
import Badge from '../common/Badge';

const Topbar = ({ currentView, onViewChange }) => {
    return (
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 shadow-lg z-20">
            {/* Left: Branding */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-500 p-2 rounded-lg shadow-lg shadow-blue-500/20">
                        <Database className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white tracking-tight">DB Intelligence</h1>
                        <p className="text-xs text-slate-500">Schema Visualizer & Editor</p>
                    </div>
                </div>
            </div>

            {/* Center: View Switcher */}
            <div className="flex gap-2 bg-slate-800 p-1 rounded-lg">
                <button
                    onClick={() => onViewChange('erd')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${currentView === 'erd'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-white hover:bg-slate-700'
                        }`}
                >
                    Diagram
                </button>
                <button
                    onClick={() => onViewChange('editor')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${currentView === 'editor'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-white hover:bg-slate-700'
                        }`}
                >
                    Editor
                </button>
                <button
                    onClick={() => onViewChange('analytics')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${currentView === 'analytics'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-white hover:bg-slate-700'
                        }`}
                >
                    Analytics
                </button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition">
                    <Settings className="w-5 h-5" />
                </button>
                <div className="h-8 w-px bg-slate-800"></div>
                <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 transition">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-300">Admin</span>
                </button>
            </div>
        </header>
    );
};

export default Topbar;
