import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

import Toast from '../../components/toast/toast';

interface Shift {
    shiftId: number;
    userId: number;
    name: string;
    clockIn: string;
    clockOut: string;
    timeWorked?: string;  // Optional property for time worked
    isLoading?: boolean;
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
        axios.get(`/api/shifts?date=${new Date().toISOString().split('T')[0]}`)
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


    const handleRowDelete = (shiftId: number) => {
        if (confirm("Do you really want to delete this row? You cannot undo this action.")) {
            axios.delete(`/api/shift/${shiftId}`)
                .then(response => {
                    const updatedShifts = shifts.filter(shift => shift.shiftId !== shiftId);
                    setShifts(updatedShifts);
                })
                .catch(error => {
                    console.error("There was an error deleting the row", error);
                });
        }
    }


    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="flex h-screen">
            {newestUser != undefined ? (<Toast message={newestUser + " has started a shift!"} />) : null}
            <div className="bg-gray-800 text-white w-72 p-6 fixed h-full">
                <h3 className="text-xl font-semibold fancy-text">The Candy Factory Timesheet</h3>
                <div className="mb-3">
                    <h2 className="text-md font-bold">{today}</h2>
                </div>
                <hr />
                <ul className="mt-5">
                    <li className='mt-8'>
                        <Link to="/start-shift" className="text-5xl text-indigo-200 hover:text-indigo-100 font-bold">
                            Start Shift
                        </Link>
                    </li>
                    <li className='mt-4'>
                        <Link to="/note" className="text-md text-indigo-200 hover:text-indigo-100">
                            📝 Leave a Note
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="flex-1 ml-72 p-6 overflow-auto">
                <div className="overflow-x-auto">
                    <table className="table-auto w-full text-2xl">
                        <thead className="sticky top-0 bg-white">
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2 w-3/5 text-left">Name</th>
                                <th className="px-4 py-2 min-w-[150px] w-[10%]">Time In</th>
                                <th className="px-4 py-2 min-w-[150px] w-[10%]">Time Out</th>
                                <th className="px-4 py-2 min-w-[150px] w-[10%] text-xl">⏱ Worked</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shifts.map((shift) => (
                                <tr key={shift.shiftId} className="text-center border-b border-gray-200 shift-row">
                                    <td className="px-4 py-3 text-left">
                                        {shift.name}
                                        {shift.clockOut && ( // Only display this when shift.clockOut is set
                                            <span className="float-right badge border border-red-500 bg-white text-black p-1 rounded text-xxs cursor-pointer" onDoubleClick={() => handleRowDelete(shift.shiftId)} style={{ lineHeight: '1', padding: '0.25rem 0.5rem' }}>
                                                Double-click to remove row
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2">{shift.clockIn}</td>
                                    <td className="px-4 py-2">
                                        {shift.clockIn && !shift.clockOut ? ( // Check if clockIn is set and clockOut is not
                                            <button
                                                onClick={() => handleClockOut(shift.shiftId)}
                                                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm ${shift.isLoading ? 'opacity-50' : ''}`}
                                                disabled={shift.isLoading}
                                            >
                                                {shift.isLoading ? 'Submitting...' : 'Clock Out'}
                                            </button>
                                        ) : (
                                            shift.clockOut || '—'
                                        )}
                                    </td>
                                    <td className="px-4 py-2">{shift.timeWorked || '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ShiftView;
