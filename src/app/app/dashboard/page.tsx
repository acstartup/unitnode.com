'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  
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

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem('unitnode_user');
    // Redirect to login
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Image 
              src="/unitnode-full.svg" 
              alt="UnitNode" 
              width={150} 
              height={40}
            />
          </div>
          <div className="flex items-center">
            <span className="mr-4 text-sm text-gray-700">
              Welcome, {user.name || user.email}
            </span>
            <button 
              onClick={handleLogout}
              className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-black/90"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          <p className="mb-4">You have successfully logged in with two-factor authentication!</p>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold mb-2">Your Account</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium">{user.role || 'User'}</p>
              </div>
              {user.companyName && (
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="font-medium">{user.companyName}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}