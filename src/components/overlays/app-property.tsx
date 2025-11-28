'use client';

import { useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import PlacesAutocomplete from '../PlacesAutocomplete';
import { useProperties } from '@/contexts/PropertyContext';

interface AddPropertyOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

const libraries: ("places")[] = ["places"];

export default function AddPropertyOverlay({ isOpen, onClose }: AddPropertyOverlayProps) {
    const [address, setAddress] = useState('');
    const { addProperty } = useProperties();

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries,
    })
   
    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!address.trim()) {
            alert('Please enter an address');
            return;
        }

        addProperty({
            address: address.trim(),
            mainTenant: 'N/A',
            rent: 0,
            occupied: false,
            createdAt: new Date(),
        })

        setAddress('');
        onClose();
    }

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
                    className="bg-white border shadow-lg rounded-lg w-full max-w-xl h-96 pointer-events-auto animate-in fade-in zoom-in-95 duration-200 relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="px-4 py-4 border-gray-200">
                        <h2 className="text-md font-semibold text-gray-900">Add property</h2>
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
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>

                    {/* Form Content */}
                    <div className="px-4 py-2">
                        <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Property address
                            </label>
                            {isLoaded ? (
                                <PlacesAutocomplete
                                    value={address}
                                    onChange={setAddress}
                                    onSelect={setAddress}
                                />
                            ) : (
                                <input
                                    type="text"
                                    className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Loading..."
                                    disabled
                                />
                            )}
                        </div>
                    </div>

                    {/* Footer Button */}
                    <div className="absolute bottom-0 left-0 right-0 px-4 py-4 border-gray-200 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-3 py-1 bg-white border border-gray-300 text-gray-700 text-sm font-small rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-3 py-1 bg-black text-white text-sm font-small rounded-md hover:bg-gray-800 transition-colors"
                        >
                            Add property
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}