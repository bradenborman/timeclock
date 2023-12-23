import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Note: React.FC = () => {
    const [note, setNote] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent the default form submit action
        alert('Note Submitted: ' + note); // Placeholder action to demonstrate submission
        setNote(''); // Clear the note after submission
    };

    return (
        <div className="bg-gray-100 min-h-screen flex justify-center items-center">
            <Link to="/" className="absolute top-4 left-4 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded">
                Return Home
            </Link>
            <div className="container mx-auto p-6 w-full max-w-4xl">
                <h2 className="fancy-text text-5xl font-bold text-center mb-6">Leave us a note</h2>
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
                    <div className="mb-6">
                        <label htmlFor="note" className="block text-gray-700 text-sm font-bold mb-2">(Make sure to include who is submitting this)</label>
                        <textarea
                            id="note"
                            className="resize-none w-full h-48 p-4 border border-gray-300 rounded focus:outline-none focus:shadow-outline"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Note;
