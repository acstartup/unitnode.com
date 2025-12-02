'use client';

import { useState } from 'react';

interface AddLeaseOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Tenant {
    id: string;
    name: string;
    phone: string;
    relation: string;
}

export default function AddLeaseOverlay({ isOpen, onClose }: AddLeaseOverlayProps) {
    const [propertyAddress, setPropertyAddress] = useState('');
    const [tenants, setTenants] = useState<Tenant[]>([
        { id: '1', name: '', phone: '', relation: 'Main' }
    ]);
    const [utilityType, setUtilityType] = useState('Rent');
    const [utilityRecurrence, setUtilityRecurrence] = useState('Monthly');
    const [utilityCost, setUtilityCost] = useState('');

    const relationOptions = [
        'Main',
        'Spouse',
        'Son',
        'Daughter',
        'Father',
        'Mother',
        'Brother',
        'Sister',
        'Grandfather',
        'Grandmother',
        'Uncle',
        'Aunt',
        'Cousin',
        'Friend',
        'Other'
    ];

    const addTenant = () => {
        const newId = Math.max(...tenants.map(t => parseInt(t.id)), 0) + 1;
        setTenants([...tenants, { id: newId.toString(), name: '', phone: '', relation: 'Spouse' }]);
    }

    const updateTenant = (id: string, field: string, value: string) => {
        setTenants(tenants.map(t =>
            t.id === id ? { ...t, [field]: value } : t
        ));
    };

    const removeTenant = (id: string) => {
        if (tenants.length > 1) {
            setTenants(tenants.filter(t => t.id !== id));
        }
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
                        <h2 className="text-sm font-semibold py-2 text-gray-900">Tenant information</h2>

                        {tenants.map((tenant, index) => (
                            <div key={tenant.id}>
                                <div className="flex gap-3">
                                    {/* Name Box */}
                                    <div className="flex-[1.3]">
                                        {index === 0 && (
                                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                                Name
                                            </label>
                                        )}
                                        <input
                                            type="text"
                                            value={tenant.name}
                                            onChange={(e) => updateTenant(tenant.id, 'name', e.target.value)}
                                            className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:transparent"
                                            placeholder="John Tenant"             
                                        />
                                    </div>

                                    {/* Phone Box */}
                                    <div className="flex-[0.7]">
                                        {index === 0 && (
                                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                                Phone
                                            </label>
                                        )}
                                        <input
                                            type="tel"
                                            value={tenant.phone}
                                            onChange={(e) => updateTenant(tenant.id, 'phone', e.target.value)}
                                            className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="(555) 123-4567"
                                        />
                                    </div>

                                    {/* Relation Dropdown */}
                                    <div className="flex-[0.6]">
                                        {index === 0 && (
                                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                                Relation
                                            </label>
                                        )}
                                        <div className="relative">
                                            <select
                                                value={tenant.relation}
                                                onChange={(e) => updateTenant(tenant.id, 'relation', e.target.value)}
                                                disabled={index === 0}
                                                className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-600 appearance-none"
                                            >
                                                {relationOptions.filter(option => index === 0 || option !== 'Main').map(option => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                            <svg
                                                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M6 9l6 6 6-6"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Add Tenant Button */}
                                {index === tenants.length - 1 && (
                                    <div className="flex gap-2 mt-3">
                                        <button
                                            onClick={addTenant}
                                            className="flex items-center justify-center h-8 w-8 border-2 border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-gray-600 hover:text-gray-900"
                                            aria-label="Add tenant"
                                        >
                                            <svg
                                                className="h-5 w-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 4v16m8-8H4"
                                                />
                                            </svg>
                                        </button>
                                        {/* Remove Tenant Button */}
                                        {tenants.length > 1 && (
                                            <button
                                                onClick={() => removeTenant(tenant.id)}
                                                className="flex items-center justify-center h-8 w-8 border-2 border-red-300 rounded-md hover:bg-red-50 transition-colors text-red-600 hover:text-red-900"
                                                aria-label="Remove tenant"
                                            >
                                                <svg
                                                    className="h-4 w-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M20 12H4"
                                                    />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                )}
                                <div className="my-3"></div>
                            </div>
                        ))}

                        {/* Utility Section */}
                        <h2 className="text-sm font-semibold py-2 text-gray-900">Utility details</h2>
                        
                        <div className="flex gap-3">
                            {/* Type Dropdown */}
                            <div className="flex-[1.3]">
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Type
                                </label>
                                <div className="relative">
                                    <select
                                        value={utilityType}
                                        onChange={(e) => setUtilityType(e.target.value)}
                                        className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                    >
                                        <option value="Rent">Rent</option>
                                    </select>
                                    <svg
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 9l6 6 6-6"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Recurrence Dropdown */}
                            <div className="flex-[0.7]">
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Recurrence
                                </label>
                                <div className="relative">
                                    <select
                                        value={utilityRecurrence}
                                        onChange={(e) => setUtilityRecurrence(e.target.value)}
                                        className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                    >
                                        <option value="Monthly">Monthly</option>
                                    </select>
                                    <svg
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 9l6 6 6-6"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Cost Box */}
                            <div className="flex-[0.6]">
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Cost
                                </label>
                                <input
                                    type="text"
                                    value={utilityCost}
                                    onChange={(e) => setUtilityCost(e.target.value)}
                                    className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="$1200"
                                />
                            </div>
                        </div>
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