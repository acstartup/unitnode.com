"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// Navbar component for site navigation
export function Navbar() {
    // State to track if navbar should be transparent or solid
    const [isScrolled, setIsScrolled] = useState(false);

    // Handle scroll events to change navbar appearance
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed left-1/2 -translate-x-1/2 top-0 z-50 transition-all duration-300 w-11/12 max-w-6xl mt-3 rounded-lg border border-gray-300 bg-white/95 backdrop-blur-sm shadow-sm",
                isScrolled ? "bg-white/95" : "bg-white/95"
            )}
        >
            <div className="px-3">
                <div className="flex items-center h-13">
                    {/* Logo - reduced padding */}
                    <div className="flex-shrink-0 pl-1">
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

                    {/* Navigation Links - centered with flex-1 and reduced spacing */}
                    <nav className="hidden md:flex flex-1 items-center justify-center space-x-6">
                        <Link href="/product" className="text-gray-600 hover:text-gray-900 font-small">
                            Product
                        </Link>
                        <Link href="/resources" className="text-gray-600 hover:text-gray-900 font-small">
                            Resources
                        </Link>
                        <Link href="/pricing" className="text-gray-600 hover:text-gray-900 font-small">
                            Pricing
                        </Link>
                    </nav>

                    {/* Auth Buttons - reduced left margin */}
                    <div className="hidden md:flex items-center space-x-2 pr-1">
                        <Link 
                            href="/login"
                            className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                        >
                            Log in
                        </Link>
                        <Link href="/signup">
                            <Button variant="secondary" size="sm">
                                Sign up
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile menu button - hidden on desktop */}
                    <div className="md:hidden ml-auto">
                        <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
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