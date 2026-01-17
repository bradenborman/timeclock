import React from 'react';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    deleteShiftsDate: string;
    deleteConfirmation: string;
    shiftCount: number;
    onConfirmationChange: (value: string) => void;
    onCancel: () => void;
    onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    deleteShiftsDate,
    deleteConfirmation,
    shiftCount,
    onConfirmationChange,
    onCancel,
    onConfirm
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fade-in">
                <div className="text-center mb-6">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirm Deletion</h2>
                    <p className="text-gray-600 mb-4">
                        This will permanently delete <span className="font-bold text-red-600">{shiftCount} shift{shiftCount !== 1 ? 's' : ''}</span> with clock-in dates prior to:
                    </p>
                    <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-4">
                        <p className="text-xl font-bold text-red-700">
                            {new Date(deleteShiftsDate).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </p>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">
                        This action <span className="font-bold text-red-600">CANNOT BE UNDONE</span>. All shift records before this date will be permanently removed from the database.
                    </p>
                </div>
                
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Type <span className="font-mono bg-gray-100 px-2 py-1 rounded text-red-600">delete</span> to confirm:
                    </label>
                    <input
                        type="text"
                        value={deleteConfirmation}
                        onChange={(e) => onConfirmationChange(e.target.value)}
                        placeholder="Type 'delete' here"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg"
                        autoFocus
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={deleteConfirmation.toLowerCase() !== 'delete'}
                        className={`flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 ${
                            deleteConfirmation.toLowerCase() !== 'delete' ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        Delete Shifts
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
