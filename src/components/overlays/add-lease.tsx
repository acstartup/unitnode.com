'use client';

import { useState } from 'react';

interface AddLeaseOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddLeaseOverlay({ isOpen, onClose }: AddLeaseOverlayProps) {
    if (!isOpen) return null;

    const [propertyAddress, setPropertyAddress] = useState('');

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/20 bg-opacity-50 z-1 transition-opacity"
                onClick={onClose}
            />

            {/* Overlay Content */}
            <div className="fixed inset-0 z-2 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="bg-white border shadow-lg rounded-lg w-full max-w-xl h-110 pointer-events-auto animate-in fade-in zone-in-95 duration-200 relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="px-4 py-4 border-gray-200">
                        <h2 className="text-md font-semibold text-gray-900">Add lease</h2>
                    </div>
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 transition-colors group"
                        aria-label="Close"
                    >
                        <svg
                            className="h-5 w-5 text-gray-500 group-hover:text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <svg
                                className="h-5 w-5 text-gray-500 group-hover:text-gray-600"
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
                        </svg>
                    </button>

                    {/* Form Content */}
                    <div className="px-4 py-2">
                        {/* Property Address Search Section */}
                        <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Property address
                            </label>
                            <input
                                type="text"
                                value={propertyAddress}
                                onChange={(e) => setPropertyAddress(e.target.value)}
                                className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="123 Main Street, Anytown, CA 902310, USA"
                            />    
                        </div>

                        {/* Tenant Section */}
                        <h2 className="text-sm font-semibold py-2 text-gray-900">Tenant Information</h2>

                        <div className="flex gap-3">
                            {/* Name Box */}
                            <div className="flex-[2]">
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="John Tenant"
                                />
                            </div>

                            {/* Phone Box */}
                            <div className="flex-[1]">
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="(555) 123-4567"
                                />
                            </div>

                            {/* Relation */}
                            <div className="flex-[0.6]">
                                <label className="block text-sm font-medium text-gray=900 mb-2">
                                    Relation
                                </label>
                                <input 
                                    type="text"
                                    value="Main"
                                    disabled
                                    className="w-full px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-600 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer Button */}
                    <div className="absolute buttom-0 left-0 right-0 px-4 py-4 border-gray-200 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-3 py-1 bg-white border border-gray-300 text-gray-700 text-sm font-small rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            className="px-3 py-1 bg-black text-white text-sm font-small rounded-md hover:bg-gray-800 transition-colors"
                        >
                            Add lease
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}