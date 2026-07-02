"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const navLinks = [
    { name: 'Encyclopedia', href: '/enciclopedia' },
    { name: 'Workshop', href: '/workshop' },
    { name: 'Store', href: '/tienda' },
    { name: 'Community', href: '/club' },
  ];

  return (
    <header className="bg-transparent absolute top-0 right-0 left-0 z-40 flex justify-end items-center px-10 h-20 w-full">
      <nav className="flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="font-mono-technical text-[13px] text-on-surface hover:text-primary transition-colors hover:underline underline-offset-8 decoration-primary decoration-2"
          >
            {link.name}
          </Link>
        ))}
        <div className="flex items-center gap-4 ml-4">
          <button className="text-on-surface hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-xl">search</span>
          </button>
          <button className="text-on-surface hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-xl">account_circle</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
