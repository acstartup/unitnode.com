'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GoogleLoginSuccess() {
  const router = useRouter();

  useEffect(() => {
    router.replace('app/properties');
  }, [router]);

  return null;
}


