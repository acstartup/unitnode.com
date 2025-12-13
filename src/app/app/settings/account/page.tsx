'use client';

import React, { useRef, useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useToast } from '@/contexts/ToastContext';

export default function Account() {
    const { user, refreshUser } = useUser();
    const router = useRouter();
    const { showToast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedCompanyName, setEditedCompanyName] = useState('');
    const [editedEmail, setEditedEmail] = useState('');
    const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
    const [sendingResetEmail, setSendingResetEmail] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showToast('Please upload an image file', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showToast('File size must be less than 5MB', 'error');
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
            showToast('Logo uploaded successfully', 'success');
        } catch (error) {
            console.error('Upload error:', error);
            showToast('Failed to upload logo. Please try again.', 'error');
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
            showToast('Logo removed successfully', 'success');
        } catch (error) {
            console.error('Delete error:', error);
            showToast('Failed to delete logo. Please try again.', 'error');
        } finally {
            setDeleting(false);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setEditedCompanyName(user?.companyName || '');
        setEditedEmail(user?.email || '');
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedCompanyName('');
        setEditedEmail('');
    };

    const hasChanges = () => {
        return (
            editedCompanyName !== (user?.companyName || '') ||
            editedEmail !== (user?.email || '')
        );
    };

    const handleSave = async () => {
        // Validate company name has at least one letter
        if (editedCompanyName.trim().length === 0) {
            showToast('Company name cannot be empty', 'error');
            return;
        }

        try {
            const updates: any = {};
            if (editedCompanyName !== (user?.companyName || '')) {
                updates.companyName = editedCompanyName.trim();
            }
            if (editedEmail !== (user?.email || '')) {
                updates.email = editedEmail.trim();
            }

            const response = await fetch('/api/auth/user/update', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });

            if (!response.ok) throw new Error('Update failed');

            await refreshUser();
            setIsEditing(false);
            showToast('Company information updated successfully', 'success');
        } catch (error) {
            console.error('Update error:', error);
            showToast('Failed to update account. Please try again.', 'error');
        }
    };

    const handleSendPasswordResetEmail = async () => {
        if (!user?.email) return;

        setSendingResetEmail(true);

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email }),
            });

            if (!response.ok) {
                showToast('Failed to send password reset email', 'error');
                setShowPasswordResetModal(false);
                return;
            }

            // Keep modal open to show success message
        } catch (error) {
            console.error('Password reset email error:', error);
            showToast('Failed to send password reset email', 'error');
            setShowPasswordResetModal(false);
        } finally {
            setSendingResetEmail(false);
        }
    };

    return (
        <div className="w-full bg-white">
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
                {/* Company Section Header with Edit/Save/Cancel Buttons */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
                </div>
                <div className="w-48 text-sm font-medium text-black mx-1 py-3 items-baseline">Logo</div>
                    <div className="flex flex-col items-left px-49 border-gray-200 -mt-8 mb-4">
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

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Company</h2>
                    {!isEditing ? (
                        <button
                            onClick={handleEditClick}
                            className="flex items-center border border-gray-300 gap-1.5 mx-1 px-2 py-1.25 text-sm font-medium text-gray-700 hover:border-gray-400 rounded-md transition-colors"
                        >
                            <svg
                                className="h-3.5 w-3.5"
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
                            Edit
                        </button>
                    ) : (
                        <div className="flex gap-3 mx-1">
                            <button
                                onClick={handleCancel}
                                className="px-2 py-1.25 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:border-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!hasChanges()}
                                className={`px-2.5 py-1.25 text-white text-sm font-medium rounded-md transition-colors ${
                                    hasChanges()
                                        ? 'bg-black hover:bg-gray-800 cursor-pointer'
                                        : 'bg-gray-400 cursor-not-allowed'
                                }`}
                            >
                                Save
                            </button>
                        </div>
                    )}
                </div>

                {/* Company Name */}
                <div className="flex items-baseline py-5 mx-1">
                    <div className="w-48 text-sm font-medium text-gray-800">Company Name</div>
                    {isEditing ? (
                        <input
                            type="text"
                            value={editedCompanyName}
                            onChange={(e) => setEditedCompanyName(e.target.value)}
                            className="flex-1 max-w-xl px-3 py-1 -my-2 -mx-3.25 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Company name"
                        />
                    ) : (
                        <div className="flex-1 text-sm text-gray-600">{user?.companyName || ''}</div>
                    )}
                </div>

                {/* Email */}
                <div className="flex items-baseline py-5 mx-1">
                    <div className="w-48 text-sm font-medium text-gray-800">Email</div>
                    {isEditing ? (
                        <input
                            type="email"
                            value={editedEmail}
                            onChange={(e) => setEditedEmail(e.target.value)}
                            className="flex-1 max-w-xl px-3 py-1 -my-2 -mx-3.25 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="email@example.com"
                        />
                    ) : (
                        <div className="flex-1 text-sm text-gray-600">{user?.email || ''}</div>
                    )}
                </div>

                {/* Password */}
                <div className="flex items-baseline py-5 mx-1">
                    <div className="w-48 text-sm font-medium text-gray-800">Password</div>
                    {isEditing ? (
                        <button
                            onClick={() => setShowPasswordResetModal(true)}
                            className="border border-gray-300 px-2 py-1 -my-2 -mx-3.25 text-sm font-medium text-gray-700 hover:border-gray-400 rounded-md transition-colors"
                        >
                            Change password
                        </button>
                    ) : (
                        <div className="flex-1 text-sm text-gray-600">
                            ••••••••••••
                        </div>
                    )}
                </div>
            </div>

            {/* Password Reset Modal */}
            {showPasswordResetModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/33 overflow-y-auto py-10"
                    onClick={() => setShowPasswordResetModal(false)}
                >
                    <div
                        className="relative w-[95%] max-w-[800px] h-auto min-h-[600px] md:min-h-[640px] rounded-3xl border border-white/60 shadow-xl flex flex-col items-center justify-center bg-white/80 backdrop-blur-md animate-in fade-in duration-300 p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setShowPasswordResetModal(false)}
                            className="absolute top-4 right-4 z-20 w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-300 shadow-sm hover:bg-gray-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                        {/* Content */}
                        <div className="w-full flex flex-col items-center max-w-md text-center">
                            {/* UnitNode icon */}
                            <div className="mb-5">
                                <Image
                                    src="/unitnode-icon.svg"
                                    alt="UnitNode Icon"
                                    width={40}
                                    height={40}
                                />
                            </div>

                            {!sendingResetEmail ? (
                                <>
                                    <h2 className="text-2xl font-bold mb-2">Reset Your Password</h2>
                                    <p className="text-sm text-gray-600 mb-8 font-medium max-w-sm">
                                        We&apos;ll send a password reset link to <span className="font-semibold">{user?.email}</span>. Click the link in the email to create a new password.
                                    </p>

                                    <div className="flex flex-col w-full gap-3 max-w-xs">
                                        <button
                                            onClick={handleSendPasswordResetEmail}
                                            className="w-full py-2.5 bg-black text-white rounded-full font-medium hover:bg-black/90 transition-colors text-sm"
                                        >
                                            <span className="font-bold">Send Reset Link</span>
                                        </button>
                                        <button
                                            onClick={() => setShowPasswordResetModal(false)}
                                            className="w-full py-2.5 bg-white/90 text-gray-800 rounded-full font-medium hover:bg-white transition-colors text-sm border border-white/70"
                                        >
                                            <span className="font-bold">Cancel</span>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
                                    <p className="text-sm text-gray-600 mb-8 font-medium max-w-sm">
                                        We&apos;ve sent a password reset link to <span className="font-semibold">{user?.email}</span>. Please check your inbox and follow the instructions to reset your password.
                                    </p>

                                    <div className="flex flex-col w-full gap-3 max-w-xs">
                                        <button
                                            onClick={() => setShowPasswordResetModal(false)}
                                            className="w-full py-2.5 bg-black text-white rounded-full font-medium hover:bg-black/90 transition-colors text-sm"
                                        >
                                            <span className="font-bold">Done</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}