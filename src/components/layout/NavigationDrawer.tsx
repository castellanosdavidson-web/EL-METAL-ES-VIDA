"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NavigationDrawer({ isOpen, onClose }: NavigationDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out cursor-pointer ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose}
      />
      
      {/* Drawer Content */}
      <nav className={`absolute right-0 top-0 h-full w-full md:w-[400px] bg-surface-container-lowest border-l-2 border-outline-variant transform transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] flex flex-col p-8 pointer-events-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="flex justify-between items-start mb-12 border-b-2 border-surface-container-highest pb-6">
          <div>
            <h2 className="text-headline-lg font-headline-lg text-primary uppercase">ARCHIVO</h2>
            <p className="font-label-technical text-label-technical text-on-surface-variant mt-2">LEGIÓN METALERA</p>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
        </div>

        <ul className="flex-grow flex flex-col gap-6">
          <li>
            <Link onClick={onClose} href="/enciclopedia" className="flex items-center gap-4 text-headline-lg font-headline-lg uppercase text-primary border-l-4 border-primary pl-4 opacity-80 hover:opacity-100 hover:translate-x-2 transition-all duration-300 glitch-hover">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>library_books</span>
              <span>Enciclopedia</span>
            </Link>
          </li>
          <li>
            <Link onClick={onClose} href="/taller" className="flex items-center gap-4 text-headline-lg font-headline-lg uppercase text-on-surface pl-4 hover:text-primary hover:bg-surface-container-highest/50 py-2 hover:translate-x-2 transition-all duration-300 glitch-hover">
              <span className="material-symbols-outlined">build</span>
              <span>Taller</span>
            </Link>
          </li>
          <li>
            <Link onClick={onClose} href="/hermandad" className="flex items-center gap-4 text-headline-lg font-headline-lg uppercase text-on-surface pl-4 hover:text-primary hover:bg-surface-container-highest/50 py-2 hover:translate-x-2 transition-all duration-300 glitch-hover">
              <span className="material-symbols-outlined text-[32px] text-primary">groups</span>
              <span>La Legión</span>
            </Link>
          </li>
        </ul>

        <div className="mt-auto border-t-2 border-surface-container-highest pt-6">
          <Link href="/admin" target="_blank" rel="noopener noreferrer" onClick={onClose} className="w-full bg-primary-container text-on-primary hover:bg-primary-container/80 transition-colors py-4 px-6 border border-primary-container font-label-technical text-label-technical uppercase flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-sm">lock</span>
            ACCESO RESTRINGIDO
          </Link>
          
          <div className="flex gap-4 mt-6">
            <button className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label-technical text-label-technical">
              <span className="material-symbols-outlined text-sm">settings</span> Ajustes
            </button>
            <button className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label-technical text-label-technical">
              <span className="material-symbols-outlined text-sm">logout</span> Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
