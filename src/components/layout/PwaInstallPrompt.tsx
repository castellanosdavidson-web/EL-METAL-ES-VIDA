"use client";
import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';

const TRANSLATIONS: Record<string, { prompt: string; install: string; iosPrompt: string; close: string }> = {
  es: {
    prompt: "Instala la App oficial de la legión",
    install: "Instalar",
    iosPrompt: "Toca ⎋ y luego 'Agregar a inicio' ⊞",
    close: "Ocultar"
  },
  en: {
    prompt: "Install the official Legion App",
    install: "Install",
    iosPrompt: "Tap ⎋ and then 'Add to Home' ⊞",
    close: "Dismiss"
  },
  pt: {
    prompt: "Instale o App oficial da legião",
    install: "Instalar",
    iosPrompt: "Toque em ⎋ e 'Adicionar à tela' ⊞",
    close: "Fechar"
  }
};

export default function PwaInstallPrompt() {
  const locale = useLocale();
  const currentTrans = TRANSLATIONS[locale] || TRANSLATIONS.es;

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showAndroidPrompt, setShowAndroidPrompt] = useState(false);
  const [showIosPrompt, setShowIosPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((reg) => console.log('SW Registered successfully:', reg.scope))
          .catch((err) => console.error('SW Registration failed:', err));
      });
    }

    // 2. Check if already installed / standalone
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (navigator as any).standalone === true;
    
    if (isStandalone) return; // Already running as PWA

    // Check if dismissed recently
    const isDismissed = localStorage.getItem('pwa_dismissed');
    if (isDismissed) return;

    // 3. Android / Chrome Install Prompt listener
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowAndroidPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 4. iOS Detection
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(iosDevice);

    // If iOS and not standalone, we can offer the custom iOS instructions
    if (iosDevice && !isStandalone) {
      const timer = setTimeout(() => {
        setShowIosPrompt(true);
      }, 5000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    setDeferredPrompt(null);
    setShowAndroidPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa_dismissed', 'true');
    setShowAndroidPrompt(false);
    setShowIosPrompt(false);
  };

  // Expose installation trigger globally for the sidebar/menu button
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).triggerPwaInstall = handleInstallClick;
      (window as any).showPwaIosInstructions = () => setShowIosPrompt(true);
      (window as any).isPwaInstallable = deferredPrompt !== null;
      (window as any).isPwaIos = isIos;
    }
  }, [deferredPrompt, isIos]);

  if (!showAndroidPrompt && !showIosPrompt) return null;

  return (
    <div className="fixed bottom-[92px] left-4 right-4 z-50 max-w-sm mx-auto bg-background/95 border border-outline-variant/80 border-l-4 border-l-primary p-3 rounded shadow-[0_12px_45px_rgba(0,0,0,0.9)] backdrop-blur-md animate-[slide-up_0.4s_ease-out] flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <span className="material-symbols-outlined text-[18px] text-primary shrink-0 animate-pulse">install_mobile</span>
        <span className="font-label-technical text-[9.5px] uppercase tracking-wider font-extrabold text-on-surface-variant truncate">
          {showIosPrompt ? currentTrans.iosPrompt : currentTrans.prompt}
        </span>
      </div>
      
      <div className="flex items-center gap-2.5 shrink-0">
        {showAndroidPrompt && (
          <button 
            onClick={handleInstallClick}
            className="bg-primary hover:bg-primary/95 text-black font-mono-technical text-[9px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded active:scale-95 transition-all shadow-[0_0_10px_rgba(255,111,0,0.5)] border border-primary/20"
          >
            {currentTrans.install}
          </button>
        )}
        
        <button 
          onClick={handleDismiss} 
          className="text-on-surface-variant/50 hover:text-primary transition-colors flex items-center justify-center p-1"
          title={currentTrans.close}
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>
      
      <style jsx global>{`
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
