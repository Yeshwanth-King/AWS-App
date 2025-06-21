'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface LikeButtonProps {
    postId: string;
}

interface ExtendedUser {
    id: string;
    email: string;
    name?: string | null;
    username: string;
    avatar?: string | null;
}

export default function LikeButton({ postId }: LikeButtonProps) {
    const { data: session } = useSession();
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadLikesData = async () => {
            try {
                const response = await fetch(`/api/likes?postId=${postId}`);
                if (response.ok) {
                    const data = await response.json();
                    setLikesCount(data.count);

                    // Check if current user liked this post
                    if (session?.user && 'id' in session.user) {
                        const userLiked = data.likes.some((like: { user: { id: string } }) =>
                            like.user.id === (session.user as ExtendedUser).id
                        );
                        setLiked(userLiked);
                    }
                }
            } catch (error) {
                console.error('Error loading likes:', error);
            }
        };

        loadLikesData();
    }, [postId, session?.user]);

    const handleToggleLike = async () => {
        if (!session) {
            toast.error('Please sign in to like posts');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/likes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId }),
            });

            if (response.ok) {
                const data = await response.json();
                setLiked(data.liked);
                setLikesCount(data.count);
                toast.success(data.message);
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to update like');
            }
        } catch (error) {
            toast.error('Something went wrong');
            console.error('Error toggling like:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggleLike}
            disabled={loading}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${liked
                    ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            <svg
                className={`w-5 h-5 ${liked ? 'fill-current' : ''}`}
                fill={liked ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
            </svg>
            <span className="text-sm font-medium">
                {likesCount} {likesCount === 1 ? 'like' : 'likes'}
            </span>
        </button>
    );
}
