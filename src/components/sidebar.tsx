'use client';

import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function Sidebar() {
    const pathname = usePathname();
    const [showDropdown, setShowDropdown] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isHoveringToggle, setIsHoveringToggle] = useState(false);

    const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showDropdown]);

    return (
        <div className="relative">
            <aside className={`h-screen bg-white border-r border-gray-400 text-black flex flex-col transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-60'}`}>
                {/* Sidebar header */}
                    <div ref={dropdownRef} className="flex items-center gap px-2 border-gray-200 relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)} 
                            className={`flex hover:bg-gray-100 items-center mx-1 my-3 px-2 py-1.5 gap-3 rounded-lg w-full items-center ${showDropdown ? 'bg-gray-100' : ''}`}
                        >
                            { /* logo area */}
                            <div className="w-6 h-6 bg-gray-100 rounded-sm flex items-center justify-center">
                                <span className="text-black text-xs">UN</span>
                            </div>
                            {!isCollapsed && (
                                <>
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
                                </>
                            )}
                        </button>

                        {/* Dropdown */}
                        {showDropdown && !isCollapsed && (
                            <div className="absolute top-14 left-3 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="p-2">
                                    {/* Logo Section */}
                                    <div className="flex flex-col items-center py-3 border-gray-200">
                                        <div className="w-16 h-16 bg-gray-100 rounded-sm flex items-center justify-center mb-2">
                                            <span className="text-black text-lg font-semibold">UN</span>
                                        </div>
                                        <h1 className="text-md font-medium">UnitNode</h1>
                                    </div>

                                    {/* Menu items */}
                                    <div className="py-1 pb-0">
                                        {/* Settings */}
                                        <Link 
                                            href="/app/settings"
                                            onClick={() => setShowDropdown(false)} 
                                            className="w-full px-3 py-2 flex items-center gap-3 hover:bg-gray-100 transition-colors text-left rounded-md">
                                            <svg
                                                className="h-4.5 w-4.5 text-gray-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />                               
                                            </svg>
                                            <span className="text-sm text-gray-700">Settings</span>
                                        </Link>

                                        {/* Divider */}
                                        <div className="border-t border-gray-200 my-1"></div>

                                        {/* Personal Details */}
                                        <Link 
                                            href="/app/settings/account" 
                                            onClick={() => setShowDropdown(false)}
                                            className="w-full px-3 py-2 flex items-center gap-3 hover:bg-gray-100 transition-colors text-left rounded-md">
                                            <svg
                                                className="h-4.5 w-4.5 text-gray-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                            <span className="text-sm text-gray-700">unitnode@gmail.com</span>
                                        </Link>

                                        {/* Log Out */}
                                        <button
                                            onClick={async () => {
                                                setShowDropdown(false);
                                                try {
                                                    await fetch('/api/auth/logout', {
                                                        method: 'POST',
                                                    });
                                                    window.location.href = '/';
                                                } catch (error) {
                                                    console.error('Logout failed:', error);
                                                }
                                            }} 
                                            className="w-full px-3 py-2 flex items-center gap-3 hover:bg-gray-100 transition-colors text-left rounded-md">    
                                            <svg
                                                className="h-4.5 w-4.5 text-gray-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                                />
                                            </svg>
                                            <span className="text-sm text-gray-700">Log out</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                {/* Navigation (pages) */}
                <nav className="flex-1 px-4 py-6 space-y-1">
                    {/* if on page, the words bold */}
                    {/* <Link href="/app/dashboard" className={`flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 ${
                        isActive('/app/dashboard')
                            ? 'font-bold text-gray-900'
                            : 'font-medium text-gray-600'
                        }`}
                    >
                        Dashboard
                    </Link> */}
                    <Link href="/app/properties" className={`flex items-center ${isCollapsed ? 'justify-center -mx-1' : 'pl-2 -mx-1'} px-1 py-2 text-sm rounded-lg hover:bg-gray-100 ${
                        isActive('/app/properties')
                            ? 'font-bold text-gray-900'
                            : 'font-medium text-gray-600'
                        }`}
                    >
                        <svg
                            className={`h-5 w-5 text-gray-600 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                        </svg>
                        {!isCollapsed && 'Properties'}
                    </Link>
                </nav>
            </aside>

            {/* Toggle button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                onMouseEnter={() => setIsHoveringToggle(true)}
                onMouseLeave={() => setIsHoveringToggle(false)}
                className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center transition-all group"
                style={{ left: isCollapsed ? '64px' : '240px' }}
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                {!isHoveringToggle && (
                    <div className="w-0.5 h-4 bg-gray-400 ml-2">
                        <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                            Collapse
                        </span>
                    </div>
                )}
                {isHoveringToggle && (
                    <svg
                        className="h-4 w-4 text-gray-600 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={isCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}
                        />
                    </svg>
                )}
                {/* Tooltip */}
                <span className="absolute left-full ml-1 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitesapce-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                    {isCollapsed ? 'Expand' : 'Collapse'}
                </span>
            </button>
            
        </div>
    )

}