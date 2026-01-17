import React from 'react';

interface AdminHeaderProps {
    sendingEmailLoading: boolean;
    onSendEmail: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ sendingEmailLoading, onSendEmail }) => {
    return (
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-4xl font-bold text-gray-800 flex items-center">
                    <span className="text-5xl mr-3">👤</span>
                    Admin Dashboard
                </h1>
                <p className="text-gray-600 mt-2 text-lg">Manage shifts, users, and send reports</p>
            </div>
            <button
                className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center ${
                    sendingEmailLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={onSendEmail}
                disabled={sendingEmailLoading}
            >
                {sendingEmailLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                    </>
                ) : (
                    <>
                        <span className="text-2xl mr-2">📧</span>
                        Send Email Report
                    </>
                )}
            </button>
        </div>
    );
};

export default AdminHeader;
