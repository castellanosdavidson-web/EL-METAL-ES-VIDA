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
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center group">
            <img 
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/articles/logo.png`} 
              alt="EL METAL ES VIDA Logo" 
              className="w-20 md:w-28 h-auto object-contain" 
              onError={(e) => { e.currentTarget.src = "/LOGO 2.png"; }}
            />
          </Link>
          <div className="flex flex-col md:flex-row md:items-center gap-2 border-l border-outline-variant/30 pl-3">
            <a 
              href="https://www.facebook.com/share/17soCvuQJe/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-label-technical text-[10px] uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">link</span>
              Facebook
            </a>
            <span className="text-outline-variant/30 hidden md:inline">|</span>
            <a 
              href="mailto:elmetalesvidalml@gmail.com" 
              className="font-label-technical text-[10px] uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">mail</span>
              Contacto
            </a>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/admin" target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-primary transition-colors duration-200 hidden md:block">
            <span className="material-symbols-outlined text-3xl">account_circle</span>
          </Link>
          <button onClick={onOpenMenu} className="text-on-surface-variant hover:text-primary transition-colors duration-200 flex items-center gap-2 group">
            <span className="font-label-technical text-label-technical uppercase hidden md:inline-block group-hover:text-primary">Archivo</span>
            <span className="material-symbols-outlined text-3xl">menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}
