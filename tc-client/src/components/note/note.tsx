import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Note: React.FC = () => {
    const [note, setNote] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent the default form submit action
        axios.post('/api/note', note)
            .then(response => {
                setNote('');
                alert("Note was submitted! Thank you")
            })
            .catch(error => {
                console.error('There was an error submitting the note:', error);
            });
    };

    return (
        <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 min-h-screen flex justify-center items-center p-4">
            <Link 
                to="/" 
                className="absolute top-6 left-6 bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center"
            >
                <span className="mr-2">←</span> Return Home
            </Link>
            
            <div className="container mx-auto p-6 w-full max-w-4xl animate-fade-in">
                <div className="text-center mb-8">
                    <h2 className="fancy-text text-6xl font-bold bg-gradient-to-r from-candy-purple to-candy-blue bg-clip-text text-transparent mb-3">
                        📝 Leave us a note
                    </h2>
                    <p className="text-gray-600 text-lg">We'd love to hear from you!</p>
                </div>
                
                <form onSubmit={handleSubmit} className="bg-white p-10 rounded-2xl shadow-2xl animate-slide-up">
                    <div className="mb-6">
                        <label htmlFor="note" className="block text-gray-700 font-semibold mb-3 text-lg">
                            Your Message
                            <span className="text-sm text-gray-500 font-normal ml-2">(Make sure to include your name)</span>
                        </label>
                        <textarea
                            id="note"
                            className="resize-none w-full h-56 p-5 border-2 border-gray-200 rounded-xl focus:border-candy-purple focus:ring-2 focus:ring-candy-purple/20 transition-all duration-200 outline-none text-lg"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Type your message here..."
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-candy-purple to-candy-blue text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
                    >
                        ✉️ Submit Note
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Note;
