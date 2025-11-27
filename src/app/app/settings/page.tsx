'use client';

import React from 'react';

export default function Settings() {
    return (
        <div className="min-h-screen w-full bg-white p-8">
            {/* Setting Header */}
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900">General Settings</h1>
            </div>

            {/* Personal Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
                {/* Account */}
                <a
                    href="#"
                    className="p-4 border border-gray-200 rounded-lg hover:border-gray-200 hover:bg-gray-50 transition-all"
                >
                    <div className="flex items-start gap-4">
                        {/* Icon Container */}
                        <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <svg
                                className="w-5 h-5 text-gray-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        </div>
                        {/* Text Content */}
                        <div className="flex-1">
                            <h3 className="text-base font-semibold text-gray-900 mb-0">Account</h3>
                            <p className="text-sm text-gray-600">Manage your account information</p>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    )
}