"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import NavigationDrawer from './NavigationDrawer';

export default function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <header className="bg-surface dark:bg-surface fixed top-0 z-50 border-b border-outline-variant/20 flex justify-between items-center px-margin-mobile h-16 w-full">
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="text-on-surface-variant dark:text-on-surface-variant hover:text-primary transition-colors duration-200 focus:opacity-80 focus:scale-95"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>menu</span>
        </button>
        <Link href="/" className="flex items-center gap-4 group">
          <Image src="/LOGO 2.png" alt="El Metal Es Vida Logo" width={56} height={56} className="rounded-full border-2 border-outline-variant/30 group-hover:border-primary transition-colors" />
          <span className="font-logo text-3xl md:text-4xl uppercase tracking-widest text-on-surface dark:text-on-surface font-normal hidden sm:inline-block">
            EL METAL ES VIDA
          </span>
        </Link>
        <button className="text-on-surface-variant dark:text-on-surface-variant hover:text-primary transition-colors duration-200 focus:opacity-80 focus:scale-95 font-label-sm text-label-sm uppercase">
          ÚNETE
        </button>
      </header>

      <NavigationDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
