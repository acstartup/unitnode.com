'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useProperties } from '@/contexts/PropertyContext';
import { useToast } from '@/contexts/ToastContext';

interface AddPaymentOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddPaymentOverlay({ isOpen, onClose }: AddPaymentOverlayProps) {
    const [propertyAddress, setPropertyAddress] = useState('');
    const [type, setType] = useState('Cash');
    const [referenceNumber, setReferenceNumber] = useState('');
    const [balance, setBalance] = useState('');
    const [description, setDescription] = useState('');
    const [selectedBillsTotal, setSelectedBillsTotal] = useState(0);
    const [selectedBillsCount, setSelectedBillsCount] = useState(0);
    const [isUtilizeCreditChecked, setIsUtilizeCreditChecked] = useState(false);
    const [isAddToCreditChecked, setIsAddToCreditChecked] = useState(false);
    const [addToCreditAmount, setAddToCreditAmount] = useState('');
    const [mounted, setMounted] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        setMounted(true);
    }, []);

    // This would come from the property's credit balance in the future
    const availableCredit = 0; // Placeholder for available credit amount

    const { properties, getBillsByProperty, addPayment, payments, getPaymentsByProperty } = useProperties();
    const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
    const [filteredProperties, setFilteredProperties] = useState<typeof properties>([]);
    const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);
    const [selectedBillIds, setSelectedBillIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (isOpen) {
            setPropertyAddress('');
            setSelectedPropertyId('');
            setFilteredProperties([]);
            setShowPropertyDropdown(false);
            setType('Cash');
            setReferenceNumber('');
            setBalance('');
            setDescription('');
            setSelectedBillsTotal(0);
            setSelectedBillsCount(0);
            setIsUtilizeCreditChecked(false);
            setIsAddToCreditChecked(false);
            setAddToCreditAmount('');
            setSelectedBillIds(new Set());
        }
    }, [isOpen]);

    // Get bills and payments for selected property
    const bills = selectedPropertyId ? getBillsByProperty(selectedPropertyId) : [];
    const propertyPayments = selectedPropertyId ? getPaymentsByProperty(selectedPropertyId) : [];

    // Calculate remaining balance for a bill
    const getRemainingBalance = (billId: string, billBalance: number) => {
        const totalPaid = propertyPayments.reduce((total, payment) => {
            const applied = payment.appliedToBills?.find(a => a.billId === billId);
            return total + (applied?.amount || 0);
        }, 0);
        return billBalance - totalPaid;
    };

    // Update selected bills total when bill selection changes
    useEffect(() => {
        const total = bills
            .filter(bill => selectedBillIds.has(bill.id))
            .reduce((sum, bill) => sum + getRemainingBalance(bill.id, bill.balance), 0);
        setSelectedBillsTotal(total);
        setSelectedBillsCount(selectedBillIds.size);
    }, [selectedBillIds, bills, propertyPayments]);

    const toggleBillSelection = (billId: string) => {
        const newSelected = new Set(selectedBillIds);
        if (newSelected.has(billId)) {
            newSelected.delete(billId);
        } else {
            // Check if adding this bill would exceed the available balance
            const bill = bills.find(b => b.id === billId);
            if (bill) {
                const billRemainingBalance = getRemainingBalance(bill.id, bill.balance);
                const newTotal = selectedBillsTotal + billRemainingBalance;
                const availableBalance = paymentAmount + (isUtilizeCreditChecked ? availableCredit : 0);

                if (newTotal > availableBalance) {
                    showToast('Cannot select bill: total would exceed payment balance', 'error');
                    return; // Don't select the bill if it would exceed available balance
                }
            }
            newSelected.add(billId);
        }
        setSelectedBillIds(newSelected);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString + 'T00:00:00');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };

    const isLate = (dueBy: string, status: string) => {
        if (status === 'Paid') return false;
        const dueDate = new Date(dueBy + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return dueDate < today;
    };

    // Calculate undistributed balance
    const paymentAmount = parseFloat(balance) || 0;
    const addToCreditValue = parseFloat(addToCreditAmount) || 0;

    // Allocated includes: selected bills + add to credit (if checked)
    const totalAllocated = selectedBillsTotal + (isAddToCreditChecked ? addToCreditValue : 0);

    // Unallocated is what's left after allocation (utilize credit adds available credit to balance)
    const undistributedBalance = paymentAmount + (isUtilizeCreditChecked ? availableCredit : 0) - totalAllocated;

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

    if (!isOpen || !mounted) return null;

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

                        {/* Payment Section */}
                        <h2 className={`text-sm font-semibold py-2 ${!selectedPropertyId ? 'text-gray-400' : 'text-gray-400'}`}>Payment information</h2>

                        {/* First Row: Type, Reference #, Balance */}
                        <div className="flex gap-3 mb-3">
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
                                        <option value="Cash">Cash</option>
                                        <option value="Check">Check</option>
                                        <option value="Credit">Credit</option>
                                        <option value="Money Order">Money Order</option>
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

                            {/* Reference # */}
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Reference #
                                </label>
                                <input
                                    type="text"
                                    value={referenceNumber}
                                    onChange={(e) => setReferenceNumber(e.target.value)}
                                    disabled={!selectedPropertyId}
                                    className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed"
                                    placeholder="REF123456"
                                />
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
                        <div className="">
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={!selectedPropertyId}
                                rows={3}
                                className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed resize-none"
                                placeholder="Additional notes or details about this payment..."
                            />
                        </div>

                        {/* Bill Selection Section */}
                        <h2 className={`text-sm font-semibold py-2 ${!selectedPropertyId ? 'text-gray-400' : 'text-gray-400'}`}>Bill selection</h2>

                        {/* Credit Checkboxes and Summary - Same Row */}
                        <div className="mb-2 flex justify-between items-center">
                            <div className="flex gap-4">
                                {/* Utilize Credit */}
                                <div className="flex items-center gap-1.5">
                                    <input
                                        type="checkbox"
                                        id="utilizeCreditCheckbox"
                                        checked={isUtilizeCreditChecked}
                                        onChange={(e) => setIsUtilizeCreditChecked(e.target.checked)}
                                        disabled={!selectedPropertyId || availableCredit === 0}
                                        className="w-3.5 h-3.5 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                    <label
                                        htmlFor="utilizeCreditCheckbox"
                                        className={`text-xs ${!selectedPropertyId ? 'text-gray-400' : 'text-gray-700'}`}
                                    >
                                        Utilize Credit: <span className="font-medium">${availableCredit.toFixed(2)}</span>
                                    </label>
                                </div>

                                {/* Add to Credit */}
                                <div className="flex items-center gap-1.5">
                                    <input
                                        type="checkbox"
                                        id="addToCreditCheckbox"
                                        checked={isAddToCreditChecked}
                                        onChange={(e) => setIsAddToCreditChecked(e.target.checked)}
                                        disabled={!selectedPropertyId}
                                        className="w-3.5 h-3.5 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                    <label
                                        htmlFor="addToCreditCheckbox"
                                        className={`text-xs ${!selectedPropertyId ? 'text-gray-400' : 'text-gray-700'}`}
                                    >
                                        Add to Credit:
                                    </label>
                                    <input
                                        type="text"
                                        value={addToCreditAmount}
                                        onChange={(e) => setAddToCreditAmount(e.target.value)}
                                        disabled={!selectedPropertyId || !isAddToCreditChecked}
                                        placeholder="$0.00"
                                        className="w-24 px-2 py-1 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* Selected Bills Summary - Same Row, Right Side */}
                            <div className="flex gap-3 text-xs -mb-4">
                                <span className={!selectedPropertyId ? 'text-gray-400' : 'text-gray-600'}>
                                    Allocated: <span className="font-medium">${totalAllocated.toFixed(2)}</span>
                                </span>
                                <span className={!selectedPropertyId ? 'text-gray-400' : 'text-gray-600'}>
                                    Remaining: <span className="font-medium">${undistributedBalance.toFixed(2)}</span>
                                </span>
                            </div>
                        </div>

                        <div className="-mb-1">
                            <div className={`min-h-[150px] max-h-[200px] overflow-y-auto px-3 py-3 border border-gray-300 rounded-md ${!selectedPropertyId ? 'bg-gray-100' : 'bg-white'}`}>
                                {!selectedPropertyId ? (
                                    <div className="flex items-center justify-center h-[144px] text-sm text-gray-400">
                                        Select a property to view bills
                                    </div>
                                ) : bills.filter(bill => getRemainingBalance(bill.id, bill.balance) > 0).length === 0 ? (
                                    <div className="flex items-center justify-center h-[144px] text-sm text-gray-500">
                                        No unpaid bills available for this property
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {bills.filter(bill => getRemainingBalance(bill.id, bill.balance) > 0).map((bill) => (
                                            <div
                                                key={bill.id}
                                                onClick={() => toggleBillSelection(bill.id)}
                                                className="flex items-start gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer transition-colors"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedBillIds.has(bill.id)}
                                                    onChange={() => toggleBillSelection(bill.id)}
                                                    className="mt-0.5 w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <span className="text-xs font-medium text-gray-900">{bill.type}</span>
                                                        <span className="text-xs font-semibold text-gray-900">${getRemainingBalance(bill.id, bill.balance).toFixed(2)}</span>
                                                        <div className="flex items-center gap-1">
                                                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                                                bill.status === 'Paid'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : bill.status === 'Partial Paid'
                                                                    ? 'bg-yellow-100 text-yellow-800'
                                                                    : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {bill.status}
                                                            </span>
                                                            {isLate(bill.dueBy, bill.status) && (
                                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-800">
                                                                    Late
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                                                        <span>Due: {formatDate(bill.dueBy)}</span>
                                                        {bill.description && (
                                                            <>
                                                                <span>•</span>
                                                                <span className="truncate">{bill.description}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                            onClick={async () => {
                                if (!selectedPropertyId) {
                                    showToast('Please select a property first', 'error');
                                    return;
                                }

                                if (!balance) {
                                    showToast('Please enter a payment amount', 'error');
                                    return;
                                }

                                try {
                                    // Calculate how to distribute the payment across selected bills
                                    const paymentAmountValue = parseFloat(balance);
                                    const selectedBills = bills.filter(bill => selectedBillIds.has(bill.id));

                                    const appliedToBills = selectedBills.map(bill => ({
                                        billId: bill.id,
                                        amount: bill.balance // For now, apply full bill balance, but this will be split proportionally
                                    }));

                                    // If payment is split across bills, distribute proportionally
                                    if (selectedBills.length > 0) {
                                        const totalBillAmount = selectedBills.reduce((sum, bill) => sum + bill.balance, 0);
                                        const paymentToDistribute = Math.min(paymentAmountValue, totalBillAmount);

                                        appliedToBills.forEach((applied, index) => {
                                            const bill = selectedBills[index];
                                            applied.amount = (bill.balance / totalBillAmount) * paymentToDistribute;
                                        });
                                    }

                                    await addPayment({
                                        propertyId: selectedPropertyId,
                                        type,
                                        referenceNumber,
                                        balance: paymentAmountValue,
                                        description,
                                        appliedToBills: appliedToBills,
                                    });

                                    showToast('Payment added successfully', 'success');
                                    onClose();
                                } catch (error) {
                                    console.error('Error adding payment:', error);
                                    showToast('Failed to add payment', 'error');
                                }
                            }}
                            disabled={!selectedPropertyId}
                            className="px-3 py-1 bg-black text-white text-sm font-small rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            Add payment
                        </button>
                    </div>
                </div>
            </div>
        </>,
        document.body
    )
}
