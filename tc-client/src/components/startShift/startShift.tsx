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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
            <Link 
                to="/" 
                className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center border border-gray-200 z-50"
            >
                <span className="mr-2">←</span> Home
            </Link>

            {/* Container wrapper */}
            <div className="w-full max-w-7xl">
                {/* Split Screen Layout */}
                {userStatus === UserStatus.NOT_SET && (
                    <div className="flex rounded-3xl overflow-hidden shadow-2xl h-[600px]">
                    {/* Left Side - First Time */}
                    <div 
                        onClick={() => handleUserStatusChange(UserStatus.NEW)}
                        className="group relative w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-500 hover:w-[55%]"
                    >
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-500"></div>
                        <div className="relative z-10 text-center text-white p-12 transform group-hover:scale-110 transition-all duration-500">
                            <div className="text-8xl mb-8 animate-bounce-subtle">✨</div>
                            <h2 className="text-6xl font-bold mb-6">First Time This Year</h2>
                            <p className="text-2xl text-blue-100 mb-8 max-w-md mx-auto">
                                New to the team? Let's get you set up with a quick registration.
                            </p>
                            <div className="inline-flex items-center text-2xl font-semibold bg-white/20 backdrop-blur-sm px-8 py-4 rounded-full group-hover:bg-white/30 transition-all duration-300">
                                <span>Get Started</span>
                                <span className="ml-3 transform group-hover:translate-x-2 transition-transform duration-300">→</span>
                            </div>
                        </div>
                        {/* Decorative circles */}
                        <div className="absolute top-20 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                    </div>

                    {/* Right Side - Returning */}
                    <div 
                        onClick={() => handleUserStatusChange(UserStatus.RETURNING)}
                        className="group relative w-1/2 bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-500 hover:w-[55%]"
                    >
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-500"></div>
                        <div className="relative z-10 text-center text-white p-12 transform group-hover:scale-110 transition-all duration-500">
                            <div className="text-8xl mb-8 animate-bounce-subtle">👋</div>
                            <h2 className="text-6xl font-bold mb-6">Welcome Back</h2>
                            <p className="text-2xl text-gray-300 mb-8 max-w-md mx-auto">
                                Already in the system? Quick clock-in with just your name.
                            </p>
                            <div className="inline-flex items-center text-2xl font-semibold bg-white/20 backdrop-blur-sm px-8 py-4 rounded-full group-hover:bg-white/30 transition-all duration-300">
                                <span>Clock In Now</span>
                                <span className="ml-3 transform group-hover:translate-x-2 transition-transform duration-300">→</span>
                            </div>
                        </div>
                        {/* Decorative circles */}
                        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                    </div>
                    </div>
                )}

                {/* NEW USER FORM - Contained */}
                {userStatus === UserStatus.NEW && (
                    <div className="animate-fade-in">
                        <button
                            onClick={() => handleUserStatusChange(UserStatus.NOT_SET)}
                            className="mb-8 text-gray-600 hover:text-gray-800 flex items-center text-lg transition-colors duration-200 group"
                        >
                            <span className="mr-2 transform group-hover:-translate-x-1 transition-transform duration-200">←</span> 
                            Back to selection
                        </button>
                        
                        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
                                <h2 className="text-4xl font-bold mb-2 flex items-center">
                                    <span className="text-5xl mr-4">📋</span>
                                    Tell us about yourself
                                </h2>
                                <p className="text-blue-100 text-lg">Just a few details to get you started</p>
                            </div>
                            
                            <form onSubmit={handleNewUserSubmit} className="p-8" autoComplete="off">
                                {/* Hidden honeypot to confuse autofill */}
                                <input type="text" name="fakeusernameremembered" style={{position: 'absolute', top: '-9999px', left: '-9999px'}} tabIndex={-1} autoComplete="off" />
                                <input type="password" name="fakepasswordremembered" style={{position: 'absolute', top: '-9999px', left: '-9999px'}} tabIndex={-1} autoComplete="new-password" />
                                
                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div className="md:col-span-2">
                                        <label htmlFor="fullName" className="block text-gray-700 font-bold mb-3 text-lg">
                                            👤 Full Name
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            id="fullName"
                                            name="search"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
                                            placeholder="John Johnson"
                                            autoComplete="new-password"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="email" className="block text-gray-700 font-bold mb-3 text-lg">
                                            📧 Email Address
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            id="email"
                                            name="search-email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
                                            placeholder="john@example.com"
                                            autoComplete="new-password"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="phoneNumber" className="block text-gray-700 font-bold mb-3 text-lg">
                                            📱 Phone Number
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            id="phoneNumber"
                                            name="search-phone"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
                                            placeholder="123-456-7890"
                                            autoComplete="new-password"
                                        />
                                    </div>
                                    
                                    <div className="md:col-span-2">
                                        <label htmlFor="physicalMailingAddress" className="block text-gray-700 font-bold mb-3 text-lg">
                                            🏠 Physical Mailing Address
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            id="physicalMailingAddress"
                                            name="search-address"
                                            value={physicalMailingAddress}
                                            onChange={(e) => setPhysicalMailingAddress(e.target.value)}
                                            className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
                                            placeholder="123 Main St, City, State 12345"
                                            autoComplete="new-password"
                                            onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                                                if (event.key === 'Enter') {
                                                    event.preventDefault();
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                
                                <button
                                    type="submit"
                                    className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-5 px-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200 text-xl ${
                                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Starting Your Shift...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center">
                                            <span className="text-2xl mr-3">🚀</span>
                                            Start My Shift
                                        </span>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* RETURNING USER FORM - Contained */}
                {userStatus === UserStatus.RETURNING && (
                    <div className="animate-fade-in">
                        <button
                            onClick={() => handleUserStatusChange(UserStatus.NOT_SET)}
                            className="mb-8 text-gray-600 hover:text-gray-800 flex items-center text-lg transition-colors duration-200 group"
                        >
                            <span className="mr-2 transform group-hover:-translate-x-1 transition-transform duration-200">←</span> 
                            Back to selection
                        </button>
                        
                        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 text-white">
                                <h2 className="text-4xl font-bold mb-2 flex items-center">
                                    <span className="text-5xl mr-4">👋</span>
                                    Welcome back!
                                </h2>
                                <p className="text-gray-300 text-lg">Select your name and you're all set</p>
                            </div>
                            
                            <form onSubmit={handleNewReturningSubmit} className="p-8">
                                <label className="block mb-8">
                                    <span className="block text-gray-700 font-bold mb-4 text-xl">
                                        Select Your Name
                                    </span>
                                    <select
                                        className="w-full p-5 text-xl border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none bg-white cursor-pointer"
                                        value={selectedEmployee}
                                        onChange={(e) => setSelectedEmployee(e.target.value)}
                                    >
                                        <option value="">Choose your name from the list...</option>
                                        {employees.map((employee, index) => (
                                            <option key={index} value={employee.userId}>{employee.name}</option>
                                        ))}
                                    </select>
                                </label>
                                
                                <button
                                    type="submit"
                                    className={`w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white font-bold py-5 px-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200 text-xl ${
                                        isLoading || selectedEmployee == undefined ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    disabled={isLoading || selectedEmployee == undefined}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Clocking You In...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center">
                                            <span className="text-2xl mr-3">⚡</span>
                                            Clock In Now
                                        </span>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StartShift;
