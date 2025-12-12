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

            <div className="flex-1 flex flex-col overflow-y-auto">
              <div className="sticky top-0 z-10 bg-white py-4">
                <Header />
              </div>
              <main className="">
                {children}
              </main>
            </div>
          </div>
        </ToastProvider>
      </PropertyProvider>
    </UserProvider>
  );
}