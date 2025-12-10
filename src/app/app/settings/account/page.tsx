'use client';

import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';

export default function Account() {
    const { user } = useUser();
    const router = useRouter();

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
                {/* Company */}
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Company</h2>
                <div className="flex flex-col items-left px-100 py-4 border-gray-200 mb-6">
                    {/* Company Section */}
                    <div className="w-20 h-20 bg-gray-100 rounded-sm flex items-center justify-center mb-3">
                        <span className="text-black text-2xl font-medium">
                            {user?.companyName?.[0]?.toUpperCase() || 'U'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}