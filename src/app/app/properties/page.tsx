'use client';

import { useProperties } from '@/contexts/PropertyContext';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ConfirmDeleteProperty from '@/components/overlays/confirm-delete-property';

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
    const [rentSortOrder, setRentSortOrder] = useState<'asc' | 'desc' | null>(null);
    const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState<{top: number, right: number} | null>(null);
    const filterRef = useRef<HTMLDivElement>(null);
    const locationFilterRef = useRef<HTMLDivElement>(null);
    const rentFilterRef = useRef<HTMLDivElement>(null);
    const tableScrollRef = useRef<HTMLDivElement>(null);
    const dropdownRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
    const buttonRefs = useRef<{[key: string]: HTMLButtonElement | null}>({});

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
            // Close property dropdown if clicked outside
            if (openDropdownId && dropdownRefs.current[openDropdownId]) {
                const dropdownElement = dropdownRefs.current[openDropdownId];
                if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
                    setOpenDropdownId(null);
                }
            }
        };

        if (showOwnerFilter || showLocationFilter || showRentFilter || openDropdownId) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showOwnerFilter, showLocationFilter, showRentFilter, openDropdownId]);

    // Track horizontal scroll position
    useEffect(() => {
        const handleScroll = () => {
            if (tableScrollRef.current) {
                setIsScrolled(tableScrollRef.current.scrollLeft > 0);
            }
        };

        const scrollElement = tableScrollRef.current;
        if (scrollElement) {
            scrollElement.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (scrollElement) {
                scrollElement.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

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

    const toggleRentSort = () => {
        if (rentSortOrder === null) {
            setRentSortOrder('desc');
        } else if (rentSortOrder === 'desc') {
            setRentSortOrder('asc');
        } else {
            setRentSortOrder(null);
        }
    };

    const toggleSelectAll = () => {
        if (selectedProperties.length === filteredProperties.length) {
            setSelectedProperties([]);
        } else {
            setSelectedProperties(filteredProperties.map(p => p.id));
        }
    };

    const toggleSelectProperty = (propertyId: string) => {
        setSelectedProperties(prev => {
            if (prev.includes(propertyId)) {
                return prev.filter(id => id !== propertyId);
            } else {
                return [...prev, propertyId];
            }
        });
    };

    const deselectAll = () => {
        setSelectedProperties([]);
    };

    const handleDeleteProperties = async () => {
        try {
            // Delete all selected properties
            await Promise.all(
                selectedProperties.map(propertyId =>
                    fetch(`/api/properties/${propertyId}`, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                    })
                )
            );

            // Clear selection after successful deletion
            setSelectedProperties([]);

            // Refresh the page to show updated list
            router.refresh();
        } catch (error) {
            console.error('Error deleting properties:', error);
            alert('Failed to delete properties');
        }
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

    // Sort properties by rent if sort order is active
    if (rentSortOrder) {
        filteredProperties = [...filteredProperties].sort((a, b) => {
            const rentA = a.rent || 0;
            const rentB = b.rent || 0;
            return rentSortOrder === 'asc' ? rentA - rentB : rentB - rentA;
        });
    }

    return (
        <div className="w-full bg-white">
            <style jsx>{`
                @keyframes checkboxCheck {
                    0% {
                        opacity: 0;
                    }
                    100% {
                        opacity: 1;
                    }
                }

                input[type="checkbox"]:checked {
                    animation: checkboxCheck 0.15s ease-in;
                }
            `}</style>
            {/* Page Header */}
            <div className="mb-1">
                <h1 className="text-3xl font-semibold text-gray-900 px-8 py-6">Properties</h1>
            </div>

            {/* Filter Bar */}
            <div className="px-8 mb-2 min-h-[32px] flex items-center gap-2 flex-wrap">
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

                {/* Selection Counter and Deselect */}
                {selectedProperties.length > 0 && (
                    <>
                        <span className="text-xs text-gray-700 font-medium">
                            {selectedProperties.length} selected
                        </span>
                        <button
                            onClick={deselectAll}
                            className="text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors"
                        >
                            Deselect all
                        </button>
                        <div className="ml-auto">
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-650 rounded-md transition-colors"
                            >
                                <svg
                                    className="w-3.5 h-3.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                                {selectedProperties.length === 1 ? 'Delete property' : 'Delete properties'}
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Table Container */}
            <div className="mx-8">
                <div ref={tableScrollRef} className="overflow-x-scroll overflow-y-hidden mb-10">
                    <table className="w-full min-w-[900px]">
                    {/* Table Header */}
                    <thead className="bg-white border-b border-gray-200">
                        <tr>
                            <th className="pl-4 pr-4 py-2 w-[3%] sticky left-0 bg-white z-10">
                                <input
                                    type="checkbox"
                                    checked={filteredProperties.length > 0 && selectedProperties.length === filteredProperties.length}
                                    onChange={toggleSelectAll}
                                    className="w-3.5 h-3.5 rounded-md border-gray-200 focus:ring-0 focus:ring-offset-0 cursor-pointer transition-all duration-150 ease-in-out hover:border-gray-300"
                                    style={{
                                        accentColor: '#374151'
                                    }}
                                />
                            </th>
                            <th className={`pr-4 py-2 text-left text-[10px] font-medium text-black uppercase tracking-wider w-[42%] sticky left-[40px] bg-white z-10 transition-shadow duration-200 ${isScrolled ? 'shadow-[4px_0_8px_-2px_rgba(0,0,0,0.25)]' : ''}`}>
                                Property Address
                            </th>
                            <th className="px-4 py-2 text-left text-[10px] font-medium text-black uppercase tracking-wider w-[18%]">
                                Owner
                            </th>
                            <th className="px-4 py-2 text-left text-[10px] font-medium text-black uppercase tracking-wider w-[25%]">
                                Tenant
                            </th>
                            <th className="px-4 py-2 text-left text-[10px] font-medium text-black uppercase tracking-wider w-[12%]">
                                <button
                                    onClick={toggleRentSort}
                                    className="inline-flex items-center gap-1 hover:text-gray-700 uppercase transition-colors"
                                >
                                    Rent
                                    <div className="flex flex-col -space-y-2 -mx-0.5">
                                        <svg
                                            className={`w-3 h-3 ${rentSortOrder === 'asc' ? 'text-gray-900' : 'text-gray-400'}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414l-3.293 3.293a1 1 0 01-1.414 0z" />
                                        </svg>
                                        <svg
                                            className={`w-3 h-3 ${rentSortOrder === 'desc' ? 'text-gray-900' : 'text-gray-400'}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 13.586l3.293-3.293a1 1 0 011.414 0z" />
                                        </svg>
                                    </div>
                                </button>
                            </th>
                            <th className="px-4 py-2 w-[5%] sticky right-0 bg-white z-10"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProperties.map((property) => {
                            const tenantNames = property.tenants && property.tenants.length > 0
                                ? property.tenants.map(t => t.name).join(', ')
                                : (property.mainTenant && property.mainTenant !== 'N/A' ? property.mainTenant : '—');
                            const rentDisplay = property.rent === 0 ? '—' : `$${property.rent}`;

                            return (
                                <tr key={property.id} className="group hover:bg-gray-50 transition-colors">
                                    <td className="pl-4 py-1 sticky left-0 bg-white group-hover:bg-gray-50 z-10 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={selectedProperties.includes(property.id)}
                                            onChange={() => toggleSelectProperty(property.id)}
                                            className="w-3.5 h-3.5 rounded-md border-gray-200 focus:ring-0 focus:ring-offset-0 cursor-pointer transition-all duration-150 ease-in-out hover:border-gray-300"
                                            style={{
                                                accentColor: '#374151'
                                            }}
                                        />
                                    </td>
                                    <td className={`pr-4 py-1 text-sm text-gray-900 whitespace-nowrap sticky left-[40px] bg-white group-hover:bg-gray-50 z-10 transition-all duration-200 ${isScrolled ? 'shadow-[4px_0_8px_-2px_rgba(0,0,0,0.25)]' : ''}`}>{property.address}</td>
                                    <td className="px-4 py-1 text-sm text-gray-500 whitespace-nowrap">{property.ownerName || '—'}</td>
                                    <td className="px-4 py-1 text-sm text-gray-500">
                                        <div className="max-w-[350px] truncate">
                                            {tenantNames}
                                        </div>
                                    </td>
                                    <td className="px-4 py-1 text-sm text-gray-500 whitespace-nowrap">{rentDisplay}</td>
                                    <td className={`px-4 py-1 text-right sticky right-0 bg-white group-hover:bg-gray-50 transition-colors ${openDropdownId === property.id ? 'z-[9999]' : 'z-10'}`}>
                                        <div
                                            className="relative inline-block"
                                            ref={(el) => { dropdownRefs.current[property.id] = el; }}
                                        >
                                            <button
                                                ref={(el) => { buttonRefs.current[property.id] = el; }}
                                                onClick={(e) => {
                                                    const button = e.currentTarget;
                                                    const rect = button.getBoundingClientRect();
                                                    setDropdownPosition({
                                                        top: rect.bottom + 2,
                                                        right: window.innerWidth - rect.right
                                                    });
                                                    setOpenDropdownId(openDropdownId === property.id ? null : property.id);
                                                }}
                                                className="p-1.5 hover:bg-gray-100 rounded-md border border-gray-300 transition-colors"
                                            >
                                                <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 16 16">
                                                    <circle cx="8" cy="3" r="1.5"/>
                                                    <circle cx="8" cy="8" r="1.5"/>
                                                    <circle cx="8" cy="13" r="1.5"/>
                                                </svg>
                                            </button>

                                            {/* Dropdown Menu */}
                                            {openDropdownId === property.id && dropdownPosition && (
                                                <div
                                                    className="fixed w-18 bg-white rounded-lg shadow-lg border border-gray-200 p-1 z-[9999] animate-in fade-in slide-in-from-top-2 duration-200"
                                                    style={{
                                                        top: `${dropdownPosition.top}px`,
                                                        right: `${dropdownPosition.right}px`
                                                    }}
                                                >
                                                    <button
                                                        onClick={() => {
                                                            setOpenDropdownId(null);
                                                            handleViewDetails(property.id);
                                                        }}
                                                        className="w-full px-2 py-1 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors rounded-md"
                                                    >
                                                        Details
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setOpenDropdownId(null);
                                                            router.push(`/app/properties/${property.id}/invoice`);
                                                        }}
                                                        className="w-full px-2 py-1 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors rounded-md"
                                                    >
                                                        Invoice
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                </div>
            </div>

            {/* Delete Confirmation Overlay */}
            <ConfirmDeleteProperty
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={() => {
                    setShowDeleteConfirm(false);
                    handleDeleteProperties();
                }}
                propertyCount={selectedProperties.length}
            />
        </div>
    );
}