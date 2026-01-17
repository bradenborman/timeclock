import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import Login from './login';
import axios from 'axios';
import { Shift } from '../shiftView/shiftView';

interface User {
    userId: string;
    name: string;
    phoneNumber: string;
    email: string;
    physicalMailingAddress: string;
    yearVerified: number | null;
    hidden: boolean;
}

const Admin: React.FC = () => {
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [sendingEmailLoading, setSendingEmailLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [downloadingSpreadsheet, setDownloadingSpreadsheet] = useState(false);
    const [activeTab, setActiveTab] = useState<'shifts' | 'users'>('shifts');
    const [deleteShiftsDate, setDeleteShiftsDate] = useState<string>('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');



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

        axios.get(`/api/users/all`)
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
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
                alert('Email sent successfully!');
            })
            .catch(error => {
                console.error('Error sending email:', error);
                setSendingEmailLoading(false)
                alert('Error sending email');
            });
    }

    const downloadSpreadsheet = (): void => {
        setDownloadingSpreadsheet(true);
        axios.get(`/api/spreadsheet/download?date=${selectedDate}`, {
            responseType: 'blob'
        })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${selectedDate}-timesheet.xlsx`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                setDownloadingSpreadsheet(false);
            })
            .catch(error => {
                console.error('Error downloading spreadsheet:', error);
                setDownloadingSpreadsheet(false);
                alert('Error downloading spreadsheet');
            });
    }

    const handleDeleteUser = (userId: string, userName: string): void => {
        const isConfirmed = window.confirm(`Are you sure you want to delete/hide ${userName}? If they have shift history, they will be hidden instead of deleted.`);
        if (isConfirmed) {
            axios.delete(`/api/user/${userId}`)
                .then(response => {
                    const result = response.data;
                    alert(result.reason);
                    // Refresh users list
                    axios.get(`/api/users/all`)
                        .then(response => {
                            setUsers(response.data);
                        })
                        .catch(error => {
                            console.error('Error fetching users:', error);
                        });
                })
                .catch(error => {
                    console.error('Error deleting user:', error);
                    alert('Error deleting user');
                });
        }
    };

    const handleUnhideUser = (userId: string, userName: string): void => {
        const isConfirmed = window.confirm(`Unhide ${userName}?`);
        if (isConfirmed) {
            axios.post(`/api/user/${userId}/unhide`)
                .then(() => {
                    // Refresh users list
                    axios.get(`/api/users/all`)
                        .then(response => {
                            setUsers(response.data);
                        })
                        .catch(error => {
                            console.error('Error fetching users:', error);
                        });
                })
                .catch(error => {
                    console.error('Error unhiding user:', error);
                    alert('Error unhiding user');
                });
        }
    };

    const handleDeleteShiftsClick = (): void => {
        if (!deleteShiftsDate) {
            alert('Please select a date');
            return;
        }
        setShowDeleteModal(true);
        setDeleteConfirmation('');
    };

    const handleDeleteShiftsConfirm = (): void => {
        if (deleteConfirmation.toLowerCase() !== 'delete') {
            alert('You must type "delete" to confirm');
            return;
        }

        axios.delete(`/api/shifts/prior-to?date=${deleteShiftsDate}&confirmation=${deleteConfirmation}`)
            .then(response => {
                const result = response.data;
                alert(result.message);
                setShowDeleteModal(false);
                setDeleteShiftsDate('');
                setDeleteConfirmation('');
                // Refresh shifts list
                axios.get(`/api/shifts`)
                    .then(response => {
                        setShifts(response.data);
                    })
                    .catch(error => {
                        console.error('Error fetching shifts:', error);
                    });
            })
            .catch(error => {
                console.error('Error deleting shifts:', error);
                alert('Error deleting shifts: ' + (error.response?.data?.error || error.message));
            });
    };


    return (
        <div className="bg-gray-50 min-h-screen">
            <Link 
                to="/" 
                className="absolute top-6 left-6 bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center z-10 border border-gray-200"
            >
                <span className="mr-2">←</span> Return Home
            </Link>
            
            {!isAuthenticated ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="bg-white p-10 rounded-2xl shadow-2xl animate-fade-in border border-gray-100">
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
                    <div className="container mx-auto w-full max-w-6xl bg-white shadow-2xl rounded-2xl overflow-hidden animate-fade-in border border-gray-100" style={{ maxHeight: '85vh' }}>
                        <div className="bg-blue-600 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-white flex items-center">
                                        <span className="text-4xl mr-3">👤</span>
                                        Admin Panel
                                    </h1>
                                    <p className="text-blue-100 mt-1">Manage shifts, users, and send reports</p>
                                </div>
                                <button
                                    className={`bg-white hover:bg-gray-50 text-blue-600 font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center ${
                                        sendingEmailLoading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    onClick={e => triggerEmail()}
                                    disabled={sendingEmailLoading}
                                >
                                    {sendingEmailLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                            
                            {/* Download Spreadsheet Section */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-3 flex-1">
                                    <span className="text-white font-semibold">📊 Download Spreadsheet:</span>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="px-4 py-2 rounded-lg border-2 border-white/20 bg-white/90 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-white"
                                    />
                                </div>
                                <button
                                    onClick={downloadSpreadsheet}
                                    disabled={downloadingSpreadsheet}
                                    className={`bg-white hover:bg-gray-50 text-blue-600 font-bold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center ${
                                        downloadingSpreadsheet ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {downloadingSpreadsheet ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Downloading...
                                        </>
                                    ) : (
                                        <>
                                            <span className="mr-2">⬇️</span>
                                            Download
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Delete Shifts Section */}
                            <div className="bg-red-500/20 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4 mb-4 border-2 border-red-400/30">
                                <div className="flex items-center gap-3 flex-1">
                                    <span className="text-white font-semibold">🗑️ Delete All Shifts Prior To:</span>
                                    <input
                                        type="date"
                                        value={deleteShiftsDate}
                                        onChange={(e) => setDeleteShiftsDate(e.target.value)}
                                        className="px-4 py-2 rounded-lg border-2 border-red-300/50 bg-white/90 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-300"
                                    />
                                </div>
                                <button
                                    onClick={handleDeleteShiftsClick}
                                    disabled={!deleteShiftsDate}
                                    className={`bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center ${
                                        !deleteShiftsDate ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    <span className="mr-2">⚠️</span>
                                    Delete Shifts
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setActiveTab('shifts')}
                                    className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                                        activeTab === 'shifts'
                                            ? 'bg-white text-blue-600 shadow-md'
                                            : 'bg-white/20 text-white hover:bg-white/30'
                                    }`}
                                >
                                    📋 Shifts
                                </button>
                                <button
                                    onClick={() => setActiveTab('users')}
                                    className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                                        activeTab === 'users'
                                            ? 'bg-white text-blue-600 shadow-md'
                                            : 'bg-white/20 text-white hover:bg-white/30'
                                    }`}
                                >
                                    👥 Users ({users.length})
                                </button>
                            </div>
                        </div>
                        
                        <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(85vh - 180px)' }}>
                            {activeTab === 'shifts' ? (
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
                                                className={`border-b border-gray-200 hover:bg-blue-50 transition-colors duration-150 ${
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
                                                            className="w-full border-2 border-blue-500 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
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
                                                            className="w-full border-2 border-blue-500 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                                            style={{ maxWidth: 85 }}
                                                        />
                                                    ) : (
                                                        <span className="text-gray-700">{shift.clockOut}</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 font-semibold text-blue-600">{shift.timeWorked}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2">
                                                        {shift.isEditing ? (
                                                            <>
                                                                <button
                                                                    onClick={() => saveShift(shift.shiftId)}
                                                                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
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
                                                                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                                                >
                                                                    ✏️ Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(shift.shiftId)}
                                                                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
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
                            ) : (
                                <table className="table-auto w-full text-left">
                                    <thead className="sticky top-0 bg-gray-100 z-10">
                                        <tr className="border-b-2 border-gray-300">
                                            <th className="px-4 py-3 font-semibold text-gray-700">Name</th>
                                            <th className="px-4 py-3 font-semibold text-gray-700">Email</th>
                                            <th className="px-4 py-3 font-semibold text-gray-700">Phone</th>
                                            <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
                                            <th className="px-4 py-3 font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user, index) => (
                                            <tr 
                                                key={user.userId} 
                                                className={`border-b border-gray-200 hover:bg-blue-50 transition-colors duration-150 ${
                                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                                } ${user.hidden ? 'opacity-60' : ''}`}
                                            >
                                                <td className="px-4 py-3 font-medium text-gray-800">
                                                    {user.name}
                                                    {user.hidden && <span className="ml-2 text-xs bg-gray-400 text-white px-2 py-1 rounded">Hidden</span>}
                                                </td>
                                                <td className="px-4 py-3 text-gray-700">{user.email}</td>
                                                <td className="px-4 py-3 text-gray-700">{user.phoneNumber}</td>
                                                <td className="px-4 py-3">
                                                    {user.hidden ? (
                                                        <span className="text-red-600 font-semibold">🚫 Hidden</span>
                                                    ) : (
                                                        <span className="text-green-600 font-semibold">✓ Active</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {user.hidden ? (
                                                        <button
                                                            onClick={() => handleUnhideUser(user.userId, user.name)}
                                                            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                                        >
                                                            👁️ Unhide
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleDeleteUser(user.userId, user.name)}
                                                            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                                        >
                                                            🗑️ Delete
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fade-in">
                        <div className="text-center mb-6">
                            <div className="text-6xl mb-4">⚠️</div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirm Deletion</h2>
                            <p className="text-gray-600 mb-4">
                                This will permanently delete <span className="font-bold text-red-600">ALL shifts</span> with a clock-in date prior to:
                            </p>
                            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-4">
                                <p className="text-xl font-bold text-red-700">
                                    {new Date(deleteShiftsDate).toLocaleDateString('en-US', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}
                                </p>
                            </div>
                            <p className="text-sm text-gray-700 mb-4">
                                This action <span className="font-bold text-red-600">CANNOT BE UNDONE</span>. All shift records before this date will be permanently removed from the database.
                            </p>
                        </div>
                        
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Type <span className="font-mono bg-gray-100 px-2 py-1 rounded text-red-600">delete</span> to confirm:
                            </label>
                            <input
                                type="text"
                                value={deleteConfirmation}
                                onChange={(e) => setDeleteConfirmation(e.target.value)}
                                placeholder="Type 'delete' here"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg"
                                autoFocus
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeleteConfirmation('');
                                }}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteShiftsConfirm}
                                disabled={deleteConfirmation.toLowerCase() !== 'delete'}
                                className={`flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 ${
                                    deleteConfirmation.toLowerCase() !== 'delete' ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                Delete Shifts
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
