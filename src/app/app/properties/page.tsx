'use client';

import { useProperties } from '@/contexts/PropertyContext';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Properties(){
    const { properties } = useProperties();
    const router = useRouter();
    const [showOwnerFilter, setShowOwnerFilter] = useState(false);
    const [selectedOwners, setSelectedOwners] = useState<string[]>([]);
    const filterRef = useRef<HTMLDivElement>(null);

    // Get unique owners
    const uniqueOwners = Array.from(new Set(properties.map(p => p.ownerName).filter(Boolean))) as string[];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setShowOwnerFilter(false);
            }
        };

        if (showOwnerFilter) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showOwnerFilter]);

    const handleViewDetails = (propertyId: string) => {
        router.push(`/app/properties/${propertyId}`);
    }

    const toggleOwner = (owner: string) => {
        setSelectedOwners(prev =>
            prev.includes(owner)
                ? prev.filter(o => o !== owner)
                : [...prev, owner]
        );
    };

    const clearFilters = () => {
        setSelectedOwners([]);
    };

    // Filter properties based on selected owners
    const filteredProperties = selectedOwners.length > 0
        ? properties.filter(p => p.ownerName && selectedOwners.includes(p.ownerName))
        : properties;

    return (
        <div className="w-full bg-white">
            {/* Page Header */}
            <div className="mb-1">
                <h1 className="text-3xl font-semibold text-gray-900 px-8 py-8">Properties</h1>
            </div>

            {/* Filter Bar */}
            <div className="px-8 mb-2 flex items-center gap-2">
                <div className="relative" ref={filterRef}>
                    <button
                        onClick={() => setShowOwnerFilter(!showOwnerFilter)}
                        className={`inline-flex items-center gap-1.5 px-2 py-0.75 text-xs font-medium rounded-md border border-dashed transition-colors ${
                            selectedOwners.length > 0
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Owner
                        {selectedOwners.length > 0 && (
                            <span className="ml-0.5 px-1 py-0.5 text-[10px] font-semibold bg-white text-gray-900 rounded">
                                {selectedOwners.length}
                            </span>
                        )}
                    </button>

                    {/* Dropdown */}
                    {showOwnerFilter && (
                        <div className="absolute top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10 animate-in fade-in slide-in-from-top-1 duration-200">
                            <div className="p-2 max-h-64 overflow-y-auto">
                                {uniqueOwners.length > 0 ? (
                                    uniqueOwners.map((owner) => (
                                        <label
                                            key={owner}
                                            className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedOwners.includes(owner)}
                                                onChange={() => toggleOwner(owner)}
                                                className="w-3.5 h-3.5 text-gray-900 border-gray-300 rounded focus:ring-gray-900 focus:ring-1"
                                            />
                                            <span className="text-sm text-gray-700">{owner}</span>
                                        </label>
                                    ))
                                ) : (
                                    <div className="px-2 py-3 text-xs text-gray-500 text-center">
                                        No owners found
                                    </div>
                                )}
                            </div>
                            {selectedOwners.length > 0 && (
                                <div className="border-t border-gray-200 p-2">
                                    <button
                                        onClick={clearFilters}
                                        className="w-full px-2 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded transition-colors"
                                    >
                                        Clear filters
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Table Container */}
            <div className="border border-gray-200 rounded-lg mx-8">
                <table className="w-full overflow-visible rounded-lg">
                    {/* Table Header */}
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[45%]">
                                Property Address
                            </th>
                            <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[18%]">
                                Owner
                            </th>
                            <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[25%]">
                                Tenant
                            </th>
                            <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[12%]">
                                Rent
                            </th>
                            <th className="px-4 py-2 w-[5%]"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProperties.map((property) => {
                            const tenantNames = property.tenants && property.tenants.length > 0
                                ? property.tenants.map(t => t.name).join(', ')
                                : (property.mainTenant && property.mainTenant !== 'N/A' ? property.mainTenant : '—');
                            const textLength = tenantNames.length;
                            const fontSize = textLength > 50 ? 'text-xs' : textLength > 30 ? 'text-sm' : 'text-sm';
                            const rentDisplay = property.rent === 0 ? '—' : property.rent;

                            return (
                                <tr key={property.id}>
                                    <td className="px-4 py-1 text-sm text-gray-900">{property.address}</td>
                                    <td className="px-4 py-1 text-sm text-gray-500">{property.ownerName || '—'}</td>
                                    <td className={`px-4 py-1 ${fontSize} text-gray-500 truncate max-w-0`}>
                                        {tenantNames}
                                    </td>
                                    <td className="px-4 py-1 text-sm text-gray-500">{rentDisplay}</td>
                                    <td className="px-4 py-1 text-right">
                                        <div className="relative group inline-block">
                                            <button
                                                onClick={() => handleViewDetails(property.id)}
                                                className="p-1 rounded-2xl hover:bg-gray-100 transition-colors"
                                                aria-label="Actions"
                                            >
                                                <svg
                                                    className="h-5 w-5 text-gray-400"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle cx="12" cy="6" r="2" />
                                                    <circle cx="12" cy="13" r="2" />
                                                    <circle cx="12" cy="20" r="2" />
                                                </svg>
                                            </button>

                                            {/* Action Tooltip */}
                                            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-0 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                                                Details
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

        </div>
    );
}