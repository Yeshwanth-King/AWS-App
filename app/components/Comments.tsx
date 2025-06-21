'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/lib/AuthContext';
import { toast } from 'sonner';
import Image from 'next/image';

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    author: {
        id: string;
        username: string;
        name: string | null;
        avatar: string | null;
    };
}

interface CommentsProps {
    postId: string;
}

export default function Comments({ postId }: CommentsProps) {
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    useEffect(() => {
        const loadCommentsData = async () => {
            try {
                const response = await fetch(`/api/comments?postId=${postId}`);
                if (response.ok) {
                    const data = await response.json();
                    setComments(data.comments);
                }
            } catch (error) {
                console.error('Error loading comments:', error);
            } finally {
                setLoading(false);
            }
        };

        loadCommentsData();
    }, [postId]); const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error('Please sign in to comment');
            return;
        }

        if (!newComment.trim()) {
            toast.error('Comment cannot be empty');
            return;
        }

        setSubmitting(true);

        try {
            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: newComment.trim(),
                    postId,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setComments([data.comment, ...comments]);
                setNewComment('');
                toast.success('Comment added!');
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to add comment');
            }
        } catch (error) {
            toast.error('Something went wrong');
            console.error('Error adding comment:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!confirm('Are you sure you want to delete this comment?')) {
            return;
        }

        try {
            const response = await fetch(`/api/comments?commentId=${commentId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setComments(comments.filter(comment => comment.id !== commentId));
                toast.success('Comment deleted');
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to delete comment');
            }
        } catch (error) {
            toast.error('Something went wrong');
            console.error('Error deleting comment:', error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Comments ({comments.length})
                </h3>                {/* Comment form */}
                {user ? (
                    <form onSubmit={handleSubmit} className="mb-6">
                        <div className="mb-4">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                disabled={submitting}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submitting || !newComment.trim()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Posting...' : 'Post Comment'}
                        </button>
                    </form>
                ) : (
                    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                        <p className="text-gray-600 dark:text-gray-400">
                            Please sign in to leave a comment.
                        </p>
                    </div>
                )}

                {/* Comments list */}
                {loading ? (
                    <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                ) : comments.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                        No comments yet. Be the first to comment!
                    </p>
                ) : (
                    <div className="space-y-4">
                        {comments.map((comment) => (
                            <div key={comment.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">                      {comment.author.avatar ? (
                                            <Image
                                                src={comment.author.avatar}
                                                alt={comment.author.name || comment.author.username}
                                                width={32}
                                                height={32}
                                                className="h-8 w-8 rounded-full"
                                            />
                                        ) : (
                                            <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {(comment.author.name || comment.author.username).charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                                {comment.author.name || comment.author.username}
                                            </h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {formatDate(comment.createdAt)}
                                            </p>
                                        </div>
                                    </div>                                    {user && user.id === comment.author.id && (
                                        <button
                                            onClick={() => handleDelete(comment.id)}
                                            className="text-red-500 hover:text-red-700 text-sm"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                                <div className="mt-3">
                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
