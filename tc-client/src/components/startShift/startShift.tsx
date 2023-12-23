import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

enum UserStatus {
    NOT_SET = 'NOT_SET',
    RETURNING = 'RETURNING',
    NEW = 'NEW',
}

const StartShift: React.FC = () => {
    const [userStatus, setUserStatus] = useState<UserStatus>(UserStatus.NEW);
    const [employees] = useState(Array.from({ length: 20 }, (_, i) => `Employee ${i + 1}`));
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();


    const handleUserStatusChange = (status: UserStatus) => {
        setUserStatus(status);
    };

    const handleStartShift = () => {
        setIsLoading(true); // Start loading

        // Simulate a 300ms delay
        setTimeout(() => {
            // Stop loading and navigate back to home
            setIsLoading(false);
            navigate('/');
        }, 300);
    };


    return (
        <div className="bg-gray-100 min-h-screen flex justify-center items-center">
            <Link to="/" className="absolute top-4 left-4 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded">
                Return Home
            </Link>
            <div className="container mx-auto p-6 w-full max-w-4xl">
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
                    <div className="mt-8 max-w-lg mx-auto bg-white p-2 rounded shadow">
                        <h3 className="text-lg font-semibold mb-6">Please fill in all fields</h3>
                        <form className="text-xl">
                            <label className="block mb-5">
                                <span className="text-gray-700">Full Name (First & Last)</span>
                                <input required type="text" className="form-input mt-1 block w-full" placeholder="John Johnson" />
                            </label>
                            <label className="block mb-5">
                                <span className="text-gray-700">Email</span>
                                <input required type="email" className="form-input mt-1 block w-full" placeholder="john@example.com" />
                            </label>
                            <label className="block mb-5">
                                <span className="text-gray-700">Phone Number</span>
                                <input required type="tel" className="form-input mt-1 block w-full" placeholder="123-456-7890" />
                            </label>
                            <label className="block mb-5">
                                <span className="text-gray-700">Payment method</span>
                                <input required type="text" className="form-input mt-1 block w-full" placeholder="Venmo: @username" />
                            </label>
                            <button
                                type="button"
                                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-5 rounded ${isLoading ? 'opacity-50' : ''}`}
                                onClick={handleStartShift}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Submitting...' : 'Start Shift'}
                            </button>
                        </form>
                    </div>
                )}

                {userStatus === UserStatus.RETURNING && (
                    <div className="mt-8 max-w-md mx-auto bg-white p-6 rounded shadow text-2xl">
                        <label className="block mb-6">
                            <span className="text-gray-700">Select Your Name</span>
                            <select className="form-select block w-full mt-1">
                                {employees.map((employee, index) => (
                                    <option key={index}>{employee}</option>
                                ))}
                            </select>
                        </label>
                        <button
                            type="button"
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${isLoading ? 'opacity-50' : ''}`}
                            onClick={handleStartShift}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Submitting...' : 'Start Shift'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StartShift;
