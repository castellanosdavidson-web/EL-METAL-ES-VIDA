"use client";
import React from 'react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';

export default function FloatingLegadoButton() {
  return (
    <Link 
      href="/legado" 
      className="fixed top-1/2 right-0 -translate-y-1/2 z-[100] group flex items-center bg-surface-container-highest border-l-2 border-y-2 border-outline-variant hover:border-[#c4704b] p-2 shadow-[-5px_5px_20px_rgba(0,0,0,0.9)] transition-all duration-300 hover:-translate-x-2 rounded-l-xl"
    >
      <div className="w-10 h-10 overflow-hidden border-2 border-[#c4704b]/50 relative shrink-0 shadow-inner rounded-full mr-2">
        <Image 
          src="/colombia-flag.png" 
          alt="Colombia Flag" 
          fill 
          unoptimized={true}
          className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100" 
        />
      </div>
      <div className="flex flex-col pr-2">
        <span className="font-label-technical text-[8px] uppercase tracking-[0.2em] text-[#c4704b] leading-tight opacity-80">Expediente</span>
        <span className="font-headline-sm text-xs uppercase text-on-surface font-black group-hover:text-[#c4704b] transition-colors leading-tight tracking-widest mt-0.5">Legado</span>
      </div>
    </Link>
  );
}
