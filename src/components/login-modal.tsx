"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useModal } from "@/components/modal-provider";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefill?: boolean;
  prefillEmail?: string;
  prefillPassword?: string;
}

export function LoginModal({ isOpen, onClose, prefill = false, prefillEmail = "", prefillPassword = "" }: LoginModalProps) {
  const [email, setEmail] = useState(prefillEmail);
  const [password, setPassword] = useState(prefillPassword);
  const [emailBlurred, setEmailBlurred] = useState(false);
  const { openSignupModal } = useModal();
  
  // Update state when prefill props change
  useEffect(() => {
    if (prefill && prefillEmail) {
      setEmail(prefillEmail);
    }
    if (prefill && prefillPassword) {
      setPassword(prefillPassword);
    }
  }, [prefill, prefillEmail, prefillPassword]);
  
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/33 overflow-y-auto py-10" onClick={handleBackdropClick}>
      {/* Grey rectangle with rounded corners */}
      <div className="relative w-[95%] max-w-[1000px] h-auto min-h-[600px] md:h-[700px] border-2 border-grey-700 rounded-4xl bg-white flex flex-col md:flex-row animate-in fade-in duration-300">
        {/* Close button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-300 shadow-sm hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        {/* Left side - logo and text */}
        <div className="flex-1 flex flex-col items-center pt-12 md:pt-28 px-4 pb-8 md:pb-0">
          {/* UnitNode icon */}
          <div className="mb-5">
            <Image 
              src="/unitnode-icon.svg"
              alt="UnitNode Icon"
              width={40}
              height={40}
            />
          </div>
          
          {/* Login text */}
          <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
          
          {/* Sign up link */}
          <p className="text-sm text-gray-600 mb-8 font-medium">
            Don&apos;t have an account? <button 
              onClick={() => {
                onClose();
                openSignupModal();
              }} 
              className="text-primary hover:underline font-medium bg-transparent border-none p-0">Sign up</button>
          </p>

          {/* Form inputs */}
          <div className="w-full max-w-[380px]">
            {/* Email input */}
            <div className="mb-4">
              <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailBlurred(false)}
                onBlur={() => setEmailBlurred(true)}
                className={cn(
                  "w-full px-4 py-2.5 rounded-2xl bg-gray-100 border focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium transition-colors",
                  emailBlurred && !isValidEmail(email) && email.length > 0
                    ? "border-red-500 border-2"
                    : "border-gray-300"
                )}
              />
              {emailBlurred && !isValidEmail(email) && email.length > 0 && (
                <p className="text-red-500 text-xs mt-1 ml-1 transition-opacity animate-in fade-in font-medium">
                  Please enter a valid email address
                </p>
              )}
            </div>
            
            {/* Password input */}
            <div className="mb-4">
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium"
              />
            </div>
            
            {/* Forgot password link */}
            <div className="flex justify-end mb-6">
              <a href="#" className="text-xs text-primary hover:underline font-medium">
                Forgot password?
              </a>
            </div>

            {/* Login button */}
            <button className="w-full mx-auto block py-2.5 bg-black text-white rounded-full font-medium hover:bg-black/90 transition-colors text-sm">
              <span className="font-bold">Log in</span>
            </button>

            {/* OR divider */}
            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-gray-300"></div>
              <div className="px-4 text-xs text-gray-500">OR</div>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Continue with Google */}
            <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-100 text-gray-800 rounded-full border border-gray-300 hover:bg-gray-200 transition-colors text-sm">
              <Image src="/google.svg" alt="Google" width={18} height={18} />
              <span className="font-medium">Continue with Google</span>
            </button>
          </div>
        </div>
        
        {/* Right side - San Francisco image */}
        <div className="hidden md:flex flex-1 justify-center items-center p-2">
          <div className="relative w-full h-full">
            <Image 
              src="/san-fran.jpg"
              alt="San Francisco skyline"
              fill
              className="object-cover rounded-3xl"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}