'use client';

import { useState } from 'react';

interface AddPropertyOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddPropertyOverlay({ isOpen, onClose }: AddPropertyOverlayProps) {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
                onClick={onClose}
            />

            {/* Overlay Content */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="bg-white rounded-lg shadow-xl w-full max-w-2xl pointer-events-auto animate-in fade-in zoom-in-95 durations-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Add property</h2>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Close"
                        >
                            <svg
                                className="h-5 w-5 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                />
                            </svg>
                        </button>
                    </div>
                      
                    {/* Body */}
                    <div className="px-6 py-4">
                        <p className="text-gray-600">Property form content will go here...</p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-md transition-colors"
                        >
                            Add property
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}