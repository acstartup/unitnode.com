'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import Toast from '@/components/Toast';

interface ToastContextType {
    showToast: (message: string, type: 'success' | 'error') => void;
}

interface ToastItem {
    id: number;
    message: string;
    type: 'success' | 'error';
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast () {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const showToast = (message: string, type: 'success' | 'error' ) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const hideToast = (id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-4 right-4 z-[10000] flex flex-col gap-2">
                {toasts.map((toast, index) => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => hideToast(toast.id)}
                        index={index}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
}