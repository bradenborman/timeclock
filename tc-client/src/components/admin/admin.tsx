import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Login from './login';
import AdminHeader from './AdminHeader';
import SpreadsheetDownload from './SpreadsheetDownload';
import DeleteShiftsSection from './DeleteShiftsSection';
import TabNavigation from './TabNavigation';
import ShiftsTable from './ShiftsTable';
import UsersTable from './UsersTable';
import DeleteConfirmationModal from './DeleteConfirmationModal';
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

    const [password, setPassword] = useState('cherry');
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
    const [deleteShiftCount, setDeleteShiftCount] = useState<number>(0);



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
                if (error.response?.status === 404) {
                    alert('No shifts found for this date');
                } else {
                    alert('Error downloading spreadsheet');
                }
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
        
        // Get count of shifts that will be deleted
        axios.get(`/api/shifts/prior-to/count?date=${deleteShiftsDate}`)
            .then(response => {
                const count = response.data.count;
                if (count === 0) {
                    alert('No shifts found prior to this date');
                    return;
                }
                // Show modal with count
                setDeleteShiftCount(count);
                setDeleteConfirmation('');
                setShowDeleteModal(true);
            })
            .catch(error => {
                console.error('Error getting shift count:', error);
                alert('Error checking shift count');
            });
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
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                    <div className="container mx-auto max-w-7xl">
                        {/* Dashboard Header */}
                        <div className="mb-6">
                            <AdminHeader 
                                sendingEmailLoading={sendingEmailLoading}
                                onSendEmail={triggerEmail}
                            />
                        </div>

                        {/* Dashboard Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            {/* Spreadsheet Download Card */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-200">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                    <span className="text-2xl mr-2">📊</span>
                                    Download Spreadsheet
                                </h3>
                                <SpreadsheetDownload
                                    selectedDate={selectedDate}
                                    onDateChange={setSelectedDate}
                                    onDownload={downloadSpreadsheet}
                                    downloading={downloadingSpreadsheet}
                                />
                            </div>

                            {/* Delete Shifts Card */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-200 hover:shadow-xl transition-shadow duration-200">
                                <h3 className="text-lg font-bold text-red-700 mb-4 flex items-center">
                                    <span className="text-2xl mr-2">⚠️</span>
                                    Bulk Delete Shifts
                                </h3>
                                <DeleteShiftsSection
                                    deleteShiftsDate={deleteShiftsDate}
                                    onDateChange={setDeleteShiftsDate}
                                    onDeleteClick={handleDeleteShiftsClick}
                                />
                            </div>
                        </div>

                        {/* Main Content Card */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                                <TabNavigation
                                    activeTab={activeTab}
                                    userCount={users.length}
                                    onTabChange={setActiveTab}
                                />
                            </div>
                            
                            <div className="overflow-y-auto p-6" style={{ maxHeight: '600px' }}>
                                {activeTab === 'shifts' ? (
                                    <ShiftsTable
                                        shifts={shifts}
                                        onEdit={toggleEdit}
                                        onDelete={handleDelete}
                                        onSave={saveShift}
                                        onCancel={() => navigate(0)}
                                        onClockInChange={updateClockIn}
                                        onClockOutChange={updateClockOut}
                                    />
                                ) : (
                                    <UsersTable
                                        users={users}
                                        onDeleteUser={handleDeleteUser}
                                        onUnhideUser={handleUnhideUser}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                deleteShiftsDate={deleteShiftsDate}
                deleteConfirmation={deleteConfirmation}
                shiftCount={deleteShiftCount}
                onConfirmationChange={setDeleteConfirmation}
                onCancel={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmation('');
                }}
                onConfirm={handleDeleteShiftsConfirm}
            />
        </div>
    );
};

export default Admin;
