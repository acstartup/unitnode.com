'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar() {
    const pathname = usePathname();
    const [showDropdown, setShowDropdown] = useState(false);

    const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

    return (
        <aside className="h-screen w-60 bg-white border-r border-gray-400 text-black flex flex-col">
            {/* Sidebar header */}
                <div className="flex items-center gap px-2 border-gray-200">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)} 
                        className={`flex hover:bg-gray-100 items-center mx-1 my-3 px-2 py-1.5 gap-3 rounded-lg w-full items-center ${showDropdown ? 'bg-gray-100' : ''}`}
                    >
                        { /* logo area */}
                        <div className="w-6 h-6 bg-gray-100 rounded-sm flex items-center justify-center">
                            <span className="text-black text-xs">UN</span>
                        </div>
                        <span className={'flex text-sm flex-1'}>
                            UnitNode
                        </span>
                        <svg
                            className="h-4 w-4 text-gray-600 pointer-events-none"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 9l6 6 6-6"
                            />
                        </svg>
                    </button>

                    {/* Dropdown */}
                    {showDropdown && (
                        <div className="absolute top-14 left-3 w-70 h-70 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                            <div className="flex justify-center py-5">
                                 <div className="w-20 h-20 bg-gray-100 rounded-sm">
                                    <span className="flex justify-center py-6 text-black text-xl">
                                        UN
                                    </span>
                                    <h1 className="flex justify-center py-3 text-md ">UnitNode</h1>

                                </div>
                            </div>
                        </div>
                    )}
                </div>

            {/* Navigation (pages) */}
            <nav className="flex-1 px-4 py-6 space-y-1">
                {/* if on page, the words bold */}
                <a href="/app/properties" className={`flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 ${
                    isActive('/app/properties')
                        ? 'font-bold text-gray-900'
                        : 'font-medium text-gray-600'
                    }`}
                >
                    Properties
                </a>
            </nav>
        </aside>
    )
}