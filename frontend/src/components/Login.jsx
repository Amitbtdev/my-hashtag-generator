import React, { useState } from 'react';
import api from './api';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/login', { username, password });
            const token = res.data.token;

            // Save token
            localStorage.setItem('token', token);

            // Decode token to get username
            const decoded = jwtDecode(token);
            localStorage.setItem('username', decoded.username);

            setMessage('Login successful! Redirecting...');

            // Reload the page, and then redirect
            window.location.reload();  // This will reload the page first

            // Redirect to the home page after a short delay to ensure reload happens
            setTimeout(() => navigate('/'), 100);  // Redirect after 100ms delay
        } catch (err) {
            setMessage('Login failed: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-pink-700 text-white">
            <form onSubmit={handleSubmit} className="bg-indigo-800 p-8 rounded shadow-lg w-full max-w-sm space-y-4">
                <h2 className="text-xl font-bold text-center">Login</h2>
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
                    Login
                </button>
                {message && <p className="text-center text-sm mt-2">{message}</p>}
            </form>
        </div>
    );
}
