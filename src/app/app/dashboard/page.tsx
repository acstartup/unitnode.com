'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  companyName?: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  
  // In a real app, you would check for authentication
  // and redirect to login if not authenticated
  useEffect(() => {
    // For demo purposes, we'll just check if we have user data in localStorage
    const userData = localStorage.getItem('unitnode_user');
    
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Failed to parse user data:', error);
        // Redirect to login if user data is invalid
        router.push('/');
      }
    } else {
      // Redirect to login if no user data
      router.push('/');
    }
  }, [router]);

  // Show loading state while checking authentication
  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  // Blank white page dashboard
  return (
    <div className="min-h-screen bg-white">
    </div>
  );
}