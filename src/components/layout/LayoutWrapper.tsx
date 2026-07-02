"use client";
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import NavigationDrawer from './NavigationDrawer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      {!isAdmin && <Header onOpenMenu={() => setIsDrawerOpen(true)} />}
      {!isAdmin && <NavigationDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />}
      {children}
      {!isAdmin && <Footer />}
    </>
  );
}
