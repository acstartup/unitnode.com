"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
}

export function ResetPasswordModal({ isOpen, onClose, token }: ResetPasswordModalProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordBlurred, setPasswordBlurred] = useState(false);
  const [confirmPasswordBlurred, setConfirmPasswordBlurred] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [requirements, setRequirements] = useState({
    hasEightChars: false,
    hasDigit: false,
    hasLowercase: false,
    hasUppercase: false
  });

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch('/api/auth/validate-reset-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          setTokenValid(false);
          setErrorMessage("This password reset link has expired or is invalid.");
        }
      } catch (error) {
        console.error('Token validation error:', error);
        setTokenValid(false);
        setErrorMessage("An error occurred while validating the reset link.");
      }
    };

    if (isOpen && token) {
      validateToken();
    }
  }, [isOpen, token]);

  // Update password requirements
  useEffect(() => {
    setRequirements({
      hasEightChars: password.length >= 8,
      hasDigit: /\d/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password)
    });
  }, [password]);

  const isPasswordValid = () => {
    return requirements.hasEightChars &&
           requirements.hasDigit &&
           requirements.hasLowercase &&
           requirements.hasUppercase;
  };

  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleResetPassword = async () => {
    // Validate password
    if (!isPasswordValid()) {
      setErrorMessage("Please meet all password requirements");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Failed to reset password. Please try again.");
        return;
      }

      // Show success overlay
      setShowSuccess(true);
    } catch (error) {
      console.error("Reset password error:", error);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onClose();
    // Redirect to home page where user can login
    router.push('/');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/33 overflow-y-auto py-10"
      onClick={handleBackdropClick}
    >
      {/* Modal container */}
      <div className={cn(
        "relative w-[95%] max-w-[800px] h-auto min-h-[600px] md:min-h-[640px] rounded-3xl border border-white/60 shadow-xl flex flex-col items-center justify-center animate-in fade-in duration-300",
        showSuccess ? "" : "bg-white/80 backdrop-blur-md"
      )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Step */}
        {showSuccess && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-md z-10 flex flex-col items-center justify-center p-8 rounded-3xl animate-in fade-in duration-300">
            <div className="relative w-full mb-5">
              <div className="flex justify-center">
                <Image
                  src="/unitnode-icon.svg"
                  alt="UnitNode Icon"
                  width={40}
                  height={40}
                />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-center">Password Reset Successful</h2>
            <p className="text-gray-600 text-center mb-8 max-w-md">
              Your password has been successfully reset. You can now log in with your new password.
            </p>

            <div className="flex flex-col w-full gap-3 max-w-xs">
              <button
                onClick={handleSuccessClose}
                className="py-2.5 px-4 bg-black text-white rounded-full font-medium hover:bg-black/90 transition-colors text-sm w-full"
              >
                <span className="font-bold">Back to Home</span>
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

        {/* Content */}
        {!showSuccess && (
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

          {/* Title */}
          <h1 className="text-2xl font-bold mb-2">Reset your password</h1>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-8 font-medium text-center max-w-sm">
            Enter a new password for your account. Make sure it meets all the requirements below.
          </p>

          {/* Form */}
          <div className="w-full max-w-[380px]">
            {/* Show error if token is invalid */}
            {!tokenValid && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm text-center font-medium">
                  {errorMessage}
                </p>
              </div>
            )}

            {tokenValid && (
              <>
                {/* Password input */}
                <div className="mb-4">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="New Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setPasswordBlurred(false)}
                      onBlur={() => setPasswordBlurred(true)}
                      className="w-full px-4 py-2.5 pr-10 rounded-2xl bg-white/90 border border-white/70 focus:outline-none focus:ring-2 focus:ring-black/10 text-sm font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Password requirements - always visible */}
                  <div className="mt-2 ml-1 space-y-1">
                    <div className={cn(
                      "text-xs flex items-center gap-1",
                      requirements.hasEightChars ? "text-green-600" : "text-gray-500"
                    )}>
                      <span>{requirements.hasEightChars ? "✓" : "○"}</span>
                      <span>At least 8 characters</span>
                    </div>
                    <div className={cn(
                      "text-xs flex items-center gap-1",
                      requirements.hasUppercase ? "text-green-600" : "text-gray-500"
                    )}>
                      <span>{requirements.hasUppercase ? "✓" : "○"}</span>
                      <span>One uppercase letter</span>
                    </div>
                    <div className={cn(
                      "text-xs flex items-center gap-1",
                      requirements.hasLowercase ? "text-green-600" : "text-gray-500"
                    )}>
                      <span>{requirements.hasLowercase ? "✓" : "○"}</span>
                      <span>One lowercase letter</span>
                    </div>
                    <div className={cn(
                      "text-xs flex items-center gap-1",
                      requirements.hasDigit ? "text-green-600" : "text-gray-500"
                    )}>
                      <span>{requirements.hasDigit ? "✓" : "○"}</span>
                      <span>One number</span>
                    </div>
                  </div>
                </div>

                {/* Confirm Password input */}
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={() => setConfirmPasswordBlurred(false)}
                      onBlur={() => setConfirmPasswordBlurred(true)}
                      className={cn(
                        "w-full px-4 py-2.5 pr-10 rounded-2xl bg-white/90 border focus:outline-none focus:ring-2 focus:ring-black/10 text-sm font-medium transition-colors",
                        confirmPasswordBlurred && confirmPassword.length > 0 && !passwordsMatch
                          ? "border-red-500 border-2"
                          : "border-white/70"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {confirmPasswordBlurred && confirmPassword.length > 0 && !passwordsMatch && (
                    <p className="text-red-500 text-xs mt-1 ml-1 transition-opacity animate-in fade-in font-medium">
                      Passwords do not match
                    </p>
                  )}
                </div>

                {/* Reset button */}
                <button
                  onClick={handleResetPassword}
                  disabled={isSubmitting || !isPasswordValid() || !passwordsMatch}
                  className={cn(
                    "w-full mx-auto block py-2.5 bg-black text-white rounded-full font-medium hover:bg-black/90 transition-colors text-sm",
                    (isSubmitting || !isPasswordValid() || !passwordsMatch) && "opacity-70 cursor-not-allowed"
                  )}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="font-bold">Resetting...</span>
                    </div>
                  ) : (
                    <span className="font-bold">Reset Password</span>
                  )}
                </button>

                {/* Error message */}
                {errorMessage && (
                  <p className="text-red-500 text-xs mt-2 text-center animate-in fade-in">
                    {errorMessage}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
