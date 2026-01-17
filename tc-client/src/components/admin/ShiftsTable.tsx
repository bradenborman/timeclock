import React from 'react';
import { Shift } from '../shiftView/shiftView';

interface ShiftsTableProps {
    shifts: Shift[];
    onEdit: (shiftId: number) => void;
    onDelete: (shiftId: number) => void;
    onSave: (shiftId: number) => void;
    onCancel: () => void;
    onClockInChange: (shiftId: number, value: string) => void;
    onClockOutChange: (shiftId: number, value: string) => void;
}

const ShiftsTable: React.FC<ShiftsTableProps> = ({
    shifts,
    onEdit,
    onDelete,
    onSave,
    onCancel,
    onClockInChange,
    onClockOutChange
}) => {
    return (
        <div className="overflow-x-auto">
            <table className="table-auto w-full text-left">
                <thead className="bg-gray-100 sticky top-0 z-10">
                    <tr className="border-b-2 border-gray-300">
                        <th className="px-4 py-3 font-semibold text-gray-700 bg-gray-100">Name</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 bg-gray-100">Clock In</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 bg-gray-100">Clock Out</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 bg-gray-100">Time Worked</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 bg-gray-100">Actions</th>
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
                                    onChange={(e) => onClockInChange(shift.shiftId, e.target.value)}
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
                                    onChange={(e) => onClockOutChange(shift.shiftId, e.target.value)}
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
                                            onClick={() => onSave(shift.shiftId)}
                                            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                        >
                                            ✓ Save
                                        </button>
                                        <button
                                            onClick={onCancel}
                                            className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                        >
                                            ✕ Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => onEdit(shift.shiftId)}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() => onDelete(shift.shiftId)}
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
        </div>
    );
};

export default ShiftsTable;
