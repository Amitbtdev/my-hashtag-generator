import React, { useEffect, useState } from 'react';
import api from '../api';

export default function History() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            setError('You must be logged in to view history.');
            setLoading(false);
            return;
        }

        api.get('/api/history', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                setHistory(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching history:', err);
                setError('Failed to load history. Please make sure you are logged in.');
                setLoading(false);
            });
    }, []);

    function extractCleanInput(contentInput) {
        const fileTypeMatch = contentInput.match(/^Using (\w+) file:/i);
        const fileType = fileTypeMatch ? fileTypeMatch[1] : null;

        if (fileType) {
            const pattern = new RegExp(`^Using ${fileType} file:.*`, 'i');
            const cleaned = contentInput.replace(pattern, '').trim();
            return cleaned;
        }
        return contentInput.trim();
    }

    if (loading) {
        return (
            <div className="flex justify-center mt-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-400"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 to-pink-700 text-gray-100 px-4">
                <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
                <p className="text-lg mb-6">{error}</p>
                <a
                    href="/login"
                    className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded shadow transition"
                >
                    Go to Login
                </a>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-pink-700 px-4 py-8 text-gray-100">
            <h1 className="text-3xl font-bold mb-6 text-center">History</h1>

            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {history.map(entry => {
                    const cleanInput = extractCleanInput(entry.contentInput);
                    const fileType = cleanInput.match(/Using (\w+) file:/)?.[1] || 'Text';

                    return (
                        <div
                            key={entry._id}
                            className="bg-indigo-700/80 rounded-lg shadow-lg overflow-hidden transform transition duration-200 hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className="h-1 bg-pink-500"></div>

                            <div className="p-4 space-y-2">
                                <p className="text-sm text-indigo-200">{new Date(entry.createdAt).toLocaleString()}</p>
                                <span className="inline-block px-2 py-1 text-xs bg-pink-600 rounded-full">
                                    {fileType}
                                </span>
                                <p className="text-sm break-words max-h-28 overflow-y-auto">
                                    {cleanInput}
                                </p>
                            </div>

                            <div className="px-4 pb-4">
                                <p className="text-sm font-semibold mb-2">Hashtags:</p>
                                <div className="flex flex-wrap gap-2">
                                    {(entry.generatedHashtags || []).map(tag => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 text-xs border border-pink-300 text-pink-200 rounded"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
