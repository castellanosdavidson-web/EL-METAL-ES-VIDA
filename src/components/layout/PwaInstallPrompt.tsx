"use client";
import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';

const TRANSLATIONS: Record<string, { title: string; prompt: string; install: string; iosPrompt: string; close: string }> = {
  es: {
    title: "⚡ EL METAL ES VIDA APP",
    prompt: "Instala la aplicación para acceso rápido y directo en tu celular.",
    install: "Instalar",
    iosPrompt: "Toca Compartir ⎋ en Safari y luego 'Agregar a la pantalla de inicio' ⊞.",
    close: "Ocultar"
  },
  en: {
    title: "⚡ EL METAL ES VIDA APP",
    prompt: "Install the app for quick and direct access on your phone.",
    install: "Install",
    iosPrompt: "Tap Share ⎋ in Safari and select 'Add to Home Screen' ⊞.",
    close: "Dismiss"
  },
  pt: {
    title: "⚡ EL METAL ES VIDA APP",
    prompt: "Instale o aplicativo para acesso rápido e direto no seu celular.",
    install: "Instalar",
    iosPrompt: "Toque em Compartilhar ⎋ no Safari e selecione 'Adicionar à tela de início' ⊞.",
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
      // Delay iOS banner presentation slightly to not interrupt initial load
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
    <div className="fixed bottom-24 left-4 z-50 max-w-sm w-[calc(100vw-32px)] bg-surface-container-lowest/98 border border-outline-variant/80 p-4 rounded shadow-[0_12px_40px_rgba(0,0,0,0.85)] backdrop-blur-md animate-[slide-up_0.4s_ease-out]">
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="font-label-technical text-[10px] text-primary tracking-widest uppercase font-extrabold">
            {currentTrans.title}
          </span>
          <button 
            onClick={handleDismiss} 
            className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-1"
            title={currentTrans.close}
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
        
        <p className="font-body-md text-xs text-on-surface-variant/90 leading-relaxed">
          {showIosPrompt ? currentTrans.iosPrompt : currentTrans.prompt}
        </p>

        {showAndroidPrompt && (
          <button 
            onClick={handleInstallClick}
            className="w-full mt-1.5 py-2.5 bg-primary hover:bg-primary/90 text-black font-label-sm text-[11px] uppercase tracking-widest font-extrabold rounded active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">install_mobile</span>
            {currentTrans.install}
          </button>
        )}
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
