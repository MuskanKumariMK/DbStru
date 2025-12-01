import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider');
    }
    return context;
};

const NotificationItem = ({ notification, onClose }) => {
    const icons = {
        success: CheckCircle,
        error: XCircle,
        warning: AlertCircle,
        info: Info
    };

    const colors = {
        success: 'bg-green-500/10 border-green-500/30 text-green-400',
        error: 'bg-red-500/10 border-red-500/30 text-red-400',
        warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
        info: 'bg-blue-500/10 border-blue-500/30 text-blue-400'
    };

    const Icon = icons[notification.type];

    return (
        <div className={`flex items-start gap-3 p-4 rounded-lg border ${colors[notification.type]} shadow-lg backdrop-blur-sm animate-slide-in`}>
            <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
                {notification.title && (
                    <p className="font-semibold mb-1">{notification.title}</p>
                )}
                <p className="text-sm opacity-90">{notification.message}</p>
            </div>
            <button
                onClick={() => onClose(notification.id)}
                className="p-1 hover:bg-white/10 rounded transition flex-shrink-0"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((type, message, title = null, duration = 5000) => {
        const id = Date.now() + Math.random();
        const notification = { id, type, message, title };

        setNotifications(prev => [...prev, notification]);

        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }

        return id;
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const notify = {
        success: (message, title = 'Success') => addNotification('success', message, title),
        error: (message, title = 'Error') => addNotification('error', message, title),
        warning: (message, title = 'Warning') => addNotification('warning', message, title),
        info: (message, title = 'Info') => addNotification('info', message, title)
    };

    return (
        <NotificationContext.Provider value={notify}>
            {children}
            {/* Notification Container */}
            <div className="fixed top-4 right-4 z-[100] space-y-2 max-w-md">
                {notifications.map(notification => (
                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onClose={removeNotification}
                    />
                ))}
            </div>
        </NotificationContext.Provider>
    );
};
