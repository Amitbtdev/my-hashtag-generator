// src/components/Navigation.jsx
import { NavLink, Link } from 'react-router-dom';
import { Home as HomeIcon, Clock, Info, Hash } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

export default function Navigation() {
    const token = localStorage.getItem('token');
    let username = '';

    if (token) {
        try {
            const decoded = jwtDecode(token);
            username = decoded.username;
        } catch (err) {
            console.error('Invalid token');
        }
    }

    return (
        <header className="bg-transparent fixed w-full z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4 md:py-6">
                    <div className="flex items-center">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl shadow-lg mr-3">
                            <Hash className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-xl md:text-2xl font-bold text-white">
                            Hashtag Generator
                        </h1>
                    </div>

                    <nav className="hidden md:flex space-x-1 items-center">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2 rounded-lg text-sm font-medium transition ${isActive
                                    ? 'bg-white/20 text-white'
                                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                                }`
                            }
                        >
                            <HomeIcon className="w-4 h-4 mr-2" />
                            Home
                        </NavLink>
                        <NavLink
                            to="/history"
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2 rounded-lg text-sm font-medium transition ${isActive
                                    ? 'bg-white/20 text-white'
                                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                                }`
                            }
                        >
                            <Clock className="w-4 h-4 mr-2" />
                            History
                        </NavLink>
                        <NavLink
                            to="/about"
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2 rounded-lg text-sm font-medium transition ${isActive
                                    ? 'bg-white/20 text-white'
                                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                                }`
                            }
                        >
                            <Info className="w-4 h-4 mr-2" />
                            About
                        </NavLink>

                        {token ? (
                            <>
                                <span className="px-4 py-2 text-white text-sm">
                                    Hi, {username}!
                                </span>
                                <button
                                    onClick={() => {
                                        localStorage.removeItem('token');
                                        alert('Logged out');
                                        window.location.reload();
                                    }}
                                    className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded shadow-md transition inline-block"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded shadow-md transition inline-block"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded shadow-md transition inline-block"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
