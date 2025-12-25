'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProperties } from '@/contexts/PropertyContext';
import { useToast } from '@/contexts/ToastContext';
import ConfirmDeleteBill from '@/components/overlays/confirm-delete-bill';
import ConfirmDeletePayment from '@/components/overlays/confirm-delete-payment';

export default function InvoicePage() {
    const params = useParams();
    const router = useRouter();
    const { properties, getBillsByProperty, getPaymentsByProperty, deleteBill, deletePayment } = useProperties();
    const { showToast } = useToast();
    const propertyId = params.id as string;

    const property = properties.find(p => p.id === propertyId);
    const bills = getBillsByProperty(propertyId);
    const payments = getPaymentsByProperty(propertyId);

    // Track which bills are expanded
    const [expandedBills, setExpandedBills] = useState<Set<string>>(new Set());

    // Track which dropdown is open (for both bills and payments)
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState<{top: number, right: number} | null>(null);
    const dropdownRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

    // Confirmation overlays
    const [isDeleteBillOpen, setIsDeleteBillOpen] = useState(false);
    const [isDeletePaymentOpen, setIsDeletePaymentOpen] = useState(false);
    const [deletingBillId, setDeletingBillId] = useState<string | null>(null);
    const [deletingPaymentId, setDeletingPaymentId] = useState<string | null>(null);

    // Sorting state
    const [dueBySortOrder, setDueBySortOrder] = useState<'asc' | 'desc' | null>(null);
    const [dateCreatedSortOrder, setDateCreatedSortOrder] = useState<'asc' | 'desc' | null>(null);
    const [initialBalanceSortOrder, setInitialBalanceSortOrder] = useState<'asc' | 'desc' | null>(null);
    const [remainingBalanceSortOrder, setRemainingBalanceSortOrder] = useState<'asc' | 'desc' | null>(null);

    // Filter state
    const [showDescriptionFilter, setShowDescriptionFilter] = useState(false);
    const [selectedDescriptions, setSelectedDescriptions] = useState<string[]>([]);
    const [descriptionFilterInput, setDescriptionFilterInput] = useState('');
    const descriptionFilterRef = useRef<HTMLDivElement>(null);

    const [showBalanceFilter, setShowBalanceFilter] = useState(false);
    const [balanceMin, setBalanceMin] = useState('');
    const [balanceMax, setBalanceMax] = useState('');
    const [activeBalanceRange, setActiveBalanceRange] = useState<{min: number | null, max: number | null} | null>(null);
    const balanceFilterRef = useRef<HTMLDivElement>(null);

    const [showMethodFilter, setShowMethodFilter] = useState(false);
    const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
    const [tempSelectedMethods, setTempSelectedMethods] = useState<string[]>([]);
    const methodFilterRef = useRef<HTMLDivElement>(null);

    const [showStatusFilter, setShowStatusFilter] = useState(false);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const statusFilterRef = useRef<HTMLDivElement>(null);

    const [showTypeFilter, setShowTypeFilter] = useState(false);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const typeFilterRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openDropdownId && dropdownRefs.current[openDropdownId]) {
                const dropdownElement = dropdownRefs.current[openDropdownId];
                if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
                    setOpenDropdownId(null);
                }
            }
            if (descriptionFilterRef.current && !descriptionFilterRef.current.contains(event.target as Node)) {
                setShowDescriptionFilter(false);
            }
            if (balanceFilterRef.current && !balanceFilterRef.current.contains(event.target as Node)) {
                setShowBalanceFilter(false);
            }
            if (methodFilterRef.current && !methodFilterRef.current.contains(event.target as Node)) {
                setShowMethodFilter(false);
            }
            if (statusFilterRef.current && !statusFilterRef.current.contains(event.target as Node)) {
                setShowStatusFilter(false);
            }
            if (typeFilterRef.current && !typeFilterRef.current.contains(event.target as Node)) {
                setShowTypeFilter(false);
            }
        };

        if (openDropdownId || showDescriptionFilter || showBalanceFilter || showMethodFilter || showStatusFilter || showTypeFilter) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openDropdownId, showDescriptionFilter, showBalanceFilter, showMethodFilter, showStatusFilter, showTypeFilter]);

    const toggleBillExpansion = (billId: string) => {
        const newExpanded = new Set(expandedBills);
        if (newExpanded.has(billId)) {
            newExpanded.delete(billId);
        } else {
            newExpanded.add(billId);
        }
        setExpandedBills(newExpanded);
    };

    // Calculate total paid for each bill
    const getBillPayments = (billId: string) => {
        return payments.filter(payment =>
            payment.appliedToBills?.some(applied => applied.billId === billId)
        );
    };

    const getTotalPaidForBill = (billId: string) => {
        return payments.reduce((total, payment) => {
            const applied = payment.appliedToBills?.find((a: { billId: string; amount: number }) => a.billId === billId);
            return total + (applied?.amount || 0);
        }, 0);
    };

    const getRemainingBalance = (billId: string, billBalance: number) => {
        const totalPaid = getTotalPaidForBill(billId);
        return billBalance - totalPaid;
    };

    const getPaymentAmountForBill = (payment: any, billId: string) => {
        const applied = payment.appliedToBills?.find((a: { billId: string; amount: number }) => a.billId === billId);
        return applied?.amount || 0;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString + 'T00:00:00');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };

    const formatDateCreated = (date: Date) => {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };

    const isLate = (dueBy: string, remainingBalance: number) => {
        if (remainingBalance <= 0) return false;
        const dueDate = new Date(dueBy + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return dueDate < today;
    };

    const getBillStatus = (billId: string, billBalance: number) => {
        const remaining = getRemainingBalance(billId, billBalance);
        if (remaining <= 0) return 'Paid';
        if (remaining < billBalance) return 'Partial Paid';
        return 'Unpaid';
    };

    const handleDeleteBill = async () => {
        if (!deletingBillId) return;

        try {
            await deleteBill(deletingBillId);
            showToast('Bill deleted successfully', 'success');
            setIsDeleteBillOpen(false);
            setDeletingBillId(null);
        } catch (error) {
            console.error('Error deleting bill:', error);
            showToast('Failed to delete bill', 'error');
        }
    };

    const handleDeletePayment = async () => {
        if (!deletingPaymentId) return;

        try {
            await deletePayment(deletingPaymentId);
            showToast('Payment deleted successfully', 'success');
            setIsDeletePaymentOpen(false);
            setDeletingPaymentId(null);
        } catch (error) {
            console.error('Error deleting payment:', error);
            showToast('Failed to delete payment', 'error');
        }
    };

    const toggleDueBySort = () => {
        if (dueBySortOrder === null) {
            setDueBySortOrder('desc');
            setDateCreatedSortOrder(null); // Clear other sorts
            setInitialBalanceSortOrder(null);
            setRemainingBalanceSortOrder(null);
        } else if (dueBySortOrder === 'desc') {
            setDueBySortOrder('asc');
        } else {
            setDueBySortOrder(null);
        }
    };

    const toggleDateCreatedSort = () => {
        if (dateCreatedSortOrder === null) {
            setDateCreatedSortOrder('desc');
            setDueBySortOrder(null); // Clear other sorts
            setInitialBalanceSortOrder(null);
            setRemainingBalanceSortOrder(null);
        } else if (dateCreatedSortOrder === 'desc') {
            setDateCreatedSortOrder('asc');
        } else {
            setDateCreatedSortOrder(null);
        }
    };

    const toggleInitialBalanceSort = () => {
        if (initialBalanceSortOrder === null) {
            setInitialBalanceSortOrder('desc');
            setDueBySortOrder(null); // Clear other sorts
            setDateCreatedSortOrder(null);
            setRemainingBalanceSortOrder(null);
        } else if (initialBalanceSortOrder === 'desc') {
            setInitialBalanceSortOrder('asc');
        } else {
            setInitialBalanceSortOrder(null);
        }
    };

    const toggleRemainingBalanceSort = () => {
        if (remainingBalanceSortOrder === null) {
            setRemainingBalanceSortOrder('desc');
            setDueBySortOrder(null); // Clear other sorts
            setDateCreatedSortOrder(null);
            setInitialBalanceSortOrder(null);
        } else if (remainingBalanceSortOrder === 'desc') {
            setRemainingBalanceSortOrder('asc');
        } else {
            setRemainingBalanceSortOrder(null);
        }
    };

    const applyDescriptionFilter = () => {
        const trimmedInput = descriptionFilterInput.trim();
        if (trimmedInput && !selectedDescriptions.includes(trimmedInput)) {
            setSelectedDescriptions([...selectedDescriptions, trimmedInput]);
        }
        setDescriptionFilterInput('');
        setShowDescriptionFilter(false);
    };

    const removeDescriptionFilter = (description: string) => {
        setSelectedDescriptions(prev => prev.filter(d => d !== description));
    };

    const applyBalanceFilter = () => {
        const min = balanceMin ? parseFloat(balanceMin) : null;
        const max = balanceMax ? parseFloat(balanceMax) : null;

        if (min !== null || max !== null) {
            setActiveBalanceRange({ min, max });
        }
        setBalanceMin('');
        setBalanceMax('');
        setShowBalanceFilter(false);
    };

    const removeBalanceFilter = () => {
        setActiveBalanceRange(null);
        setBalanceMin('');
        setBalanceMax('');
    };

    const applyMethodFilter = () => {
        setSelectedMethods(tempSelectedMethods);
        setShowMethodFilter(false);
    };

    const toggleMethodSelection = (method: string) => {
        setTempSelectedMethods(prev => {
            if (prev.includes(method)) {
                return prev.filter(m => m !== method);
            } else {
                return [...prev, method];
            }
        });
    };

    const applyStatusFilter = () => {
        setShowStatusFilter(false);
    };

    const toggleStatusSelection = (status: string) => {
        setSelectedStatuses(prev => {
            if (prev.includes(status)) {
                return prev.filter(s => s !== status);
            } else {
                return [...prev, status];
            }
        });
    };

    const applyTypeFilter = () => {
        setShowTypeFilter(false);
    };

    const toggleTypeSelection = (type: string) => {
        setSelectedTypes(prev => {
            if (prev.includes(type)) {
                return prev.filter(t => t !== type);
            } else {
                return [...prev, type];
            }
        });
    };

    const clearFilters = () => {
        setSelectedDescriptions([]);
        setDescriptionFilterInput('');
        setActiveBalanceRange(null);
        setBalanceMin('');
        setBalanceMax('');
        setSelectedMethods([]);
        setSelectedStatuses([]);
        setSelectedTypes([]);
    };

    // Filter bills based on selected descriptions
    let filteredBills = bills;
    if (selectedDescriptions.length > 0) {
        filteredBills = filteredBills.filter(bill => {
            if (!bill.description) return false;
            return selectedDescriptions.some(description =>
                bill.description.toLowerCase().includes(description.toLowerCase())
            );
        });
    }

    // Filter by balance range
    if (activeBalanceRange) {
        filteredBills = filteredBills.filter(bill => {
            const balance = bill.balance || 0;
            if (activeBalanceRange.min !== null && balance < activeBalanceRange.min) return false;
            if (activeBalanceRange.max !== null && balance > activeBalanceRange.max) return false;
            return true;
        });
    }

    // Filter by selected methods (payment types)
    if (selectedMethods.length > 0) {
        filteredBills = filteredBills.filter(bill => {
            // Get all payments for this bill
            const billPayments = payments.filter(payment =>
                payment.appliedToBills?.some(applied => applied.billId === bill.id)
            );
            // Check if any payment has a matching method
            return billPayments.some(payment => selectedMethods.includes(payment.type));
        });
    }

    // Filter by selected statuses
    if (selectedStatuses.length > 0) {
        filteredBills = filteredBills.filter(bill => {
            const status = getBillStatus(bill.id, bill.balance);
            return selectedStatuses.includes(status);
        });
    }

    // Filter by selected types
    if (selectedTypes.length > 0) {
        filteredBills = filteredBills.filter(bill => {
            return selectedTypes.includes(bill.type);
        });
    }

    // Sort bills based on active sort order
    let sortedBills = [...filteredBills];
    if (dueBySortOrder) {
        sortedBills.sort((a, b) => {
            const dateA = new Date(a.dueBy + 'T00:00:00').getTime();
            const dateB = new Date(b.dueBy + 'T00:00:00').getTime();
            return dueBySortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
    } else if (dateCreatedSortOrder) {
        sortedBills.sort((a, b) => {
            const dateA = a.createdAt.getTime();
            const dateB = b.createdAt.getTime();
            return dateCreatedSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
    } else if (initialBalanceSortOrder) {
        sortedBills.sort((a, b) => {
            const balanceA = a.balance;
            const balanceB = b.balance;
            return initialBalanceSortOrder === 'asc' ? balanceA - balanceB : balanceB - balanceA;
        });
    } else if (remainingBalanceSortOrder) {
        sortedBills.sort((a, b) => {
            const remainingA = getRemainingBalance(a.id, a.balance);
            const remainingB = getRemainingBalance(b.id, b.balance);
            return remainingBalanceSortOrder === 'asc' ? remainingA - remainingB : remainingB - remainingA;
        });
    }

    return (
    <div className="w-full bg-white">
        {/* Breadcrumbs */}
        <div className="px-8 pt-8 pb-1">
             <div className="flex items-center text-sm text-gray-500 font-semibold">
                    <button
                    onClick={() => router.push('/app/properties')}
                    className="hover:text-gray-700 transition-colors"
                >
                    {property?.address || 'Loading...'}
                </button>
                <svg
                    className="h-4 w-4 mx-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </div>
        </div>

        {/* Header */}
        <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 px-8">Invoice</h1>
        </div>

        {/* Filter Bar */}
        <div className="px-8 mb-2 min-h-[32px] flex items-center gap-2 flex-wrap">
            <div className="relative" ref={descriptionFilterRef}>
                <button
                    onClick={() => setShowDescriptionFilter(!showDescriptionFilter)}
                    className={`inline-flex items-center gap-1.5 px-2 py-0.75 text-xs font-medium rounded-md border transition-colors ${
                        selectedDescriptions.length > 0
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
                    Description
                </button>

                {/* Dropdown */}
                {showDescriptionFilter && (
                    <div className="absolute top-full mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10 animate-in fade-in slide-in-from-top-1 duration-200 p-3">
                        <label className="block -mt-1 text-xs font-medium text-gray-700 mb-2">
                            Filter by: Description
                        </label>
                        <input
                            type="text"
                            value={descriptionFilterInput}
                            onChange={(e) => setDescriptionFilterInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    applyDescriptionFilter();
                                }
                            }}
                            placeholder=""
                            className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent mb-2"
                        />
                        <div className="flex justify-center">
                            <button
                                onClick={applyDescriptionFilter}
                                disabled={!descriptionFilterInput.trim()}
                                className={`px-3 py-1 text-white text-xs font-medium rounded-md transition-colors -mb-1 ${
                                    descriptionFilterInput.trim()
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
            {selectedDescriptions.map((description) => (
                <div
                    key={description}
                    className="inline-flex items-center gap-1.5 px-2 py-0.75 text-xs font-medium rounded-md bg-gray-100 text-gray-700 border border-gray-300"
                >
                    <span>{description}</span>
                    <button
                        onClick={() => removeDescriptionFilter(description)}
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

            {/* Balance Range Filter */}
            <div className="relative" ref={balanceFilterRef}>
                <button
                    onClick={() => setShowBalanceFilter(!showBalanceFilter)}
                    className={`inline-flex items-center gap-1.5 px-2 py-0.75 text-xs font-medium rounded-md border transition-colors ${
                        activeBalanceRange
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
                    Balance
                </button>

                {/* Dropdown */}
                {showBalanceFilter && (
                    <div className="absolute top-full mt-1 w-61.5 bg-white rounded-lg shadow-lg border border-gray-200 z-10 animate-in fade-in slide-in-from-top-1 duration-200 p-3">
                        <label className="block -mt-1 text-xs font-medium text-gray-700 mb-2">
                            Filter by: Balance Range
                        </label>
                        <div className="flex gap-2 mb-2 -mx-1">
                            <input
                                type="number"
                                value={balanceMin}
                                onChange={(e) => setBalanceMin(e.target.value)}
                                placeholder="Min"
                                className="w-27.5 px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            />
                            <input
                                type="number"
                                value={balanceMax}
                                onChange={(e) => setBalanceMax(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        applyBalanceFilter();
                                    }
                                }}
                                placeholder="Max"
                                className="w-27.5 px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            />
                        </div>
                        <div className="flex justify-center">
                            <button
                                onClick={applyBalanceFilter}
                                disabled={!balanceMin.trim() && !balanceMax.trim()}
                                className={`px-3 py-1 text-white text-xs font-medium rounded-md transition-colors -mb-1 ${
                                    balanceMin.trim() || balanceMax.trim()
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

            {/* Active Balance Range Chip */}
            {activeBalanceRange && (
                <div className="inline-flex items-center gap-1.5 px-2 py-0.75 text-xs font-medium rounded-md bg-gray-100 text-gray-700 border border-gray-300">
                    <span>
                        ${activeBalanceRange.min ?? 0} - ${activeBalanceRange.max ?? '∞'}
                    </span>
                    <button
                        onClick={removeBalanceFilter}
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

            {/* Method Filter */}
            <div className="relative" ref={methodFilterRef}>
                <button
                    onClick={() => {
                        setTempSelectedMethods(selectedMethods);
                        setShowMethodFilter(!showMethodFilter);
                    }}
                    className={`inline-flex items-center gap-1.5 px-2 py-0.75 text-xs font-medium rounded-md border transition-colors ${
                        selectedMethods.length > 0
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
                    Method
                </button>

                {/* Dropdown */}
                {showMethodFilter && (
                    <div className="absolute top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 animate-in fade-in slide-in-from-top-1 duration-200 p-3">
                        <label className="block -mt-1 text-xs font-medium text-gray-700 mb-2">
                            Filter by: Method
                        </label>
                        <div className="space-y-1.5 mb-2">
                            {['Cash', 'Check', 'Credit', 'Money Order', 'Other'].map((method) => (
                                <div key={method} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`method-${method}`}
                                        checked={tempSelectedMethods.includes(method)}
                                        onChange={() => toggleMethodSelection(method)}
                                        className="w-3 h-3 text-gray-900 bg-white border-gray-300 rounded focus:ring-gray-900 focus:ring-2"
                                    />
                                    <label
                                        htmlFor={`method-${method}`}
                                        className="ml-2 text-xs text-gray-700 cursor-pointer"
                                    >
                                        {method}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center">
                            <button
                                onClick={applyMethodFilter}
                                disabled={tempSelectedMethods.length === 0}
                                className={`px-3 py-1 text-white text-xs font-medium rounded-md transition-colors -mb-1 ${
                                    tempSelectedMethods.length > 0
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

            {/* Active Method Filter Chips */}
            {selectedMethods.map((method) => (
                <div
                    key={method}
                    className="inline-flex items-center gap-1.5 px-2 py-0.75 text-xs font-medium rounded-md bg-gray-100 text-gray-700 border border-gray-300"
                >
                    <span>{method}</span>
                    <button
                        onClick={() => toggleMethodSelection(method)}
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

            {/* Status Filter */}
            <div className="relative" ref={statusFilterRef}>
                <button
                    onClick={() => setShowStatusFilter(!showStatusFilter)}
                    className={`inline-flex items-center gap-1.5 px-2 py-0.75 text-xs font-medium rounded-md border transition-colors ${
                        selectedStatuses.length > 0
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
                    Status
                </button>

                {/* Dropdown */}
                {showStatusFilter && (
                    <div className="absolute top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 animate-in fade-in slide-in-from-top-1 duration-200 p-3">
                        <label className="block -mt-1 text-xs font-medium text-gray-700 mb-2">
                            Filter by: Status
                        </label>
                        <div className="space-y-1.5 mb-2">
                            {['Paid', 'Partial Paid', 'Unpaid'].map((status) => (
                                <div key={status} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`status-${status}`}
                                        checked={selectedStatuses.includes(status)}
                                        onChange={() => toggleStatusSelection(status)}
                                        className="w-3 h-3 text-gray-900 bg-white border-gray-300 rounded focus:ring-gray-900 focus:ring-2"
                                    />
                                    <label
                                        htmlFor={`status-${status}`}
                                        className="ml-2 text-xs text-gray-700 cursor-pointer"
                                    >
                                        {status}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center">
                            <button
                                onClick={applyStatusFilter}
                                disabled={selectedStatuses.length === 0}
                                className={`px-3 py-1 text-white text-xs font-medium rounded-md transition-colors -mb-1 ${
                                    selectedStatuses.length > 0
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

            {/* Active Status Filter Chips */}
            {selectedStatuses.map((status) => (
                <div
                    key={status}
                    className="inline-flex items-center gap-1.5 px-2 py-0.75 text-xs font-medium rounded-md bg-gray-100 text-gray-700 border border-gray-300"
                >
                    <span>{status}</span>
                    <button
                        onClick={() => toggleStatusSelection(status)}
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

            {/* Type Filter */}
            <div className="relative" ref={typeFilterRef}>
                <button
                    onClick={() => setShowTypeFilter(!showTypeFilter)}
                    className={`inline-flex items-center gap-1.5 px-2 py-0.75 text-xs font-medium rounded-md border transition-colors ${
                        selectedTypes.length > 0
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
                    Type
                </button>

                {/* Dropdown */}
                {showTypeFilter && (
                    <div className="absolute top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 animate-in fade-in slide-in-from-top-1 duration-200 p-3">
                        <label className="block -mt-1 text-xs font-medium text-gray-700 mb-2">
                            Filter by: Type
                        </label>
                        <div className="space-y-1.5 mb-2">
                            {['Rent', 'Utilities', 'Maintenance', 'Insurance', 'Other'].map((type) => (
                                <div key={type} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`type-${type}`}
                                        checked={selectedTypes.includes(type)}
                                        onChange={() => toggleTypeSelection(type)}
                                        className="w-3 h-3 text-gray-900 bg-white border-gray-300 rounded focus:ring-gray-900 focus:ring-2"
                                    />
                                    <label
                                        htmlFor={`type-${type}`}
                                        className="ml-2 text-xs text-gray-700 cursor-pointer"
                                    >
                                        {type}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center">
                            <button
                                onClick={applyTypeFilter}
                                disabled={selectedTypes.length === 0}
                                className={`px-3 py-1 text-white text-xs font-medium rounded-md transition-colors -mb-1 ${
                                    selectedTypes.length > 0
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

            {/* Active Type Filter Chips */}
            {selectedTypes.map((type) => (
                <div
                    key={type}
                    className="inline-flex items-center gap-1.5 px-2 py-0.75 text-xs font-medium rounded-md bg-gray-100 text-gray-700 border border-gray-300"
                >
                    <span>{type}</span>
                    <button
                        onClick={() => toggleTypeSelection(type)}
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

            {/* Clear All Filters */}
            {(selectedDescriptions.length > 0 || activeBalanceRange || selectedMethods.length > 0 || selectedStatuses.length > 0 || selectedTypes.length > 0) && (
                <button
                    onClick={clearFilters}
                    className="text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors"
                >
                    Clear all
                </button>
            )}
        </div>

        {/* Table Container */}
        <div className="mx-8">
            <div className="overflow-x-scroll overflow-y-hidden mb-10">
                <table className="w-full min-w-[900px]">
                    {/* Table Header */}
                    <thead className="bg-white border-b border-gray-200">
                        <tr>
                            <th className="pl-4 pr-4 py-2 w-[3%]">
                            </th>
                            <th className="pr-4 py-2 text-left text-[10px] font-medium text-black uppercase tracking-wider w-[11%]">
                                <button
                                    onClick={toggleDueBySort}
                                    className="inline-flex items-center gap-1 hover:text-gray-700 uppercase transition-colors"
                                >
                                    Due By
                                    <div className="flex flex-col -space-y-2 -mx-0.5">
                                        <svg
                                            className={`w-3 h-3 ${dueBySortOrder === 'asc' ? 'text-gray-900' : 'text-gray-400'}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414l-3.293 3.293a1 1 0 01-1.414 0z" />
                                        </svg>
                                        <svg
                                            className={`w-3 h-3 ${dueBySortOrder === 'desc' ? 'text-gray-900' : 'text-gray-400'}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 13.586l3.293-3.293a1 1 0 011.414 0z" />
                                        </svg>
                                    </div>
                                </button>
                            </th>
                            <th className="px-4 py-2 text-left text-[10px] font-medium text-black uppercase tracking-wider w-[12%]">
                                <button
                                    onClick={toggleDateCreatedSort}
                                    className="inline-flex items-center gap-1 hover:text-gray-700 uppercase transition-colors"
                                >
                                    Date Created
                                    <div className="flex flex-col -space-y-2 -mx-0.5">
                                        <svg
                                            className={`w-3 h-3 ${dateCreatedSortOrder === 'asc' ? 'text-gray-900' : 'text-gray-400'}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414l-3.293 3.293a1 1 0 01-1.414 0z" />
                                        </svg>
                                        <svg
                                            className={`w-3 h-3 ${dateCreatedSortOrder === 'desc' ? 'text-gray-900' : 'text-gray-400'}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 13.586l3.293-3.293a1 1 0 011.414 0z" />
                                        </svg>
                                    </div>
                                </button>
                            </th>
                            <th className="px-4 py-2 text-left text-[10px] font-medium text-black uppercase tracking-wider w-[11%]">
                                Type
                            </th>
                            <th className="px-4 py-2 text-left text-[10px] font-medium text-black uppercase tracking-wider w-[11%]">
                                Payee/Payer
                            </th>
                            <th className="px-4 py-2 text-left text-[10px] font-medium text-black uppercase tracking-wider w-[11%]">
                                Status
                            </th>
                            <th className="px-4 py-2 text-left text-[10px] font-medium text-black uppercase tracking-wider w-[11%]">
                                Method
                            </th>
                            <th className="px-4 py-2 text-left text-[10px] font-medium text-black uppercase tracking-wider w-[11%]">
                                <button
                                    onClick={toggleInitialBalanceSort}
                                    className="inline-flex items-center gap-1 hover:text-gray-700 uppercase transition-colors whitespace-nowrap"
                                >
                                    Initial Balance
                                    <div className="flex flex-col -space-y-2 -mx-0.5">
                                        <svg
                                            className={`w-3 h-3 ${initialBalanceSortOrder === 'asc' ? 'text-gray-900' : 'text-gray-400'}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414l-3.293 3.293a1 1 0 01-1.414 0z" />
                                        </svg>
                                        <svg
                                            className={`w-3 h-3 ${initialBalanceSortOrder === 'desc' ? 'text-gray-900' : 'text-gray-400'}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 13.586l3.293-3.293a1 1 0 011.414 0z" />
                                        </svg>
                                    </div>
                                </button>
                            </th>
                            <th className="px-4 py-2 text-left text-[10px] font-medium text-black uppercase tracking-wider w-[11%]">
                                <button
                                    onClick={toggleRemainingBalanceSort}
                                    className="inline-flex items-center gap-1 hover:text-gray-700 uppercase transition-colors whitespace-nowrap"
                                >
                                    Remaining Balance
                                    <div className="flex flex-col -space-y-2 -mx-0.5">
                                        <svg
                                            className={`w-3 h-3 ${remainingBalanceSortOrder === 'asc' ? 'text-gray-900' : 'text-gray-400'}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414l-3.293 3.293a1 1 0 01-1.414 0z" />
                                        </svg>
                                        <svg
                                            className={`w-3 h-3 ${remainingBalanceSortOrder === 'desc' ? 'text-gray-900' : 'text-gray-400'}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 13.586l3.293-3.293a1 1 0 011.414 0z" />
                                        </svg>
                                    </div>
                                </button>
                            </th>
                            <th className="px-4 py-2 text-left text-[10px] font-medium text-black uppercase tracking-wider w-[20%]">
                                Description
                            </th>
                            <th className="w-[5%]"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {sortedBills.length === 0 ? (
                            <tr>
                                <td colSpan={11} className="px-4 py-8 text-center text-sm text-gray-500">
                                    No transactions found for this property
                                </td>
                            </tr>
                        ) : (
                            sortedBills.map((bill) => {
                                const billPayments = getBillPayments(bill.id);
                                const remainingBalance = getRemainingBalance(bill.id, bill.balance);
                                const status = getBillStatus(bill.id, bill.balance);
                                const isExpanded = expandedBills.has(bill.id);
                                const isPaid = remainingBalance <= 0;

                                return (
                                    <React.Fragment key={bill.id}>
                                        {/* Bill Row */}
                                        <tr
                                            className={`group border-b border-gray-200 transition-colors ${
                                                isPaid ? 'bg-gray-50 hover:bg-gray-100' : 'hover:bg-gray-50'
                                            }`}
                                        >
                                            <td className="pl-4 py-1">
                                                {billPayments.length > 0 && (
                                                    <button
                                                        onClick={() => toggleBillExpansion(bill.id)}
                                                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                                                    >
                                                        <svg
                                                            className={`w-3 h-3 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </td>
                                            <td className={`pr-4 py-1 text-sm whitespace-nowrap ${isPaid ? 'text-gray-500' : 'text-gray-900'}`}>
                                                {formatDate(bill.dueBy)}
                                            </td>
                                            <td className={`px-4 py-1 text-sm whitespace-nowrap ${isPaid ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {formatDateCreated(bill.createdAt)}
                                            </td>
                                            <td className={`px-4 py-1 text-sm whitespace-nowrap ${isPaid ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {bill.type}
                                            </td>
                                            <td className={`px-4 py-1 text-sm ${isPaid ? 'text-gray-400' : 'text-gray-500'}`}>
                                                <div className="max-w-[150px] truncate" title={bill.payee || property?.address?.split(',')[0].trim() || '—'}>
                                                    {bill.payee || property?.address?.split(',')[0].trim() || '—'}
                                                </div>
                                            </td>
                                            <td className="px-4 py-1 text-sm whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                                        status === 'Paid'
                                                            ? 'bg-green-100 text-green-800'
                                                            : status === 'Partial Paid'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {status}
                                                    </span>
                                                    {isLate(bill.dueBy, remainingBalance) && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                                            Late
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className={`px-4 py-1 text-sm whitespace-nowrap ${isPaid ? 'text-gray-400' : 'text-gray-500'}`}></td>
                                            <td className="px-4 py-1 text-sm whitespace-nowrap">
                                                <span className={`font-medium ${isPaid ? 'text-gray-400' : 'text-gray-900'}`}>
                                                    ${bill.balance.toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-1 text-sm whitespace-nowrap">
                                                <span className={`font-medium ${isPaid ? 'text-gray-400' : 'text-red-600'}`}>
                                                    -${remainingBalance.toFixed(2)}
                                                </span>
                                            </td>
                                            <td className={`px-4 py-1 text-sm ${isPaid ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {bill.description || '—'}
                                            </td>
                                            <td className="px-4 py-1 text-right">
                                                <div
                                                    className="relative inline-block"
                                                    ref={(el) => { dropdownRefs.current[bill.id] = el; }}
                                                >
                                                    <button
                                                        onClick={(e) => {
                                                            const button = e.currentTarget;
                                                            const rect = button.getBoundingClientRect();
                                                            setDropdownPosition({
                                                                top: rect.bottom + 2,
                                                                right: window.innerWidth - rect.right
                                                            });
                                                            setOpenDropdownId(openDropdownId === bill.id ? null : bill.id);
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
                                                    {openDropdownId === bill.id && dropdownPosition && (
                                                        <div
                                                            className="fixed w-18 bg-white rounded-lg shadow-lg border border-gray-200 p-1 z-[200] animate-in fade-in slide-in-from-top-2 duration-200"
                                                            style={{
                                                                top: `${dropdownPosition.top}px`,
                                                                right: `${dropdownPosition.right}px`
                                                            }}
                                                        >
                                                            <button
                                                                onClick={() => {
                                                                    setOpenDropdownId(null);
                                                                    setDeletingBillId(bill.id);
                                                                    setIsDeleteBillOpen(true);
                                                                }}
                                                                className="w-full px-2 py-1 text-left text-sm text-red-600 hover:bg-gray-100 transition-colors rounded-md"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>

                                        {/* Payment Rows (Nested) */}
                                        {isExpanded && billPayments.map((payment) => {
                                            const paymentAmount = getPaymentAmountForBill(payment, bill.id);
                                            return (
                                                <tr
                                                    key={`payment-${payment.id}-${bill.id}`}
                                                    className={`border-b border-gray-100 transition-colors ${
                                                        isPaid ? 'bg-gray-50 hover:bg-gray-100' : 'bg-gray-50 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    <td className="pl-4 py-4.5"></td>
                                                    <td className="pr-4 py-1 text-sm text-gray-400 whitespace-nowrap pl-8"></td>
                                                    <td className={`px-4 py-1 text-sm whitespace-nowrap ${isPaid ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        {formatDateCreated(payment.createdAt)}
                                                    </td>
                                                    <td className={`px-4 py-1 text-sm whitespace-nowrap ${isPaid ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        {payment.type}
                                                    </td>
                                                    <td className="px-4 py-1 text-sm whitespace-nowrap"></td>
                                                    <td className={`px-4 py-1 text-sm whitespace-nowrap ${isPaid ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        {payment.referenceNumber || ''}
                                                    </td>
                                                    <td className="px-4 py-1 text-sm whitespace-nowrap"></td>
                                                    <td className="px-4 py-1 text-sm whitespace-nowrap">
                                                        <span className={`font-medium ${isPaid ? 'text-gray-400' : 'text-green-600'}`}>
                                                            +${paymentAmount.toFixed(2)}
                                                        </span>
                                                    </td>
                                                    <td className={`px-4 py-1 text-sm ${isPaid ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        {payment.description || '—'}
                                                    </td>
                                                    <td className="px-4 py-1 text-right">
                                                        <div
                                                            className="relative inline-block"
                                                            ref={(el) => { dropdownRefs.current[payment.id] = el; }}
                                                        >
                                                            <button
                                                                onClick={(e) => {
                                                                    const button = e.currentTarget;
                                                                    const rect = button.getBoundingClientRect();
                                                                    setDropdownPosition({
                                                                        top: rect.bottom + 2,
                                                                        right: window.innerWidth - rect.right
                                                                    });
                                                                    setOpenDropdownId(openDropdownId === payment.id ? null : payment.id);
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
                                                            {openDropdownId === payment.id && dropdownPosition && (
                                                                <div
                                                                    className="fixed w-22 bg-white rounded-lg shadow-lg border border-gray-200 p-1 z-[200] animate-in fade-in slide-in-from-top-2 duration-200"
                                                                    style={{
                                                                        top: `${dropdownPosition.top}px`,
                                                                        right: `${dropdownPosition.right}px`
                                                                    }}
                                                                >
                                                                    <button
                                                                        onClick={() => {
                                                                            setOpenDropdownId(null);
                                                                            setDeletingPaymentId(payment.id);
                                                                            setIsDeletePaymentOpen(true);
                                                                        }}
                                                                        className="w-full px-2 py-1 text-left text-sm text-red-600 hover:bg-gray-100 transition-colors rounded-md"
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </React.Fragment>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Confirmation Overlays */}
        <ConfirmDeleteBill
            isOpen={isDeleteBillOpen}
            onClose={() => {
                setIsDeleteBillOpen(false);
                setDeletingBillId(null);
            }}
            onConfirm={handleDeleteBill}
            billType={deletingBillId ? bills.find(b => b.id === deletingBillId)?.type : undefined}
            billBalance={deletingBillId ? bills.find(b => b.id === deletingBillId)?.balance : undefined}
        />

        <ConfirmDeletePayment
            isOpen={isDeletePaymentOpen}
            onClose={() => {
                setIsDeletePaymentOpen(false);
                setDeletingPaymentId(null);
            }}
            onConfirm={handleDeletePayment}
            paymentType={deletingPaymentId ? payments.find(p => p.id === deletingPaymentId)?.type : undefined}
            paymentBalance={deletingPaymentId ? payments.find(p => p.id === deletingPaymentId)?.balance : undefined}
        />
    </div>
    )
}
