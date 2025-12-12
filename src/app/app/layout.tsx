import React from 'react';
import type { Metadata } from 'next';
import '@/app/globals.css';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import { PropertyProvider } from '@/contexts/PropertyContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { UserProvider } from '@/contexts/UserContext';

export const metadata: Metadata = {
  title: 'UnitNode',
  description: 'Automate your property management.',
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <PropertyProvider>
        <ToastProvider>
          <div className="flex h-screen bg-white">
            <Sidebar />

            <div className="flex-1 flex flex-col py-4 overflow-hidden">
              <Header />
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
        </ToastProvider>
      </PropertyProvider>
    </UserProvider>
  );
}