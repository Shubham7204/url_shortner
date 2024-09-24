import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useGetUserDetails from '../../hooks/useGetUserDetails';

const Navbar = () => {
    const { user_data } = useGetUserDetails();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const links = [
        { path: '/', label: 'Home' },
        { path: '/generate', label: 'TrimURL' }, // Updated label to TrimURL
        { path: '/signin', label: 'Sign In', condition: !user_data },
        { path: '/signup', label: 'Sign Up', condition: !user_data },
        { path: '/analytics', label: 'Analytics', condition: user_data },
        { path: '/admin', label: 'Admin', condition: user_data?.role === 'Admin' },
        { path: '/profile', label: 'Profile', condition: user_data },
    ];

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-blue-600 text-2xl font-bold">
                            TrimURL
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center">
                        {links.map(({ path, label, condition = true }) =>
                            condition && (
                                <Link
                                    key={path}
                                    to={path}
                                    className={`ml-4 px-3 py-2 rounded-md text-sm font-medium ${
                                        location.pathname === path
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    {label}
                                </Link>
                            )
                        )}
                    </div>
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {links.map(({ path, label, condition = true }) =>
                            condition && (
                                <Link
                                    key={path}
                                    to={path}
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                                        location.pathname === path
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {label}
                                </Link>
                            )
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
