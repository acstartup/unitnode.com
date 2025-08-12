'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function GoogleLoginSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Construct a basic user payload and store in localStorage
    const user = {
      id: searchParams.get('id') || '',
      email: searchParams.get('email') || '',
      name: searchParams.get('name') || undefined,
      companyName: searchParams.get('companyName') || undefined,
      role: searchParams.get('role') || undefined,
    };
    try {
      localStorage.setItem('unitnode_user', JSON.stringify(user));
    } catch {}
    // Redirect to dashboard
    router.replace('/app/dashboard');
  }, [router, searchParams]);

  return null;
}


