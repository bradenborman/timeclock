import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDarkMode } from '../../contexts/DarkModeContext';

export interface User {
    userId: string;
    name: string;
    phoneNumber: string;
    email: string;
    physicalMailingAddress: string;
    yearVerified: number | null;
}

enum FlowStep {
    SELECT_USER = 'SELECT_USER',
    VERIFY_INFO = 'VERIFY_INFO',
    NEW_USER = 'NEW_USER',
    CONFIRM_CLOCK_IN = 'CONFIRM_CLOCK_IN',
}

const StartShift: React.FC = () => {
    const [flowStep, setFlowStep] = useState<FlowStep>(FlowStep.SELECT_USER);
    const [employees, setEmployees] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string>('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userToClockIn, setUserToClockIn] = useState<{ userId: string; name: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
    const navigate = useNavigate();

    // Form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [physicalMailingAddress, setPhysicalMailingAddress] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [formKey, setFormKey] = useState(Date.now());

    const currentYear = new Date().getFullYear();

    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = () => {
        setIsLoadingEmployees(true);
        axios.get('/api/users')
            .then(response => {
                const sortedEmployees = response.data.sort((a: User, b: User) => 
                    a.name.localeCompare(b.name)
                );
                setEmployees(sortedEmployees);
                setIsLoadingEmployees(false);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                setIsLoadingEmployees(false);
            });
    };

    const groupEmployeesByLetter = () => {
        const grouped: { [key: string]: User[] } = {};
        employees.forEach(employee => {
            const firstLetter = employee.name.charAt(0).toUpperCase();
            if (!grouped[firstLetter]) {
                grouped[firstLetter] = [];
            }
            grouped[firstLetter].push(employee);
        });
        return grouped;
    };

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setEmailError('');
            return true;
        }
        if (!emailRegex.test(email)) {
            setEmailError('Please enter a valid email address');
            return false;
        }
        setEmailError('');
        return true;
    };

    const validatePhone = (phone: string) => {
        const phoneRegex = /^[\d\s\-\(\)]+$/;
        if (!phone) {
            setPhoneError('');
            return true;
        }
        if (phone.replace(/[\s\-\(\)]/g, '').length < 10) {
            setPhoneError('Phone number must be at least 10 digits');
            return false;
        }
        if (!phoneRegex.test(phone)) {
            setPhoneError('Please enter a valid phone number');
            return false;
        }
        setPhoneError('');
        return true;
    };

    const handleUserSelect = async (userId: string) => {
        if (!userId) return; // Don't process empty selection
        
        setSelectedUserId(userId);
        setIsLoading(true);
        
        // Fetch full user details
        try {
            const response = await axios.get(`/api/user/${userId}`);
            const user: User = response.data;
            
            // Check if verification is needed
            if (user.yearVerified === null || user.yearVerified !== currentYear) {
                // Need to verify
                setSelectedUser(user);
                setName(user.name);
                setEmail(user.email || '');
                setPhoneNumber(user.phoneNumber || '');
                setPhysicalMailingAddress(user.physicalMailingAddress || '');
                setIsLoading(false);
                setFlowStep(FlowStep.VERIFY_INFO);
            } else {
                // Already verified this year, show custom confirmation
                setIsLoading(false);
                setUserToClockIn({ userId, name: user.name });
                setFlowStep(FlowStep.CONFIRM_CLOCK_IN);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            setIsLoading(false);
            setSelectedUserId(''); // Reset selection
            alert('Error loading user information');
        }
    };

    const handleConfirmClockIn = () => {
        if (userToClockIn) {
            clockInUser(userToClockIn.userId, userToClockIn.name);
        }
    };

    const handleCancelClockIn = () => {
        setUserToClockIn(null);
        setSelectedUserId('');
        setFlowStep(FlowStep.SELECT_USER);
    };

    const clockInUser = (userId: string, userName: string) => {
        setIsLoading(true);
        axios.post('/api/clockin', null, { params: { userId } })
            .then(() => {
                setIsLoading(false);
                navigate('/', { state: { newestUser: userName } });
            })
            .catch((error) => {
                console.error('Error clocking in:', error);
                setIsLoading(false);
                alert('Error clocking in');
            });
    };

    const handleVerifyAndClockIn = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateEmail(email) || !validatePhone(phoneNumber)) {
            return;
        }

        setIsLoading(true);

        try {
            // Update user info
            const updatedUser = {
                ...selectedUser,
                name,
                email,
                phoneNumber,
                physicalMailingAddress,
                yearVerified: currentYear
            };

            await axios.put('/api/user', updatedUser);
            
            // Clock in
            clockInUser(selectedUser!.userId, name);
        } catch (error) {
            console.error('Error updating user:', error);
            setIsLoading(false);
            alert('Error updating information');
        }
    };

    const handleNewUserSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateEmail(email) || !validatePhone(phoneNumber)) {
            return;
        }
        
        setIsLoading(true);

        const userData = {
            name,
            email,
            phoneNumber,
            physicalMailingAddress,
            yearVerified: currentYear
        };

        try {
            await axios.post('/api/user', userData);
            setIsLoading(false);
            navigate('/', { state: { newestUser: name } });
        } catch (error) {
            setIsLoading(false);
            alert('ERROR: Check console');
            console.error('Error creating user:', error);
        }
    };

    const showNewUserForm = () => {
        setName('');
        setEmail('');
        setPhoneNumber('');
        setPhysicalMailingAddress('');
        setEmailError('');
        setPhoneError('');
        setFormKey(Date.now());
        setFlowStep(FlowStep.NEW_USER);
    };

    const calculateProgress = () => {
        let completed = 0;
        if (name.trim()) completed++;
        if (email.trim() && !emailError) completed++;
        if (phoneNumber.trim() && !phoneError) completed++;
        if (physicalMailingAddress.trim()) completed++;
        return completed;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
            <Link 
                to="/" 
                className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center border border-gray-200 z-50"
            >
                <span className="mr-2">←</span> Home
            </Link>

            <div className="w-full max-w-4xl">
                {/* SELECT USER DROPDOWN */}
                {flowStep === FlowStep.SELECT_USER && (
                    <div className="animate-fade-in">
                        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
                                <h2 className="text-4xl font-bold mb-2 flex items-center">
                                    <span className="text-5xl mr-4">👋</span>
                                    Start Your Shift
                                </h2>
                                <p className="text-blue-100 text-lg">Select your name to clock in</p>
                            </div>
                            
                            <div className="p-8">
                                <label className="block mb-6">
                                    <span className="block text-gray-700 font-bold mb-4 text-xl">
                                        Select Your Name
                                    </span>
                                    <select
                                        className="w-full p-5 text-xl border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none bg-white cursor-pointer"
                                        value={selectedUserId}
                                        onChange={(e) => handleUserSelect(e.target.value)}
                                        disabled={isLoadingEmployees}
                                    >
                                        <option value="">Choose your name from the list...</option>
                                        {Object.entries(groupEmployeesByLetter())
                                            .sort(([letterA], [letterB]) => letterA.localeCompare(letterB))
                                            .map(([letter, employeesInGroup]) => (
                                                <React.Fragment key={letter}>
                                                    <option 
                                                        disabled 
                                                        style={{
                                                            fontWeight: 'bold',
                                                            fontSize: '1.25rem',
                                                            backgroundColor: '#dbeafe',
                                                            color: '#1e40af',
                                                            padding: '0.5rem'
                                                        }}
                                                    >
                                                        ━━━ {letter} ━━━
                                                    </option>
                                                    {employeesInGroup.map((employee) => (
                                                        <option 
                                                            key={employee.userId} 
                                                            value={employee.userId}
                                                            style={{ paddingLeft: '1.5rem' }}
                                                        >
                                                            {employee.name}
                                                        </option>
                                                    ))}
                                                </React.Fragment>
                                            ))
                                        }
                                    </select>
                                </label>

                                <div className="text-center mt-8 pt-8 border-t border-gray-200">
                                    <p className="text-gray-600 mb-4">Don't see your name?</p>
                                    <button
                                        onClick={showNewUserForm}
                                        className="text-blue-600 hover:text-blue-700 font-semibold text-lg underline"
                                    >
                                        Click here to add yourself
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* VERIFY INFO FORM */}
                {flowStep === FlowStep.VERIFY_INFO && selectedUser && (
                    <div className="animate-fade-in">
                        <button
                            onClick={() => setFlowStep(FlowStep.SELECT_USER)}
                            className="mb-8 text-gray-600 hover:text-gray-800 flex items-center text-lg transition-colors duration-200 group"
                        >
                            <span className="mr-2 transform group-hover:-translate-x-1 transition-transform duration-200">←</span> 
                            Back to selection
                        </button>
                        
                        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-8 text-white">
                                <h2 className="text-4xl font-bold mb-2 flex items-center">
                                    <span className="text-5xl mr-4">✓</span>
                                    Verify Your Information
                                </h2>
                                <p className="text-yellow-100 text-lg">
                                    Please confirm your details are up to date for {currentYear}
                                </p>
                            </div>
                            
                            <form onSubmit={handleVerifyAndClockIn} className="p-8">
                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div className="md:col-span-2">
                                        <label htmlFor="fullName" className="block text-gray-700 font-bold mb-3 text-lg">
                                            👤 Full Name
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            id="fullName"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
                                            placeholder="John Johnson"
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
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                validateEmail(e.target.value);
                                            }}
                                            onBlur={(e) => validateEmail(e.target.value)}
                                            className={`w-full p-4 text-lg border-2 rounded-xl focus:ring-4 transition-all duration-200 outline-none ${
                                                emailError
                                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                                                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                                            }`}
                                            placeholder="john@example.com"
                                        />
                                        {emailError && (
                                            <p className="text-red-500 text-sm mt-2 flex items-center">
                                                <span className="mr-1">⚠️</span>
                                                {emailError}
                                            </p>
                                        )}
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="phoneNumber" className="block text-gray-700 font-bold mb-3 text-lg">
                                            📱 Phone Number
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            id="phoneNumber"
                                            value={phoneNumber}
                                            onChange={(e) => {
                                                setPhoneNumber(e.target.value);
                                                validatePhone(e.target.value);
                                            }}
                                            onBlur={(e) => validatePhone(e.target.value)}
                                            className={`w-full p-4 text-lg border-2 rounded-xl focus:ring-4 transition-all duration-200 outline-none ${
                                                phoneError
                                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                                                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                                            }`}
                                            placeholder="123-456-7890"
                                        />
                                        {phoneError && (
                                            <p className="text-red-500 text-sm mt-2 flex items-center">
                                                <span className="mr-1">⚠️</span>
                                                {phoneError}
                                            </p>
                                        )}
                                    </div>
                                    
                                    <div className="md:col-span-2">
                                        <label htmlFor="physicalMailingAddress" className="block text-gray-700 font-bold mb-3 text-lg">
                                            🏠 Physical Mailing Address
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            id="physicalMailingAddress"
                                            value={physicalMailingAddress}
                                            onChange={(e) => setPhysicalMailingAddress(e.target.value)}
                                            className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
                                            placeholder="123 Main St, City, State 12345"
                                        />
                                    </div>
                                </div>
                                
                                <button
                                    type="submit"
                                    className={`w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-5 px-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200 text-xl ${
                                        isLoading || emailError || phoneError ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    disabled={isLoading || !!emailError || !!phoneError}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Confirming & Clocking In...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center">
                                            <span className="text-2xl mr-3">✓</span>
                                            Confirm & Clock In
                                        </span>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* NEW USER FORM */}
                {flowStep === FlowStep.NEW_USER && (
                    <div className="animate-fade-in">
                        <button
                            onClick={() => setFlowStep(FlowStep.SELECT_USER)}
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
                                <p className="text-blue-100 text-lg mb-4">Just a few details to get you started</p>
                                
                                <div className="flex items-center gap-2 mt-6">
                                    <div className="flex-1 flex gap-2">
                                        {[1, 2, 3, 4].map((step) => (
                                            <div
                                                key={step}
                                                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                                                    calculateProgress() >= step ? 'bg-white' : 'bg-white/30'
                                                }`}
                                            ></div>
                                        ))}
                                    </div>
                                    <span className="text-sm font-semibold ml-2">
                                        {calculateProgress()}/4 Complete
                                    </span>
                                </div>
                            </div>
                            
                            <form key={formKey} onSubmit={handleNewUserSubmit} className="p-8" autoComplete="off">
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
                                            onFocus={(e) => e.target.removeAttribute('readonly')}
                                            className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
                                            placeholder="John Johnson"
                                            autoComplete="new-password"
                                            readOnly
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
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                validateEmail(e.target.value);
                                            }}
                                            onBlur={(e) => validateEmail(e.target.value)}
                                            onFocus={(e) => e.target.removeAttribute('readonly')}
                                            className={`w-full p-4 text-lg border-2 rounded-xl focus:ring-4 transition-all duration-200 outline-none ${
                                                emailError
                                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                                                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                                            }`}
                                            placeholder="john@example.com"
                                            autoComplete="new-password"
                                            readOnly
                                        />
                                        {emailError && (
                                            <p className="text-red-500 text-sm mt-2 flex items-center">
                                                <span className="mr-1">⚠️</span>
                                                {emailError}
                                            </p>
                                        )}
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
                                            onChange={(e) => {
                                                setPhoneNumber(e.target.value);
                                                validatePhone(e.target.value);
                                            }}
                                            onBlur={(e) => validatePhone(e.target.value)}
                                            onFocus={(e) => e.target.removeAttribute('readonly')}
                                            className={`w-full p-4 text-lg border-2 rounded-xl focus:ring-4 transition-all duration-200 outline-none ${
                                                phoneError
                                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                                                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                                            }`}
                                            placeholder="123-456-7890"
                                            autoComplete="new-password"
                                            readOnly
                                        />
                                        {phoneError && (
                                            <p className="text-red-500 text-sm mt-2 flex items-center">
                                                <span className="mr-1">⚠️</span>
                                                {phoneError}
                                            </p>
                                        )}
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
                                            onFocus={(e) => e.target.removeAttribute('readonly')}
                                            className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
                                            placeholder="123 Main St, City, State 12345"
                                            autoComplete="new-password"
                                            readOnly
                                        />
                                    </div>
                                </div>
                                
                                <button
                                    type="submit"
                                    className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-5 px-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200 text-xl ${
                                        isLoading || emailError || phoneError || calculateProgress() < 4 ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    disabled={isLoading || !!emailError || !!phoneError || calculateProgress() < 4}
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

                {/* CONFIRM CLOCK IN MODAL */}
                {flowStep === FlowStep.CONFIRM_CLOCK_IN && userToClockIn && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
                        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full mx-4 transform animate-scale-in">
                            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
                                <h2 className="text-3xl font-bold flex items-center justify-center">
                                    <span className="text-4xl mr-3">✓</span>
                                    Confirm Clock In
                                </h2>
                            </div>
                            
                            <div className="p-8 text-center">
                                <p className="text-gray-600 text-lg mb-2">Start shift for</p>
                                <p className="text-3xl font-bold text-gray-800 mb-8">{userToClockIn.name}?</p>
                                
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleCancelClockIn}
                                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-6 rounded-xl transition-all duration-200 text-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirmClockIn}
                                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StartShift;
