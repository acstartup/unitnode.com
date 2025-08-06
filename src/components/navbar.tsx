"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useModal } from "@/components/modal-provider";

// Navbar component for site navigation
export function Navbar() {
    // State to track if navbar should be transparent or solid
    const [isScrolled, setIsScrolled] = useState(false);
    // State for active dropdown
    const [hoverTimeout] = useState<number | null>(null);
    // Access modal functions
    const { openSignupModal, openLoginModal } = useModal();

    // Handle scroll events to change navbar appearance
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    
    // Use a ref to handle hover intent without event listeners
    useEffect(() => {
        // Clean up timeout on unmount
        return () => {
            if (hoverTimeout) {
                clearTimeout(hoverTimeout);
            }
        };
    }, [hoverTimeout]);

    return (
        <header
            className={cn(
                "fixed left-1/2 -translate-x-1/2 top-0 z-50 transition-all duration-300 w-11/12 max-w-6xl mt-3 rounded-lg border border-gray-300 bg-white/95 backdrop-blur-sm shadow-xs",
                isScrolled ? "bg-white/95" : "bg-white/95"
            )}
        >
            <div className="px-3">
                <div className="flex items-center h-13">
                    {/* Logo - reduced padding */}
                    <div className="flex-shrink-0 pl-4">
                        <Link href="/">
                            <Image
                                src="/unitnode-full.svg"
                                alt="UnitNode"
                                width={130}
                                height={30}
                                className="h-7 w-auto"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Navigation Links - with dropdowns */}
                    <nav className="hidden md:flex flex-1 items-center justify-center space-x-6">
                        {/* Product Dropdown */}
                        <div className="relative group" data-hover="dropdown">
                            <button className="text-gray-600 group-hover:text-gray-900 font-sm flex items-center gap-1 cursor-pointer relative">
                                Product
                                <svg width="8" height="5" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-200 group-hover:rotate-180">
                                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span className="dropdown-connector"></span>
                            </button>
                            
                            {/* Product Dropdown menu */}
                            <div className="dropdown-menu absolute -left-22 top-full mt-5 w-64 rounded-lg bg-white/80 backdrop-blur-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                {/* Invisible area to prevent dropdown from closing when moving mouse */}
                                <div className="absolute h-5 -top-5 left-0 right-0"></div>
                                <div className="py-0.5">
                                    <a href="/login" className="flex items-start px-3.5 py-1.5 rounded-md m-0.5 transition-colors group/item">
                                        <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center mr-3 transition-colors group-hover/item:bg-gray-300">
                                            <Image
                                                src="/pm-portal.svg"
                                                alt="Property Management Portal"
                                                width={21}
                                                height={21}
                                                className="transition-colors "
                                            />
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">Property Manager Portal</div>
                                            <div className="text-sm text-gray-500 transition-all group-hover/item:text-gray-700">Automate your tasks</div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                        
                        {/* Resources Dropdown */}
                        <div className="relative group" data-hover="dropdown">
                            <button className="text-gray-600 group-hover:text-gray-900 font-sm flex items-center gap-1 cursor-pointer relative">
                                Resources
                                <svg width="8" height="5" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-200 group-hover:rotate-180">
                                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span className="dropdown-connector"></span>
                            </button>
                            
                            {/* Resources Dropdown menu */}
                            <div className="dropdown-menu absolute -left-13 top-full mt-5 w-48 rounded-lg bg-white/60 backdrop-blur-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                {/* Invisible area to prevent dropdown from closing when moving mouse */}
                                <div className="absolute h-5 -top-5 left-0 right-0"></div>
                                <div className="py-0.5">
                                    <a href="/blog" className="flex items-start px-3.5 py-1.5 rounded-md m-0.5 transition-colors group/item">
                                        <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center mr-2.5 transition-colors group-hover/item:bg-gray-300">
                                            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-colors group-hover/item:stroke-primary">
                                                <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M7 7H17M7 12H17M7 17H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">Blog</div>
                                            <div className="text-sm text-gray-500 transition-all group-hover/item:text-gray-700">Latest updates</div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Help Dropdown */}
                        <div className="relative group" data-hover="dropdown">
                            <button className="text-gray-600 group-hover:text-gray-900 font-sm flex items-center gap-1 cursor-pointer relative">
                                Help
                                <svg width="8" height="5" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-200 group-hover:rotate-180">
                                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span className="dropdown-connector"></span>
                            </button>
                            
                            {/* Help Dropdown Menu*/}
                            <div className="dropdown-menu absolute -left-15 top-full mt-5 w-42 rounded-lg bg-white/60 backdrop-blur-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                {/* Invisible area to prevent dropdown from closing when moving mouse */}
                                <div className="absolute h-5 -top-5 left-0 right-0"></div>
                                <div className="py-0.5">
                                    <a href="/support" className="flex items-start px-3.5 py-1.5 rounded-md m-0.5 transition-colors group/item">
                                        <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center mr-2.5 transition-colors group-hover/item:bg-gray-300">
                                            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-colors group-hover/item:stroke-primary">
                                                <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M7 7H17M7 12H17M7 17H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">Contact</div>
                                            <div className="text-sm text-gray-500 transition-all group-hover/item:text-gray-700">Get support</div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    
                        <Link href="/pricing" className="text-gray-600 hover:text-gray-900 font-sm">
                            Pricing
                        </Link>
                    </nav>

                    {/* Auth Buttons - reduced left margin */}
                    <div className="hidden md:flex items-center space-x-1 pr-4">
                        <button
                            onClick={openLoginModal}
                            className="text-sm text-gray-600 hover:text-gray-900 px-1.5 py-1 bg-transparent border-none cursor-pointer"
                        >
                            Login
                        </button>
                        <Button 
                            variant="secondary" 
                            size="sm" 
                            className="py-1 px-3 font-extrabold text-sm"
                            onClick={openSignupModal}
                        >
                            Sign up
                        </Button>
                    </div>

                    {/* Mobile menu button - hidden on desktop */}
                    <div className="md:hidden ml-auto">
                        <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer">
                            <span className="sr-only">Open menu</span>
                            {/* Simple hamburger icon */}
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M4 6H20M4 12H20M4 18H20"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

        </header>
    );
}