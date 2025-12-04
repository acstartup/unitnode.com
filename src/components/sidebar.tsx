'use client';

import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

    return (
        <aside className="h-screen w-60 bg-white border-r border-gray-400 text-black flex flex-col">
            {/* Sidebar header */}
            <div className="px-4 py-5 flex items-center gap-3 border-gray-200">
                { /* logo area */}
                <div className="w-7 h-7 bg-gray-300 rounded-sm flex items-center justify-center">
                    <span className="text-white font-bold text-xs">UN</span>
                </div>
                <span className="font-semibold text-base text-gray-900 flex-1">UnitNode</span>
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