import React from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';

export const TableSkeleton: React.FC = () => {
    const { isDarkMode } = useDarkMode();
    
    return (
        <div className={`rounded-3xl shadow-xl overflow-hidden border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}>
            <div className="overflow-x-auto">
                <table className="table-auto w-full">
                    <thead>
                        <tr className={`text-white ${
                            isDarkMode 
                                ? 'bg-gradient-to-r from-blue-800 to-blue-900' 
                                : 'bg-gradient-to-r from-blue-600 to-blue-700'
                        }`}>
                            <th className="px-6 py-5 text-left font-bold text-lg">
                                <div className="flex items-center">
                                    <span className="mr-2">👤</span>
                                    Name
                                </div>
                            </th>
                            <th className="px-6 py-5 font-bold text-lg">
                                <div className="flex items-center justify-center">
                                    <span className="mr-2">🕐</span>
                                    Time In
                                </div>
                            </th>
                            <th className="px-6 py-5 font-bold text-lg">
                                <div className="flex items-center justify-center">
                                    <span className="mr-2">🕐</span>
                                    Time Out
                                </div>
                            </th>
                            <th className="px-6 py-5 font-bold text-lg">
                                <div className="flex items-center justify-center">
                                    <span className="mr-2">⏱</span>
                                    Hours Worked
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <tr key={i} className={`h-20 border-b ${
                                isDarkMode 
                                    ? 'border-gray-700 bg-gray-800' 
                                    : 'border-gray-100 bg-white'
                            }`}>
                                <td className="px-6 py-4 text-left">
                                    <div className={`h-6 rounded-lg animate-pulse ${
                                        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                                    }`} style={{ width: '60%' }}></div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className={`h-8 rounded-full animate-pulse mx-auto ${
                                        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                                    }`} style={{ width: '100px' }}></div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className={`h-10 rounded-xl animate-pulse mx-auto ${
                                        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                                    }`} style={{ width: '120px' }}></div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className={`h-8 rounded-full animate-pulse mx-auto ${
                                        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                                    }`} style={{ width: '80px' }}></div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const SelectSkeleton: React.FC = () => {
    const { isDarkMode } = useDarkMode();
    
    return (
        <div className={`rounded-3xl shadow-2xl overflow-hidden ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
            <div className={`p-8 ${
                isDarkMode 
                    ? 'bg-gradient-to-r from-gray-900 to-gray-800' 
                    : 'bg-gradient-to-r from-gray-800 to-gray-900'
            }`}>
                <div className={`h-10 rounded-lg animate-pulse mb-4 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-700'
                }`} style={{ width: '60%' }}></div>
                <div className={`h-6 rounded-lg animate-pulse ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-700'
                }`} style={{ width: '40%' }}></div>
            </div>
            
            <div className="p-8">
                <div className={`h-6 rounded-lg animate-pulse mb-4 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`} style={{ width: '30%' }}></div>
                <div className={`h-16 rounded-xl animate-pulse mb-8 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}></div>
                <div className={`h-16 rounded-xl animate-pulse ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}></div>
            </div>
        </div>
    );
};
