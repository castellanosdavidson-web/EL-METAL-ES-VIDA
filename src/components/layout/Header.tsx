"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface HeaderProps {
  onOpenMenu?: () => void;
}

export default function Header({ onOpenMenu }: HeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY) {
          setIsVisible(false); // Scrolling down
        } else {
          setIsVisible(true);  // Scrolling up
        }
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header className={`fixed w-full z-40 bg-background/95 backdrop-blur-sm border-b-2 border-outline-variant transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
        <Link href="/" className="flex items-center gap-4 group">
          <Image src="/LOGO 2.png" alt="EL METAL ES VIDA Logo" width={40} height={40} className="w-10 h-auto" />
          <span className="text-headline-lg-mobile md:text-headline-lg font-headline-lg uppercase tracking-tighter text-primary">EL METAL ES VIDA</span>
        </Link>
        <div className="flex items-center gap-6">
          <button className="text-on-surface-variant hover:text-primary transition-colors duration-200 hidden md:block">
            <span className="material-symbols-outlined text-3xl">account_circle</span>
          </button>
          <button onClick={onOpenMenu} className="text-on-surface-variant hover:text-primary transition-colors duration-200 flex items-center gap-2 group">
            <span className="font-label-technical text-label-technical uppercase hidden md:inline-block group-hover:text-primary">Archivo</span>
            <span className="material-symbols-outlined text-3xl">menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}
