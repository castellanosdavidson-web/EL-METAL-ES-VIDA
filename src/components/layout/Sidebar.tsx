"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/', icon: 'home' },
    { name: 'Archive', href: '/archive', icon: 'auto_stories' },
    { name: 'Forge', href: '/forge', icon: 'construction' },
    { name: 'Vault', href: '/vault', icon: 'shopping_cart' },
    { name: 'Order', href: '/order', icon: 'group' },
  ];

  return (
    <aside className="w-[280px] h-screen fixed left-0 top-0 bg-surface border-r border-outline-variant/30 flex flex-col z-50">
      {/* Logo Area */}
      <div className="p-6 border-b border-outline-variant/30 flex flex-col items-start gap-4">
        <Link href="/" className="group flex flex-col">
          <span className="font-logo text-4xl uppercase tracking-widest text-primary-container group-hover:text-primary transition-colors leading-none">
            EL METAL
          </span>
          <span className="font-logo text-4xl uppercase tracking-widest text-on-surface group-hover:text-primary transition-colors leading-none">
            ES VIDA
          </span>
        </Link>
      </div>

      {/* User Info & Action */}
      <div className="p-6 border-b border-outline-variant/30 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-surface-container flex justify-center items-center rounded border border-outline-variant">
            <span className="material-symbols-outlined text-primary text-xl">shield</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-sm text-on-surface uppercase tracking-widest font-bold">ARCHIVIST</span>
            <span className="font-mono-technical text-[10px] text-on-surface-variant uppercase">RANK: ELITE</span>
          </div>
        </div>
        <button className="w-full bg-primary-container text-[#F5F5F5] font-mono-technical text-xs uppercase py-3 border border-primary hover:bg-primary transition-colors flex justify-center shadow-[0_0_10px_rgba(138,3,3,0.3)]">
          CONTRIBUTE
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col flex-grow py-4">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-4 px-6 py-4 font-mono-technical text-xs uppercase tracking-widest transition-colors ${
                isActive 
                  ? 'bg-primary-container text-on-primary border-l-4 border-primary' 
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low border-l-4 border-transparent'
              }`}
            >
              <span className={`material-symbols-outlined text-lg ${isActive ? 'text-on-primary' : ''}`}>
                {link.icon}
              </span>
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
