"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useModal } from "@/components/modal-provider";
import { useRouter } from "next/navigation";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefill?: boolean;
  prefillEmail?: string;
  prefillPassword?: string;
}

export function LoginModal({ isOpen, onClose, prefill = false, prefillEmail = "", prefillPassword = "" }: LoginModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState(prefillEmail);
  const [password, setPassword] = useState(prefillPassword);
  const [emailBlurred, setEmailBlurred] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showVerificationStep, setShowVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const [countdownActive, setCountdownActive] = useState(false);
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
  
  // Check for saved credentials from email verification
  useEffect(() => {
    if (isOpen) {
      try {
        const savedPrefill = localStorage.getItem('unitnode_login_prefill');
        if (savedPrefill) {
          const prefillData = JSON.parse(savedPrefill);
          
          // Check if the prefill data is recent (within the last 5 minutes)
          const isRecent = Date.now() - prefillData.timestamp < 5 * 60 * 1000;
          
          if (isRecent && prefillData.email) {
            setEmail(prefillData.email);
            
            // Set password if available
            if (prefillData.password) {
              setPassword(prefillData.password);
            }
            
            // Clear the saved data after using it once
            localStorage.removeItem('unitnode_login_prefill');
          }
        }
      } catch (error) {
        console.error('Error reading saved login credentials:', error);
      }
    }
  }, [isOpen]);
  
  // Countdown timer for verification code
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (countdownActive && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCountdownActive(false);
      setCountdown(300);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdownActive, countdown]);
  
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  // Force reset state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setShowVerificationStep(false);
      setVerificationCode("");
      setVerificationError("");
      setErrorMessage("");
      setIsSubmitting(false);
      setCountdownActive(false);
      setCountdown(300);
    }
  }, [isOpen]);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/33 overflow-y-auto py-10" onClick={handleBackdropClick}>
      {/* Grey rectangle with rounded corners */}
      <div className="relative w-[95%] max-w-[1000px] h-auto min-h-[600px] md:h-[700px] border-2 border-grey-700 rounded-4xl bg-white flex flex-col md:flex-row animate-in fade-in duration-300">
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
            <h2 className="text-2xl font-bold mb-2 text-center">Two-Factor Authentication</h2>
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
                className="w-full px-4 py-3 rounded-2xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 text-center text-xl font-medium tracking-widest letter-spacing-2"
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
                Code expires in {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
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
                    // Import here to avoid circular dependency
                    const { apiClient } = await import('@/lib/app/api-client');
                    
                    // Step 2: Verify the code
                    const result = await apiClient.auth.loginVerifyCode(verificationCode, email);
                    
                    if (result.success && result.user) {
                      // Store user data in localStorage
                      localStorage.setItem('unitnode_user', JSON.stringify(result.user));
                      // Redirect to dashboard or main app
                      router.push('/app/dashboard');
                      onClose();
                    } else {
                      setVerificationError(result.message || "Invalid verification code");
                    }
                  } catch (error) {
                    console.error("Verification error:", error);
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
                      // Import here to avoid circular dependency
                      const { apiClient } = await import('@/lib/app/api-client');
                      
                      // Resend verification code
                      const result = await apiClient.auth.loginSendCode(email, password);
                      
                      if (result.success) {
                        setCountdown(300);
                        setCountdownActive(true);
                      } else {
                        setVerificationError(result.message || "Failed to resend code");
                      }
                    } catch (error) {
                      console.error("Resend error:", error);
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
                {countdownActive ? `Resend code in ${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')}` : "Resend code"}
              </button>
              
              <button
                onClick={() => {
                  // Go back to login form
                  setShowVerificationStep(false);
                }}
                className="py-2.5 px-4 bg-transparent text-primary hover:underline font-medium text-sm w-full text-center"
              >
                Back to login
              </button>
            </div>
          </div>
        )}
        
        {/* Close button */}
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
            <button 
              onClick={async () => {
                // Validate inputs
                if (!email || !password) {
                  setErrorMessage("Please enter both email and password");
                  return;
                }
                
                if (!isValidEmail(email)) {
                  setErrorMessage("Please enter a valid email address");
                  return;
                }
                
                setIsSubmitting(true);
                setErrorMessage("");
                
                try {
                  // Import here to avoid circular dependency
                  const { apiClient } = await import('@/lib/app/api-client');
                  
                  // Step 1: Send credentials and get verification code
                  const result = await apiClient.auth.loginSendCode(email, password);
                  
                  if (result.success) {
                    // Show verification step
                    setShowVerificationStep(true);
                    setCountdownActive(true);
                    setCountdown(300); // 5 minutes
                  } else {
                    setErrorMessage(result.message || "Invalid email or password");
                  }
                } catch (error) {
                  console.error("Login error:", error);
                  setErrorMessage("An error occurred. Please try again.");
                } finally {
                  setIsSubmitting(false);
                }
              }}
              disabled={isSubmitting}
              className={cn(
                "w-full mx-auto block py-2.5 bg-black text-white rounded-full font-medium hover:bg-black/90 transition-colors text-sm",
                isSubmitting && "opacity-70 cursor-not-allowed"
              )}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="font-bold">Logging in...</span>
                </div>
              ) : (
                <span className="font-bold">Log in</span>
              )}
            </button>

            {/* Error message */}
            {errorMessage && (
              <p className="text-red-500 text-xs mt-2 text-center animate-in fade-in">
                {errorMessage}
              </p>
            )}

            {/* OR divider */}
            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-gray-300"></div>
              <div className="px-4 text-xs text-gray-500">OR</div>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Continue with Google */}
            <button
              onClick={() => {
                window.location.href = '/api/auth/google/start?state=login';
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-100 text-gray-800 rounded-full border border-gray-300 hover:bg-gray-200 transition-colors text-sm"
            >
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