'use client';

import { useProperties } from '@/contexts/PropertyContext';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Properties(){
    const { properties } = useProperties();
    const router = useRouter();
    const [showOwnerFilter, setShowOwnerFilter] = useState(false);
    const [selectedOwners, setSelectedOwners] = useState<string[]>([]);
    const [ownerFilterInput, setOwnerFilterInput] = useState('');
    const [showLocationFilter, setShowLocationFilter] = useState(false);
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const [locationFilterInput, setLocationFilterInput] = useState('');
    const [showRentFilter, setShowRentFilter] = useState(false);
    const [rentMin, setRentMin] = useState('');
    const [rentMax, setRentMax] = useState('');
    const [activeRentRange, setActiveRentRange] = useState<{min: number | null, max: number | null} | null>(null);
    const [showVacantOnly, setShowVacantOnly] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);
    const locationFilterRef = useRef<HTMLDivElement>(null);
    const rentFilterRef = useRef<HTMLDivElement>(null);

    const removeOwnerFilter = (owner: string) => {
        setSelectedOwners(prev => prev.filter(o => o !== owner));
    };

    const removeLocationFilter = (location: string) => {
        setSelectedLocations(prev => prev.filter(l => l !== location));
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setShowOwnerFilter(false);
            }
            if (locationFilterRef.current && !locationFilterRef.current.contains(event.target as Node)) {
                setShowLocationFilter(false);
            }
            if (rentFilterRef.current && !rentFilterRef.current.contains(event.target as Node)) {
                setShowRentFilter(false);
            }
        };

        if (showOwnerFilter || showLocationFilter || showRentFilter) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showOwnerFilter, showLocationFilter, showRentFilter]);

    const handleViewDetails = (propertyId: string) => {
        router.push(`/app/properties/${propertyId}`);
    }

    const applyFilter = () => {
        const trimmedInput = ownerFilterInput.trim();
        if (trimmedInput && !selectedOwners.includes(trimmedInput)) {
            setSelectedOwners([...selectedOwners, trimmedInput]);
        }
        setOwnerFilterInput('');
        setShowOwnerFilter(false);
    };

    const applyLocationFilter = () => {
        const trimmedInput = locationFilterInput.trim();
        if (trimmedInput && !selectedLocations.includes(trimmedInput)) {
            setSelectedLocations([...selectedLocations, trimmedInput]);
        }
        setLocationFilterInput('');
        setShowLocationFilter(false);
    };

    const applyRentFilter = () => {
        const min = rentMin ? parseFloat(rentMin) : null;
        const max = rentMax ? parseFloat(rentMax) : null;

        if (min !== null || max !== null) {
            setActiveRentRange({ min, max });
        }
        setRentMin('');
        setRentMax('');
        setShowRentFilter(false);
    };

    const removeRentFilter = () => {
        setActiveRentRange(null);
        setRentMin('');
        setRentMax('');
    };

    const clearFilters = () => {
        setSelectedOwners([]);
        setOwnerFilterInput('');
        setSelectedLocations([]);
        setLocationFilterInput('');
        setActiveRentRange(null);
        setRentMin('');
        setRentMax('');
        setShowVacantOnly(false);
    };

    // Filter properties based on selected owners, locations, rent range, and vacancy
    let filteredProperties = properties;

    if (selectedOwners.length > 0) {
        filteredProperties = filteredProperties.filter(p => p.ownerName && selectedOwners.includes(p.ownerName));
    }

    if (selectedLocations.length > 0) {
        filteredProperties = filteredProperties.filter(p => {
            return selectedLocations.some(location =>
                p.address.toLowerCase().includes(location.toLowerCase())
            );
        });
    }

    if (activeRentRange) {
        filteredProperties = filteredProperties.filter(p => {
            const rent = p.rent || 0;
            if (activeRentRange.min !== null && rent < activeRentRange.min) return false;
            if (activeRentRange.max !== null && rent > activeRentRange.max) return false;
            return true;
        });
    }

    if (showVacantOnly) {
        filteredProperties = filteredProperties.filter(p => {
            const hasNoTenants = (!p.tenants || p.tenants.length === 0) &&
                                 (!p.mainTenant || p.mainTenant === 'N/A');
            return hasNoTenants;
        });
    }

    return (
        <div className="w-full bg-white">
            {/* Page Header */}
            <div className="mb-1">
                <h1 className="text-3xl font-semibold text-gray-900 px-8 py-6">Properties</h1>
            </div>

            {/* Filter Bar */}
            <div className="px-8 mb-2 flex items-center gap-2 flex-wrap">
                <div className="relative" ref={filterRef}>
                    <button
                        onClick={() => setShowOwnerFilter(!showOwnerFilter)}
                        className={`inline-flex items-center gap-1.5 px-2 py-0.75 text-xs font-medium rounded-md border transition-colors ${
                            selectedOwners.length > 0
                                ? 'bg-white text-gray-700 border-gray-900 hover:bg-gray-50'
                                : 'bg-white text-gray-700 border-dashed border-gray-300 hover:bg-gray-50'
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
                    </button>

                    {/* Dropdown */}
                    {showOwnerFilter && (
                        <div className="absolute top-full mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10 animate-in fade-in slide-in-from-top-1 duration-200 p-3">
                            <label className="block -mt-1 text-xs font-medium text-gray-700 mb-2">
                                Filter by: Owner Name
                            </label>
                            <input
                                type="text"
                                value={ownerFilterInput}
                                onChange={(e) => setOwnerFilterInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        applyFilter();
                                    }
                                }}
                                placeholder=""
                                className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent mb-2"
                            />
                            <div className="flex justify-center">
                                <button
                                    onClick={applyFilter}
                                    disabled={!ownerFilterInput.trim()}
                                    className={`px-3 py-1 text-white text-xs font-medium rounded-md transition-colors -mb-1 ${
                                        ownerFilterInput.trim()
                                            ? 'bg-gray-900 hover:bg-gray-800 cursor-pointer'
                                            : 'bg-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Active Filter Chips */}
                {selectedOwners.map((owner) => (
                    <div
                        key={owner}
                        className="inline-flex items-center gap-1.5 px-2 py-0.75 text-xs font-medium rounded-md bg-gray-100 text-gray-700 border border-gray-300"
                    >
                        <span>{owner}</span>
                        <button
                            onClick={() => removeOwnerFilter(owner)}
                            className="hover:text-gray-900 transition-colors"
                        >
                            <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}

                {/* Location Filter */}
                <div className="relative" ref={locationFilterRef}>
                    <button
                        onClick={() => setShowLocationFilter(!showLocationFilter)}
                        className={`inline-flex items-center gap-1.5 px-2 py-0.75 text-xs font-medium rounded-md border transition-colors ${
                            selectedLocations.length > 0
                                ? 'bg-white text-gray-700 border-gray-900 hover:bg-gray-50'
                                : 'bg-white text-gray-700 border-dashed border-gray-300 hover:bg-gray-50'
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
                        Location
                    </button>

                    {/* Dropdown */}
                    {showLocationFilter && (
                        <div className="absolute top-full mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10 animate-in fade-in slide-in-from-top-1 duration-200 p-3">
                            <label className="block -mt-1 text-xs font-medium text-gray-700 mb-2">
                                Filter by: Location
                            </label>
                            <input
                                type="text"
                                value={locationFilterInput}
                                onChange={(e) => setLocationFilterInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        applyLocationFilter();
                                    }
                                }}
                                placeholder=""
                                className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent mb-2"
                            />
                            <div className="flex justify-center">
                                <button
                                    onClick={applyLocationFilter}
                                    disabled={!locationFilterInput.trim()}
                                    className={`px-3 py-1 text-white text-xs font-medium rounded-md transition-colors -mb-1 ${
                                        locationFilterInput.trim()
                                            ? 'bg-gray-900 hover:bg-gray-800 cursor-pointer'
                                            : 'bg-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Active Location Filter Chips */}
                {selectedLocations.map((location) => (
                    <div
                        key={location}
                        className="inline-flex items-center gap-1.5 px-2 py-0.75 text-xs font-medium rounded-md bg-gray-100 text-gray-700 border border-gray-300"
                    >
                        <span>{location}</span>
                        <button
                            onClick={() => removeLocationFilter(location)}
                            className="hover:text-gray-900 transition-colors"
                        >
                            <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}

                {/* Rent Range Filter */}
                <div className="relative" ref={rentFilterRef}>
                    <button
                        onClick={() => setShowRentFilter(!showRentFilter)}
                        className={`inline-flex items-center gap-1.5 px-2 py-0.75 text-xs font-medium rounded-md border transition-colors ${
                            activeRentRange
                                ? 'bg-white text-gray-700 border-gray-900 hover:bg-gray-50'
                                : 'bg-white text-gray-700 border-dashed border-gray-300 hover:bg-gray-50'
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
                        Rent
                    </button>

                    {/* Dropdown */}
                    {showRentFilter && (
                        <div className="absolute top-full mt-1 w-61.5 bg-white rounded-lg shadow-lg border border-gray-200 z-10 animate-in fade-in slide-in-from-top-1 duration-200 p-3">
                            <label className="block -mt-1 text-xs font-medium text-gray-700 mb-2">
                                Filter by: Rent Range
                            </label>
                            <div className="flex gap-2 mb-2 -mx-1">
                                <input
                                    type="number"
                                    value={rentMin}
                                    onChange={(e) => setRentMin(e.target.value)}
                                    placeholder="Min"
                                    className="w-27.5 px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                />
                                <input
                                    type="number"
                                    value={rentMax}
                                    onChange={(e) => setRentMax(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            applyRentFilter();
                                        }
                                    }}
                                    placeholder="Max"
                                    className="w-27.5 px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                />
                            </div>
                            <div className="flex justify-center">
                                <button
                                    onClick={applyRentFilter}
                                    disabled={!rentMin.trim() && !rentMax.trim()}
                                    className={`px-3 py-1 text-white text-xs font-medium rounded-md transition-colors -mb-1 ${
                                        rentMin.trim() || rentMax.trim()
                                            ? 'bg-gray-900 hover:bg-gray-800 cursor-pointer'
                                            : 'bg-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Active Rent Range Chip */}
                {activeRentRange && (
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.75 text-xs font-medium rounded-md bg-gray-100 text-gray-700 border border-gray-300">
                        <span>
                            ${activeRentRange.min ?? 0} - ${activeRentRange.max ?? '∞'}
                        </span>
                        <button
                            onClick={removeRentFilter}
                            className="hover:text-gray-900 transition-colors"
                        >
                            <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Vacant Filter Button */}
                <button
                    onClick={() => setShowVacantOnly(!showVacantOnly)}
                    className={`inline-flex items-center gap-1.5 px-2 py-0.75 text-xs font-medium rounded-md border transition-colors ${
                        showVacantOnly
                            ? 'bg-white text-gray-700 border-gray-900 hover:bg-gray-50'
                            : 'bg-white text-gray-700 border-dashed border-gray-300 hover:bg-gray-50'
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
                    Vacant
                </button>

                {/* Clear All Filters */}
                {(selectedOwners.length > 0 || selectedLocations.length > 0 || activeRentRange || showVacantOnly) && (
                    <button
                        onClick={clearFilters}
                        className="text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors"
                    >
                        Clear all
                    </button>
                )}
            </div>

            {/* Table Container */}
            <div className="border border-gray-200 rounded-lg mx-8 overflow-hidden">
                <table className="w-full">
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