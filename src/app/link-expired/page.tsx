'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function LinkExpired() {
  const [resending, setResending] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleResendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setErrorMessage('Please enter your email address');
      return;
    }
    
    try {
      setResending(true);
      setErrorMessage('');
      
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setEmailSubmitted(true);
      } else {
        setErrorMessage(data.message || 'Failed to resend verification email');
      }
    } catch (error) {
      console.error('Error resending verification email:', error);
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setResending(false);
    }
  };
  
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
        
        <div className="text-center">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Verification Link Expired</h2>
          <p className="text-gray-600 text-sm mb-6">
            The verification link you clicked has expired or is no longer valid.
          </p>
          
          {!emailSubmitted ? (
            <>
              <p className="text-gray-600 text-sm mb-4">
                Please enter your email address below to receive a new verification link:
              </p>
              
              <form onSubmit={handleResendEmail} className="flex flex-col gap-3">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium"
                />
                
                {errorMessage && (
                  <p className="text-red-500 text-xs text-center animate-in fade-in">
                    {errorMessage}
                  </p>
                )}
                
                <button 
                  type="submit"
                  disabled={resending}
                  className="w-full mx-auto block py-2.5 bg-black text-white rounded-full font-medium hover:bg-black/90 transition-colors text-sm"
                >
                  {resending ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-b-2 border-white"></div>
                      <span className="font-bold">Sending...</span>
                    </div>
                  ) : (
                    <span className="font-bold">Resend Verification Email</span>
                  )}
                </button>
                
                <Link 
                  href="/"
                  onClick={() => {
                    // Set a flag to auto-open the login modal after redirect
                    localStorage.setItem('unitnode_open_login_modal', 'true');
                  }}
                  className="w-full mx-auto block py-2.5 bg-gray-100 text-gray-800 rounded-full font-medium hover:bg-gray-200 transition-colors text-sm border border-gray-300 text-center"
                >
                  <span className="font-bold">Back to Login</span>
                </Link>
              </form>
            </>
          ) : (
            <>
              <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-6">
                <p className="text-gray-700 mb-2">
                  We&apos;ve sent a new verification link to <span className="font-medium">{email}</span>
                </p>
                <p className="text-gray-700">
                  Please check your inbox and click the link to complete your registration.
                </p>
              </div>
              
              <Link 
                href="/"
                onClick={() => {
                  // Set a flag to auto-open the login modal after redirect
                  localStorage.setItem('unitnode_open_login_modal', 'true');
                }}
                className="w-full mx-auto block py-2.5 bg-black text-white rounded-full font-medium hover:bg-black/90 transition-colors text-sm"
              >
                <span className="font-bold">Back to Login</span>
              </Link>
            </>
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-center text-gray-500 text-xs">
            © {new Date().getFullYear()} UnitNode
          </p>
        </div>
      </div>
    </div>
  );
}