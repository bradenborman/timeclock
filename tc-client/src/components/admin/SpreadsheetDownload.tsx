import React from 'react';

interface SpreadsheetDownloadProps {
    selectedDate: string;
    onDateChange: (date: string) => void;
    onDownload: () => void;
    downloading: boolean;
}

const SpreadsheetDownload: React.FC<SpreadsheetDownloadProps> = ({
    selectedDate,
    onDateChange,
    onDownload,
    downloading
}) => {
    return (
        <div className="space-y-4">
            <p className="text-gray-600 text-sm">Select a date to download the timesheet spreadsheet for that day.</p>
            <div className="flex items-center gap-4">
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => onDateChange(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                    onClick={onDownload}
                    disabled={downloading}
                    className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center ${
                        downloading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {downloading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Downloading...
                        </>
                    ) : (
                        <>
                            <span className="mr-2">⬇️</span>
                            Download
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default SpreadsheetDownload;
