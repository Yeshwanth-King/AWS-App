'use client';

import { useState } from 'react';
import Image from 'next/image';
import LikeButton from './LikeButton';
import Comments from './Comments';

interface Author {
    id: string;
    username: string;
    name: string | null;
    avatar: string | null;
}

interface Post {
    id: string;
    title: string;
    slug: string;
    content: string;
    fileType: string;
    published: boolean;
    createdAt: string;
    updatedAt: string;
    authorId?: string;
    author?: Author;
    _count?: {
        likes: number;
        comments: number;
    };
}

interface PhotoGridProps {
    posts: Post[];
}

export default function PhotoGrid({ posts }: PhotoGridProps) {
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (posts.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-500 dark:text-gray-400">
                    <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-lg font-medium mb-2">No photos yet</h3>
                    <p>Be the first to share a photo!</p>
                </div>
            </div>
        );
    }

    const renderMedia = (post: Post, isFullSize: boolean = false) => {
        if (post.fileType === 'video' || post.content.includes('.mp4')) {
            return (
                <video
                    src={post.content}
                    controls
                    className={isFullSize ? "max-h-[50vh] w-auto" : "object-cover w-full h-full"}
                    playsInline
                />
            );
        } else {
            return (
                <Image
                    src={post.content}
                    alt={post.title || 'Media'}
                    fill
                    className={isFullSize ? "max-h-[70vh] w-auto object-contain" : "object-cover"}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
            );
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
                    >
                        <div
                            className="relative aspect-square cursor-pointer"
                            onClick={() => setSelectedPost(post)}
                        >
                            {renderMedia(post)}
                            {/* File type indicator */}
                            {post.fileType === 'video' && (
                                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                                    VIDEO
                                </div>
                            )}
                        </div>

                        <div className="p-4">
                            {/* Author info */}
                            {post.author && (
                                <div className="flex items-center mb-3">
                                    {post.author.avatar ? (
                                        <Image
                                            src={post.author.avatar}
                                            alt={post.author.name || post.author.username}
                                            width={24}
                                            height={24}
                                            className="h-6 w-6 rounded-full mr-2"
                                        />
                                    ) : (
                                        <div className="h-6 w-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mr-2">
                                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                {(post.author.name || post.author.username).charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {post.author.name || post.author.username}
                                    </span>
                                </div>
                            )}

                            {/* Caption */}
                            {post.title && (
                                <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                                    {post.title}
                                </p>
                            )}

                            {/* Interaction buttons */}
                            <div className="flex items-center justify-between">
                                <LikeButton postId={post.id} />
                                <button
                                    onClick={() => setSelectedPost(post)}
                                    className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <span className="text-sm">
                                        {post._count?.comments || 0}
                                    </span>
                                </button>
                            </div>

                            {/* Date */}
                            <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                                {formatDate(post.createdAt)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal for full-size media with comments */}
            {selectedPost && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="relative max-w-4xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-lg overflow-hidden flex flex-col">
                        {/* Close button */}
                        <button
                            onClick={() => setSelectedPost(null)}
                            className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Media */}
                        <div className="relative flex-shrink-0" style={{ width: '800px', height: '400px' }}>
                            {renderMedia(selectedPost, true)}
                        </div>

                        {/* Content area - scrollable */}
                        <div className="flex-1 overflow-y-auto">
                            {/* Header with author and actions */}
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                    {selectedPost.author && (
                                        <div className="flex items-center">
                                            {selectedPost.author.avatar ? (
                                                <Image
                                                    src={selectedPost.author.avatar}
                                                    alt={selectedPost.author.name || selectedPost.author.username}
                                                    width={40}
                                                    height={40}
                                                    className="h-10 w-10 rounded-full mr-3"
                                                />
                                            ) : (
                                                <div className="h-10 w-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mr-3">
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        {(selectedPost.author.name || selectedPost.author.username).charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {selectedPost.author.name || selectedPost.author.username}
                                                </h3>
                                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                                    {formatDate(selectedPost.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    <LikeButton postId={selectedPost.id} />
                                </div>

                                {/* Caption */}
                                {selectedPost.title && (
                                    <p className="text-gray-900 dark:text-white mb-4">
                                        {selectedPost.title}
                                    </p>
                                )}
                            </div>

                            {/* Comments section */}
                            <div className="p-6">
                                <Comments postId={selectedPost.id} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
