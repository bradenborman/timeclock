import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

import Toast from '../../components/toast/toast';

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

    useEffect(() => {
        const timer = setTimeout(() => {
            const { newestUser, ...restState } = location.state || {};
            if (newestUser) {
                navigate(location.pathname, { state: { ...restState }, replace: true });
            }
        }, 3000); 0
        return () => clearTimeout(timer);
    }, [location, navigate]);


    useEffect(() => {
        axios.get(`/api/shifts`)
            .then(response => {
                console.log(response.data)
                setShifts(response.data);
            })
            .catch(error => {
                console.error('Error fetching shifts:', error);
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
            })
            .catch(error => {
                console.error('Error clocking out:', error);
                // If there's an error, update the shift to remove the loading state but keep the clockOut time
                setShifts(shifts.map((s, index) => index === shiftIndex ? { ...s, isLoading: false } : s));
            });
    };

    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="flex h-screen bg-gray-50">
            {newestUser != undefined ? (<Toast message={newestUser + " has started a shift!"} />) : null}
            
            {/* Sidebar */}
            <div className="bg-gradient-to-b from-blue-600 to-blue-700 text-white w-72 p-6 fixed h-full shadow-2xl">
                <div className="mb-8 text-center">
                    <h3 className="text-2xl font-bold fancy-text mb-1">🍬 The Candy Factory</h3>
                    <p className="text-xl font-semibold text-blue-100">Timesheet</p>
                </div>
                <div className="mb-6 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <h2 className="text-sm font-semibold text-white/90">{today}</h2>
                </div>
                <div className="h-px bg-white/20 mb-6"></div>
                <nav className="space-y-4">
                    <Link 
                        to="/start-shift" 
                        className="block text-4xl font-bold text-white hover:text-blue-200 transition-all duration-300 hover:translate-x-2 transform"
                    >
                        ▶ Start Shift
                    </Link>
                    <Link 
                        to="/note" 
                        className="flex items-center text-lg text-white/90 hover:text-white hover:bg-white/10 rounded-lg p-3 transition-all duration-200"
                    >
                        <span className="text-2xl mr-3">📝</span>
                        <span>Leave a Note</span>
                    </Link>
                    <Link 
                        to="/admin" 
                        className="flex items-center text-lg text-white/90 hover:text-white hover:bg-white/10 rounded-lg p-3 transition-all duration-200"
                    >
                        <span className="text-2xl mr-3">👤</span>
                        <span>Admin Panel</span>
                    </Link>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-72 p-8 overflow-auto">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in">
                        <div className="overflow-x-auto">
                            <table className="table-auto w-full text-xl">
                                <thead className="sticky top-0 bg-blue-600 text-white">
                                    <tr>
                                        <th className="px-6 py-4 w-3/5 text-left font-semibold">Name</th>
                                        <th className="px-6 py-4 min-w-[120px] w-[10%] font-semibold">Time In</th>
                                        <th className="px-6 py-4 min-w-[120px] w-[10%] font-semibold">Time Out</th>
                                        <th className="px-6 py-4 min-w-[130px] w-[10%] text-lg font-semibold">⏱ Worked</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shifts.map((shift, index) => (
                                        <tr 
                                            key={shift.shiftId} 
                                            className={`text-center border-b border-gray-100 hover:bg-blue-50 transition-colors duration-150 h-20 ${
                                                index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                            }`}
                                        >
                                            <td className="px-6 py-4 text-left font-medium text-gray-800">
                                                {shift.name}
                                            </td>
                                            <td className="px-6 py-4 text-gray-700">{shift.clockIn}</td>
                                            <td className="px-6 py-4">
                                                {shift.clockIn && !shift.clockOut ? (
                                                    <button
                                                        onClick={() => handleClockOut(shift.shiftId)}
                                                        className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 ${
                                                            shift.isLoading ? 'opacity-50 cursor-not-allowed' : ''
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
                                                            'Clock Out'
                                                        )}
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-700">{shift.clockOut || '—'}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-blue-600">{shift.timeWorked || '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShiftView;
