// Toast.tsx
import React, { useEffect, useState } from 'react';

interface ToastProps {
    message: string;
}

const Toast: React.FC<ToastProps> = ({ message }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Show the toast when the message changes
        if (message) {
            setShow(true);

            // Hide the toast after 3 seconds
            const timer = setTimeout(() => {
                setShow(false);
            }, 3000);

            // Clean up the timer
            return () => clearTimeout(timer);
        }
    }, [message]);

    if (!show) {
        return null;
    }

    return (
        <div
            className={`fixed bottom-32 left-1/2 transform -translate-x-1/2 px-8 py-4 bg-green-500 text-white text-3xl font-bold rounded-2xl shadow-2xl transition-all duration-500 ease-out ${
                show ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-72 opacity-0 scale-95'
            }`}
            style={{ transitionProperty: 'opacity, transform' }}
        >
            <div className="flex items-center">
                <span className="text-4xl mr-3">🎉</span>
                {message}
            </div>
        </div>
    );
};

export default Toast;
