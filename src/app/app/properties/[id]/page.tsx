'use client';

import { useParams, useRouter } from 'next/navigation';
import { useProperties } from '@/contexts/PropertyContext';

export default function PropertyDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { properties } = useProperties();
    const propertyId = params.id as string;

    const property = properties.find(p => p.id === propertyId);

    // Placeholder tenant data
    const tenants = [
        { name: 'Aiden Timothy-John Potato', phone: '(555) 123-4567', relation: 'Main'},
        { name: 'Jann Smith', phone: '(555) 987-6543', relation: 'Sister'}
    ]

    // Placeholder utility data
    const utility = [
        { type: 'Rent', recurrence: 'Yearly', cost: '$120'}
    ]

    // Placeholder owner data
    const owner = [
        { name: 'John Owner', email: 'john.owner@example.com', phone: '(555) 111-2222' }
    ]

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
            <div className="mb-0">
                <h1 className="text-3xl font-semibold text-gray-900 px-8">Property details</h1>
            </div>

            {/* Lease Section */}
            <div className="px-8 py-5">
                {/* Sub-header: Lease */}
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Lease</h2>

                {/* Sub-sub-header */}
                <h3 className="text-md font-medium text-gray-900 mb-4 mx-1">Tenants</h3>

                {/* Tenants Table */}
                <div className="max-w-6xl">
                    <table className="mx-2 w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-1 pr-35 text-xs font-semibold text-gray-900">Name</th>
                                <th className="text-left py-1 text-xs font-semibold text-gray-900">Phone</th>
                                <th className="text-left py-1 pr-125 text-xs font-semibold text-gray-900">Relation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tenants.map((tenant, index) => (
                                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                    <td className="py-1 text-sm text-gray-900 font-semibold">{tenant.name}</td>
                                    <td className="py-1 text-sm text-gray-600">{tenant.phone}</td>
                                    <td className="py-1 text-sm text-gray-600">{tenant.relation}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Utility */}
                <h3 className="text-md font-medium text-gray-900 mx-1 pt-6 pb-4">Utility</h3>

                {/* Utilities Table */}
                <div className="max-w-6xl">
                    <table className="mx-2 w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-1 pr-25 text-xs font-semibold text-gray-900">Type</th>
                                <th className="text-left py-1 pr-20 text-xs font-semibold text-gray-900">Recurrence</th>
                                <th className="text-left py-1 pr-170 text-xs font-semibold text-gray-900">Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {utility.map((utility, index) => (
                                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                    <td className="py-1 text-sm text-gray-900 font-semibold">{utility.type}</td>
                                    <td className="py-1 text-sm text-gray-600">{utility.recurrence}</td>
                                    <td className="py-1 text-sm text-gray-600">{utility.cost}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Property Section */}
            <div className="px-8 py-4">
                {/* Sub-header */}
                <div className="space-y-3">
                    {/* Header with Edit button */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">Owner</h2>
                        <button className="flex items-center border border-gray-300 gap-1.5 mx-1 px-2 py-1.25 text-sm font-medium text-gray-700 hover:border-gray-400 rounded-md transition-colors">
                            <svg
                                className="h-3.5 w-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                            </svg>
                            Edit
                        </button>
                    </div>
                    {/* Name */}
                    <div className="flex items-center py-3 mx-1">
                        <div className="w-48 text-sm font-medium text-gray-800">Name</div>
                        <div className="flex-1 text-sm text-gray-600">{owner[0].name}</div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center py-3 mx-1">
                        <div className="w-48 text-sm font-medium text-gray-800">Email</div>
                        <div className="flex-1 text-sm text-gray-600">{owner[0].email}</div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center py-3 mx-1">
                        <div className="w-48 text-sm font-medium text-gray-800">Phone</div>
                        <div className="flex-1 text-sm text-gray-600">{owner[0].phone}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
