'use client';

import { useState, useEffect } from 'react';
import { useProperties } from '@/contexts/PropertyContext';
import { useToast } from '@/contexts/ToastContext';

interface AddPaymentOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddPaymentOverlay({ isOpen, onClose }: AddPaymentOverlayProps) {
    const [propertyAddress, setPropertyAddress] = useState('');
    const { showToast } = useToast();

    const { properties } = useProperties();
    const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
    const [filteredProperties, setFilteredProperties] = useState<typeof properties>([]);
    const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setPropertyAddress('');
            setSelectedPropertyId('');
            setFilteredProperties([]);
            setShowPropertyDropdown(false);
        }
    }, [isOpen]);

    const handlePropertyAddressChange = (value: string) => {
        setPropertyAddress(value);
        if (value.trim()) {
            const filtered = properties.filter(p =>
                p.address.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredProperties(filtered);
            setShowPropertyDropdown(true);
        } else {
            setFilteredProperties([]);
            setShowPropertyDropdown(false);
            setSelectedPropertyId('');
        }
    };

    const handleSelectProperty = (propertyId: string, address: string) => {
        setSelectedPropertyId(propertyId);
        setPropertyAddress(address);
        setShowPropertyDropdown(false);
        setFilteredProperties([]);
    }

    if (!isOpen) return null;

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
                    className="bg-white border shadow-lg rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto animate-in fade-in zone-in-95 duration-200 relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="px-4 py-4 border-gray-200">
                        <h2 className="text-md font-semibold text-gray-900">
                            Add payment
                        </h2>
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
                        {/* Property Address Search Section */}
                        <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Property address
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={propertyAddress}
                                    onChange={(e) => handlePropertyAddressChange(e.target.value)}
                                    onFocus={() => propertyAddress && setShowPropertyDropdown(true)}
                                    onBlurCapture={() => setTimeout(() => setShowPropertyDropdown(false), 200)}
                                    className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="123 Main Street, Anytown, CA 902310, USA"
                                />

                                {/* Property Dropdown */}
                                {showPropertyDropdown && filteredProperties.length > 0 && (
                                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                        {filteredProperties.map((property) => (
                                            <button
                                                key={property.id}
                                                onClick={() => handleSelectProperty(property.id, property.address)}
                                                className="w-full px-3 py-2 text-left hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
                                            >
                                                <div className="text-sm font-medium text-gray-900">
                                                    {property.address}
                                                </div>
                                                {property.ownerName && (
                                                    <div className="text-xs text-gray-500">
                                                        Owner: {property.ownerName}
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {showPropertyDropdown && propertyAddress && filteredProperties.length === 0 && (
                                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3">
                                        <div className="text-sm text-gray-500">
                                            No properties found
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* TODO: Add payment form fields here */}
                    </div>


                    {/* Footer Button */}
                    <div className="sticky bottom-0 left-0 right-0 px-4 py-4 flex justify-end gap-3 bg-white">
                        <button
                            onClick={onClose}
                            className="px-3 py-1 bg-white border border-gray-300 text-gray-700 text-sm font-small rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                if (!selectedPropertyId) {
                                    showToast('Please select a property first', 'error');
                                    return;
                                }

                                // TODO: Add payment submission logic
                            }}
                            disabled={!selectedPropertyId}
                            className="px-3 py-1 bg-black text-white text-sm font-small rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            Add payment
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
