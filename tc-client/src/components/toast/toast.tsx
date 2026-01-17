// Toast.tsx
import React, { useEffect, useState } from 'react';

interface ToastProps {
    message: string;
    type?: 'success' | 'info' | 'warning' | 'error';
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (message) {
            setShow(true);
            const timer = setTimeout(() => {
                setShow(false);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    if (!show || !message) {
        return null;
    }

    const getStyles = () => {
        switch (type) {
            case 'success':
                return {
                    bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
                    icon: '✓',
                    ring: 'ring-green-400'
                };
            case 'info':
                return {
                    bg: 'bg-gradient-to-r from-blue-500 to-cyan-600',
                    icon: 'ℹ',
                    ring: 'ring-blue-400'
                };
            case 'warning':
                return {
                    bg: 'bg-gradient-to-r from-yellow-500 to-orange-600',
                    icon: '⚠',
                    ring: 'ring-yellow-400'
                };
            case 'error':
                return {
                    bg: 'bg-gradient-to-r from-red-500 to-rose-600',
                    icon: '✕',
                    ring: 'ring-red-400'
                };
        }
    };

    const styles = getStyles();

    return (
        <div
            className={`fixed top-6 right-6 z-50 transition-all duration-300 ease-out ${
                show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}
        >
            <div className={`${styles.bg} text-white px-6 py-4 rounded-xl shadow-2xl ring-2 ${styles.ring} ring-opacity-50 backdrop-blur-sm max-w-md`}>
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white bg-opacity-20 rounded-full text-xl font-bold">
                        {styles.icon}
                    </div>
                    <div className="flex-1 text-base font-medium leading-snug">
                        {message}
                    </div>
                    <button
                        onClick={() => setShow(false)}
                        className="flex-shrink-0 ml-2 text-white hover:text-gray-200 transition-colors"
                        aria-label="Close"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Toast;
