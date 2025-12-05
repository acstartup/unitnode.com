'use client';

import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

    return (
        <aside className="h-screen w-60 bg-white border-r border-gray-400 text-black flex flex-col">
            {/* Sidebar header */}
            { /* logo area */}
            {/* "div" because it is boxes (less critical) than critical side ("aside") information*/}
            <div className ="px-4 py-5">
                <h1 className="text-xl font-semibold text-gray-900">UnitNode</h1>
            </div>

            {/* Navigation (pages) */}
            <nav className="flex-1 px-4 py-6 space-y-1">
                {/* if on page, the words bold */}
                <a href="/app/dashboard" className={`flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 ${
                    isActive('/app/dashboard')
                        ? 'font-bold text-gray-900'
                        : 'font-medium text-gray-600'
                    }`}
                >
                    Dashboard
                </a>
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