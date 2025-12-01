import React from 'react';

const Input = ({
    label,
    error,
    icon: Icon,
    className = '',
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    {label}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition" />
                    </div>
                )}
                <input
                    className={`block w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-3 border border-slate-700 rounded-lg bg-slate-950 text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-inner ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-2 text-sm text-red-400">{error}</p>
            )}
        </div>
    );
};

export default Input;
