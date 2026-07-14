"use client";
import React, { useState, useEffect } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';

interface HeaderProps {
  onOpenMenu?: () => void;
}

export default function Header({ onOpenMenu }: HeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

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

  const switchLanguage = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

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
          <div className="flex flex-col border-l border-outline-variant/30 pl-3 gap-0.5">
            <span className="font-label-technical text-[9px] uppercase tracking-[0.2em] text-primary font-bold hidden sm:block">
              {t('siteTitle') || 'El Metal Es Vida'}
            </span>
            <div className="flex flex-row items-center gap-3">
              <a 
                href="https://www.facebook.com/share/17soCvuQJe/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-label-technical text-[10px] uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1.5"
                title="Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="hidden sm:inline-block">Facebook</span>
              </a>
              <span className="text-outline-variant/30 hidden sm:inline-block">|</span>
              <a 
                href="mailto:elmetalesvidalml@gmail.com" 
                className="font-label-technical text-[10px] uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1.5"
                title={t('contact') || 'Contacto'}
              >
                <span className="material-symbols-outlined text-[14px]">mail</span>
                <span className="hidden sm:inline-block">{t('contact') || 'Contacto'}</span>
              </a>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
            <div className="flex items-center gap-1 sm:gap-2 border border-outline-variant/30 p-1 sm:p-2 bg-surface-container-low rounded-sm">
              <div className="flex items-center gap-1 sm:gap-2 text-on-surface-variant pr-1 sm:pr-2 border-r border-outline-variant/50 mr-0.5 sm:mr-1" title="Translate / Idioma">
                <span className="material-symbols-outlined text-[16px] sm:text-[18px]">translate</span>
                <span className="font-label-technical text-[10px] uppercase hidden lg:inline-block tracking-widest">{locale === 'en' ? 'Language' : 'Idioma'}</span>
              </div>
              <button 
                onClick={() => switchLanguage('es')}
                className={`relative w-7 h-[20px] sm:w-9 sm:h-[26px] transition-all duration-300 hover:scale-110 ${locale !== 'es' ? 'opacity-40 grayscale hover:grayscale-0 hover:opacity-100' : 'ring-2 ring-primary ring-offset-2 ring-offset-surface-container-low'}`}
                title="Español"
              >
                <Image src="/images/flags/es.png" alt="ES" fill sizes="(max-width: 640px) 28px, 36px" className="object-cover rounded-[2px]" />
              </button>
              <button 
                onClick={() => switchLanguage('en')}
                className={`relative w-7 h-[20px] sm:w-9 sm:h-[26px] transition-all duration-300 hover:scale-110 ${locale !== 'en' ? 'opacity-40 grayscale hover:grayscale-0 hover:opacity-100' : 'ring-2 ring-primary ring-offset-2 ring-offset-surface-container-low'}`}
                title="English"
              >
                <Image src="/images/flags/en.png" alt="EN" fill sizes="(max-width: 640px) 28px, 36px" className="object-cover rounded-[2px]" />
              </button>
              <button 
                onClick={() => switchLanguage('pt')}
                className={`relative w-7 h-[20px] sm:w-9 sm:h-[26px] transition-all duration-300 hover:scale-110 ${locale !== 'pt' ? 'opacity-40 grayscale hover:grayscale-0 hover:opacity-100' : 'ring-2 ring-primary ring-offset-2 ring-offset-surface-container-low'}`}
                title="Português"
              >
                <Image src="/images/flags/pt.png" alt="PT" fill sizes="(max-width: 640px) 28px, 36px" className="object-cover rounded-[2px]" />
              </button>
            </div>
          <a href="/admin" target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-primary transition-colors duration-200 hidden md:block">
            <span className="material-symbols-outlined text-3xl">account_circle</span>
          </a>
          <button onClick={onOpenMenu} className="text-on-surface-variant hover:text-primary transition-colors duration-200 flex items-center gap-2 group">
            <span className="font-label-technical text-label-technical uppercase hidden md:inline-block group-hover:text-primary">{t('menu') || 'Menú'}</span>
            <span className="material-symbols-outlined text-3xl">menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}
