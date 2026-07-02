"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-[280px] relative">
        <Header />
        <main className="w-full">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
