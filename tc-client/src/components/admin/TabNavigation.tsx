import React from 'react';

interface TabNavigationProps {
    activeTab: 'shifts' | 'users';
    userCount: number;
    onTabChange: (tab: 'shifts' | 'users') => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, userCount, onTabChange }) => {
    return (
        <div className="flex gap-3">
            <button
                onClick={() => onTabChange('shifts')}
                className={`px-8 py-3 rounded-xl font-bold transition-all duration-200 ${
                    activeTab === 'shifts'
                        ? 'bg-white text-blue-600 shadow-lg'
                        : 'bg-blue-500/30 text-white hover:bg-blue-500/50'
                }`}
            >
                📋 Shifts
            </button>
            <button
                onClick={() => onTabChange('users')}
                className={`px-8 py-3 rounded-xl font-bold transition-all duration-200 ${
                    activeTab === 'users'
                        ? 'bg-white text-blue-600 shadow-lg'
                        : 'bg-blue-500/30 text-white hover:bg-blue-500/50'
                }`}
            >
                👥 Users ({userCount})
            </button>
        </div>
    );
};

export default TabNavigation;
