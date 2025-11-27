'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function Header() {
    const pathname = usePathname();
  
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const isActive = (path: string) => pathname === path;
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current?.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isDropdownOpen]);

    return (

        <header className="h-8 bg-white flex items-center px-8 sticky">
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {/* Search Icon */}
                        <svg
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 placeholder-gray-500 text-sm text-gray-900 focus:outline-none focus:bg-white focus:border-gray transition-colors"
                        />
                </div>
            </div>

            {/* right side: settings icon*/}
            <div className="ml-115 flex items-center gap-3 px-2">
                <div className="relative group">
                    <a
                        href="/app/settings"
                        className="block p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Settings"
                    >
                        <svg
                        className={`h-5 w-5 ${
                            isActive('/app/settings')
                                ? 'text-gray-900'
                                : 'text-gray-600'
                        }`}
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
                    </a>

                    {/* Custom Setting Tooltip */}
                    <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                        Settings
                    </span>
                </div>
              
                {/* Circle Plus Command Center Icon */}
                <div ref={dropdownRef} className="relative">
                    <button
                        className="block p-1.5 rounded-full hover:bg-gray-100 transition-colors hover:opacity-80 transition-opacity relative group"
                        aria-label="Add"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <svg
                            className="h-6 w-6"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <circle
                                cx="12"
                                cy="12"
                                r="10"
                                fill="black"
                            />
                            <path
                                d="M12 8v8M8 12h8"
                                stroke="white"
                                strokeWidth={2}
                                strokeLinecap="round"
                            />
                        </svg>

                        {/* Custom Command Tooltip */}
                        {!isDropdownOpen && (
                            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                                Command
                            </span>
                        )}
                    </button> 

                    {/* Dropdown Menu for Command Center*/}
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-0.5 w-40 bg-white rounded-lg shadow-lg border border-gray-200 p-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            {/* Add Property Button */}
                            <button className="w-full px-2 py-1 flex items-center gap-3 hover:bg-gray-100 transition-colors text-left rounded-md">
                                <svg
                                    className="h-4.5 w-4.5 flex-shrink-0"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        fill="white"
                                    />
                                    <path
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                        stroke="black"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span className="text-sm text-black">Add property</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}