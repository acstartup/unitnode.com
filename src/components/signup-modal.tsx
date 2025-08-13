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
  const [verificationCode, setVerificationCode] = useState("");
  const [passwordBlurred, setPasswordBlurred] = useState(false);
  const [emailBlurred, setEmailBlurred] = useState(false);
  const [companyNameBlurred, setCompanyNameBlurred] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showVerificationStep, setShowVerificationStep] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [countdownActive, setCountdownActive] = useState(false);
  const { openLoginModal, setSavedCredentials } = useModal();
  const [requirements, setRequirements] = useState({
    hasEightChars: false,
    hasDigit: false,
    hasLowercase: false,
    hasUppercase: false
  });
  // Google completion step
  const [isGoogleCompleteStep, setIsGoogleCompleteStep] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleCompleteSuccess, setGoogleCompleteSuccess] = useState(false);
  
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
  
  // Countdown timer for verification code
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (countdownActive && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCountdownActive(false);
      setCountdown(60);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdownActive, countdown]);
  
  // No automatic redirect - removed as requested
  // Detect if we should show Google completion step
  useEffect(() => {
    try {
      const mode = localStorage.getItem('unitnode_signup_mode');
      const emailFromStore = localStorage.getItem('unitnode_signup_email') || '';
      if (mode === 'google_complete') {
        setIsGoogleCompleteStep(true);
        setGoogleEmail(emailFromStore);
        // Clear one-time flags
        localStorage.removeItem('unitnode_signup_mode');
        localStorage.removeItem('unitnode_signup_email');
      }
    } catch {}
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/33 overflow-y-auto py-10" onClick={handleBackdropClick}>
      {/* Modal container with translucent white background like navbar */}
      <div className="relative w-[95%] max-w-[800px] h-auto min-h-[600px] md:min-h-[640px] rounded-3xl border border-white/60 bg-white/80 backdrop-blur-md shadow-xl flex flex-col items-center justify-center animate-in fade-in duration-300">
        
        {/* Google Completion Step */}
        {isGoogleCompleteStep && (
          <div className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center p-8 rounded-4xl animate-in fade-in duration-300">
            <div className="relative w-full mb-5">
              <div className="flex justify-center">
                <Image 
                  src="/unitnode-logo.png"
                  alt="UnitNode"
                  width={150}
                  height={40}
                  priority
                />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-center">Complete your signup</h2>
            <p className="text-gray-600 text-center mb-6 max-w-md">
              Welcome
              {googleEmail ? (
                <span className="font-bold">, {googleEmail}</span>
              ) : null}
              . Enter your company name to finish.
            </p>

            <div className="w-full max-w-[380px]">
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
                  autoFocus
                />
                {companyNameBlurred && companyName.length === 0 && (
                  <p className="text-red-500 text-xs mt-1 ml-1 transition-opacity animate-in fade-in font-medium">
                    Company name is required
                  </p>
                )}
              </div>

              <button
                onClick={async () => {
                  if (companyName.trim().length === 0) {
                    setCompanyNameBlurred(true);
                    return;
                  }
                  setIsSubmitting(true);
                  setErrorMessage("");
                  try {
                    const res = await fetch('/api/auth/google/complete', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: googleEmail, companyName: companyName.trim() }),
                    });
                    const data = await res.json();
                    if (res.ok && data.success) {
                      // Show success overlay inside modal
                      setIsGoogleCompleteStep(false);
                      setGoogleCompleteSuccess(true);
                    } else {
                      setErrorMessage(data.message || 'Failed to save company name');
                    }
                  } catch {
                    setErrorMessage('An error occurred. Please try again.');
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
                {isSubmitting ? 'Saving...' : 'Finish'}
              </button>

              {/* Error message */}
              {errorMessage && (
                <p className="text-red-500 text-xs mt-2 text-center animate-in fade-in">{errorMessage}</p>
              )}

              <button
                onClick={() => setIsGoogleCompleteStep(false)}
                className="py-2.5 px-4 bg-transparent text-primary hover:underline font-medium text-sm w-full text-center mt-2"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {/* Google Completion Success */}
        {googleCompleteSuccess && (
          <div className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center p-8 rounded-4xl animate-in fade-in duration-300">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setGoogleCompleteSuccess(false);
              }}
              className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-300 shadow-sm hover:bg-gray-100 z-20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-3 text-center">All set!</h2>
            <p className="text-gray-700 mb-6 text-center max-w-md">Your company has been saved. You can now log in to your account.</p>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <button 
                onClick={() => {
                  // Close signup modal and open login modal
                  onClose();
                  setTimeout(() => {
                    openLoginModal();
                  }, 100);
                }}
                className="py-2.5 px-4 bg-black text-white rounded-full font-medium hover:bg-black/90 transition-colors text-sm w-full"
              >
                <span className="font-bold">Go to Login</span>
              </button>
              <button 
                onClick={() => {
                  // Return to the signup form
                  setGoogleCompleteSuccess(false);
                }}
                className="py-2.5 px-4 bg-transparent text-primary hover:underline font-medium text-sm w-full text-center"
              >
                Back to signup form
              </button>
            </div>
          </div>
        )}

        {/* Verification Code Step */}
        {showVerificationStep && (
          <div className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center p-8 rounded-4xl animate-in fade-in duration-300">
            <div className="relative w-full mb-5">
              <div className="flex justify-center">
                <Image 
                  src="/unitnode-logo.png"
                  alt="UnitNode"
                  width={150}
                  height={40}
                  priority
                />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-center">Verify Your Email</h2>
            <p className="text-gray-600 text-center mb-6 max-w-md">
              We&apos;ve sent a verification code to <span className="font-medium">{email}</span>. 
              Please enter the 6-digit code below:
            </p>
            
            <div className="w-full max-w-xs mb-6">
              <input
                type="text"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => {
                  // Only allow numbers and limit to 6 digits
                  const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                  setVerificationCode(value);
                  if (verificationError) setVerificationError("");
                }}
                className="w-full px-4 py-3 rounded-2xl bg-white/90 border border-white/70 focus:outline-none focus:ring-2 focus:ring-black/10 text-center text-xl font-medium tracking-widest letter-spacing-2"
                maxLength={6}
                autoFocus
                inputMode="numeric"
                pattern="[0-9]*"
              />
              
              {verificationError && (
                <p className="text-red-500 text-xs mt-1 text-center animate-in fade-in">
                  {verificationError}
                </p>
              )}
              
              <div className="text-center mt-2 text-sm text-gray-500">
                Code expires in {countdown} seconds
              </div>
            </div>
            
            <div className="flex flex-col w-full gap-3 max-w-xs">
              <button
                onClick={async () => {
                  if (verificationCode.length !== 6) {
                    setVerificationError("Please enter a valid 6-digit code");
                    return;
                  }
                  
                  setIsSubmitting(true);
                  
                  try {
                    const result = await apiClient.auth.verifyCode(verificationCode);
                    
                    if (result.success) {
                      setSignupSuccess(true);
                      setShowVerificationStep(false);
                    } else {
                      setVerificationError(result.message || "Invalid verification code");
                    }
                  } catch (/* eslint-disable-line @typescript-eslint/no-unused-vars */_) {
                    setVerificationError("An error occurred. Please try again.");
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                disabled={isSubmitting || verificationCode.length !== 6}
                className={cn(
                  "py-2.5 px-4 bg-black text-white rounded-full font-medium transition-colors text-sm w-full",
                  (isSubmitting || verificationCode.length !== 6) ? "opacity-70 cursor-not-allowed" : "hover:bg-black/90"
                )}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="font-bold">Verifying...</span>
                  </div>
                ) : (
                  <span className="font-bold">Verify Code</span>
                )}
              </button>
              
              <button
                onClick={async () => {
                  if (!countdownActive) {
                    setIsSubmitting(true);
                    
                    try {
                      const result = await apiClient.auth.signup(email, password, companyName);
                      
                      if (result.success) {
                        setCountdown(60);
                        setCountdownActive(true);
                      } else {
                        setVerificationError(result.message || "Failed to resend code");
                      }
                    } catch (/* eslint-disable-line @typescript-eslint/no-unused-vars */_) {
                      setVerificationError("An error occurred. Please try again.");
                    } finally {
                      setIsSubmitting(false);
                    }
                  }
                }}
                disabled={isSubmitting || countdownActive}
                className={cn(
                  "py-2.5 px-4 bg-transparent text-gray-600 rounded-full font-medium transition-colors text-sm w-full",
                  (isSubmitting || countdownActive) ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
                )}
              >
                {countdownActive ? `Resend code in ${countdown}s` : "Resend code"}
              </button>
              
              <button
                onClick={() => {
                  // Go back to signup form
                  setShowVerificationStep(false);
                }}
                className="py-2.5 px-4 bg-transparent text-primary hover:underline font-medium text-sm w-full text-center"
              >
                Back to signup
              </button>
            </div>
          </div>
        )}
        
        {/* Success Message */}
        {signupSuccess && (
          <div className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center p-8 rounded-4xl animate-in fade-in duration-300">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-300 shadow-sm hover:bg-gray-100 z-20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-3 text-center">Check Your Email</h2>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 max-w-md">
              <p className="text-gray-700 mb-2">
                We&apos;ve sent a verification link to <span className="font-medium">{email}</span>
              </p>
              <p className="text-gray-700">
                Please check your inbox and click the link to complete your registration.
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <button 
                onClick={() => {
                  // Close the signup modal and open login modal with prefilled credentials
                  onClose();
                  setSavedCredentials(email, password);
                  setTimeout(() => {
                    openLoginModal(email, password);
                  }, 100);
                }}
                className="py-2.5 px-4 bg-black text-white rounded-full font-medium hover:bg-black/90 transition-colors text-sm w-full"
              >
                <span className="font-bold">Go to Login</span>
              </button>
              <button 
                onClick={() => {
                  // Reset the modal state to show the signup form again
                  setSignupSuccess(false);
                  setShowVerificationStep(false);
                  setVerificationCode("");
                }}
                className="py-2.5 px-4 bg-transparent text-primary hover:underline font-medium text-sm w-full text-center"
              >
                Back to signup form
              </button>
            </div>
            <p className="text-gray-500 text-xs text-center mt-4">
              Didn&apos;t receive an email? Check your spam folder or <button 
                onClick={() => {
                  // Reset the modal state to show the signup form again
                  setSignupSuccess(false);
                  setShowVerificationStep(false);
                  setVerificationCode("");
                }} 
                className="text-primary hover:underline font-medium bg-transparent border-none p-0 text-xs">try again</button>.
            </p>
          </div>
        )}
        {/* Close button - always visible */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }} 
          className="absolute top-4 right-4 z-20 w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-300 shadow-sm hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        {/* Content - centered */}
        <div className="w-full flex flex-col items-center pt-10 px-6 pb-10">
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
          <h1 className="text-2xl font-bold mb-2 text-center">Create your UnitNode account</h1>
          
          {/* Sign in link */}
          <p className="text-sm text-gray-700 mb-8 font-medium text-center">
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
            <div className="mb-2 relative">
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordBlurred(false)}
                onBlur={() => setPasswordBlurred(true)}
                className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-white/90 border border-white/70 focus:outline-none focus:ring-2 focus:ring-black/10 text-sm font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-600 hover:text-gray-800"
              >
                {showPassword ? (
                  // Eye-off (simple)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <line x1="4" y1="4" x2="20" y2="20" />
                  </svg>
                ) : (
                  // Eye (simple)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
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
                    // Show success message - user needs to check email for verification link
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
              <div className="flex-1 h-px bg-white/60"></div>
              <div className="px-4 text-xs text-gray-700">OR</div>
              <div className="flex-1 h-px bg-white/60"></div>
            </div>

            {/* Continue with Google */}
            <button
              onClick={() => {
                // preserve flow as signup state
                window.location.href = '/api/auth/google/start?state=signup';
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-white text-black rounded-full border border-white/70 hover:bg-white/90 transition-colors text-sm"
            >
              <Image src="/google.svg" alt="Google" width={18} height={18} />
              <span className="font-medium">Continue with Google</span>
            </button>
          </div>
        </div>
        
        {/* Removed right-side image to keep modal clean and centered */}
      </div>
    </div>
  );
}