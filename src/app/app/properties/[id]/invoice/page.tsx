'use client';

import { useParams, useRouter } from 'next/navigation';
import { useProperties } from '@/contexts/PropertyContext';

export default function InvoicePage() {
    const params = useParams();
    const router = useRouter();
    const { properties, getBillsByProperty, getPaymentsByProperty } = useProperties();
    const propertyId = params.id as string;

    const property = properties.find(p => p.id === propertyId);
    const bills = getBillsByProperty(propertyId);
    const payments = getPaymentsByProperty(propertyId);

    // Combine bills and payments into a single array for the invoice
    type InvoiceItem = {
        id: string;
        type: 'bill' | 'payment';
        date: Date;
        dueBy?: string;
        itemType: string;
        balance: number;
        description: string;
        status?: 'Unpaid' | 'Partial Paid' | 'Paid';
        referenceNumber?: string;
    };

    const invoiceItems: InvoiceItem[] = [
        ...bills.map(bill => ({
            id: bill.id,
            type: 'bill' as const,
            date: bill.createdAt,
            dueBy: bill.dueBy,
            itemType: bill.type,
            balance: bill.balance,
            description: bill.description,
            status: bill.status,
        })),
        ...payments.map(payment => ({
            id: payment.id,
            type: 'payment' as const,
            date: payment.createdAt,
            itemType: payment.type,
            balance: payment.balance,
            description: payment.description,
            referenceNumber: payment.referenceNumber,
        })),
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

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

    const isLate = (dueBy: string, status: string) => {
        if (status === 'Paid') return false;
        const dueDate = new Date(dueBy + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return dueDate < today;
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
            </div>
        </div>

        {/* Header */}
        <div className="mb-1">
            <h1 className="text-3xl font-semibold text-gray-900 px-8 py-6">Invoice</h1>
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
                    <tbody className="bg-white divide-y divide-gray-200">
                        {invoiceItems.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-500">
                                    No transactions found for this property
                                </td>
                            </tr>
                        ) : (
                            invoiceItems.map((item) => (
                                <tr key={item.id} className="group hover:bg-gray-50 transition-colors">
                                    <td className="pl-4 py-1"></td>
                                    <td className="pr-4 py-1 text-sm text-gray-900 whitespace-nowrap">
                                        {item.type === 'bill' && item.dueBy ? formatDate(item.dueBy) : '—'}
                                    </td>
                                    <td className="px-4 py-1 text-sm text-gray-500 whitespace-nowrap">{formatDateCreated(item.date)}</td>
                                    <td className="px-4 py-1 text-sm text-gray-500 whitespace-nowrap">{item.itemType}</td>
                                    <td className="px-4 py-1 text-sm whitespace-nowrap">
                                        {item.type === 'bill' && item.status ? (
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                                    item.status === 'Paid'
                                                        ? 'bg-green-100 text-green-800'
                                                        : item.status === 'Partial Paid'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {item.status}
                                                </span>
                                                {item.dueBy && isLate(item.dueBy, item.status) && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                                        Late
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <span>—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-1 text-sm text-gray-500 whitespace-nowrap">
                                        {item.type === 'payment' && item.referenceNumber ? item.referenceNumber : ''}
                                    </td>
                                    <td className="px-4 py-1 text-sm whitespace-nowrap">
                                        {item.type === 'bill' ? (
                                            <span className="text-red-600 font-medium">-${item.balance.toFixed(2)}</span>
                                        ) : (
                                            <span className="text-green-600 font-medium">+${item.balance.toFixed(2)}</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-1 text-sm text-gray-500">{item.description || '—'}</td>
                                    <td className="px-4 py-1 text-right">
                                        <button className="p-1.5 hover:bg-gray-100 rounded-md border border-gray-300 transition-colors">
                                            <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 16 16">
                                                <circle cx="8" cy="3" r="1.5"/>
                                                <circle cx="8" cy="8" r="1.5"/>
                                                <circle cx="8" cy="13" r="1.5"/>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    )
}