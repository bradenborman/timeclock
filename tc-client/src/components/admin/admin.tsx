import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import Login from './login';
import axios from 'axios';
import { Shift } from '../shiftView/shiftView';

const Admin: React.FC = () => {
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [shifts, setShifts] = useState<Shift[]>([]);

    useEffect(() => {
        setIsAuthenticated(false);

        axios.get(`/api/shifts`)
            .then(response => {
                console.log(response.data)
                setShifts(response.data);
            })
            .catch(error => {
                console.error('Error fetching shifts:', error);
            })

    }, []);

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'cherry') {
            setIsAuthenticated(true);
        }
    };

    const handleDelete = (shiftId: number) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this shift?");
        if (isConfirmed) {
            axios.delete(`/api/shift/${shiftId}`)
                .then(response => {
                    setShifts(prevShifts => prevShifts.filter(shift => shift.shiftId !== shiftId));
                    console.log('Shift deleted successfully');
                })
                .catch(error => {
                    console.error('There was an error deleting the shift:', error);
                });
        }
    };

    const toggleEdit = (shiftId: number) => {
        setShifts(shifts.map(shift => {
            if (shift.shiftId === shiftId) {
                return { ...shift, isEditing: !shift.isEditing };
            }
            return shift;
        }));
    };

    const updateClockIn = (shiftId: number, newClockIn: string) => {
        setShifts(shifts.map(shift => {
            if (shift.shiftId === shiftId) {
                return { ...shift, clockIn: newClockIn };
            }
            return shift;
        }));
    };

    const updateClockOut = (shiftId: number, newClockOut: string) => {
        setShifts(shifts.map(shift => {
            if (shift.shiftId === shiftId) {
                return { ...shift, clockOut: newClockOut };
            }
            return shift;
        }));
    };
    const saveShift = (shiftId: number) => {
        const shift = shifts.find(s => s.shiftId === shiftId);
        if (shift) {
            axios.put('/api/shift', shift)
                .then(response => {
                    const updatedTimeWorked = response.data;
                    setShifts(shifts.map(s => {
                        if (s.shiftId === shiftId) {
                            return { ...s, timeWorked: updatedTimeWorked, isEditing: false };
                        }
                        return s;
                    }));
                })
                .catch(error => {
                    console.error('Error updating shift:', error);
                });
        }
    };


    return (
        <div className="bg-gray-100 min-h-screen">
            <Link to="/" className="absolute top-4 left-4 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded">
                Return Home
            </Link>
            {!isAuthenticated ? (
                <div className="flex justify-center items-center h-screen">
                    <Login
                        password={password}
                        setPassword={setPassword}
                        handlePasswordSubmit={handlePasswordSubmit}
                    />
                </div>
            ) : (
                <div className="flex justify-center items-center min-h-screen">
                    <div className="container mx-auto p-5 w-full max-w-4xl bg-white shadow-lg rounded" style={{ maxHeight: '700px', overflowY: 'auto' }}>
                        <table className="table-auto w-full text-left">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="px-4 py-2">Name</th>
                                    <th className="px-4 py-2">Clock In</th>
                                    <th className="px-4 py-2">Clock Out</th>
                                    <th className="px-4 py-2">Time Worked</th>
                                    <th className="px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shifts.map((shift, index) => (
                                    <tr key={shift.shiftId} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                                        <td className="border px-4 py-2">{shift.name}</td>
                                        <td className="border px-4 py-2">
                                            {shift.isEditing ? (
                                                <input
                                                    type="text"
                                                    value={shift.clockIn}
                                                    onChange={(e) => updateClockIn(shift.shiftId, e.target.value)}
                                                    className="w-full border-2 border-blue-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                    style={{ maxWidth: 85, paddingLeft: 5 }}
                                                />
                                            ) : (
                                                shift.clockIn
                                            )}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {shift.isEditing ? (
                                                <input
                                                    type="text"
                                                    value={shift.clockOut}
                                                    onChange={(e) => updateClockOut(shift.shiftId, e.target.value)}
                                                    className="w-full border-2 border-blue-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                    style={{ maxWidth: 85, paddingLeft: 5 }}
                                                />
                                            ) : (
                                                shift.clockOut
                                            )}
                                        </td>
                                        <td className="border px-4 py-2">{shift.timeWorked}</td>
                                        <td className="border px-4 py-2 flex justify-start items-center space-x-2">
                                            {shift.isEditing ? (
                                                <>
                                                    <button
                                                        onClick={() => saveShift(shift.shiftId)}
                                                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(0)}
                                                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded"
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => toggleEdit(shift.shiftId)}
                                                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(shift.shiftId)}
                                                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )
            }
        </div >
    );
};

export default Admin;
