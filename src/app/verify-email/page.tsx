"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { apiClient } from "@/lib/app/api-client";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  
  const [verificationState, setVerificationState] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [countdown, setCountdown] = useState(5);
  
  useEffect(() => {
    async function verifyEmail() {
      if (!token) {
        setVerificationState("error");
        setErrorMessage("Verification token is missing. Please check your email link.");
        return;
      }
      
      try {
        const result = await apiClient.auth.verifyEmail(token);
        
        if (result.success) {
          setVerificationState("success");
          
          // Start countdown to redirect to login page
          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                router.push("/"); // Redirect to home page where login modal can be opened
              }
              return prev - 1;
            });
          }, 1000);
          
          return () => clearInterval(timer);
        } else {
          setVerificationState("error");
          setErrorMessage(result.message || "Failed to verify email. The link may be expired or invalid.");
        }
      } catch (error) {
        console.error("Email verification error:", error);
        setVerificationState("error");
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
    
    verifyEmail();
  }, [token, router]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="mb-8">
        <Image 
          src="/unitnode-full.svg"
          alt="UnitNode"
          width={180}
          height={40}
          priority
        />
      </div>
      
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
        {verificationState === "loading" && (
          <div className="flex flex-col items-center py-6">
            <div className="w-12 h-12 rounded-full border-4 border-t-primary border-gray-200 animate-spin mb-4"></div>
            <h2 className="text-xl font-bold mb-2">Verifying your email</h2>
            <p className="text-gray-600 text-center">Please wait while we verify your email address...</p>
          </div>
        )}
        
        {verificationState === "success" && (
          <div className="flex flex-col items-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Email verified successfully!</h2>
            <p className="text-gray-600 text-center mb-6">
              Your email has been verified. You can now log in to your account.
            </p>
            <div className="flex flex-col w-full gap-3">
              <button 
                onClick={() => router.push("/")}
                className="py-2.5 px-4 bg-black text-white rounded-full font-medium hover:bg-black/90 transition-colors text-sm w-full"
              >
                <span className="font-bold">Go to Login ({countdown})</span>
              </button>
            </div>
          </div>
        )}
        
        {verificationState === "error" && (
          <div className="flex flex-col items-center py-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Verification failed</h2>
            <p className="text-gray-600 text-center mb-6">
              {errorMessage || "Failed to verify your email. The link may be expired or invalid."}
            </p>
            <div className="flex flex-col w-full gap-3">
              <button 
                onClick={() => router.push("/")}
                className="py-2.5 px-4 bg-black text-white rounded-full font-medium hover:bg-black/90 transition-colors text-sm w-full"
              >
                <span className="font-bold">Back to Home</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}