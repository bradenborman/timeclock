import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Shift {
    shiftId: number;
    userId: number;
    userName: string;
    clockIn: string;
    clockOut: string;
    timeWorked?: string;  // Optional property for time worked
    isLoading?: boolean;
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
                    <h2 className="text-md font-bold">{today}</h2>
                </div>
                <hr />
                <ul className="mt-5">
                    <li className='mt-8'>
                        <Link to="/start-shift" className="text-4xl text-indigo-200 hover:text-indigo-100 font-bold">
                            Start Shift
                        </Link>
                    </li>
                    <li className='mt-4'>
                        <Link to="/note" className="text-md text-indigo-200 hover:text-indigo-100">
                            📝 Leave a Note
                        </Link>
                    </li>
                    {/* <li className='mt-1'>
                        <span className="text-sm text-indigo-200 hover:text-indigo-100">
                            Need to delete a row? (Hover me)
                        </span>
                    </li> */}
                </ul>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 ml-72 p-6 overflow-auto">
                <div className="overflow-x-auto">
                    <table className="table-auto w-full text-2xl">
                        <thead className="sticky top-0 bg-white">
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2 w-3/5 text-left">Name
                                    {/* <small className='text-xs'>(Double click row to show delete option)</small> */}
                                </th>
                                <th className="px-4 py-2 min-w-[150px] w-[10%]">Time In</th>
                                <th className="px-4 py-2 min-w-[150px] w-[10%]">Time Out</th>
                                <th className="px-4 py-2 min-w-[150px] w-[10%] text-xl">⏱ Worked</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shifts.map((shift) => (
                                <tr key={shift.shiftId} className="text-center border-b border-gray-200">
                                    <td className="px-4 py-3 text-left">{shift.userName}</td>
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
