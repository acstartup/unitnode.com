import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import Sidebar from '@/components/sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'UnitNode App',
  description: 'Property management software by UnitNode',
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen bg-white">
      {/* Updated Layout to have sidebar on every page, step #1 to redirecting the log-in page to the dashboard page*/}
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
       {children}
      </main>
    </div>
  );
}