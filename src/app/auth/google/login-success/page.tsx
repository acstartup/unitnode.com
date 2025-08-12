'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GoogleLoginSuccess() {
  const router = useRouter();

  useEffect(() => {
    try {
      const currentUrl = new URL(window.location.href);
      const user = {
        id: currentUrl.searchParams.get('id') || '',
        email: currentUrl.searchParams.get('email') || '',
        name: currentUrl.searchParams.get('name') || undefined,
        companyName: currentUrl.searchParams.get('companyName') || undefined,
        role: currentUrl.searchParams.get('role') || undefined,
      };
      localStorage.setItem('unitnode_user', JSON.stringify(user));
    } catch {}
    router.replace('/app/dashboard');
  }, [router]);

  return null;
}


