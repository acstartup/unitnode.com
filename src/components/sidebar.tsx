'use client';

import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

    return (
        <aside className="h-screen w-60 bg-white border-r border-gray-400 text-black flex flex-col">
            {/* Sidebar header */}
                <div className="flex items-center gap px-2 border-gray-200">
                    <button className="flex hover:bg-gray-100 items-center mx-1 my-3 px-2 py-1.5 gap-3 rounded-lg w-full items-center">
                        { /* logo area */}
                        <div className="w-6 h-6 bg-gray-100 rounded-sm flex items-center justify-center">
                            <span className="text-black ont-bold text-xs">UN</span>
                        </div>
                        <span className="flex font-medium text-sm text-gray-700 flex-1">UnitNode</span>
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