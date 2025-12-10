'use client';

import React, { useRef, useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Account() {
    const { user, refreshUser } = useUser();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload/logo', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');

            const data = await response.json();
            console.log('Uploaded:', data);
            await refreshUser();
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload logo. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteLogo = async () => {
        setDeleting(true);

        try {
            const response = await fetch('/api/upload/logo/delete', {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Delete failed');

            await refreshUser();
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete logo. Please try again.');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="w-full bg-white min-h-screen">
            {/* Breadcrumbs */}
            <div className="px-8 pt-8 pb-1">
                <div className="flex items-center text-sm text-gray-500 font-semibold">
                    <button
                        onClick={() => router.push('/app/settings')}
                        className="hover:text-gray-700 transition-colors"
                    >
                        Settings
                    </button>
                    <svg
                        className="h-4 w-4 mx-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </div>
            </div>

            {/* Header */}
            <div className="mb-0">
                <h1 className="text-3xl font-semibold text-gray-900 px-8">Account</h1>
            </div>

            {/* Content */}
            <div className="px-8 py-5">
                <div className="text-lg font-semibold text-gray-900 mb-4">Profile</div>
                    <div className="flex flex-col items-left px-100 border-gray-200 mb-6">
                        {/* Logo */}
                        <div className="relative w-20 h-20 group">
                            <div className="w-20 h-20 bg-gray-100 rounded-sm flex items-center justify-center mb-3 overflow-hidden">
                                {user?.companyLogo ? (
                                    <Image
                                        src={user.companyLogo}
                                        alt="Company Logo"
                                        width={80}
                                        height={80}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <span className="text-black text-2xl font-medium">
                                        {user?.companyName?.[0]?.toUpperCase() || 'U'}
                                    </span>
                                )}
                            </div>

                            {/* File input (hidden) */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                                disabled={uploading || deleting}
                            />

                            {user?.companyLogo ? (
                                /* Delete button (X) - shows when logo exists */
                                <button
                                    onClick={handleDeleteLogo}
                                    disabled={deleting}
                                    className="absolute -top-1 -right-1 w-6 h-6 bg-white hover:bg-gray-50 border border-gray-300 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                    title="Remove logo"
                                >
                                    {deleting ? (
                                        <svg 
                                            className="animate-spin h-3 w-3 text-white" 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            fill="none" 
                                            viewBox="0 0 24 24">
                                            <circle 
                                                className="opacity-25" 
                                                cx="12" 
                                                cy="12" 
                                                r="10" 
                                                stroke="currentColor" 
                                                strokeWidth="4"
                                            ></circle>
                                            <path 
                                                className="opacity-75" 
                                                fill="currentColor" 
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                            </path>
                                        </svg>
                                    ) : (
                                        <svg
                                            className="h-3.5 w-3.5 text-black"
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
                                    )}
                                </button>
                            ) : (
                                /* Upload button (pencil) - shows when no logo */
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="absolute bottom-0 right-0 w-7 h-7 bg-white border border-gray-300 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-gray-50"
                                >
                                    {uploading ? (
                                        <svg className="animate-spin h-3.5 w-3.5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <svg
                                            className="h-3.5 w-3.5 text-gray-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                            />
                                        </svg>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                {/* Company */}
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Company</h2>
                    <div className="flex items-baseline py-3 mx-1">
                        <div className="w-48 text-sm font-medium text-gray-800">Name</div>
                    </div>
                    <div className="flex items-baseline py-5 mx-1">
                        <div className="w-48 text-sm font-medium text-gray-800">Email</div>
                    </div>
                    <div className="flex items-baseline py-3 mx-1">
                        <div className="w-48 text-sm font-medium text-gray-800">Password</div>
                    </div>
            </div>
        </div>
    )
}