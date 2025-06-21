'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Post {
    id: string;
    title: string;
    slug: string;
    content: string;
    published: boolean;
    createdAt: string;
    updatedAt: string;
    authorId?: string;
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
        return null;
    }

    const renderMedia = (post: Post, isFullSize: boolean = false) => {
        if (post.content.endsWith('.mp4') || post.content.includes('.mp4?')) {
            console.log(`Rendering video for post `);
            return (
                <video
                    src={post.content}
                    controls
                    className={isFullSize ? "max-h-[70vh] w-auto" : "object-cover w-full h-full"}
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
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700"
                        onClick={() => setSelectedPost(post)}
                    >
                        <div className="relative aspect-square">
                            {renderMedia(post)}
                        </div>
                        <div className="p-4">
                            <p className="text-gray-700 dark:text-gray-300 font-semibold line-clamp-1">
                                {post.title}
                            </p>

                            <Link href={post.content} target='_blank' className="text-gray-500 dark:text-gray-400 text-sm mt-1 block line-clamp-2">
                                {post.content}
                            </Link>
                            <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                                {formatDate(post.createdAt)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal for full-size media */}
            {selectedPost && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="relative max-w-4xl max-h-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
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
                        <div className="relative" style={{ width: '800px', height: '600px' }}>
                            {renderMedia(selectedPost, true)}
                        </div>

                        {/* Title, content and date */}
                        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                            <h2 className="text-gray-900 dark:text-white text-xl font-semibold mb-2">
                                {selectedPost.title}
                            </h2>
                            <p className="text-gray-900 dark:text-white text-lg mb-2">
                                {selectedPost.content}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                {formatDate(selectedPost.createdAt)}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
