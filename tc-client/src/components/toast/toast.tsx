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
            className={`fixed bottom-32 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-green-600 text-white text-4xl rounded shadow-lg transition-all duration-700 ease-in-out ${show ? 'translate-y-0 opacity-100' : 'translate-y-72 opacity-0'}`}
            style={{ transitionProperty: 'opacity, transform' }}
        >
            {message}
        </div>
    );
};

export default Toast;
