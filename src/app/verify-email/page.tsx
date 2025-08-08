'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [verificationState, setVerificationState] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!token) {
      setVerificationState('error');
      setErrorMessage('No verification token provided');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setVerificationState('success');
          
          // Start countdown for redirect
          let seconds = 5;
          const timer = setInterval(() => {
            seconds -= 1;
            setCountdown(seconds);
            
            if (seconds <= 0) {
              clearInterval(timer);
              router.push('/');
            }
          }, 1000);
          
          return () => clearInterval(timer);
        } else {
          setVerificationState('error');
          setErrorMessage(data.message || 'Failed to verify email');
        }
      } catch (error) {
        console.error('Error verifying email:', error);
        setVerificationState('error');
        setErrorMessage('An error occurred while verifying your email');
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <div className="flex justify-center mb-8">
          <Image 
            src="/unitnode-logo.png" 
            alt="UnitNode" 
            width={180} 
            height={45}
            priority
          />
        </div>
        
        {verificationState === 'loading' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold mb-3">Verifying Your Email</h2>
            <p className="text-gray-600 text-lg">Please wait while we verify your email address...</p>
          </div>
        )}
        
        {verificationState === 'success' && (
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-3">Email Verified Successfully!</h2>
            <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-6">
              <p className="text-gray-700 mb-2">Thank you for verifying your email address.</p>
              <p className="text-gray-700">Your account is now active and you can access all UnitNode features.</p>
            </div>
            <p className="text-gray-500 mb-6 text-lg">Redirecting to login in <span className="font-bold text-black">{countdown}</span> seconds...</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link 
                href="/"
                className="bg-black text-white py-3 px-8 rounded-full font-medium hover:bg-black/90 transition-colors inline-block text-base"
              >
                Go to Login
              </Link>
              <Link 
                href="https://unitnode.com"
                className="bg-gray-100 text-gray-800 py-3 px-8 rounded-full font-medium hover:bg-gray-200 transition-colors inline-block border border-gray-300 text-base"
              >
                Visit Website
              </Link>
            </div>
          </div>
        )}
        
        {verificationState === 'error' && (
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-3">Verification Failed</h2>
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
              <p className="text-gray-700">{errorMessage}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link 
                href="/"
                className="bg-black text-white py-3 px-8 rounded-full font-medium hover:bg-black/90 transition-colors inline-block text-base"
              >
                Go to Login
              </Link>
              <button
                onClick={() => {
                  // Attempt to verify again
                  window.location.reload();
                }}
                className="bg-gray-100 text-gray-800 py-3 px-8 rounded-full font-medium hover:bg-gray-200 transition-colors inline-block border border-gray-300 text-base"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} UnitNode. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}