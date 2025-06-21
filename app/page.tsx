'use client';

import { useState, useEffect } from 'react';
import PhotoUpload from './components/PhotoUpload';
import PhotoGrid from './components/PhotoGrid';
import Header from './components/Header';

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

export default function Home() {
  const [photos, setPhotos] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Load photos when component mounts
  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/photos');
      if (response.ok) {
        const data = await response.json();
        setPhotos(data.photos);
      }
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = () => {
    loadPhotos(); // Reload photos after upload
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Section */}
        <div className="mb-8">
          <PhotoUpload onUploadAction={handlePhotoUpload} />
        </div>

        {/* Photos Grid */}
        <div>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">Loading photos...</span>
            </div>
          ) : (
            <PhotoGrid posts={photos} />
          )}
        </div>

        {/* Empty State */}
        {!loading && photos.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No photos yet</h3>
            <p className="text-gray-500 dark:text-gray-400">Upload your first photo to get started!</p>
          </div>
        )}
      </main>
    </div>
  );
}
