import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Shift {
    shiftId: number;
    userId: number;
    userName: string;
    clockIn: string;
    clockOut: string;
    isLoading?: boolean; // Add loading state to each shift
}

let mockShifts: Shift[] = [];

for (var i = 1; i <= 5; i++) {
    mockShifts.push({
        shiftId: i,
        userId: i,
        userName: 'Employee ' + i,
        clockIn: '9:00 AM',
        clockOut: ''
    });
}

mockShifts.push({
    shiftId: 56,
    userId: 5,
    userName: 'Employee ' + 5,
    clockIn: '9:00 AM',
    clockOut: ''
});

const ShiftView: React.FC = () => {
    const [shifts, setShifts] = useState<Shift[]>(mockShifts);

    const handleClockOut = (shiftId: number) => {
        const updatedShifts = shifts.map(shift => {
            if (shift.shiftId === shiftId) {  // Check against shiftId instead of userId
                return { ...shift, isLoading: true };
            }
            return shift;
        });

        setShifts(updatedShifts);

        setTimeout(() => {
            const newShifts = shifts.map(shift => {
                if (shift.shiftId === shiftId) {
                    const currentTime = new Date().toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                    });
                    return { ...shift, clockOut: currentTime, isLoading: false };
                }
                return shift;
            });

            setShifts(newShifts);
        }, 300);
    };


    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="bg-gray-800 text-white w-72 p-6 fixed h-full">
                <h3 className="text-xl font-semibold fancy-text">The Candy Factory Timesheet</h3>
                <div className="mb-3">
                    <h2 className="text-xl font-bold">{today}</h2>
                </div>
                <hr />
                <ul className="mt-5">
                    <li className='my-3'>
                        <Link to="/start-shift" className="text-4xl text-indigo-200 hover:text-indigo-100">
                            Start Shift
                        </Link>
                    </li>
                    <li className='mt-10'>
                        <Link to="/note" className="text-xl text-indigo-200 hover:text-indigo-100">
                            Leave a Note
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 ml-72 p-6 overflow-auto">
                <div className="overflow-x-auto">
                    <table className="table-auto w-full text-2xl">
                        <thead className="sticky top-0 bg-white">
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2 w-3/5 text-left">Name</th>
                                <th className="px-4 py-2 min-w-[100px] w-[10%]">Time In</th>
                                <th className="px-4 py-2 min-w-[100px] w-[10%]">Time Out</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shifts.map((shift) => (
                                <tr key={shift.userId} className="text-center border-b border-gray-200">
                                    <td className="px-4 py-3 text-left">{shift.userName}</td>
                                    <td className="px-4 py-2">{shift.clockIn}</td>
                                    <td className="px-4 py-2">
                                        {shift.clockIn && !shift.clockOut ? (
                                            <button
                                                onClick={() => handleClockOut(shift.shiftId)}  // Pass shiftId to the handler
                                                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm ${shift.isLoading ? 'opacity-50' : ''}`}
                                                disabled={shift.isLoading}
                                            >
                                                {shift.isLoading ? 'Submitting...' : 'Clock Out'}
                                            </button>
                                        ) : (
                                            shift.clockOut || '—'
                                        )}
                                    </td>
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
