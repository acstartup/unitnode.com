'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useProperties } from '@/contexts/PropertyContext';
import { useToast } from '@/contexts/ToastContext';

interface AddBillOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddBillOverlay({ isOpen, onClose }: AddBillOverlayProps) {
    const [propertyAddress, setPropertyAddress] = useState('');
    const [dueBy, setDueBy] = useState('');
    const [type, setType] = useState('Rent');
    const [balance, setBalance] = useState('');
    const [description, setDescription] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const { showToast } = useToast();

    const { properties, addBill } = useProperties();
    const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
    const [filteredProperties, setFilteredProperties] = useState<typeof properties>([]);
    const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setPropertyAddress('');
            setSelectedPropertyId('');
            setFilteredProperties([]);
            setShowPropertyDropdown(false);

            // Set default due date to one month from today
            const today = new Date();
            const oneMonthFromNow = new Date(today);
            oneMonthFromNow.setMonth(today.getMonth() + 1);
            const formattedDate = oneMonthFromNow.toISOString().split('T')[0];
            setDueBy(formattedDate);

            setType('Rent');
            setBalance('');
            setDescription('');
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

    // Calendar helper functions
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek };
    };

    const formatDateForInput = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formatDateForDisplay = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString + 'T00:00:00');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    };

    const handleDateSelect = (day: number) => {
        const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        setDueBy(formatDateForInput(selectedDate));
        setShowCalendar(false);
    };

    const changeMonth = (direction: number) => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1));
    };

    const isSelectedDate = (day: number) => {
        if (!dueBy) return false;
        const selected = new Date(dueBy + 'T00:00:00');
        return selected.getDate() === day &&
               selected.getMonth() === currentMonth.getMonth() &&
               selected.getFullYear() === currentMonth.getFullYear();
    };

    const isToday = (day: number) => {
        const today = new Date();
        return today.getDate() === day &&
               today.getMonth() === currentMonth.getMonth() &&
               today.getFullYear() === currentMonth.getFullYear();
    };

    if (!isOpen) return null;

    return createPortal(
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/20 bg-opacity-50 z-[9998] transition-opacity"
                onClick={onClose}
            />

            {/* Overlay Content */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="bg-white border shadow-lg rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto animate-in fade-in zone-in-95 duration-200 relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="px-4 py-4 border-gray-200">
                        <h2 className="text-md font-semibold text-gray-900">
                            Add bill
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

                        {/* Bill Section */}
                        <h2 className={`text-sm font-semibold py-2 ${!selectedPropertyId ? 'text-gray-400' : 'text-gray-400'}`}>Bill information</h2>

                        {/* First Row: Due By, Type, Balance */}
                        <div className="flex gap-3 mb-3">
                            {/* Due By */}
                            <div className="flex-1 relative">
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Due By
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formatDateForDisplay(dueBy)}
                                        onFocus={() => selectedPropertyId && setShowCalendar(true)}
                                        readOnly
                                        disabled={!selectedPropertyId}
                                        className="w-full px-3 py-1.5 pr-10 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed cursor-pointer"
                                        placeholder="Select date"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => selectedPropertyId && setShowCalendar(!showCalendar)}
                                        disabled={!selectedPropertyId}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Calendar Dropdown */}
                                {showCalendar && selectedPropertyId && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-[10000]"
                                            onClick={() => setShowCalendar(false)}
                                        />
                                        <div className="absolute z-[10001] mt-1 w-50 bg-white border border-gray-300 rounded-md shadow-lg p-3">
                                            {/* Calendar Header */}
                                            <div className="flex items-center justify-between mb-1 -mt-0.5">
                                                <button
                                                    type="button"
                                                    onClick={() => changeMonth(-1)}
                                                    className=" hover:bg-gray-100 rounded transition-colors"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                    </svg>
                                                </button>
                                                <div className="text-xs font-semibold">
                                                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => changeMonth(1)}
                                                    className="hover:bg-gray-100 rounded transition-colors"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                            </div>

                                            {/* Day Labels */}
                                            <div className="grid grid-cols-7 gap-0 -mb-0">
                                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                                    <div key={day} className="text-center text-[10px] font-medium text-gray-600 py-0.25">
                                                        {day}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Calendar Days */}
                                            <div className="grid grid-cols-7 gap-0 -mb-2">
                                                {(() => {
                                                    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
                                                    const days = [];

                                                    // Empty cells before first day
                                                    for (let i = 0; i < startingDayOfWeek; i++) {
                                                        days.push(<div key={`empty-${i}`} className="h-6" />);
                                                    }

                                                    // Days of month
                                                    for (let day = 1; day <= daysInMonth; day++) {
                                                        const selected = isSelectedDate(day);
                                                        const today = isToday(day);

                                                        days.push(
                                                            <button
                                                                key={day}
                                                                type="button"
                                                                onClick={() => handleDateSelect(day)}
                                                                className={`h-6 text-xs rounded transition-colors ${
                                                                    selected
                                                                        ? 'bg-black text-white font-semibold'
                                                                        : today
                                                                        ? 'bg-gray-200 font-semibold hover:bg-gray-300'
                                                                        : 'hover:bg-gray-100'
                                                                }`}
                                                            >
                                                                {day}
                                                            </button>
                                                        );
                                                    }

                                                    return days;
                                                })()}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Type Dropdown */}
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Type
                                </label>
                                <div className="relative">
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        disabled={!selectedPropertyId}
                                        className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed appearance-none"
                                    >
                                        <option value="Rent">Rent</option>
                                        <option value="Water">Water</option>
                                        <option value="Electricity">Electricity</option>
                                        <option value="Gas">Gas</option>
                                        <option value="Internet">Internet</option>
                                        <option value="Garbage">Garbage</option>
                                        <option value="HOA">HOA</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Insurance">Insurance</option>
                                        <option value="Other">Other</option>
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

                            {/* Balance */}
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Balance
                                </label>
                                <input
                                    type="text"
                                    value={balance}
                                    onChange={(e) => setBalance(e.target.value)}
                                    disabled={!selectedPropertyId}
                                    className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed"
                                    placeholder="$1200"
                                />
                            </div>
                        </div>

                        {/* Second Row: Description */}
                        <div className="-mb-1">
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={!selectedPropertyId}
                                rows={3}
                                className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed resize-none"
                                placeholder="Additional notes or details about this bill..."
                            />
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
                            onClick={async () => {
                                if (!selectedPropertyId) {
                                    showToast('Please select a property first', 'error');
                                    return;
                                }

                                if (!dueBy || !balance) {
                                    showToast('Please fill in all required fields', 'error');
                                    return;
                                }

                                try {
                                    await addBill({
                                        propertyId: selectedPropertyId,
                                        dueBy,
                                        type,
                                        balance: parseFloat(balance),
                                        description,
                                    });

                                    showToast('Bill added successfully', 'success');
                                    onClose();
                                } catch (error) {
                                    console.error('Error adding bill:', error);
                                    showToast('Failed to add bill', 'error');
                                }
                            }}
                            disabled={!selectedPropertyId}
                            className="px-3 py-1 bg-black text-white text-sm font-small rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            Add bill
                        </button>
                    </div>
                </div>
            </div>
        </>,
        document.body
    )
}
