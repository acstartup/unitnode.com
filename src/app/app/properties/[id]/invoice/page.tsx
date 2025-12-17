'use client';

import { useParams, useRouter } from 'next/navigation';
import { useProperties } from '@/contexts/PropertyContext';

export default function InvoicePage() {
    const params = useParams();
    const router = useRouter();
    const { properties } = useProperties();
    const propertyId = params.id as string;

    const property = properties.find(p => p.id === propertyId);

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
                        {/* Sample row - replace with actual data */}
                        <tr className="group hover:bg-gray-50 transition-colors">
                            <td className="pl-4 py-1"></td>
                            <td className="pr-4 py-1 text-sm text-gray-900 whitespace-nowrap">—</td>
                            <td className="px-4 py-1 text-sm text-gray-500 whitespace-nowrap">—</td>
                            <td className="px-4 py-1 text-sm text-gray-500 whitespace-nowrap">—</td>
                            <td className="px-4 py-1 text-sm text-gray-500 whitespace-nowrap">—</td>
                            <td className="px-4 py-1 text-sm text-gray-500 whitespace-nowrap">—</td>
                            <td className="px-4 py-1 text-sm text-gray-500 whitespace-nowrap">—</td>
                            <td className="px-4 py-1 text-sm text-gray-500">—</td>
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
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    )
}