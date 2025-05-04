import React, { useState } from 'react';
import api from './api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/register', { username, password });
            setMessage('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setMessage('Registration failed: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-pink-700 text-white">
            <form onSubmit={handleSubmit} className="bg-indigo-800 p-8 rounded shadow-lg w-full max-w-sm space-y-4">
                <h2 className="text-xl font-bold text-center">Register</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 rounded bg-indigo-700 text-white placeholder-indigo-300"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 rounded bg-indigo-700 text-white placeholder-indigo-300"
                    required
                />
                <button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 p-2 rounded">
                    Register
                </button>
                {message && <p className="text-center text-sm mt-2">{message}</p>}
            </form>
        </div>
    );
}
