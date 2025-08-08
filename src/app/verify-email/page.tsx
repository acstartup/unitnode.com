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
    <div className="min-h-screen bg-black/33 flex flex-col items-center justify-center p-4">
      <div className="w-[95%] max-w-[500px] bg-white rounded-4xl border-2 border-grey-700 shadow-lg p-8 animate-in fade-in duration-300">
        <div className="flex justify-center mb-6">
          <Image 
            src="/unitnode-logo.png" 
            alt="UnitNode" 
            width={150} 
            height={40}
            priority
          />
        </div>
        
        {verificationState === 'loading' && (
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
            <h2 className="text-xl font-bold mb-2">Verifying Your Email</h2>
            <p className="text-gray-600 text-sm">This will only take a moment...</p>
          </div>
        )}
        
        {verificationState === 'success' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Email Verified!</h2>
            <p className="text-gray-600 text-sm mb-4">
              Your account is now active and ready to use.
            </p>
            <p className="text-gray-500 mb-6 text-sm">
              Redirecting in <span className="font-bold text-black">{countdown}</span>...
            </p>
            <Link 
              href="/"
              className="w-full mx-auto block py-2.5 bg-black text-white rounded-full font-medium hover:bg-black/90 transition-colors text-sm"
            >
              <span className="font-bold">Go to Login</span>
            </Link>
          </div>
        )}
        
        {verificationState === 'error' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Verification Failed</h2>
            <p className="text-red-500 text-xs mb-4">
              {errorMessage}
            </p>
            <div className="flex flex-col gap-3">
              <Link 
                href="/"
                className="w-full mx-auto block py-2.5 bg-black text-white rounded-full font-medium hover:bg-black/90 transition-colors text-sm"
              >
                <span className="font-bold">Go to Login</span>
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="w-full mx-auto block py-2.5 bg-gray-100 text-gray-800 rounded-full font-medium hover:bg-gray-200 transition-colors text-sm border border-gray-300"
              >
                <span className="font-bold">Try Again</span>
              </button>
            </div>
          </div>
        )}
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-center text-gray-500 text-xs">
            © {new Date().getFullYear()} UnitNode
          </p>
        </div>
      </div>
    </div>
  );
}