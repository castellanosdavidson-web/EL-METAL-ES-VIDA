"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

/**
 * Convierte URLs de YouTube encontradas en el HTML del artículo
 * en iframes embebidos con vista previa reproducible.
 */
function processYouTubeEmbeds(html: string): string {
  if (!html) return '';

  // Regex para capturar URLs de YouTube en múltiples formatos
  const ytRegex = /(?:<a[^>]*href=["'])?(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})(?:[^"'<\s]*)(?:["'][^>]*>.*?<\/a>)?/gi;

  // También capturamos URLs "sueltas" que Quill pone como texto plano (no como <a>)
  const plainUrlRegex = /(?:^|[\s>])(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})(?:[^\s<]*)/gi;

  let processed = html;

  // Primero: reemplazar enlaces <a> que apuntan a YouTube
  processed = processed.replace(
    /<a[^>]*href=["'](?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})[^"']*["'][^>]*>.*?<\/a>/gi,
    (_, videoId) => createYouTubeEmbed(videoId)
  );

  // Segundo: reemplazar URLs de YouTube que aparecen como texto plano
  processed = processed.replace(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})(?:[^\s<"']*)/gi,
    (match, videoId) => {
      // Evitar doble reemplazo (si ya fue convertido a iframe)
      if (match.includes('iframe')) return match;
      return createYouTubeEmbed(videoId);
    }
  );

  return processed;
}

function createYouTubeEmbed(videoId: string): string {
  return `<div class="yt-embed-wrapper" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:2rem 0;border:1px solid rgba(255,255,255,0.1);background:#000;">
    <iframe 
      src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      allowfullscreen
      title="Video de YouTube"
      loading="lazy"
    ></iframe>
  </div>`;
}

export default function ArticuloPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          const found = data.find((a: any) => a.slug === slug || a.id.toString() === slug);
          setArticle(found);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <main className="pt-[120px] min-h-screen flex items-center justify-center bg-background">
        <span className="font-label-technical text-primary animate-pulse tracking-widest">Sincronizando Archivo...</span>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="pt-[120px] min-h-screen flex flex-col items-center justify-center bg-background px-6">
        <h1 className="text-headline-lg font-headline-lg text-primary uppercase mb-4">Error 404</h1>
        <p className="font-mono-technical text-on-surface-variant mb-8 uppercase text-center">El archivo solicitado no se encuentra en el núcleo.</p>
        <Link href="/" className="bg-primary-container text-white px-8 py-4 font-label-technical uppercase hover:bg-background hover:text-primary border-2 border-primary-container transition-all">
          VOLVER AL INICIO
        </Link>
      </main>
    );
  }

  // Procesar el contenido para embeber videos de YouTube
  const processedContent = processYouTubeEmbeds(article.desc || '');

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Header — con padding-top generoso para no colisionar con el menú */}
      <section className="relative flex items-end overflow-hidden border-b-2 border-outline-variant bg-surface-dim pt-[140px] md:pt-[160px] pb-10 md:pb-16 min-h-[50vh] md:min-h-[60vh]">
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-40" 
          style={{ backgroundImage: `url('${article.imageUrl || ''}')` }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/40" />
        
        {/* Content */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 md:px-12 lg:px-16">
          {/* Badges */}
          <div className="flex flex-wrap gap-3 mb-5">
            <span className="bg-primary-container text-white px-3 py-1 font-label-technical text-label-technical text-xs md:text-sm">
              {article.category}
            </span>
            <span className="border border-outline-variant text-on-surface-variant px-3 py-1 font-label-technical text-label-technical text-xs md:text-sm">
              LECTURA: {article.readTime || '5 MIN'}
            </span>
          </div>
          
          {/* Title — tamaños responsivos con word-break para pantallas pequeñas */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display-lg uppercase text-on-surface leading-tight drop-shadow-2xl break-words hyphens-auto">
            {article.title}
          </h1>
          
          {/* Meta info */}
          <p className="font-mono-technical text-primary mt-5 tracking-widest uppercase text-xs md:text-sm break-all">
            PUBLICADO: {new Date(article.createdAt || Date.now()).toISOString().split('T')[0]} // ARCHIVO: ART-{article.id.toString().slice(-4)}-X
          </p>
        </div>
      </section>

      {/* Content Section — responsive con buena legibilidad */}
      <section className="py-12 md:py-20 lg:py-24 px-6 md:px-12 lg:px-16 max-w-4xl mx-auto">
        {/* Estilos del contenido enriquecido */}
        <style jsx global>{`
          .article-content {
            color: #e0d6cc;
            font-size: 1rem;
            line-height: 1.85;
            word-wrap: break-word;
            overflow-wrap: break-word;
            hyphens: auto;
          }
          
          @media (min-width: 640px) {
            .article-content {
              font-size: 1.075rem;
              line-height: 1.9;
            }
          }
          
          @media (min-width: 768px) {
            .article-content {
              font-size: 1.125rem;
              line-height: 1.95;
            }
          }

          .article-content p {
            margin-bottom: 1.25em;
            max-width: 100%;
          }

          .article-content h1,
          .article-content h2,
          .article-content h3 {
            color: #fff;
            text-transform: uppercase;
            margin-top: 2em;
            margin-bottom: 0.75em;
            line-height: 1.3;
            word-break: break-word;
          }

          .article-content h1 { font-size: 1.75rem; }
          .article-content h2 { font-size: 1.4rem; }
          .article-content h3 { font-size: 1.15rem; }

          @media (min-width: 768px) {
            .article-content h1 { font-size: 2.25rem; }
            .article-content h2 { font-size: 1.75rem; }
            .article-content h3 { font-size: 1.35rem; }
          }

          .article-content strong,
          .article-content b {
            color: #ffffff;
            font-weight: 700;
          }

          .article-content em,
          .article-content i {
            font-style: italic;
            color: #d4c5b5;
          }

          .article-content a {
            color: #c4704b;
            text-decoration: underline;
            text-underline-offset: 3px;
            transition: color 0.2s ease;
          }

          .article-content a:hover {
            color: #e8956e;
          }

          .article-content ul,
          .article-content ol {
            padding-left: 1.5em;
            margin-bottom: 1.25em;
          }

          .article-content li {
            margin-bottom: 0.5em;
          }

          .article-content ul li {
            list-style-type: disc;
          }

          .article-content ol li {
            list-style-type: decimal;
          }

          .article-content blockquote {
            border-left: 3px solid #c4704b;
            padding: 0.75em 1em;
            margin: 1.5em 0;
            background: rgba(255,255,255,0.03);
            font-style: italic;
            color: #d4c5b5;
          }

          .article-content img {
            max-width: 100%;
            height: auto;
            margin: 1.5em 0;
            border: 1px solid rgba(255,255,255,0.1);
          }

          .article-content .yt-embed-wrapper {
            border-radius: 2px;
          }

          .article-content pre,
          .article-content code {
            background: rgba(255,255,255,0.05);
            padding: 0.2em 0.4em;
            font-size: 0.9em;
            border: 1px solid rgba(255,255,255,0.08);
          }

          .article-content pre {
            padding: 1em;
            overflow-x: auto;
            margin: 1.5em 0;
          }

          /* Quill classes */
          .article-content .ql-align-center { text-align: center; }
          .article-content .ql-align-right { text-align: right; }
          .article-content .ql-align-justify { text-align: justify; }

          .article-content .ql-size-small { font-size: 0.85em; }
          .article-content .ql-size-large { font-size: 1.35em; }
          .article-content .ql-size-huge { font-size: 1.75em; }
        `}</style>

        <div 
          className="article-content"
          dangerouslySetInnerHTML={{ __html: processedContent }} 
        />
        
        {/* Footer / Navigation */}
        <div className="mt-16 md:mt-20 pt-8 md:pt-10 border-t border-outline-variant">
          <Link href="/enciclopedia" className="text-on-surface-variant font-label-technical hover:text-primary transition-colors flex items-center gap-2 text-sm uppercase">
            <span className="material-symbols-outlined">arrow_back</span>
            VOLVER AL ARCHIVO GENERAL
          </Link>
        </div>
      </section>
    </main>
  );
}
