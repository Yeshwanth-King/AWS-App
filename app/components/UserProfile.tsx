'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useCallback } from 'react';

interface UserStats {
    uploadCount: number;
    totalLikes: number;
    totalComments: number;
}

export default function UserProfile() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchUserStats = useCallback(async () => {
        if (!session?.user?.email) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/users/${encodeURIComponent(session.user.email)}/stats`);
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching user stats:', error);
        } finally {
            setLoading(false);
        }
    }, [session?.user?.email]);

    useEffect(() => {
        if (session?.user?.email) {
            fetchUserStats();
        }
    }, [session?.user?.email, fetchUserStats]);

    if (!session?.user) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    User Profile
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Please sign in to view your profile.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                User Profile
            </h2>

            <div className="space-y-4">
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                            {session.user.name?.[0] || session.user.email?.[0] || 'U'}
                        </span>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {session.user.name || 'Anonymous User'}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            {session.user.email}
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    </div>
                ) : stats ? (
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {stats.uploadCount}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Uploads
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-500">
                                {5 - stats.uploadCount} remaining
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                                {stats.totalLikes}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Likes Received
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {stats.totalComments}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Comments Received
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-4">
                        <p className="text-gray-600 dark:text-gray-400">
                            Unable to load profile statistics
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
