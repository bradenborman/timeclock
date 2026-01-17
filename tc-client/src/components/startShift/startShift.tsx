import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

enum UserStatus {
    NOT_SET = 'NOT_SET',
    RETURNING = 'RETURNING',
    NEW = 'NEW',
}

export interface User {
    userId: string;
    name: string;
    phoneNumber: string;
    email: string;
    physicalMailingAddress: string;
}

const StartShift: React.FC = () => {
    const [userStatus, setUserStatus] = useState<UserStatus>(UserStatus.NOT_SET);
    const [employees, setEmployees] = useState<User[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    //NEW USER VARS 
    // Define state variables
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [physicalMailingAddress, setPhysicalMailingAddress] = useState('');


    useEffect(() => {
        axios.get('/api/users')
            .then(response => {
                console.log(response.data)
                setEmployees(response.data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    }, []);

    const handleUserStatusChange = (status: UserStatus) => {
        setUserStatus(status);
    };

    const handleNewUserSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        setIsLoading(true);

        const userData = {
            name,
            email,
            phoneNumber,
            physicalMailingAddress
        };

        axios.post('/api/user', userData)
            .then(response => {
                setIsLoading(false);
                navigate('/', {
                    state: {
                        newestUser: name,
                    }
                });
            })
            .catch(error => {
                setIsLoading(false);
                alert("ERROR Check console")
                console.error('There was an error!', error);
            });
    }


    const handleNewReturningSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        setIsLoading(true);

        axios.post('/api/clockin', null, {
            params: {
                userId: selectedEmployee,
            }
        })
            .then(() => {
                setIsLoading(false);
                const name: string = employees.find(employee => employee.userId === selectedEmployee)?.name || "New Employee";
                navigate('/', {
                    state: {
                        newestUser: name,
                    }
                });
            })
            .catch((error) => {
                console.error('There was an error clocking in:', error);
                setIsLoading(false);
            })
    };

    return (
        <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 min-h-screen flex justify-center items-center p-4">
            <Link 
                to="/" 
                className="absolute top-6 left-6 bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center"
            >
                <span className="mr-2">←</span> Return Home
            </Link>
            
            <div className="container mx-auto p-5 w-full max-w-4xl animate-fade-in">
                <div className="text-center mb-8">
                    <h2 className="text-5xl font-bold bg-gradient-to-r from-candy-purple to-candy-blue bg-clip-text text-transparent mb-2">
                        Welcome! 👋
                    </h2>
                    <p className="text-gray-600 text-lg">Let's get you clocked in</p>
                </div>

                <div className="flex justify-center gap-4 mb-8">
                    <button
                        className={`px-8 py-4 rounded-xl font-bold text-lg shadow-lg transform transition-all duration-200 ${
                            userStatus === UserStatus.NEW
                                ? 'bg-gradient-to-r from-candy-mint to-green-400 text-white scale-105 shadow-xl'
                                : 'bg-white text-gray-700 hover:shadow-xl hover:scale-105'
                        }`}
                        onClick={() => handleUserStatusChange(UserStatus.NEW)}
                    >
                        <span className="text-2xl mr-2">✨</span>
                        First Time This Year
                    </button>
                    <button
                        className={`px-8 py-4 rounded-xl font-bold text-lg shadow-lg transform transition-all duration-200 ${
                            userStatus === UserStatus.RETURNING
                                ? 'bg-gradient-to-r from-candy-blue to-blue-500 text-white scale-105 shadow-xl'
                                : 'bg-white text-gray-700 hover:shadow-xl hover:scale-105'
                        }`}
                        onClick={() => handleUserStatusChange(UserStatus.RETURNING)}
                    >
                        <span className="text-2xl mr-2">👋</span>
                        Returning
                    </button>
                </div>

                {/* NEW USER FORM */}
                {userStatus === UserStatus.NEW && (
                    <div className="mt-8 max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-2xl animate-slide-up">
                        <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                            <span className="text-3xl mr-3">📋</span>
                            Tell us about yourself
                        </h3>
                        <form className="space-y-5" onSubmit={handleNewUserSubmit}>
                            <div>
                                <label htmlFor="fullName" className="block text-gray-700 font-semibold mb-2">
                                    Full Name (First & Last)
                                </label>
                                <input
                                    required
                                    type="text"
                                    id="fullName"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-candy-purple focus:ring-2 focus:ring-candy-purple/20 transition-all duration-200 outline-none"
                                    placeholder="John Johnson"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                                    📨 Email
                                </label>
                                <input
                                    required
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-candy-purple focus:ring-2 focus:ring-candy-purple/20 transition-all duration-200 outline-none"
                                    placeholder="john@example.com"
                                    autoComplete="off"
                                />
                            </div>
                            <div>
                                <label htmlFor="phoneNumber" className="block text-gray-700 font-semibold mb-2">
                                    ☎️ Phone Number
                                </label>
                                <input
                                    required
                                    type="tel"
                                    id="phoneNumber"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-candy-purple focus:ring-2 focus:ring-candy-purple/20 transition-all duration-200 outline-none"
                                    placeholder="123-456-7890"
                                    autoComplete="off"
                                />
                            </div>
                            <div>
                                <label htmlFor="physicalMailingAddress" className="block text-gray-700 font-semibold mb-2">
                                    📫 Physical Mailing Address
                                </label>
                                <input
                                    required
                                    type="text"
                                    id="physicalMailingAddress"
                                    value={physicalMailingAddress}
                                    onChange={(e) => setPhysicalMailingAddress(e.target.value)}
                                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-candy-purple focus:ring-2 focus:ring-candy-purple/20 transition-all duration-200 outline-none"
                                    placeholder="123 Main St, City, State 12345"
                                    autoComplete="off"
                                    onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                                        if (event.key === 'Enter') {
                                            event.preventDefault();
                                        }
                                    }}
                                />
                            </div>
                            <button
                                type="submit"
                                className={`w-full bg-gradient-to-r from-candy-purple to-candy-blue text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ${
                                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Starting Your Shift...
                                    </span>
                                ) : (
                                    '🚀 Start Shift'
                                )}
                            </button>
                        </form>
                    </div>
                )}

                {/* RETURNING USER FORM */}
                {userStatus === UserStatus.RETURNING && (
                    <div className="mt-8 max-w-md mx-auto bg-white p-8 rounded-2xl shadow-2xl animate-slide-up">
                        <form onSubmit={handleNewReturningSubmit}>
                            <label className="block mb-8">
                                <span className="text-gray-700 font-semibold text-lg mb-3 block">
                                    Select Your Name 👇
                                </span>
                                <select
                                    className="w-full p-4 text-xl border-2 border-gray-200 rounded-lg focus:border-candy-blue focus:ring-2 focus:ring-candy-blue/20 transition-all duration-200 outline-none bg-white"
                                    value={selectedEmployee}
                                    onChange={(e) => setSelectedEmployee(e.target.value)}
                                >
                                    <option selected disabled>Select Yourself</option>
                                    {employees.map((employee, index) => (
                                        <option key={index} value={employee.userId}>{employee.name}</option>
                                    ))}
                                </select>
                            </label>
                            <button
                                type="submit"
                                className={`w-full bg-gradient-to-r from-candy-blue to-blue-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ${
                                    isLoading || selectedEmployee == undefined ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                disabled={isLoading || selectedEmployee == undefined}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Starting Your Shift...
                                    </span>
                                ) : (
                                    '🚀 Start Shift'
                                )}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div >
    );
};

export default StartShift;
