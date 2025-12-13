"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [emailBlurred, setEmailBlurred] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = async () => {
    // Validate email
    if (!email) {
      setErrorMessage("Please enter your email address");
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // TODO: API call to send reset password email will be implemented next
      console.log("Sending password reset email to:", email);

      // Placeholder for now
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Close modal after successful submission
      onClose();
    } catch (error) {
      console.error("Forgot password error:", error);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[101] flex items-center justify-center overflow-y-auto py-10"
      onClick={handleBackdropClick}
    >
      {/* Modal container - same size as login modal */}
      <div className="relative w-[95%] max-w-[800px] h-auto min-h-[600px] md:min-h-[640px] rounded-3xl border border-white/60 shadow-xl flex flex-col items-center justify-center bg-white/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >

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
          <h1 className="text-2xl font-bold mb-2">Forgot password?</h1>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-8 font-medium text-center max-w-sm">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>

          {/* Form */}
          <div className="w-full max-w-[380px]">
            {/* Email input */}
            <div className="mb-6">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailBlurred(false)}
                onBlur={() => setEmailBlurred(true)}
                className={cn(
                  "w-full px-4 py-2.5 rounded-2xl bg-white/90 border focus:outline-none focus:ring-2 focus:ring-black/10 text-sm font-medium transition-colors",
                  emailBlurred && !isValidEmail(email) && email.length > 0
                    ? "border-red-500 border-2"
                    : "border-white/70"
                )}
              />
              {emailBlurred && !isValidEmail(email) && email.length > 0 && (
                <p className="text-red-500 text-xs mt-1 ml-1 transition-opacity animate-in fade-in font-medium">
                  Please enter a valid email address
                </p>
              )}
            </div>

            {/* Confirm button */}
            <button
              onClick={handleConfirm}
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
                  <span className="font-bold">Sending...</span>
                </div>
              ) : (
                <span className="font-bold">Confirm</span>
              )}
            </button>

            {/* Error message */}
            {errorMessage && (
              <p className="text-red-500 text-xs mt-2 text-center animate-in fade-in">
                {errorMessage}
              </p>
            )}

            {/* Back to login link */}
            <div className="flex justify-center mt-6">
              <button
                onClick={onClose}
                className="text-xs text-primary hover:underline font-medium"
              >
                Back to login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
