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
            <div className="border border-gray-200 rounded-lg overflow-hidden mx-8">
                <table className="w-full">
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
                                <td className="px-4 py-3 text-sm text-gray-900">{property.address}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{property.mainTenant}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{property.rent}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{property.occupied ? 'Yes' : 'No'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}