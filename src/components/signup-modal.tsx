"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useModal } from "@/components/modal-provider";
import { apiClient } from "@/lib/app/api-client";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [passwordBlurred, setPasswordBlurred] = useState(false);
  const [emailBlurred, setEmailBlurred] = useState(false);
  const [companyNameBlurred, setCompanyNameBlurred] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { openLoginModal } = useModal();
  const [requirements, setRequirements] = useState({
    hasEightChars: false,
    hasDigit: false,
    hasLowercase: false,
    hasUppercase: false
  });
  
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  useEffect(() => {
    setRequirements({
      hasEightChars: password.length >= 8,
      hasDigit: /\d/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password)
    });
  }, [password]);
  
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
        
        {signupSuccess && (
          <div className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center p-8 rounded-4xl animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-center">Verification Email Sent</h2>
            <p className="text-gray-600 text-center mb-6 max-w-md">
              We've sent a verification email to <span className="font-medium">{email}</span>. 
              Please check your inbox and click the verification link to complete your signup.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
              <button 
                onClick={() => {
                  onClose();
                  openLoginModal();
                }}
                className="py-2.5 px-4 bg-black text-white rounded-full font-medium hover:bg-black/90 transition-colors text-sm flex-1"
              >
                <span className="font-bold">Go to Login</span>
              </button>
              <button 
                onClick={onClose}
                className="py-2.5 px-4 bg-gray-100 text-gray-800 rounded-full font-medium hover:bg-gray-200 transition-colors text-sm border border-gray-300 flex-1"
              >
                <span className="font-bold">Close</span>
              </button>
            </div>
          </div>
        )}
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
        <div className="flex-1 flex flex-col items-center pt-12 px-4 pb-8 md:pb-0">
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
            Already have an account? <button 
              onClick={() => {
                onClose();
                openLoginModal();
              }} 
              className="text-primary hover:underline font-medium bg-transparent border-none p-0">Sign in</button>
          </p>

          {/* Form inputs */}
          <div className="w-full max-w-[380px]">
            {/* Company Name input */}
            <div className="mb-4">
              <input 
                type="text" 
                placeholder="Company Name" 
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                onFocus={() => setCompanyNameBlurred(false)}
                onBlur={() => setCompanyNameBlurred(true)}
                className={cn(
                  "w-full px-4 py-2.5 rounded-2xl bg-gray-100 border focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium transition-colors",
                  companyNameBlurred && companyName.length === 0
                    ? "border-red-500 border-2"
                    : "border-gray-300"
                )}
              />
              {companyNameBlurred && companyName.length === 0 && (
                <p className="text-red-500 text-xs mt-1 ml-1 transition-opacity animate-in fade-in font-medium">
                  Company name is required
                </p>
              )}
            </div>
            
            {/* Company Email input */}
            <div className="mb-4">
              <input 
                type="email" 
                placeholder="Company Email" 
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
            <div className="mb-2">
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordBlurred(false)}
                onBlur={() => setPasswordBlurred(true)}
                className="w-full px-4 py-2.5 rounded-2xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium"
              />
            </div>

            {/* Password requirements */}
            <div className="mb-8 pl-1">
              <div className={cn(
                "flex items-center gap-2 text-xs mb-1 transition-all duration-300",
                requirements.hasEightChars 
                  ? "text-green-600" 
                  : passwordBlurred 
                    ? "text-red-600"
                    : "text-gray-600"
              )}>
                <div className="flex items-center justify-center w-4 h-4">
                  {requirements.hasEightChars ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-green-600 transition-transform duration-300 animate-in zoom-in" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : passwordBlurred ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-red-600 transition-transform duration-300 animate-in zoom-in" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full border border-gray-400"></div>
                  )}
                </div>
                <span className={cn(
                  "transition-all duration-300",
                  requirements.hasEightChars 
                    ? "font-bold animate-in fade-in" 
                    : "font-medium"
                )}>
                  At least 8 characters
                </span>
              </div>
              
              <div className={cn(
                "flex items-center gap-2 text-xs mb-1 transition-all duration-300",
                requirements.hasDigit 
                  ? "text-green-600" 
                  : passwordBlurred 
                    ? "text-red-600"
                    : "text-gray-600"
              )}>
                <div className="flex items-center justify-center w-4 h-4">
                  {requirements.hasDigit ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-green-600 transition-transform duration-300 animate-in zoom-in" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : passwordBlurred ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-red-600 transition-transform duration-300 animate-in zoom-in" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full border border-gray-400"></div>
                  )}
                </div>
                <span className={cn(
                  "transition-all duration-300",
                  requirements.hasDigit 
                    ? "font-bold animate-in fade-in" 
                    : "font-medium"
                )}>
                  One digit (0-9)
                </span>
              </div>
              
              <div className={cn(
                "flex items-center gap-2 text-xs mb-1 transition-all duration-300",
                requirements.hasLowercase 
                  ? "text-green-600" 
                  : passwordBlurred 
                    ? "text-red-600"
                    : "text-gray-600"
              )}>
                <div className="flex items-center justify-center w-4 h-4">
                  {requirements.hasLowercase ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-green-600 transition-transform duration-300 animate-in zoom-in" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : passwordBlurred ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-red-600 transition-transform duration-300 animate-in zoom-in" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full border border-gray-400"></div>
                  )}
                </div>
                <span className={cn(
                  "transition-all duration-300",
                  requirements.hasLowercase 
                    ? "font-bold animate-in fade-in" 
                    : "font-medium"
                )}>
                  One lowercase letter (a-z)
                </span>
              </div>
              
              <div className={cn(
                "flex items-center gap-2 text-xs transition-all duration-300",
                requirements.hasUppercase 
                  ? "text-green-600" 
                  : passwordBlurred 
                    ? "text-red-600"
                    : "text-gray-600"
              )}>
                <div className="flex items-center justify-center w-4 h-4">
                  {requirements.hasUppercase ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-green-600 transition-transform duration-300 animate-in zoom-in" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : passwordBlurred ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-red-600 transition-transform duration-300 animate-in zoom-in" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full border border-gray-400"></div>
                  )}
                </div>
                <span className={cn(
                  "transition-all duration-300",
                  requirements.hasUppercase 
                    ? "font-bold animate-in fade-in" 
                    : "font-medium"
                )}>
                  One uppercase letter (A-Z)
                </span>
              </div>
            </div>

            {/* Continue button */}
            <button 
              onClick={async () => {
                // Validate form
                if (!isValidEmail(email)) {
                  setEmailBlurred(true);
                  return;
                }
                
                if (companyName.length === 0) {
                  setCompanyNameBlurred(true);
                  return;
                }
                
                if (!requirements.hasEightChars || !requirements.hasDigit || 
                    !requirements.hasLowercase || !requirements.hasUppercase) {
                  setPasswordBlurred(true);
                  return;
                }
                
                setIsSubmitting(true);
                setErrorMessage("");
                
                try {
                  const result = await apiClient.auth.signup(email, password, companyName);
                  
                  if (result.success) {
                    setSignupSuccess(true);
                  } else {
                    setErrorMessage(result.message || "Failed to create account. Please try again.");
                  }
                } catch (error) {
                  console.error("Signup error:", error);
                  setErrorMessage("An unexpected error occurred. Please try again.");
                } finally {
                  setIsSubmitting(false);
                }
              }}
              disabled={isSubmitting}
              className={cn(
                "w-full mx-auto block py-2.5 bg-black text-white rounded-full font-medium transition-colors text-sm",
                isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-black/90"
              )}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="font-bold">Sending...</span>
                </div>
              ) : (
                <span className="font-bold">Continue</span>
              )}
            </button>
            
            {/* Error message */}
            {errorMessage && (
              <p className="text-red-500 text-xs mt-2 text-center animate-in fade-in">
                {errorMessage}
              </p>
            )}

            {/* Terms of service */}
            <p className="text-xs text-center text-gray-600 mt-4 font-medium">
              By continuing, you agree to UnitNode&apos;s <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
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
        <div className="hidden md:flex flex-1 justify-center items-center p-2">
          <div className="relative w-full h-full">
            <Image 
              src="/Hong-Kong-EarnestTse-Shutterstock.webp"
              alt="Hong Kong skyline"
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