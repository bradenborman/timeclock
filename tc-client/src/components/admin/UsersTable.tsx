import React from 'react';

interface User {
    userId: string;
    name: string;
    phoneNumber: string;
    email: string;
    physicalMailingAddress: string;
    yearVerified: number | null;
    hidden: boolean;
}

interface UsersTableProps {
    users: User[];
    onDeleteUser: (userId: string, userName: string) => void;
    onUnhideUser: (userId: string, userName: string) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ users, onDeleteUser, onUnhideUser }) => {
    return (
        <div className="overflow-x-auto">
            <table className="table-auto w-full text-left">
                <thead className="bg-gray-100 sticky top-0 z-10">
                    <tr className="border-b-2 border-gray-300">
                        <th className="px-4 py-3 font-semibold text-gray-700 bg-gray-100">Name</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 bg-gray-100">Email</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 bg-gray-100">Phone</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 bg-gray-100">Status</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 bg-gray-100">Actions</th>
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
                                    onClick={() => onUnhideUser(user.userId, user.name)}
                                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                >
                                    👁️ Unhide
                                </button>
                            ) : (
                                <button
                                    onClick={() => onDeleteUser(user.userId, user.name)}
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
        </div>
    );
};

export default UsersTable;
