"use client";
import React, { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import BibliotecaCDs from '@/components/ui/BibliotecaCDs';

function processYouTubeEmbeds(html: string): string {
  if (!html) return '';

  // Limpiar espacios no divisibles (&nbsp; y \u00a0) para evitar que el navegador pegue las palabras
  let processed = html
    .replace(/&nbsp;/g, ' ')
    .replace(/\u00a0/g, ' ');

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

interface ArticleClientProps {
  initialArticle: any;
  initialOthers: any[];
}

export default function ArticleClient({ initialArticle, initialOthers }: ArticleClientProps) {
  const locale = useLocale();
  const t = useTranslations('Article');
  const [copied, setCopied] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [shareUrl, setShareUrl] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadMp3 = async () => {
    if (!initialArticle.audioUrl) return;
    setIsDownloading(true);
    try {
      const response = await fetch(initialArticle.audioUrl);
      if (!response.ok) throw new Error('Error downloading');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ElMetalEsVida - ${initialArticle.title}.mp3`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Hubo un error al intentar descargar el archivo.');
    } finally {
      setIsDownloading(false);
    }
  };
  
  const [leadEmail, setLeadEmail] = useState('');
  const [leadStatus, setLeadStatus] = useState<'idle' | 'loading' | 'unlocked'>('idle');
  const [leadError, setLeadError] = useState('');

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadError('');
    if (!leadEmail.includes('@')) {
      setLeadError('Email inválido');
      return;
    }
    setLeadStatus('loading');
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: leadEmail })
      });
      if (res.ok) {
        setLeadStatus('unlocked');
      } else {
        const data = await res.json();
        setLeadError(data.error || 'Error al procesar solicitud');
        setLeadStatus('idle');
      }
    } catch (err) {
      setLeadError('Error de conexión');
      setLeadStatus('idle');
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href);
    }
    if (initialOthers && initialOthers.length > 0) {
      const shuffledOthers = [...initialOthers]
        .map((value: any) => ({ value, sort: Math.random() }))
        .sort((a: any, b: any) => a.sort - b.sort)
        .map(({ value }: any) => value);
      setRecommendations(shuffledOthers.slice(0, 3));
    }
  }, [initialOthers]);

  if (!initialArticle) {
    return (
      <main className="pt-[120px] min-h-screen flex flex-col items-center justify-center bg-background px-6">
        <h1 className="text-headline-lg font-headline-lg text-primary uppercase mb-4">{t('notFoundHero')}</h1>
        <p className="font-mono-technical text-on-surface-variant mb-8 uppercase text-center">{t('notFoundHeroDesc')}</p>
        <Link href="/" className="bg-primary-container text-white px-8 py-4 font-label-technical uppercase hover:bg-background hover:text-primary border-2 border-primary-container transition-all">
          {t('backToHome')}
        </Link>
      </main>
    );
  }

  const articleDesc = locale === 'en' ? (initialArticle.desc_en || initialArticle.desc) : locale === 'pt' ? (initialArticle.desc_pt || initialArticle.desc) : initialArticle.desc;
  const processedContent = processYouTubeEmbeds(articleDesc || '');
  const articleTitle = locale === 'en' ? (initialArticle.title_en || initialArticle.title) : locale === 'pt' ? (initialArticle.title_pt || initialArticle.title) : initialArticle.title;

  const faqs = locale === 'en' && initialArticle.faqs_en?.length ? initialArticle.faqs_en : 
               locale === 'pt' && initialArticle.faqs_pt?.length ? initialArticle.faqs_pt : 
               initialArticle.faqs || [];

  const similarBands = locale === 'en' && initialArticle.similarBands_en?.length ? initialArticle.similarBands_en :
                       locale === 'pt' && initialArticle.similarBands_pt?.length ? initialArticle.similarBands_pt :
                       initialArticle.similarBands || [];

  const bandCds = initialArticle.category === 'Bandas' && initialOthers
    ? initialOthers.filter((a: any) => a.type === 'cd' && a.artist && a.artist.toLowerCase() === initialArticle.title.toLowerCase())
    : [];

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Cinzel+Decorative:wght@400;700;900&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap');

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
          word-break: normal;
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
          font-family: 'Lora', Georgia, serif;
          font-size: 1.05rem;
          line-height: 1.85;
          word-wrap: normal !important;
          overflow-wrap: normal !important;
          hyphens: none !important;
          word-break: normal !important;
          text-align: justify;
          font-weight: 400;
        }

        @media (min-width: 640px) {
          .article-content {
            font-size: 1.1rem;
            line-height: 1.7;
          }
        }

        @media (min-width: 768px) {
          .article-content {
            font-size: 1.15rem;
            line-height: 1.75;
          }
        }

        .article-content p {
          margin-bottom: 1em;
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
          margin-top: 1.8em;
          margin-bottom: 0.5em;
          line-height: 1.35;
          word-break: normal;
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
          <div className="article-hero__bg relative">
            {initialArticle.imageUrl && (
              <Image 
                src={initialArticle.imageUrl} 
                alt={articleTitle || 'Portada'} 
                fill 
                priority 
                sizes="100vw"
                className="object-cover animate-fade-in" 
              />
            )}
          </div>
          <div className="article-hero__overlay" />

          <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 lg:px-16">
            {/* Category badges */}
            <div className="flex flex-wrap gap-3 mb-5">
              <span className="bg-primary-container/80 text-white px-4 py-1.5 font-mono-technical text-[10px] md:text-xs uppercase tracking-widest backdrop-blur-sm">
                {initialArticle.category}
              </span>
              <span className="border border-outline-variant/50 text-on-surface-variant/80 px-4 py-1.5 font-mono-technical text-[10px] md:text-xs uppercase tracking-widest backdrop-blur-sm">
                ⏱ {initialArticle.readTime || '5 MIN'}
              </span>
            </div>

            {/* Title */}
            <h1 className="article-hero__title">
              {articleTitle}
            </h1>

            <div className="article-hero__divider" />

            {/* Meta */}
            <div className="flex flex-col gap-2">
              <p className="font-mono-technical text-primary/70 tracking-widest uppercase text-[10px] md:text-xs">
                {t('published')}: {new Date(initialArticle.createdAt || Date.now()).toISOString().split('T')[0]} &nbsp;&#47;&#47;&nbsp; {t('archivo')} ART-{initialArticle.id.toString().slice(-4)}-X
              </p>
              <p className="font-mono-technical text-primary/70 tracking-widest uppercase text-[10px] md:text-xs flex items-center gap-2">
                {t('autor')} <a href="https://www.linkedin.com/in/davidson-smith-castellanos-jimenez-a533a4130/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-container transition-colors flex items-center gap-1 underline underline-offset-4 decoration-primary/30 hover:decoration-primary"><svg className="w-3 h-3 fill-current shrink-0" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> DAVIDSON SCJ</a>
              </p>
            </div>
          </div>
        </section>

        {/* ===== ARTICLE BODY ===== */}
        <div className="article-body-wrapper">
          {/* Background image (portada) sutil y fija */}
          <div className="article-body-wrapper__bg relative">
            {initialArticle.imageUrl && (
              <Image 
                src={initialArticle.imageUrl} 
                alt={articleTitle || 'Portada'} 
                fill 
                sizes="100vw"
                className="object-cover opacity-[0.15] mix-blend-screen" 
              />
            )}
          </div>

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

            {/* External Download / Plugin */}
            {initialArticle.type === 'plugin' && initialArticle.externalUrl && (
              <div className="my-12 p-6 md:p-8 bg-surface-container-lowest border border-primary/30 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent" />
                <div className="absolute -right-16 -top-16 opacity-5 pointer-events-none group-hover:scale-110 group-hover:rotate-12 transition-transform duration-1000">
                  <span className="material-symbols-outlined text-[200px]">extension</span>
                </div>
                
                <h3 className="font-headline-md text-headline-md uppercase text-on-surface mb-2">{t('toolAvailable')}</h3>
                <div className="font-body-md text-on-surface-variant/90 mb-6 space-y-2">
                  <p>{t('toolDesc')}</p>
                </div>
                
                <div className="bg-primary-container/10 border border-primary p-6">
                  <div className="mb-4 p-3 border border-error/50 bg-error/10 flex items-start gap-2">
                    <span className="material-symbols-outlined text-error text-[16px] mt-0.5">warning</span>
                    <p className="font-mono-technical text-[10px] md:text-xs text-on-surface-variant leading-relaxed">
                      <strong className="text-error uppercase">{t('importantTitle')}</strong> {t('importantDesc')}
                    </p>
                  </div>
                  <a 
                    href={initialArticle.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-primary text-on-primary px-8 py-4 uppercase font-bold tracking-widest hover:bg-inverse-primary hover:text-primary-container transition-all active:scale-95 shadow-[0_0_15px_rgba(var(--md-sys-color-primary),0.3)] w-full md:w-auto justify-center"
                  >
                    <span className="material-symbols-outlined">exit_to_app</span>
                    {t('downloadSite')}
                  </a>
                </div>
              </div>
            )}

            {/* Lead Magnet / Descarga de Audio */}
            {initialArticle.type !== 'plugin' && initialArticle.audioUrl && (
              <div className="my-12 p-6 md:p-8 bg-surface-container-lowest border border-primary/30 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent" />
                <div className="absolute -right-16 -top-16 opacity-5 pointer-events-none group-hover:scale-110 group-hover:rotate-12 transition-transform duration-1000">
                  <span className="material-symbols-outlined text-[200px]">audio_file</span>
                </div>
                
                <h3 className="font-headline-md text-headline-md uppercase text-on-surface mb-2">{t('audioFile')}</h3>
                <div className="font-body-md text-on-surface-variant/90 mb-8 max-w-2xl space-y-2">
                  <p>{t('audioDesc1')}</p>
                  <p>{t('audioDesc2')}</p>
                </div>

                {leadStatus === 'unlocked' ? (
                  <div className="bg-primary-container/10 border border-primary p-6 animate-fade-in">
                    <p className="font-label-technical text-label-technical text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined">check_circle</span>
                      {t('accessGranted')}
                    </p>
                    <div className="font-body-md text-on-surface-variant/90 mb-6 space-y-1 text-sm md:text-base">
                      <p>{t('accessGrantedDesc1')}</p>
                      <p>{t('accessGrantedDesc2')}</p>
                    </div>
                    <button 
                      onClick={handleDownloadMp3}
                      disabled={isDownloading}
                      className="inline-flex items-center gap-3 bg-primary text-on-primary px-8 py-4 uppercase font-bold tracking-widest hover:bg-inverse-primary hover:text-primary-container transition-all active:scale-95 shadow-[0_0_15px_rgba(var(--md-sys-color-primary),0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined">
                        {isDownloading ? 'hourglass_empty' : 'download'}
                      </span>
                      {isDownloading ? t('verifying') + '...' : t('downloadMp3')}
                    </button>
                  </div>
                ) : (
                  <div className="bg-surface-container-high/20 border border-outline-variant/30 p-6 relative z-10">
                    <h4 className="font-label-technical text-label-technical text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined">lock_open</span>
                      {t('accessAuthorized')}
                    </h4>
                    <div className="font-body-md text-on-surface-variant/80 mb-6 space-y-1 text-sm md:text-base">
                      <p>{t('accessAuthDesc1')}</p>
                      <p>{t('accessAuthDesc2')}</p>
                      <p>{t('accessAuthDesc3')}</p>
                    </div>
                    <form onSubmit={handleLeadSubmit} className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <input 
                          type="email" 
                          placeholder={t('emailPlaceholder')} 
                          value={leadEmail}
                          onChange={(e) => setLeadEmail(e.target.value)}
                          required
                          className="w-full bg-surface-container border border-outline-variant/40 p-4 text-on-surface font-mono-technical focus:border-primary outline-none focus:bg-surface-container-high transition-colors"
                        />
                        {leadError && <p className="text-error font-mono-technical text-[10px] mt-2 uppercase">{leadError}</p>}
                      </div>
                      <button 
                        type="submit"
                        disabled={leadStatus === 'loading'}
                        className="bg-surface-variant text-on-surface px-8 py-4 border border-outline-variant/50 uppercase font-bold tracking-widest hover:bg-primary-container hover:text-on-surface hover:border-primary transition-all disabled:opacity-50 whitespace-nowrap flex items-center gap-2 justify-center"
                      >
                        {leadStatus === 'loading' ? (
                          t('verifying')
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-sm">settings_power</span>
                            {t('unlockFile')}
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* FAQ Section */}
            {faqs && faqs.length > 0 && (
              <div className="my-8 p-4 md:p-6 bg-surface-container-lowest/30 border border-outline-variant/20 rounded-md">
                <h3 className="font-headline-md text-sm md:text-base text-primary uppercase mb-4 tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">quiz</span>
                  {t('faqTitle')}
                </h3>
                <div className="space-y-2.5">
                  {faqs.map((faq: any, idx: number) => (
                    <details key={idx} className="group border border-outline-variant/10 bg-surface/20 py-2.5 px-3.5 cursor-pointer [&_summary::-webkit-details-marker]:hidden rounded-sm transition-all duration-300 hover:bg-surface/40">
                      <summary className="flex justify-between items-center outline-none list-none select-none">
                        <span className="font-body-md font-bold text-on-surface group-hover:text-primary transition-colors text-xs md:text-sm">
                          ⛧ {faq.question}
                        </span>
                        <span className="material-symbols-outlined text-on-surface-variant/60 text-sm transition-transform duration-300 group-open:rotate-180">
                          expand_more
                        </span>
                      </summary>
                      <div className="mt-2 pt-2 border-t border-outline-variant/10 font-body-md text-xs md:text-sm text-on-surface-variant/80 leading-relaxed whitespace-pre-line cursor-default">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {/* Similar Bands / Playlist Siniestra - Spotify Tracklist Style */}
            {similarBands && similarBands.length > 0 && (
              <div className="my-8 p-4 md:p-6 bg-surface-container-lowest/50 border border-outline-variant/10 rounded-lg relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary/60 to-transparent" />
                
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-sm text-primary">headphones</span>
                  <h3 className="font-mono-technical text-[10px] md:text-xs text-primary uppercase tracking-widest font-bold">
                    {t('playlistTitle')}
                  </h3>
                </div>
                <p className="font-body-md text-[9px] md:text-[10px] text-on-surface-variant/60 uppercase tracking-wider mb-4 border-b border-outline-variant/10 pb-3">
                  {t('playlistSubtitle')}
                </p>

                {/* Tracklist Header (Spotify-like) */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 border-b border-outline-variant/5 text-[9px] font-mono-technical text-on-surface-variant/40 uppercase tracking-widest">
                  <div className="col-span-1 text-center">#</div>
                  <div className="col-span-4">{t('playlistBandSong')}</div>
                  <div className="col-span-6">{t('playlistWhy')}</div>
                  <div className="col-span-1 text-right">{t('playlistRitual')}</div>
                </div>

                {/* Tracks list */}
                <div className="divide-y divide-outline-variant/5">
                  {similarBands.map((bandObj: any, idx: number) => {
                    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(bandObj.band + ' ' + bandObj.song)}`;
                    return (
                      <div 
                        key={idx} 
                        className="grid grid-cols-12 gap-2 md:gap-4 px-3 md:px-4 py-3 items-center hover:bg-surface-variant/10 transition-colors group/track rounded-md duration-200"
                      >
                        {/* Track Number / Play icon */}
                        <div className="col-span-1 text-center font-mono-technical text-xs text-on-surface-variant/40 group-hover/track:text-primary transition-colors">
                          <span className="group-hover/track:hidden">0{idx + 1}</span>
                          <span className="material-symbols-outlined text-[16px] hidden group-hover/track:inline-block text-primary align-middle animate-pulse">play_arrow</span>
                        </div>

                        {/* Band and Song */}
                        <div className="col-span-10 md:col-span-4 flex flex-col min-w-0">
                          <span className="font-body-lg font-bold text-on-surface text-sm uppercase tracking-wide truncate group-hover/track:text-primary transition-colors">
                            {bandObj.band}
                          </span>
                          <span className="font-mono-technical text-[10px] text-on-surface-variant/70 italic truncate mt-0.5">
                            "{bandObj.song}"
                          </span>
                        </div>

                        {/* Recommendation Description */}
                        <div className="col-span-11 md:col-span-6 pl-5 md:pl-0">
                          <p className="font-body-md text-xs text-on-surface-variant/80 line-clamp-1 group-hover/track:line-clamp-none transition-all duration-300 md:text-sm">
                            {bandObj.description}
                          </p>
                        </div>

                        {/* Link Button */}
                        <div className="col-span-1 text-right">
                          <a 
                            href={searchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-surface-container hover:bg-primary-container text-on-surface hover:text-white transition-all active:scale-90"
                            title={`Buscar ${bandObj.band} en YouTube`}
                          >
                            <span className="material-symbols-outlined text-sm">play_arrow</span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CD Library for Bands */}
            {initialArticle.category === 'Bandas' && bandCds.length > 0 && (
              <div className="my-12">
                <h3 className="font-headline-md text-headline-md text-primary uppercase text-center mb-8">
                  DISCOGRAFÍA SELECCIONADA
                </h3>
                <BibliotecaCDs cds={bandCds} />
              </div>
            )}

            {/* Share section */}
            <div className="my-8 p-6 bg-surface-container/30 border border-outline-variant/20 rounded">
              <h3 className="font-label-technical text-label-technical uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">share</span>
                {t('shareTitle')}
              </h3>
              <p className="font-body-md text-sm md:text-base text-on-surface-variant/90 mb-4 italic">
                {t('shareDesc')}
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 px-4 py-2 border border-outline-variant text-[11px] uppercase tracking-wider font-mono-technical text-on-surface-variant hover:text-primary hover:border-primary transition-all duration-300"
                >
                  Facebook
                </a>
                <a 
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(articleTitle || '')}`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 px-4 py-2 border border-outline-variant text-[11px] uppercase tracking-wider font-mono-technical text-on-surface-variant hover:text-primary hover:border-primary transition-all duration-300"
                >
                  Twitter / X
                </a>
                <a 
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent((articleTitle || '') + ' ' + shareUrl)}`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 px-4 py-2 border border-outline-variant text-[11px] uppercase tracking-wider font-mono-technical text-on-surface-variant hover:text-primary hover:border-primary transition-all duration-300"
                >
                  WhatsApp
                </a>
                <button 
                  onClick={() => {
                    if (shareUrl) {
                      navigator.clipboard.writeText(shareUrl);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-container/20 border border-primary-container text-[11px] uppercase tracking-wider font-mono-technical text-primary hover:bg-primary-container/40 transition-all duration-300"
                >
                  {copied ? t('linkCopied') : t('copyLink')}
                </button>
              </div>
            </div>

            {/* Recommendations Section */}
            {recommendations.length > 0 && (
              <div className="my-12 pt-8 border-t border-outline-variant/20">
                <h3 className="font-headline-md text-headline-md text-on-surface uppercase mb-6 tracking-wide">{t('moreArticles')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recommendations.map((rec) => (
                    <Link key={rec.id} href={`/articulo/${rec.slug || rec.id}`} className="flex flex-col border border-outline-variant/10 bg-surface-container-lowest/30 hover:border-primary/50 transition-all group overflow-hidden">
                      <div className="h-32 w-full overflow-hidden relative">
                        <Image 
                          src={rec.imageUrl} 
                          alt={rec.title} 
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-80 z-10" />
                        <span className="absolute bottom-2 left-2 bg-primary-container/95 text-white px-2 py-0.5 text-[8px] font-mono-technical tracking-wider uppercase">
                          {rec.category}
                        </span>
                      </div>
                      <div className="p-4 flex-grow flex flex-col justify-between">
                        <h4 className="font-headline-md text-sm text-on-surface line-clamp-2 uppercase tracking-wide group-hover:text-primary transition-colors">
                          {locale === 'en' ? (rec.title_en || rec.title) : locale === 'pt' ? (rec.title_pt || rec.title) : rec.title}
                        </h4>
                        <span className="text-[9px] font-mono-technical text-on-surface-variant/60 block mt-2 uppercase">
                          {t('readExpediente')}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-8 md:mt-12 pt-6 border-t border-outline-variant/30">
              <Link href={initialArticle.type === 'plugin' ? "/taller" : "/archivo"} className="text-on-surface-variant/60 font-mono-technical hover:text-primary transition-colors flex items-center gap-2 text-xs uppercase tracking-widest group">
                <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
                {t('back')} {initialArticle.type === 'plugin' ? t('backToTaller') : t('backToArchive')}
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
