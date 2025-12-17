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
        <div className="mb-0">
            <h1 className="text-3xl font-semibold text-gray-900 px-8">Invoice</h1>
        </div>
    </div>
    )
}