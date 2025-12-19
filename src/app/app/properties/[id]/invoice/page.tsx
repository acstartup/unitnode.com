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

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openDropdownId && dropdownRefs.current[openDropdownId]) {
                const dropdownElement = dropdownRefs.current[openDropdownId];
                if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
                    setOpenDropdownId(null);
                }
            }
        };

        if (openDropdownId) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openDropdownId]);

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
                                Due By
                            </th>
                            <th className="px-4 py-2 text-left text-[10px] font-medium text-black uppercase tracking-wider w-[11%]">
                                Date Created
                            </th>
                            <th className="px-4 py-2 text-left text-[10px] font-medium text-black uppercase tracking-wider w-[11%]">
                                Type
                            </th>
                            <th className="px-4 py-2 text-left text-[10px] font-medium text-black uppercase tracking-wider w-[11%]">
                                Status
                            </th>
                            <th className="px-4 py-2 text-left text-[10px] font-medium text-black uppercase tracking-wider w-[11%]">
                                Method
                            </th>
                            <th className="px-4 py-2 text-left text-[10px] font-medium text-black uppercase tracking-wider w-[11%]">
                                Balance
                            </th>
                            <th className="px-4 py-2 text-left text-[10px] font-medium text-black uppercase tracking-wider w-[26%]">
                                Description
                            </th>
                            <th className="w-[5%]"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {bills.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-500">
                                    No transactions found for this property
                                </td>
                            </tr>
                        ) : (
                            bills.map((bill) => {
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
                                                            className="fixed w-22 bg-white rounded-lg shadow-lg border border-gray-200 p-1 z-[200] animate-in fade-in slide-in-from-top-2 duration-200"
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
