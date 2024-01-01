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
    paymentMethod: string;
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
    const [paymentMethod, setPaymentMethod] = useState('');


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
            paymentMethod
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
        <div className="bg-gray-100 min-h-screen flex justify-center items-center">
            <Link to="/" className="absolute top-4 left-4 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded">
                Return Home
            </Link>
            <div className="container mx-auto p-5 w-full max-w-4xl">
                <h2 className="text-3xl font-bold text-center mb-6">Please choose an option</h2>
                <div className="text-center text-3xl">
                    <button
                        className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mx-2 ${userStatus === UserStatus.NEW ? 'bg-green-700' : ''
                            }`}
                        onClick={() => handleUserStatusChange(UserStatus.NEW)}
                    >
                        First Time This Year
                    </button>
                    <button
                        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2 ${userStatus === UserStatus.RETURNING ? 'bg-blue-700' : ''
                            }`}
                        onClick={() => handleUserStatusChange(UserStatus.RETURNING)}
                    >
                        Returning
                    </button>
                </div>

                {/* Conditional rendering based on userStatus */}
                {userStatus === UserStatus.NEW && (
                    <div className="mt-8 max-w-lg mx-auto bg-white p-6 rounded shadow">
                        <h3 className="text-xl font-semibold mb-6">Please fill in all fields</h3>
                        <form className="space-y-4" onSubmit={handleNewUserSubmit}>
                            <div className="mb-4">
                                <label htmlFor="fullName" className="text-gray-700 font-semibold">Full Name (First & Last) </label>
                                <input
                                    required
                                    type="text"
                                    id="fullName"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="form-input mt-1 p-1 block w-full border border-gray-300 focus:border-blue-500"
                                    placeholder="John Johnson"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="text-gray-700 font-semibold">📨 Email</label>
                                <input
                                    required
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-input mt-1 p-1 block w-full border border-gray-300 focus:border-blue-500"
                                    placeholder="john@example.com"
                                    autoComplete="off"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="phoneNumber" className="text-gray-700 font-semibold">☎️ Phone Number</label>
                                <input
                                    required
                                    type="tel"
                                    id="phoneNumber"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="form-input mt-1 p-1 block w-full border border-gray-300 focus:border-blue-500"
                                    placeholder="123-456-7890"
                                    autoComplete="off"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="paymentMethod" className="text-gray-700 font-semibold">💳 Payment method</label>
                                <input
                                    required
                                    type="text"
                                    id="paymentMethod"
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="form-input mt-1 p-1 block w-full border border-gray-300 focus:border-blue-500"
                                    placeholder="EX: Venmo: @username / TBD"
                                    autoComplete="off"
                                />
                            </div>
                            <button
                                type="submit"
                                className={`bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Submitting...' : 'Start Shift'}
                            </button>
                        </form>
                    </div>


                )}

                {userStatus === UserStatus.RETURNING && (
                    <div className="mt-8 max-w-md mx-auto bg-white p-6 rounded shadow text-xl">
                        <form onSubmit={handleNewReturningSubmit}>
                            <label className="block mb-10">
                                <span className="text-gray-700">Select Your Name 👇</span>
                                <select
                                    className="form-select block w-full mt-1 text-2xl"
                                    value={selectedEmployee}
                                    onChange={(e) => setSelectedEmployee(e.target.value)}
                                >
                                    <option selected disabled>Select Youself</option>
                                    {employees.map((employee, index) => (
                                        <option key={index} value={employee.userId}>{employee.name}</option>
                                    ))}
                                </select>
                            </label>
                            <button
                                type="submit"
                                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${isLoading ? 'opacity-50' : ''}`}
                                disabled={isLoading || selectedEmployee == undefined}
                            >
                                {isLoading ? 'Submitting...' : 'Start Shift'}
                            </button>
                        </form>

                    </div>
                )}
            </div>
        </div >
    );
};

export default StartShift;
