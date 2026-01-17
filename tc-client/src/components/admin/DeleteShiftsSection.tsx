import React from 'react';

interface DeleteShiftsSectionProps {
    deleteShiftsDate: string;
    onDateChange: (date: string) => void;
    onDeleteClick: () => void;
}

const DeleteShiftsSection: React.FC<DeleteShiftsSectionProps> = ({
    deleteShiftsDate,
    onDateChange,
    onDeleteClick
}) => {
    return (
        <div className="space-y-4">
            <p className="text-gray-600 text-sm">Permanently delete all shifts with clock-in dates before the selected date.</p>
            <div className="flex items-center gap-4">
                <input
                    type="date"
                    value={deleteShiftsDate}
                    onChange={(e) => onDateChange(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg border-2 border-red-300 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                <button
                    onClick={onDeleteClick}
                    disabled={!deleteShiftsDate}
                    className={`bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center ${
                        !deleteShiftsDate ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    <span className="mr-2">🗑️</span>
                    Delete Shifts
                </button>
            </div>
        </div>
    );
};

export default DeleteShiftsSection;
