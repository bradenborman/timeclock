import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

import Toast from '../../components/toast/toast';
import DarkModeToggle from '../darkModeToggle/DarkModeToggle';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { TableSkeleton } from '../skeleton/Skeleton';

export interface Shift {
    shiftId: number;
    userId: number;
    name: string;
    clockIn: string;
    clockOut: string;
    timeWorked?: string;  // Optional property for time worked
    isLoading?: boolean;
    isEditing?: boolean;
}

const ShiftView: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    let { newestUser } = location.state || {};

    const [shifts, setShifts] = useState<Shift[]>([]);
    const [hideCompleted, setHideCompleted] = useState<boolean>(() => {
        const saved = localStorage.getItem('hideCompleted');
        return saved === 'true';
    });
    const [clockOutMessage, setClockOutMessage] = useState<string>('');
    const [isLoadingShifts, setIsLoadingShifts] = useState<boolean>(true);
    const { isDarkMode } = useDarkMode();

    // Save hideCompleted preference to localStorage
    useEffect(() => {
        localStorage.setItem('hideCompleted', hideCompleted.toString());
    }, [hideCompleted]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const { newestUser, ...restState } = location.state || {};
            if (newestUser) {
                navigate(location.pathname, { state: { ...restState }, replace: true });
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, [location, navigate]);

    // Clear clock out message after showing
    useEffect(() => {
        if (clockOutMessage) {
            const timer = setTimeout(() => {
                setClockOutMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [clockOutMessage]);


    useEffect(() => {
        setIsLoadingShifts(true);
        axios.get(`/api/shifts`)
            .then(response => {
                console.log(response.data)
                setShifts(response.data);
                setIsLoadingShifts(false);
            })
            .catch(error => {
                console.error('Error fetching shifts:', error);
                setIsLoadingShifts(false);
            })

    }, []);

    const handleClockOut = (shiftId: number) => {
        // Find the shift that matches the shiftId
        const shiftIndex = shifts.findIndex(s => s.shiftId === shiftId);
        if (shiftIndex === -1) {
            console.error('Shift not found');
            return;
        }

        // Capture the current time
        const currentTime = new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });

        // Create an updated shift object with the current time as clockOut and isLoading as true
        const updatedShift = {
            ...shifts[shiftIndex],
            clockOut: currentTime,
            isLoading: true
        };

        // Update the state to show the shift as loading and set the clockOut time
        setShifts(shifts.map((s, index) => index === shiftIndex ? updatedShift : s));

        // Post the updated shift to the server
        axios.post('/api/clockout', updatedShift)
            .then(response => {
                // Update the specific shift with the response data and set isLoading to false
                const newShifts = shifts.map((s, index) => {
                    if (index === shiftIndex) {
                        return { ...s, clockOut: currentTime, isLoading: false, timeWorked: response.data };
                    }
                    return s;
                });

                setShifts(newShifts);
                
                // Show success toast with name and hours worked
                setClockOutMessage(`${updatedShift.name} clocked out! Worked ${response.data}`);
            })
            .catch(error => {
                console.error('Error clocking out:', error);
                // If there's an error, update the shift to remove the loading state but keep the clockOut time
                setShifts(shifts.map((s, index) => index === shiftIndex ? { ...s, isLoading: false } : s));
            });
    };

    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Filter shifts based on hideCompleted state
    const displayedShifts = hideCompleted 
        ? shifts.filter(s => !s.clockOut) 
        : shifts;

    return (
        <div className={`flex h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 to-blue-50'}`}>
            {newestUser != undefined ? (<Toast message={newestUser + " has started a shift!"} />) : null}
            {clockOutMessage && <Toast message={clockOutMessage} />}
            
            {/* Modern Sidebar */}
            <div className={`w-80 p-8 fixed h-full shadow-xl border-r flex flex-col ${
                isDarkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-100'
            }`}>
                <div className="mb-10 text-center">
                    <div className="text-5xl mb-3">🍬</div>
                    <h3 className={`text-3xl font-bold fancy-text mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>The Candy Factory</h3>
                    <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Timesheet</p>
                </div>
                
                <div className={`mb-8 rounded-2xl p-4 border ${
                    isDarkMode 
                        ? 'bg-gradient-to-r from-blue-900 to-blue-800 border-blue-700' 
                        : 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200'
                }`}>
                    <div className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Today's Date</div>
                    <h2 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{today}</h2>
                </div>
                
                <nav className="space-y-3 mb-8">
                    <Link 
                        to="/start-shift" 
                        className={`group flex items-center rounded-2xl p-5 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] ${
                            isDarkMode
                                ? 'bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white'
                                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                        }`}
                    >
                        <div className="flex-1">
                            <div className="text-3xl font-bold mb-1">Start Shift</div>
                            <div className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-100'}`}>Clock in for today</div>
                        </div>
                        <span className="text-3xl transform group-hover:translate-x-1 transition-transform duration-200">▶</span>
                    </Link>
                    
                    <Link 
                        to="/admin" 
                        className={`group flex items-center rounded-2xl p-4 transition-all duration-200 hover:shadow-md border-2 ${
                            isDarkMode
                                ? 'bg-gray-700 hover:bg-gray-600 border-gray-600 hover:border-blue-500'
                                : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-blue-300'
                        }`}
                    >
                        <span className="text-3xl mr-4">👤</span>
                        <div className="flex-1">
                            <div className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Admin Panel</div>
                            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Manage shifts</div>
                        </div>
                        <span className={`transform group-hover:translate-x-1 transition-transform duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>→</span>
                    </Link>
                </nav>
                
                {/* Stats in Sidebar */}
                {shifts.length > 0 && (
                    <div className="mt-auto space-y-1.5">
                        <div className={`text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>TODAY'S STATS</div>
                        <div className={`flex items-center justify-between py-1.5 px-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Employees</span>
                            <span className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{shifts.length}</span>
                        </div>
                        <div className={`flex items-center justify-between py-1.5 px-3 rounded-lg ${isDarkMode ? 'bg-green-900/30' : 'bg-green-50'}`}>
                            <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Currently Working</span>
                            <span className={`text-base font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                                {shifts.filter(s => s.clockIn && !s.clockOut).length}
                            </span>
                        </div>
                        <div className={`flex items-center justify-between py-1.5 px-3 rounded-lg ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                            <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Clocked Out</span>
                            <span className={`text-base font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                {shifts.filter(s => s.clockOut).length}
                            </span>
                        </div>
                    </div>
                )}
                
                {/* Footer decoration */}
                <div className="mt-6">
                    <div className={`h-1 rounded-full ${
                        isDarkMode 
                            ? 'bg-gradient-to-r from-blue-800 via-blue-600 to-blue-800' 
                            : 'bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200'
                    }`}></div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 ml-80 p-8 overflow-auto">
                {/* Dark Mode Toggle - Top Right */}
                <div className="absolute top-6 right-6 z-10">
                    <DarkModeToggle />
                </div>
                
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Today's Shifts</h1>
                        
                        {/* Hide Completed Toggle */}
                        <button
                            onClick={() => setHideCompleted(!hideCompleted)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                                hideCompleted 
                                    ? isDarkMode
                                        ? 'bg-blue-700 text-white shadow-md hover:bg-blue-800'
                                        : 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                                    : isDarkMode
                                        ? 'bg-gray-700 text-gray-200 border-2 border-gray-600 hover:border-blue-500 hover:bg-gray-600'
                                        : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                            }`}
                        >
                            <span className="text-lg">{hideCompleted ? '👁️' : '👁️‍🗨️'}</span>
                            <span>{hideCompleted ? 'Show All' : 'Hide Completed'}</span>
                        </button>
                    </div>
                    
                    {/* Modern Table Card */}
                    {isLoadingShifts ? (
                        <TableSkeleton />
                    ) : (
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
                                    {displayedShifts.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-16 text-center">
                                                <div className="text-6xl mb-4">📋</div>
                                                <div className={`text-xl font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {hideCompleted && shifts.length > 0 
                                                        ? 'All shifts completed!' 
                                                        : 'No shifts yet today'}
                                                </div>
                                                <div className={`mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                    {hideCompleted && shifts.length > 0 
                                                        ? 'Everyone has clocked out' 
                                                        : 'Clock in to get started!'}
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        displayedShifts.map((shift, index) => (
                                            <tr 
                                                key={shift.shiftId} 
                                                className={`text-center border-b transition-all duration-150 ${
                                                    displayedShifts.length > 5 ? 'h-14' : 'h-20'
                                                } ${
                                                    isDarkMode
                                                        ? index % 2 === 0 
                                                            ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' 
                                                            : 'bg-gray-750 border-gray-700 hover:bg-gray-700'
                                                        : index % 2 === 0 
                                                            ? 'bg-white border-gray-100 hover:bg-blue-50' 
                                                            : 'bg-gray-50/50 border-gray-100 hover:bg-blue-50'
                                                }`}
                                            >
                                                <td className={`text-left ${displayedShifts.length > 5 ? 'px-4 py-2' : 'px-6 py-4'}`}>
                                                    <div className={`font-semibold ${displayedShifts.length > 5 ? 'text-base' : 'text-lg'} ${
                                                        isDarkMode ? 'text-white' : 'text-gray-800'
                                                    }`}>{shift.name}</div>
                                                </td>
                                                <td className={displayedShifts.length > 5 ? 'px-4 py-2' : 'px-6 py-4'}>
                                                    <span className={`inline-flex items-center ${displayedShifts.length > 5 ? 'px-3 py-1 text-sm' : 'px-4 py-2'} rounded-full font-medium ${
                                                        isDarkMode 
                                                            ? 'bg-green-900/40 text-green-300' 
                                                            : 'bg-green-100 text-green-700'
                                                    }`}>
                                                        {shift.clockIn}
                                                    </span>
                                                </td>
                                                <td className={displayedShifts.length > 5 ? 'px-4 py-2' : 'px-6 py-4'}>
                                                    {shift.clockIn && !shift.clockOut ? (
                                                        <button
                                                            onClick={() => handleClockOut(shift.shiftId)}
                                                            className={`text-white font-bold ${
                                                                displayedShifts.length > 5 ? 'py-2 px-4 text-sm' : 'py-3 px-6'
                                                            } rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 ${
                                                                shift.isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                                            } ${
                                                                isDarkMode
                                                                    ? 'bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900'
                                                                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                                                            }`}
                                                            disabled={shift.isLoading}
                                                        >
                                                            {shift.isLoading ? (
                                                                <span className="flex items-center">
                                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                    </svg>
                                                                    Clocking Out...
                                                                </span>
                                                            ) : (
                                                                '⏹ Clock Out'
                                                            )}
                                                        </button>
                                                    ) : (
                                                        <span className={`inline-flex items-center ${displayedShifts.length > 5 ? 'px-3 py-1 text-sm' : 'px-4 py-2'} rounded-full font-medium ${
                                                            isDarkMode 
                                                                ? 'bg-red-900/40 text-red-300' 
                                                                : 'bg-red-100 text-red-700'
                                                        }`}>
                                                            {shift.clockOut || '—'}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className={displayedShifts.length > 5 ? 'px-4 py-2' : 'px-6 py-4'}>
                                                    <span className={`inline-flex items-center ${displayedShifts.length > 5 ? 'px-3 py-1 text-base' : 'px-4 py-2 text-lg'} rounded-full font-bold ${
                                                        isDarkMode 
                                                            ? 'bg-blue-900/40 text-blue-300' 
                                                            : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                        {shift.timeWorked || '—'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShiftView;
