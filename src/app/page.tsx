"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [featuredArticles, setFeaturedArticles] = useState<any[]>([]);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          // Top 3 as featured
          setFeaturedArticles(data.slice(0, 3));
          // Next 3 as recent logs
          setRecentLogs(data.slice(3, 6));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="pt-20 pb-32 max-w-6xl mx-auto px-8">
      {/* Hero Section */}
      <section className="relative w-full flex flex-col items-center justify-center py-20 border-b border-outline-variant/30 mb-16">
        <div className="relative z-10 w-full flex flex-col items-center text-center gap-8">
          <h1 className="font-logo text-5xl md:text-7xl lg:text-[80px] text-on-surface uppercase leading-none tracking-tight">
            NO ES RUIDO.<br />
            ES HISTORIA,<br />
            CIENCIA Y<br />
            HERMANDAD.
          </h1>
          <div className="flex flex-col items-center gap-2 mt-8 text-on-surface-variant">
            <span className="font-mono-technical text-xs tracking-[0.3em] uppercase">DESCENDER</span>
            <span className="material-symbols-outlined text-primary animate-bounce">expand_more</span>
          </div>
        </div>
      </section>

      {/* Featured Expedientes */}
      <section className="mb-20">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="font-logo text-3xl text-primary-container uppercase tracking-widest">EXPEDIENTES DESTACADOS</h2>
          <div className="flex-1 h-[1px] bg-outline-variant/30 relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-1">
              <div className="w-4 h-1.5 bg-primary"></div>
              <div className="w-1.5 h-1.5 bg-outline-variant"></div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <span className="font-mono-technical text-primary animate-pulse">CARGANDO ARCHIVOS...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredArticles.map((article: any) => (
              <div key={article.id} className="group cursor-pointer flex flex-col gap-4 border border-outline-variant/20 bg-surface-container-low p-4 relative overflow-hidden hover:border-primary/50 transition-colors">
                <div className="h-48 w-full relative overflow-hidden bg-background">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100" style={{ backgroundImage: `url('${article.imageUrl}')` }}></div>
                  <div className="absolute top-2 left-2 bg-primary px-2 py-0.5 text-on-primary font-mono-technical text-[10px] uppercase tracking-widest">
                    {article.category || 'ARCHIVO'}
                  </div>
                </div>
                <div>
                  <h3 className="font-headline-md text-xl text-on-surface leading-tight mb-2 group-hover:text-primary transition-colors uppercase">{article.title}</h3>
                  <p className="font-body-md text-sm text-on-surface-variant line-clamp-2 mb-4">{article.desc}</p>
                  <div className="flex justify-between items-center font-mono-technical text-[10px] uppercase tracking-widest text-on-surface-variant border-t border-outline-variant/20 pt-3">
                    <div className="flex flex-col">
                      <span>RANK:</span>
                      <span className="text-primary-container">GOLD</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span>12 MIN</span>
                      <span>READ</span>
                    </div>
                  </div>
                </div>
                {/* Bottom line */}
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary group-hover:w-full transition-all duration-500"></div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent Logs */}
      <section className="mb-20">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-[1px] bg-primary"></div>
          <h2 className="font-logo text-3xl text-on-surface uppercase tracking-widest">LOGS RECIENTES</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <span className="font-mono-technical text-primary animate-pulse">CARGANDO LOGS...</span>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {recentLogs.map((log: any, i: number) => {
              const ranks = ['COMMON', 'ELITE', 'RARE'];
              const rank = ranks[i % ranks.length];
              return (
                <div key={log.id} className="flex items-center justify-between p-6 bg-surface-container-low border border-outline-variant/20 hover:border-primary/30 transition-colors group">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono-technical text-[10px] text-on-surface-variant uppercase tracking-widest">LOG #2024.08.{12 - i}</span>
                    <h3 className="font-headline-md text-lg text-on-surface uppercase group-hover:text-primary transition-colors">{log.title}</h3>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="flex flex-col text-right font-mono-technical text-[10px] uppercase tracking-widest">
                      <span className="text-on-surface-variant">TIME</span>
                      <span className="text-on-surface">{log.readTime || '03:45'}</span>
                    </div>
                    <div className="flex flex-col text-right font-mono-technical text-[10px] uppercase tracking-widest">
                      <span className="text-on-surface-variant">RANK</span>
                      <span className={`${rank === 'ELITE' ? 'text-primary' : 'text-primary-container'}`}>{rank}</span>
                    </div>
                    <button className="w-10 h-10 bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors border border-outline-variant/30">
                      <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-center mt-8">
          <button className="font-mono-technical text-[10px] uppercase tracking-widest text-on-surface-variant border border-outline-variant/50 px-6 py-3 hover:bg-surface-container-low hover:text-on-surface transition-colors">
            CARGAR ARCHIVOS ANTIGUOS
          </button>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 border-t border-b border-outline-variant/20 flex flex-col items-center text-center mt-20 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[1px] bg-primary"></div>
        <h2 className="font-logo text-5xl text-on-surface uppercase mb-6">ÚNETE A LA<br/>HERMANDAD</h2>
        <p className="font-body-md text-sm text-on-surface-variant max-w-md mb-8">
          Recibe manifiestos técnicos, diagramas de circuitos y protocolos de combate directamente en tu terminal. Sin spam, solo acero.
        </p>
        
        <form className="flex flex-col sm:flex-row w-full max-w-lg gap-4" onSubmit={e => e.preventDefault()}>
          <div className="relative flex-1">
            <span className="absolute -top-2 left-4 bg-background px-1 font-mono-technical text-[8px] text-on-surface-variant tracking-widest uppercase">
              IDENTIFICADOR EMAIL
            </span>
            <input 
              type="email" 
              placeholder="user@system.com" 
              className="w-full bg-surface-container-low border border-outline-variant/50 focus:border-primary px-4 py-3 font-mono-technical text-sm text-on-surface outline-none transition-colors"
            />
          </div>
          <button type="submit" className="bg-primary hover:bg-[#800000] text-on-primary font-mono-technical text-xs uppercase tracking-widest px-8 py-3 transition-colors border border-[#ff0000]/30 shadow-[0_0_15px_rgba(138,3,3,0.4)]">
            ENLISTARSE
          </button>
        </form>
        
        <div className="flex items-center gap-2 mt-8 text-on-surface-variant/50 font-mono-technical text-[9px] uppercase tracking-widest">
          <span className="material-symbols-outlined text-[12px]">security</span>
          TRANSMISIÓN ENCRIPTADA BAJO PROTOCOLO ALPHA-9
        </div>
      </section>
    </main>
  );
}
