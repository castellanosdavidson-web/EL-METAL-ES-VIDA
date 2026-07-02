"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          // Tomamos solo los últimos 3 para el home
          setRecentArticles(data.slice(0, 3));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="pt-16 pb-32">
      {/* Hero Section */}
      <section className="relative h-[751px] w-full flex items-center justify-center px-margin-mobile technical-border border-x-0 border-t-0 border-b">
        {/* Background Image Placeholder */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDzzXYbLNfUwFe0rnCghdCmLKKjtva8Fq3rdZBp22AfU4qYkhh5Pdi0sxfeIBZf_AN_1mmSa1JpXkxJEmslKWjfe7BHmIOXeCBWBgikSkWH4UsTXbI_BMBu5vXZZ2qwdodehSzWzRP_pkr7--jpJg889qdXk8ewhLsJsRxeVhs0VsIysGYJeM3uJKV39zQUadu1dZ70bI_96ennxOBuSZoGhebj8-xVpSL2sV5HixBuDA355w16wHbmJZRijivOc8MmFmCkStEliA')",
            opacity: 0.3
          }}
        ></div>
        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center gap-stack-loose">
          <div className="glass-panel p-stack-loose rounded w-full border border-outline-variant/50">
            <h1 className="font-display-lg text-display-lg text-on-surface uppercase mb-stack-tight">
              No es ruido. <span className="text-primary-container block mt-2">Es historia, ciencia y hermandad.</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              El medio definitivo de cultura extrema. Archivos técnicos, análisis clínicos y documentales para la legión.
            </p>
          </div>
        </div>
        {/* Scroll Indicator */}
        <div className="absolute bottom-stack-loose left-1/2 transform -translate-x-1/2 text-on-surface-variant flex flex-col items-center gap-2">
          <span className="font-mono-technical text-mono-technical uppercase tracking-widest text-[10px]">DESCENDER</span>
          <span className="material-symbols-outlined animate-bounce">arrow_downward</span>
        </div>
      </section>

      {/* Lead Magnet Section */}
      <section className="py-margin-desktop px-margin-mobile bg-surface-container-low border-b border-outline-variant/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-xl mx-auto flex flex-col gap-stack-loose relative z-10">
          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined text-primary-container text-4xl">book_5</span>
            <div>
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-2">Desbloquea el Archivo</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Descarga la guía: 'La Anatomía del Riff'. Un análisis forense de la composición extrema.</p>
            </div>
          </div>
          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            <div className="relative">
              <input className="w-full bg-surface-container border-b-2 border-outline-variant focus:border-primary-container focus:ring-0 text-on-surface font-mono-technical text-mono-technical py-4 px-4 transition-colors placeholder-on-surface-variant/50" placeholder="TU CORREO ELECTRÓNICO" required type="email" />
            </div>
            <button className="w-full bg-primary-container text-[#F5F5F5] font-mono-technical text-mono-technical uppercase py-4 px-6 hover:bg-[#A00000] transition-colors cta-double-border text-center flex items-center justify-center gap-2 group" type="submit">
              DESCARGAR AHORA
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">download</span>
            </button>
            <p className="font-label-sm text-label-sm text-on-surface-variant text-center opacity-70">Acceso inmediato. Sin spam comercial.</p>
          </form>
        </div>
      </section>

      {/* Latest Documentals */}
      <section className="py-margin-desktop px-margin-mobile bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-stack-loose border-b border-outline-variant/20 pb-4">
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface uppercase">Archivos Recientes</h2>
            <Link className="font-label-sm text-label-sm text-primary hover:text-on-surface transition-colors flex items-center gap-1" href="/enciclopedia">
              VER TODOS <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <span className="font-mono-technical text-primary animate-pulse uppercase">Cargando base de datos...</span>
            </div>
          ) : recentArticles.length === 0 ? (
            <div className="flex justify-center py-20 text-on-surface-variant font-mono-technical uppercase">
              No hay archivos subidos todavía. Usa /admin.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-masonry-gap">
              {recentArticles.map((article: any, index: number) => (
                <article key={article.id} className={`technical-border rounded-none flex flex-col group cursor-pointer hover:border-primary-container transition-colors bg-transparent relative overflow-hidden ${index === 2 ? 'md:col-span-2 lg:col-span-1' : ''}`}>
                  <div className="h-48 w-full bg-surface-container relative overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('${article.imageUrl}')` }}></div>
                    <div className="absolute top-2 left-2 bg-surface px-2 py-1 technical-border text-on-surface font-label-sm text-label-sm uppercase flex items-center gap-1 backdrop-blur-md bg-opacity-80">
                      <span className="material-symbols-outlined text-[14px]">timer</span> {article.readTime}
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-grow bg-surface-container-low">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 bg-primary-container rounded-full"></span>
                      <span className="font-mono-technical text-mono-technical text-on-surface-variant uppercase text-[10px]">{article.category}</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors leading-tight">{article.title}</h3>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-margin-desktop px-margin-mobile bg-surface-container border-y border-outline-variant/20">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-stack-tight">
          <span className="material-symbols-outlined text-4xl text-primary-container mb-2">groups</span>
          <h3 className="font-headline-md text-headline-md text-on-surface uppercase">Una legión de +10.000 cabezas</h3>
          <p className="font-mono-technical text-mono-technical text-on-surface-variant uppercase tracking-widest mb-stack-loose">Operando en toda Latinoamérica</p>
          <div className="flex gap-4">
            <Link className="w-12 h-12 flex items-center justify-center technical-border rounded-none text-on-surface-variant hover:text-primary hover:border-primary transition-all" href="#">
              <span className="font-label-sm text-label-sm font-bold">IG</span>
            </Link>
            <Link className="w-12 h-12 flex items-center justify-center technical-border rounded-none text-on-surface-variant hover:text-primary hover:border-primary transition-all" href="#">
              <span className="font-label-sm text-label-sm font-bold">YT</span>
            </Link>
            <Link className="w-12 h-12 flex items-center justify-center technical-border rounded-none text-on-surface-variant hover:text-primary hover:border-primary transition-all" href="#">
              <span className="font-label-sm text-label-sm font-bold">DC</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
