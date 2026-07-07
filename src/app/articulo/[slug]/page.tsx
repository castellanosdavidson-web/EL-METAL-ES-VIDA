"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import parse from 'html-react-parser'; // Si se necesita parsear el HTML

export default function ArticuloPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          // Si el artículo no tiene slug (artículos antiguos), intentar buscar por id fallback o simplemente mostrar el primero
          const found = data.find((a: any) => a.slug === slug || a.id.toString() === slug);
          setArticle(found);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <main className="pt-[88px] min-h-screen flex items-center justify-center bg-background">
        <span className="font-label-technical text-primary animate-pulse tracking-widest">Sincronizando Archivo...</span>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="pt-[88px] min-h-screen flex flex-col items-center justify-center bg-background">
        <h1 className="text-headline-lg font-headline-lg text-primary uppercase mb-4">Error 404</h1>
        <p className="font-mono-technical text-on-surface-variant mb-8 uppercase">El archivo solicitado no se encuentra en el núcleo.</p>
        <Link href="/" className="bg-primary-container text-white px-8 py-4 font-label-technical uppercase hover:bg-background hover:text-primary border-2 border-primary-container transition-all">
          VOLVER AL INICIO
        </Link>
      </main>
    );
  }

  return (
    <main className="pt-[88px] min-h-screen bg-background">
      {/* Hero Header */}
      <section className="relative h-[60vh] flex items-end overflow-hidden border-b-2 border-outline-variant bg-surface-dim">
        <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-50" style={{ backgroundImage: `url('${article.imageUrl || ''}')` }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        <div className="relative z-10 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pb-12">
          <div className="flex gap-4 mb-4">
            <span className="bg-primary-container text-white px-3 py-1 font-label-technical text-label-technical">{article.category}</span>
            <span className="border border-outline-variant text-on-surface-variant px-3 py-1 font-label-technical text-label-technical">LECTURA: {article.readTime || '5 MIN'}</span>
          </div>
          <h1 className="text-headline-xl md:text-display-lg font-display-lg uppercase text-on-surface leading-tight drop-shadow-2xl max-w-4xl">
            {article.title}
          </h1>
          <p className="font-mono-technical text-primary mt-6 tracking-widest uppercase">
            PUBLICADO: {new Date(article.createdAt || Date.now()).toISOString().split('T')[0]} // ARCHIVO: ART-{article.id.toString().slice(-4)}-X
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-4xl mx-auto">
        {/* Aquí renderizamos el contenido enriquecido (HTML guardado por Quill) */}
        <div className="prose prose-invert prose-lg max-w-none prose-headings:font-headline-lg prose-headings:uppercase prose-p:font-body-lg prose-a:text-primary hover:prose-a:text-primary-container prose-strong:text-white">
          {parse(article.desc || '')}
        </div>
        
        <div className="mt-20 pt-10 border-t border-outline-variant">
          <Link href="/enciclopedia" className="text-on-surface-variant font-label-technical hover:text-primary transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined">arrow_back</span>
            VOLVER AL ARCHIVO GENERAL
          </Link>
        </div>
      </section>
    </main>
  );
}
