'use client';

import { useParams } from 'next/navigation';
import { useProperties } from '@/contexts/PropertyContext';

export default function PropertyDetailsPage() {
    const params = useParams();
    const { properties } = useProperties();
    const propertyId = params.id as string;

    const property = properties.find(p => p.id === propertyId);

    return (
        <div className="w-full bg-white">
            {/* Breadcrumbs */}
            <div className="px-8 pt-8 pb-1">
                <div className="flex items-center text-sm text-gray-500 font-semibold">
                    <span>{property?.address || 'Loading...'}</span>
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
            <div className="mb-1">
                <h1 className="text-3xl font-semibold text-gray-900 px-8">Property details</h1>
            </div>
        </div>
    )
}
