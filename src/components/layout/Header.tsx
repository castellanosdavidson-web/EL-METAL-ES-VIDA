import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-surface dark:bg-surface fixed top-0 z-50 border-b border-outline-variant/20 flex justify-between items-center px-margin-mobile h-16 w-full">
      <button className="text-on-surface-variant dark:text-on-surface-variant hover:text-primary transition-colors duration-200 focus:opacity-80 focus:scale-95">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>menu</span>
      </button>
      <Link href="/" className="font-headline-md-mobile text-headline-md-mobile uppercase tracking-widest text-on-surface dark:text-on-surface font-bold">
        EL METAL ES VIDA
      </Link>
      <button className="text-on-surface-variant dark:text-on-surface-variant hover:text-primary transition-colors duration-200 focus:opacity-80 focus:scale-95 font-label-sm text-label-sm uppercase">
        ÚNETE
      </button>
    </header>
  );
}
