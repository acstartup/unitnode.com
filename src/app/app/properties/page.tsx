'use client';

import React from 'react';

export default function Properties(){
    return (
        <div className="min-h-screen w-full bg-white">
            {/* Page Header */}
            <div className="mb-4">
                <h1 className="text-3xl font-semibold text-gray-900 px-8 py-6">Properties</h1>
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
                    {/* Table Body - Empty till connection */}
                    <tbody className="bg-white divid-y divide-gray-200">
                        {/* Rows will be added here */}
                    </tbody>
                </table>
            </div>

        </div>
    );
}