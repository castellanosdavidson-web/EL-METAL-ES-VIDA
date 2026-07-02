"use client";
import React from 'react';
import Link from 'next/link';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NavigationDrawer({ isOpen, onClose }: NavigationDrawerProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <aside 
        className={`fixed top-0 left-0 h-full w-72 bg-surface-container-lowest border-r border-outline-variant/20 z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-margin-mobile border-b border-outline-variant/20">
          <span className="font-headline-md-mobile text-headline-md-mobile font-bold text-on-surface uppercase">MENÚ</span>
          <button 
            onClick={onClose}
            className="text-on-surface-variant hover:text-primary transition-colors focus:outline-none"
          >
            <span className="material-symbols-outlined text-[28px]">close</span>
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-stack-tight flex flex-col">
          <Link 
            href="/" 
            onClick={onClose}
            className="px-margin-mobile py-4 font-headline-md text-headline-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors border-l-4 border-transparent hover:border-primary"
          >
            INICIO
          </Link>
          <Link 
            href="/enciclopedia" 
            onClick={onClose}
            className="px-margin-mobile py-4 font-headline-md text-headline-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors border-l-4 border-transparent hover:border-primary"
          >
            ARCHIVO TÉCNICO
          </Link>
          <Link 
            href="/club" 
            onClick={onClose}
            className="px-margin-mobile py-4 font-headline-md text-headline-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors border-l-4 border-transparent hover:border-primary"
          >
            CLUB PRIVADO
          </Link>
          <Link 
            href="/tienda" 
            onClick={onClose}
            className="px-margin-mobile py-4 font-headline-md text-headline-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors border-l-4 border-transparent hover:border-primary"
          >
            ARSENAL (TIENDA)
          </Link>
        </nav>
        
        <div className="p-margin-mobile border-t border-outline-variant/20 bg-surface-container">
          <p className="font-mono-technical text-mono-technical text-primary">SISTEMA INICIADO</p>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-2">V. 1.0.0 // PROTOCOLO ACTIVO</p>
        </div>
      </aside>
    </>
  );
}
