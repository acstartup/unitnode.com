'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ResetPasswordModal } from '@/components/reset-password-modal';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
      setShowModal(true);
    } else {
      // No token, redirect to home
      router.push('/');
    }
  }, [searchParams, router]);

  const handleClose = () => {
    setShowModal(false);
    router.push('/');
  };

  return (
    <>
      {token && (
        <ResetPasswordModal
          isOpen={showModal}
          onClose={handleClose}
          token={token}
        />
      )}
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
