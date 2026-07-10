"use client";
import React from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');
  
  return (
    <footer className="bg-surface-container-low border-t-2 border-outline-variant w-full">
      <div className="w-full px-margin-mobile md:px-margin-desktop py-8 flex flex-col md:flex-row justify-between items-center max-w-container-max mx-auto gap-6">
        <div className="flex items-center gap-2">
          <span className="font-label-technical text-label-technical text-primary">EL METAL ES VIDA</span>
          <span className="font-label-technical text-label-technical text-on-surface-variant hidden md:inline">|</span>
          <span className="font-label-technical text-label-technical text-on-surface-variant">© {new Date().getFullYear()} {t('archiveVersion')}</span>
        </div>
        <nav className="flex gap-6">
          <Link href="#" className="font-label-technical text-label-technical text-on-surface-variant hover:text-primary hover:underline transition-colors opacity-70 hover:opacity-100">{t('privacy')}</Link>
          <Link href="#" className="font-label-technical text-label-technical text-on-surface-variant hover:text-primary hover:underline transition-colors opacity-70 hover:opacity-100">{t('terms')}</Link>
          <Link href="#" className="font-label-technical text-label-technical text-on-surface-variant hover:text-primary hover:underline transition-colors opacity-70 hover:opacity-100">{t('contact')}</Link>
        </nav>
      </div>
    </footer>
  );
}
