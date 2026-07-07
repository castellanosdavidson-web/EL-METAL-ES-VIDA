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
      if (match.includes('iframe')) return match;
      return createYouTubeEmbed(videoId);
    }
  );

  return processed;
}

function createYouTubeEmbed(videoId: string): string {
  return `<div class="yt-embed-wrapper">
    <iframe 
      src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1" 
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
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="font-mono-technical text-primary animate-pulse tracking-widest text-xs uppercase">Cargando Archivo...</span>
        </div>
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

  const processedContent = processYouTubeEmbeds(article.desc || '');

  return (
    <>
      {/* Google Fonts metaleras */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Cinzel+Decorative:wght@400;700;900&display=swap');

        /* ============================================
           HERO SECTION
           ============================================ */
        .article-hero {
          position: relative;
          min-height: 65vh;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
          padding-top: 140px;
          padding-bottom: 3rem;
        }

        @media (min-width: 768px) {
          .article-hero {
            min-height: 70vh;
            padding-top: 160px;
            padding-bottom: 4rem;
          }
        }

        .article-hero__bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          opacity: 0.35;
          will-change: transform;
          transform: translateZ(0);
        }

        .article-hero__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            #0d0907 0%,
            #0d0907ee 30%,
            #0d0907aa 55%,
            #0d090744 80%,
            #0d090722 100%
          );
          will-change: transform;
          transform: translateZ(0);
        }

        .article-hero__title {
          font-family: 'Cinzel', serif;
          text-transform: uppercase;
          color: #f0e6d8;
          text-shadow: 
            0 0 30px rgba(196, 112, 75, 0.25),
            0 4px 20px rgba(0,0,0,0.8);
          line-height: 1.25;
          letter-spacing: 0.08em;
          word-spacing: 0.12em;
          word-break: break-word;
          font-size: 1.5rem;
          font-weight: 600;
        }

        @media (min-width: 480px) {
          .article-hero__title { font-size: 1.8rem; }
        }
        @media (min-width: 640px) {
          .article-hero__title { font-size: 2.1rem; }
        }
        @media (min-width: 768px) {
          .article-hero__title { font-size: 2.5rem; }
        }
        @media (min-width: 1024px) {
          .article-hero__title { font-size: 3rem; }
        }

        .article-hero__divider {
          width: 80px;
          height: 2px;
          background: linear-gradient(90deg, #c4704b, transparent);
          margin: 1.5rem 0;
        }

        /* ============================================
           ARTICLE BODY — BACKGROUND + ATMOSPHERE
           ============================================ */
        .article-body-wrapper {
          position: relative;
        }

        .article-body-wrapper__bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100%;
          background-size: cover;
          background-position: center top;
          opacity: 0.08;
          pointer-events: none;
          z-index: 0;
          will-change: transform;
          transform: translateZ(0);
        }

        .article-body-content {
          position: relative;
          z-index: 2;
        }

        /* ============================================
           ARTICLE CONTENT TYPOGRAPHY — METAL STYLE
           ============================================ */
        .article-content {
          color: #d8cec4;
          font-family: 'Cinzel', serif;
          font-size: 0.95rem;
          line-height: 2;
          word-wrap: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
          font-weight: 400;
        }

        @media (min-width: 640px) {
          .article-content {
            font-size: 1rem;
            line-height: 2.05;
          }
        }

        @media (min-width: 768px) {
          .article-content {
            font-size: 1.05rem;
            line-height: 2.1;
          }
        }

        .article-content p {
          margin-bottom: 1.5em;
          max-width: 100%;
        }

        /* Drop cap en el primer párrafo */
        .article-content > p:first-of-type::first-letter {
          font-family: 'Cinzel Decorative', serif;
          font-size: 3.5em;
          float: left;
          line-height: 0.8;
          margin-right: 0.1em;
          margin-top: 0.05em;
          color: #c4704b;
          text-shadow: 0 0 20px rgba(196, 112, 75, 0.4);
          font-weight: 900;
        }

        .article-content h1,
        .article-content h2,
        .article-content h3 {
          font-family: 'Cinzel', serif;
          color: #f0e6d8;
          text-transform: uppercase;
          margin-top: 2.5em;
          margin-bottom: 0.75em;
          line-height: 1.35;
          word-break: break-word;
          text-shadow: 0 0 15px rgba(196, 112, 75, 0.15);
          letter-spacing: 0.06em;
          word-spacing: 0.1em;
        }

        .article-content h1 { font-size: 1.5rem; font-weight: 600; }
        .article-content h2 { font-size: 1.25rem; font-weight: 600; }
        .article-content h3 { font-size: 1.05rem; font-weight: 500; }

        @media (min-width: 768px) {
          .article-content h1 { font-size: 1.85rem; }
          .article-content h2 { font-size: 1.5rem; }
          .article-content h3 { font-size: 1.2rem; }
        }

        .article-content strong,
        .article-content b {
          color: #f0e6d8;
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        .article-content em,
        .article-content i {
          font-style: italic;
          color: #c4a882;
        }

        .article-content a {
          color: #c4704b;
          text-decoration: none;
          border-bottom: 1px solid rgba(196, 112, 75, 0.4);
          transition: all 0.3s ease;
          padding-bottom: 1px;
        }

        .article-content a:hover {
          color: #e8956e;
          border-bottom-color: #e8956e;
          text-shadow: 0 0 12px rgba(196, 112, 75, 0.3);
        }

        .article-content ul,
        .article-content ol {
          padding-left: 1.5em;
          margin-bottom: 1.5em;
        }

        .article-content li {
          margin-bottom: 0.6em;
        }

        .article-content ul li {
          list-style-type: '⛧ ';
        }

        .article-content ol li {
          list-style-type: decimal;
        }

        .article-content blockquote {
          border-left: 3px solid #c4704b;
          padding: 1em 1.5em;
          margin: 2em 0;
          background: rgba(196, 112, 75, 0.05);
          font-style: italic;
          color: #c4a882;
          position: relative;
        }

        .article-content blockquote::before {
          content: '"';
          font-family: 'Cinzel Decorative', serif;
          font-size: 4rem;
          color: rgba(196, 112, 75, 0.15);
          position: absolute;
          top: -10px;
          left: 10px;
          line-height: 1;
        }

        .article-content img {
          max-width: 100%;
          height: auto;
          margin: 2em 0;
          border: 1px solid rgba(196, 112, 75, 0.2);
          box-shadow: 0 4px 30px rgba(0,0,0,0.5);
        }

        /* YouTube embeds */
        .article-content .yt-embed-wrapper {
          position: relative;
          padding-bottom: 56.25%;
          height: 0;
          overflow: hidden;
          margin: 2.5rem 0;
          border: 1px solid rgba(196, 112, 75, 0.3);
          box-shadow: 
            0 4px 40px rgba(0,0,0,0.6),
            0 0 60px rgba(196, 112, 75, 0.08);
          background: #000;
        }

        .article-content .yt-embed-wrapper iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }

        .article-content pre,
        .article-content code {
          background: rgba(255,255,255,0.04);
          padding: 0.2em 0.5em;
          font-size: 0.85em;
          font-family: 'JetBrains Mono', monospace;
          border: 1px solid rgba(255,255,255,0.06);
          color: #c4704b;
        }

        .article-content pre {
          padding: 1.25em;
          overflow-x: auto;
          margin: 2em 0;
        }

        /* Quill alignment classes */
        .article-content .ql-align-center { text-align: center; }
        .article-content .ql-align-right { text-align: right; }
        .article-content .ql-align-justify { text-align: justify; }

        .article-content .ql-size-small { font-size: 0.85em; }
        .article-content .ql-size-large { font-size: 1.3em; }
        .article-content .ql-size-huge { font-size: 1.7em; }

        /* ============================================
           DECORATIVE ELEMENTS
           ============================================ */
        .metal-separator {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 3rem 0;
          opacity: 0.4;
        }

        .metal-separator__line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, #c4704b, transparent);
        }

        .metal-separator__icon {
          color: #c4704b;
          font-size: 0.7rem;
          font-family: 'Cinzel Decorative', serif;
        }
      `}</style>

      <main className="min-h-screen bg-background">
        {/* ===== HERO SECTION ===== */}
        <section className="article-hero">
          <div 
            className="article-hero__bg"
            style={{ backgroundImage: `url('${article.imageUrl || ''}')` }}
          />
          <div className="article-hero__overlay" />

          <div className="relative z-10 w-full max-w-4xl mx-auto px-6 md:px-12 lg:px-16">
            {/* Category badges */}
            <div className="flex flex-wrap gap-3 mb-5">
              <span className="bg-primary-container/80 text-white px-4 py-1.5 font-mono-technical text-[10px] md:text-xs uppercase tracking-widest backdrop-blur-sm">
                {article.category}
              </span>
              <span className="border border-outline-variant/50 text-on-surface-variant/80 px-4 py-1.5 font-mono-technical text-[10px] md:text-xs uppercase tracking-widest backdrop-blur-sm">
                ⏱ {article.readTime || '5 MIN'}
              </span>
            </div>

            {/* Title */}
            <h1 className="article-hero__title">
              {article.title}
            </h1>

            <div className="article-hero__divider" />

            {/* Meta */}
            <p className="font-mono-technical text-primary/70 tracking-widest uppercase text-[10px] md:text-xs">
              PUBLICADO: {new Date(article.createdAt || Date.now()).toISOString().split('T')[0]} &nbsp;&#47;&#47;&nbsp; ARCHIVO: ART-{article.id.toString().slice(-4)}-X
            </p>
          </div>
        </section>

        {/* ===== ARTICLE BODY ===== */}
        <div className="article-body-wrapper">
          {/* Background image (portada) sutil y fija */}
          <div 
            className="article-body-wrapper__bg"
            style={{ backgroundImage: `url('${article.imageUrl || ''}')` }}
          />

          {/* Content */}
          <section className="article-body-content py-12 md:py-20 lg:py-24 px-6 md:px-12 lg:px-16 max-w-4xl mx-auto">
            {/* Decorative separator */}
            <div className="metal-separator">
              <div className="metal-separator__line" />
              <span className="metal-separator__icon">⛧ ⛧ ⛧</span>
              <div className="metal-separator__line" />
            </div>

            {/* Article content */}
            <div 
              className="article-content"
              dangerouslySetInnerHTML={{ __html: processedContent }} 
            />

            {/* Bottom separator */}
            <div className="metal-separator">
              <div className="metal-separator__line" />
              <span className="metal-separator__icon">⛧ ⛧ ⛧</span>
              <div className="metal-separator__line" />
            </div>

            {/* Navigation */}
            <div className="mt-8 md:mt-12 pt-6 border-t border-outline-variant/30">
              <Link href="/enciclopedia" className="text-on-surface-variant/60 font-mono-technical hover:text-primary transition-colors flex items-center gap-2 text-xs uppercase tracking-widest group">
                <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
                VOLVER AL ARCHIVO GENERAL
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
