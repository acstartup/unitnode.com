'use client';

import { useProperties } from '@/contexts/PropertyContext';
import React from 'react';

export default function Properties(){
    const { properties } = useProperties();

    return (
        <div className="min-h-screen w-full bg-white">
            {/* Page Header */}
            <div className="mb-1">
                <h1 className="text-3xl font-semibold text-gray-900 px-8 py-8">Properties</h1>
            </div>

            {/* Table Container */}
            <div className="border border-gray-200 rounded-lg mx-8">
                <table className="w-full overflow-visible rounded-lg">
                    {/* Table Header */}
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                                Property Address
                            </th>
                            <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                                Main Tenant
                            </th>
                            <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                                Rent
                            </th>
                            <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                                Occupied
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {properties.map((property) => (
                            <tr key={property.id}>
                                <td className="px-4 py-1 text-sm text-gray-900">{property.address}</td>
                                <td className="px-4 py-1 text-sm text-gray-500">{property.mainTenant}</td>
                                <td className="px-4 py-1 text-sm text-gray-500">{property.rent}</td>
                                <td className="px-4 py-1 text-sm text-gray-500">{property.occupied ? 'Yes' : 'No'}</td>
                                <td className="px-4 py-1 text-right">
                                    <div className="relative group inline-block">                                        
                                        <button
                                            className="p-1 rounded-2xl hover:bg-gray-100 transition-colors"
                                            aria-label="Actions"
                                        >
                                            <svg
                                                className="h-5 w-5 text-gray-400"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle cx="12" cy="6" r="2" />
                                                <circle cx="12" cy="13" r="2" />
                                                <circle cx="12" cy="20" r="2" />
                                            </svg>
                                        </button>

                                        {/* Action Tooltip */}
                                        <span className="absolute left-1/2 -translate-x-1/2 top-full mt-0 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                                            Action
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}