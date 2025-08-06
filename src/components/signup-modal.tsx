"use client";

import Image from "next/image";
import { useState } from "react";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignupModal({ isOpen, onClose }: SignupModalProps) {
  if (!isOpen) return null;
  
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-33 bg-black/33" onClick={handleBackdropClick}>
      {/* Grey rectangle with rounded corners */}
      <div className="relative w-[1000px] h-[700px] border-2 border-grey-700 rounded-4xl bg-white flex animate-in fade-in duration-300">
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
        <div className="flex-1 flex flex-col items-center pt-12">
          {/* UnitNode icon */}
          <div className="mb-5">
            <Image 
              src="/unitnode-icon.svg"
              alt="UnitNode Icon"
              width={40}
              height={40}
            />
          </div>
          
          {/* Create account text */}
          <h1 className="text-2xl font-bold mb-2">Create your UnitNode account</h1>
          
          {/* Sign in link */}
          <p className="text-sm text-gray-600 mb-8 font-medium">
            Already have an account? <a href="#" className="text-primary hover:underline">Sign in</a>
          </p>

          {/* Form inputs */}
          <div className="w-[380px]">
            {/* Company Name input */}
            <div className="mb-4">
              <input 
                type="text" 
                placeholder="Company Name" 
                className="w-full px-4 py-2.5 rounded-2xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium"
              />
            </div>
            
            {/* Company Email input */}
            <div className="mb-4">
              <input 
                type="email" 
                placeholder="Company Email" 
                className="w-full px-4 py-2.5 rounded-2xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium"
              />
            </div>

            {/* Password input */}
            <div className="mb-2">
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full px-4 py-2.5 rounded-2xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium"
              />
            </div>

            {/* Password requirements */}
            <div className="mb-8 pl-1">
              <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                <input type="radio" className="w-2.5 h-2.5" disabled />
                <span className="font-medium">At least 6 characters</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                <input type="radio" className="w-2.5 h-2.5" disabled />
                <span className="font-medium">One digit (0-9)</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                <input type="radio" className="w-2.5 h-2.5" disabled />
                <span className="font-medium">One lowercase letter (a-z)</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <input type="radio" className="w-2.5 h-2.5" disabled />
                <span className="font-medium">One uppercase letter (A-Z)</span>
              </div>
            </div>

            {/* Continue button */}
            <button className="w-full mx-auto block py-2.5 bg-black text-white rounded-full font-medium hover:bg-black/90 transition-colors text-sm">
              <span className="font-medium">Continue</span>
            </button>

            {/* Terms of service */}
            <p className="text-xs text-center text-gray-600 mt-4 font-medium">
              By continuing, you agree to UnitNode's <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
            </p>

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
        
        {/* Right side - Hong Kong image */}
        <div className="flex-1 flex justify-center items-center p-2">
          <div className="relative w-full h-full">
            <Image 
              src="/Hong-Kong-EarnestTse-Shutterstock.webp"
              alt="Hong Kong skyline"
              fill
              className="object-cover rounded-3xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}