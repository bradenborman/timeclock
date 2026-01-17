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

    const [sendingEmailLoading, setSendingEmailLoading] = useState(false);



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
        
        axios.post('/api/admin/validate', { password })
            .then(response => {
                if (response.data.valid) {
                    setIsAuthenticated(true);
                } else {
                    alert('Invalid password');
                    setPassword('');
                }
            })
            .catch(error => {
                console.error('Error validating password:', error);
                alert('Error validating password');
            });
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

    const triggerEmail = (): void => {
        setSendingEmailLoading(true)
        axios.get('/api/email/send')
            .then(response => {
                setSendingEmailLoading(false)
            })
            .catch(error => {
                console.error('Error updating shift:', error);
            });
    }


    return (
        <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 min-h-screen">
            <Link 
                to="/" 
                className="absolute top-6 left-6 bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center z-10"
            >
                <span className="mr-2">←</span> Return Home
            </Link>
            
            {!isAuthenticated ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="bg-white p-10 rounded-2xl shadow-2xl animate-fade-in">
                        <div className="text-center mb-8">
                            <div className="text-6xl mb-4">🔐</div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Admin Access</h2>
                            <p className="text-gray-600">Enter password to continue</p>
                        </div>
                        <Login
                            password={password}
                            setPassword={setPassword}
                            handlePasswordSubmit={handlePasswordSubmit}
                        />
                    </div>
                </div>
            ) : (
                <div className="flex justify-center items-center min-h-screen p-6">
                    <div className="container mx-auto w-full max-w-6xl bg-white shadow-2xl rounded-2xl overflow-hidden animate-fade-in" style={{ maxHeight: '85vh' }}>
                        <div className="bg-gradient-to-r from-candy-purple to-candy-blue p-6 flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-white flex items-center">
                                    <span className="text-4xl mr-3">👤</span>
                                    Admin Panel
                                </h1>
                                <p className="text-white/80 mt-1">Manage shifts and send reports</p>
                            </div>
                            <button
                                className={`bg-white hover:bg-gray-50 text-candy-purple font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center ${
                                    sendingEmailLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                onClick={e => triggerEmail()}
                                disabled={sendingEmailLoading}
                            >
                                {sendingEmailLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-candy-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <span className="text-xl mr-2">📧</span>
                                        Send Email Report
                                    </>
                                )}
                            </button>
                        </div>
                        
                        <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(85vh - 120px)' }}>
                            <table className="table-auto w-full text-left">
                                <thead className="sticky top-0 bg-gray-100 z-10">
                                    <tr className="border-b-2 border-gray-300">
                                        <th className="px-4 py-3 font-semibold text-gray-700">Name</th>
                                        <th className="px-4 py-3 font-semibold text-gray-700">Clock In</th>
                                        <th className="px-4 py-3 font-semibold text-gray-700">Clock Out</th>
                                        <th className="px-4 py-3 font-semibold text-gray-700">Time Worked</th>
                                        <th className="px-4 py-3 font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shifts.map((shift, index) => (
                                        <tr 
                                            key={shift.shiftId} 
                                            className={`border-b border-gray-200 hover:bg-purple-50 transition-colors duration-150 ${
                                                index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                            }`}
                                        >
                                            <td className="px-4 py-3 font-medium text-gray-800">{shift.name}</td>
                                            <td className="px-4 py-3">
                                                {shift.isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={shift.clockIn}
                                                        onChange={(e) => updateClockIn(shift.shiftId, e.target.value)}
                                                        className="w-full border-2 border-candy-purple rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-candy-purple/20"
                                                        style={{ maxWidth: 85 }}
                                                    />
                                                ) : (
                                                    <span className="text-gray-700">{shift.clockIn}</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                {shift.isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={shift.clockOut}
                                                        onChange={(e) => updateClockOut(shift.shiftId, e.target.value)}
                                                        className="w-full border-2 border-candy-purple rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-candy-purple/20"
                                                        style={{ maxWidth: 85 }}
                                                    />
                                                ) : (
                                                    <span className="text-gray-700">{shift.clockOut}</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-candy-purple">{shift.timeWorked}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    {shift.isEditing ? (
                                                        <>
                                                            <button
                                                                onClick={() => saveShift(shift.shiftId)}
                                                                className="bg-gradient-to-r from-candy-mint to-green-400 hover:from-green-400 hover:to-candy-mint text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                                            >
                                                                ✓ Save
                                                            </button>
                                                            <button
                                                                onClick={() => navigate(0)}
                                                                className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                                            >
                                                                ✕ Cancel
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => toggleEdit(shift.shiftId)}
                                                                className="bg-candy-yellow hover:bg-yellow-400 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                                            >
                                                                ✏️ Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(shift.shiftId)}
                                                                className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                                            >
                                                                🗑️ Delete
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
