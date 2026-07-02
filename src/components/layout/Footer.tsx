import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-outline-variant/30 py-8 mt-10">
      <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="font-logo text-2xl uppercase text-on-surface">EL METAL ES VIDA</h2>
          <p className="font-mono-technical text-[10px] text-on-surface-variant uppercase tracking-widest">
            © 2024 EL METAL ES VIDA - ARCHIVAL DIVISION
          </p>
        </div>
        
        <div className="flex items-center gap-8">
          <nav className="flex gap-6 font-mono-technical text-[10px] uppercase tracking-widest text-on-surface">
            <Link href="#" className="hover:text-primary transition-colors">Manifesto</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-primary transition-colors">Death Protocol</Link>
          </nav>
          
          <div className="flex gap-3">
            <button className="w-8 h-8 border border-outline-variant/50 flex items-center justify-center text-on-surface hover:text-primary hover:border-primary transition-colors">
              <span className="material-symbols-outlined text-sm">share</span>
            </button>
            <button className="w-8 h-8 border border-outline-variant/50 flex items-center justify-center text-on-surface hover:text-primary hover:border-primary transition-colors">
              <span className="material-symbols-outlined text-sm">rss_feed</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
