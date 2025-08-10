'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // This is a placeholder for actual authentication logic
    // In the future, we'll implement real authentication checks here
    const checkAuth = async () => {
      // For now, we'll just set it to true to allow access
      // Later, this will check cookies, JWT tokens, or make API calls
      setIsAuthenticated(true);
    };

    checkAuth();
  }, []);

  // Show nothing while checking authentication
  if (isAuthenticated === null) {
    return null;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    router.push('/');
    return null;
  }

  // If authenticated, show the protected content
  return <>{children}</>;
}