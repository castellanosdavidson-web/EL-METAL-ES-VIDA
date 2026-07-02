import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest dark:bg-surface-container-lowest w-full py-stack-loose px-margin-mobile border-t border-outline-variant/20 grid grid-cols-1 md:grid-cols-2 gap-gutter max-w-7xl mx-auto">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Image src="/logo.jpg" alt="El Metal Es Vida Logo" width={32} height={32} className="rounded-full grayscale opacity-80" />
          <div className="font-headline-md-mobile text-headline-md-mobile font-bold text-on-surface">EL METAL ES VIDA</div>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant">© 2024 EL METAL ES VIDA. REGISTRO TÉCNICO NO. 666.</p>
      </div>
      <div className="flex flex-wrap gap-4 md:justify-end items-end">
        <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors focus:ring-1 focus:ring-primary focus:outline-none" href="#">BOLETÍN</Link>
        <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors focus:ring-1 focus:ring-primary focus:outline-none" href="#">AVISO LEGAL</Link>
        <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors focus:ring-1 focus:ring-primary focus:outline-none" href="#">TERMINOLOGÍA</Link>
        <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors focus:ring-1 focus:ring-primary focus:outline-none" href="#">CONTACTO</Link>
      </div>
    </footer>
  );
}
