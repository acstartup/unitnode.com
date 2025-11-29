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
        { name: 'Jone Doe', phone: '(555) 123-4567', relation: 'Main'},
        { name: 'Jann Smith', phone: '(555) 987-6543', relation: 'Sister'}
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

            {/* Lease */}
            <div className="px-8 py-5">
                {/* Sub-header: Lease */}
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Lease</h2>

                {/* Sub-sub-header */}
                <h3 className="text-md font-medium text-gray-900 mb-4 mx-1">Tenants</h3>

                {/* Tenants Table */}
                <table className="mx-2 w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-1 pr-12 text-xs font-semibold text-gray-900">Name</th>
                            <th className="text-left py-1 pr-5 text-xs font-semi-bold text-gray-900">Phone</th>
                            <th className="text-left py-1 pr-60 text-xs font-semi-bold text-gray-900">Relation</th>
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
        </div>
    )
}
