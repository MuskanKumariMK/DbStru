import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    onClick,
    disabled = false,
    icon: Icon,
    className = '',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/20 focus:ring-blue-500',
        secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 focus:ring-slate-500',
        danger: 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20 focus:ring-red-500',
        ghost: 'bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white focus:ring-slate-500',
        success: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 focus:ring-emerald-500',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {Icon && <Icon className="w-4 h-4" />}
            {children}
        </button>
    );
};

export default Button;
