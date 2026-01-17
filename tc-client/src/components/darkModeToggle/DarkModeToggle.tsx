import React from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';

const DarkModeToggle: React.FC = () => {
    const { isDarkMode, toggleDarkMode } = useDarkMode();

    return (
        <button
            onClick={toggleDarkMode}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 opacity-60 hover:opacity-100 ${
                isDarkMode 
                    ? 'bg-gray-700 focus:ring-gray-600' 
                    : 'bg-gray-300 focus:ring-gray-400'
            }`}
            aria-label="Toggle dark mode"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            <div
                className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transform transition-all duration-300 flex items-center justify-center ${
                    isDarkMode ? 'translate-x-7' : 'translate-x-0'
                }`}
            >
                {isDarkMode ? (
                    <span className="text-xs">🌙</span>
                ) : (
                    <span className="text-xs">☀️</span>
                )}
            </div>
        </button>
    );
};

export default DarkModeToggle;
