"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
// import Image from 'next/image';

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

interface PhotoUploadProps {
    onUploadAction: (photo: Post) => void;
}

export default function PhotoUpload({ onUploadAction }: PhotoUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [caption, setCaption] = useState("");
    const [dragActive, setDragActive] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleFileSelect(files[0]);
        }
    };

    const handleFileSelect = (file: File) => {
        if (file.type.startsWith("image/") || file.type === "video/mp4") {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        } else {
            toast.error("Please select an image or video file");
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            handleFileSelect(files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("photo", selectedFile);
            formData.append("caption", caption);

            const response = await fetch("/api/photos", {
                method: "POST",
                body: formData,
            });
            if (response.ok) {
                const newPhoto = await response.json();
                console.log("Uploaded photo:", newPhoto);
                onUploadAction(newPhoto);

                // Reset form
                setSelectedFile(null);
                setPreviewUrl(null);
                setCaption("");
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            } else {
                // const errorData = await response.json().catch(() => ({}));
                const error = await response.json();

                const errorMessage = error.error || "An error occurred during upload";
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error("Upload error:", error);
        } finally {
            setUploading(false);
        }
    };

    const clearSelection = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setCaption("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Upload a Photo
            </h2>

            {!previewUrl ? (
                <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                        : "border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500"
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <div className="flex flex-col items-center">
                        <svg
                            className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                            Drag and drop your photo here
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">or</p>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Browse Files
                        </button>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                            PNG, JPG, GIF up to 10MB
                        </p>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={"image/*,video/*"}
                        onChange={handleFileInputChange}
                        className="hidden"
                    />
                </div>
            ) : (
                <div className="space-y-4">
                    {" "}
                    {/* Preview */}
                    <div className="relative">
                        {selectedFile?.type.startsWith("image/") ? (
                            // Image preview
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={previewUrl!}
                                alt="Preview"
                                className="w-full h-64 object-cover rounded-lg"
                            />
                        ) : selectedFile?.type === "video/mp4" ? (
                            // Video preview
                            <video
                                src={previewUrl!}
                                className="w-full h-64 object-cover rounded-lg"
                                controls
                            />
                        ) : null}
                        <button
                            onClick={clearSelection}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                    {/* Caption Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Caption (optional)
                        </label>
                        <textarea
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="Write a caption for your photo..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                            rows={3}
                        />
                    </div>
                    {/* Upload Button */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="flex-1 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                        >
                            {uploading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Uploading...
                                </>
                            ) : (
                                "Upload Photo"
                            )}
                        </button>
                        <button
                            onClick={clearSelection}
                            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
