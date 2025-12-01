import React from 'react';

const Card = ({ children, className = '', title, actions }) => {
    return (
        <div className={`bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden ${className}`}>
            {title && (
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                    {actions && <div className="flex gap-2">{actions}</div>}
                </div>
            )}
            <div className="p-4">
                {children}
            </div>
        </div>
    );
};

export default Card;
