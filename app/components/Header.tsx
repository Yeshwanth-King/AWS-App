'use client';

import { useAuth } from '@/app/lib/AuthContext';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
    const { user, loading, signOut } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut();
    };

    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
                            PhotoBlog
                        </Link>
                    </div>                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        {loading ? (
                            <div className="animate-pulse flex space-x-4">
                                <div className="h-8 w-16 bg-gray-200 rounded"></div>
                                <div className="h-8 w-16 bg-gray-200 rounded"></div>
                            </div>
                        ) : user ? (
                            <>
                                <span className="text-gray-700 dark:text-gray-300">
                                    Welcome, {user.name || user.email}
                                </span>
                                <button
                                    onClick={handleSignOut}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Sign Out
                                </button>
                                <span className="text-gray-700 dark:text-gray-300">
                                    {user?.uploadCount}/5 uploads remaining
                                </span>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/auth/signin"
                                    className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/auth/signup"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden">                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 dark:border-gray-700">
                        {loading ? (
                            <div className="animate-pulse space-y-2">
                                <div className="h-8 w-full bg-gray-200 rounded"></div>
                                <div className="h-8 w-full bg-gray-200 rounded"></div>
                            </div>
                        ) : user ? (
                            <>
                                <div className="px-3 py-2 text-gray-700 dark:text-gray-300">
                                    Welcome, {user.name || user.email}
                                </div>
                                <span className="text-gray-700 dark:text-gray-300 py-4">
                                    {user.uploadCount}/5 uploads remaining
                                </span>
                                <button
                                    onClick={handleSignOut}
                                    className="w-full text-left bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/auth/signin"
                                    className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/auth/signup"
                                    className="block bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                    </div>
                )}
            </div>
        </header>
    );
}
