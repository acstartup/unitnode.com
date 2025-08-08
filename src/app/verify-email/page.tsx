'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [verificationState, setVerificationState] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(5);
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Function to resend verification email
  const resendVerificationEmail = async () => {
    if (!email) return;
    
    try {
      setResending(true);
      setResendSuccess(false);
      
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setResendSuccess(true);
      } else {
        console.error('Failed to resend verification email:', data.message);
      }
    } catch (error) {
      console.error('Error resending verification email:', error);
    } finally {
      setResending(false);
    }
  };

  // Extract email and password from token or URL params
  useEffect(() => {
    if (token) {
      try {
        // The token is a JWT - we can extract the payload without verifying
        // This is just to get the email for resending, actual verification happens on the server
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          if (payload.email) {
            setEmail(payload.email);
          }
          
          // Check if password was included in the token payload
          if (payload.password) {
            setPassword(payload.password);
          }
        }
        
        // Also check URL for password parameter (for cases where we don't want to include it in the JWT)
        const passwordParam = searchParams.get('p');
        if (passwordParam) {
          try {
            // Decode the base64 password
            const decodedPassword = atob(passwordParam);
            setPassword(decodedPassword);
          } catch (e) {
            console.error('Error decoding password parameter:', e);
          }
        }
      } catch (error) {
        console.error('Error extracting data from token:', error);
      }
    }
  }, [token, searchParams, setPassword]);

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
          
          // Store user info for login
          if (data.email) {
            // Store credentials in localStorage for login form to use
            const loginData: {
              email: string;
              timestamp: number;
              password?: string;
            } = {
              email: data.email,
              timestamp: Date.now() // Add timestamp for expiry check
            };
            
            // Add password if available
            if (password) {
              loginData.password = password;
            }
            
            localStorage.setItem('unitnode_login_prefill', JSON.stringify(loginData));
            // Set a flag to auto-open the login modal after redirect
            localStorage.setItem('unitnode_open_login_modal', 'true');
          }
          
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
          // Check if the token is expired
          if (data.message && data.message.toLowerCase().includes('expired')) {
            // Redirect to expired link page
            router.push('/link-expired');
          } else {
            setVerificationState('error');
            setErrorMessage(data.message || 'Failed to verify email');
          }
        }
      } catch (error) {
        console.error('Error verifying email:', error);
        setVerificationState('error');
        setErrorMessage('An error occurred while verifying your email');
      }
    };

    verifyEmail();
  }, [token, router, password]);

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
              onClick={() => {
                // Ensure the email is saved for login prefill when clicking this button too
                if (email) {
                  const loginData: {
                    email: string;
                    timestamp: number;
                    password?: string;
                  } = {
                    email: email,
                    timestamp: Date.now()
                  };
                  
                  // Add password if available
                  if (password) {
                    loginData.password = password;
                  }
                  
                  localStorage.setItem('unitnode_login_prefill', JSON.stringify(loginData));
                  // Set a flag to auto-open the login modal after redirect
                  localStorage.setItem('unitnode_open_login_modal', 'true');
                }
              }}
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
                onClick={resendVerificationEmail}
                disabled={resending || !email}
                className="w-full mx-auto block py-2.5 bg-gray-100 text-gray-800 rounded-full font-medium hover:bg-gray-200 transition-colors text-sm border border-gray-300"
              >
                {resending ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-b-2 border-gray-800"></div>
                    <span className="font-bold">Sending...</span>
                  </div>
                ) : (
                  <span className="font-bold">Resend Email</span>
                )}
              </button>
              
              {resendSuccess && (
                <p className="text-green-500 text-xs mt-2 text-center animate-in fade-in">
                  Verification email sent! Please check your inbox.
                </p>
              )}
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

export default function VerifyEmail() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black/33 flex flex-col items-center justify-center p-4">
        <div className="w-[95%] max-w-[500px] bg-white rounded-4xl border-2 border-grey-700 shadow-lg p-8 animate-in fade-in duration-300 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}