"use client";
import React, { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NavigationDrawer({ isOpen, onClose }: NavigationDrawerProps) {
  const tNav = useTranslations('Navigation');
  const tDrawer = useTranslations('NavigationDrawer');
  const locale = useLocale();

  const [canInstall, setCanInstall] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      // Check PWA Install status
      if (typeof window !== 'undefined') {
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                            (navigator as any).standalone === true;
        if (!isStandalone) {
          setCanInstall((window as any).isPwaInstallable || false);
          setIsIos((window as any).isPwaIos || false);
        }
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleInstallClick = () => {
    onClose();
    if (typeof window !== 'undefined') {
      if (canInstall && (window as any).triggerPwaInstall) {
        (window as any).triggerPwaInstall();
      } else if (isIos && (window as any).showPwaIosInstructions) {
        (window as any).showPwaIosInstructions();
      }
    }
  };

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
            <h2 className="text-headline-lg font-headline-lg text-primary uppercase">{tDrawer('sections') || 'Secciones'}</h2>
            <p className="font-label-technical text-label-technical text-on-surface-variant mt-2">{tDrawer('legion')}</p>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
        </div>

        <ul className="flex-grow flex flex-col gap-6">
          <li>
            <Link onClick={onClose} href="/archivo" className="group flex items-center text-headline-lg font-headline-lg uppercase text-primary border-l-4 border-primary pl-4 opacity-80 hover:opacity-100 hover:translate-x-2 transition-all duration-300 glitch-hover">
              <div className="relative w-8 h-8 mr-4 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
                <Image src="/nav_icons/1.png" alt="Archivo" fill unoptimized className="object-contain drop-shadow-[0_0_8px_rgba(196,112,75,0.4)]" />
              </div>
              <span>{tNav('archivo')}</span>
            </Link>
          </li>
          <li>
            <Link onClick={onClose} href="/taller" className="group flex items-center text-headline-lg font-headline-lg uppercase text-on-surface pl-4 hover:text-primary hover:bg-surface-container-highest/50 py-2 hover:translate-x-2 transition-all duration-300 glitch-hover">
              <div className="relative w-8 h-8 mr-4 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
                <Image src="/nav_icons/2.png" alt="Taller" fill unoptimized className="object-contain" />
              </div>
              <span>{tNav('taller')}</span>
            </Link>
          </li>
          <li>
            <Link onClick={onClose} href="/legado" className="group flex items-center text-headline-lg font-headline-lg uppercase text-on-surface pl-4 hover:text-[#c4704b] hover:bg-surface-container-highest/50 py-2 hover:translate-x-2 transition-all duration-300 glitch-hover">
              <div className="relative w-8 h-8 mr-4 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
                <Image src="/nav_icons/3.png" alt="Legado" fill unoptimized className="object-contain" />
              </div>
              <span>Legado</span>
            </Link>
          </li>
          <li>
            <Link onClick={onClose} href="/tienda" className="group flex items-center text-headline-lg font-headline-lg uppercase text-on-surface pl-4 hover:text-error hover:bg-surface-container-highest/50 py-2 hover:translate-x-2 transition-all duration-300 glitch-hover">
              <div className="relative w-8 h-8 mr-4 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
                <Image src="/nav_icons/4.png" alt="Tienda" fill unoptimized className="object-contain" />
              </div>
              <span className="group-hover:text-error">{tDrawer('arsenal')}</span>
            </Link>
          </li>
        </ul>

        <div className="mt-auto border-t-2 border-surface-container-highest pt-6">
          <Link href="/admin" target="_blank" rel="noopener noreferrer" onClick={onClose} className="w-full bg-primary-container text-on-primary hover:bg-primary-container/80 transition-colors py-4 px-6 border border-primary-container font-label-technical text-label-technical uppercase flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-sm">lock</span>
            {tDrawer('restrictedAccess')}
          </Link>
        </div>
      </nav>
    </div>
  );
}
