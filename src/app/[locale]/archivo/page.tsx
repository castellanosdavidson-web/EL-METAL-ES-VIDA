"use client";
import React, { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';

export default function EnciclopediaPage() {
  const locale = useLocale();
  const t = useTranslations('Archive');
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(t('catTodos'));

  const getPlainText = (html: string) => {
    if (!html) return '';
    return html
      .replace(/<[^>]+>/g, ' ')  // strip HTML tags
      .replace(/&nbsp;/g, ' ')   // decode &nbsp;
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/\r?\n/g, ' ')    // strip newlines
      .replace(/\s+/g, ' ')      // collapse whitespace
      .trim();
  };

  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setPosts(data.filter((a: any) => a.type !== 'plugin' && a.type !== 'gear' && !a.is_hidden));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    t('catTodos'),
    t('catNoticias'),
    t('catDocumental'),
    t('catAnalisis'),
    t('catCiencia'),
    t('catEquipamiento')
  ];

  const sortedPosts = [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filteredPosts = selectedCategory === t('catTodos') 
    ? sortedPosts 
    : sortedPosts.filter(p => {
        // Map category names back to Spanish for filtering since DB saves them in Spanish
        const esCategories: any = {
          [t('catNoticias')]: 'Noticias',
          [t('catDocumental')]: 'Documental Histórico',
          [t('catAnalisis')]: 'Análisis Técnico',
          [t('catCiencia')]: 'Ciencia Sonora',
          [t('catEquipamiento')]: 'Equipamiento'
        };
        return p.category === esCategories[selectedCategory];
      });

  return (
    <main className="flex-grow pt-[160px] pb-stack-loose px-margin-mobile flex flex-col gap-stack-loose w-full max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="flex flex-col gap-stack-tight border-b border-outline-variant/20 pb-6">
        <div className="flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined text-[16px]">auto_stories</span>
          <span className="font-mono-technical text-mono-technical uppercase">{t('tag')}</span>
        </div>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">{t('title')}</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-2">
          {t('desc')}
        </p>
      </section>

      {/* Category Filter Tabs */}
      <section className="flex flex-wrap gap-3 border-b border-outline-variant/10 pb-6">
        {categories.map((cat) => (
          <button 
            key={cat} 
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 font-mono-technical text-[10px] md:text-xs uppercase tracking-widest transition-all duration-300 border ${
              selectedCategory === cat 
                ? 'bg-primary-container text-white border-primary-container' 
                : 'border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-primary/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="font-mono-technical text-primary animate-pulse tracking-widest text-xs uppercase">{t('loading')}</span>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-outline-variant/20 rounded">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">folder_open</span>
          <p className="font-mono-technical text-xs text-on-surface-variant uppercase">{t('empty')}</p>
        </div>
      ) : (
        /* Encyclopedic Masonry Grid */
        <section className="columns-1 md:columns-2 lg:columns-3 gap-masonry-gap space-y-masonry-gap">
          {filteredPosts.map((post, idx) => (
            <Link 
              href={post.slug ? `/articulo/${post.slug}` : `/articulo/${post.id}`} 
              key={post.id} 
              className="break-inside-avoid border border-outline-variant/30 flex flex-col bg-surface-container-low group cursor-pointer relative overflow-hidden block"
            >
              <div className="w-full relative pt-[75%] bg-surface-variant">
                <Image 
                  src={post.imageUrl || '/posts/placeholder.png'} 
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={idx < 3}
                  className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
                />
                <div className="absolute top-2 left-2 bg-surface border border-outline-variant px-2 py-1 flex items-center gap-1 z-10 shadow-md">
                  <span className="material-symbols-outlined text-[14px] text-primary">{post.icon || 'article'}</span>
                  <span className="font-label-sm text-label-sm uppercase text-on-surface">{post.category}</span>
                </div>
              </div>
              <div className="p-4 flex flex-col gap-2 border-t border-outline-variant/30 bg-surface-container-lowest relative z-20">
                <h2 className="font-headline-md text-headline-md text-on-surface leading-tight group-hover:text-primary transition-colors uppercase">{locale === 'en' && post.title_en ? post.title_en : locale === 'pt' && post.title_pt ? post.title_pt : post.title}</h2>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm line-clamp-3 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {getPlainText(locale === 'en' && post.desc_en ? post.desc_en : locale === 'pt' && post.desc_pt ? post.desc_pt : post.desc)}
                </p>
                <div className="mt-2 flex items-center gap-2 text-primary font-label-sm text-label-sm uppercase opacity-80 group-hover:opacity-100 cursor-pointer">
                  <span>{t('viewRecord')}</span>
                  <span className="material-symbols-outlined text-[16px] transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}

      {/* Legado Colombiano Highlight */}
      <section className="mt-8 border border-outline-variant bg-surface-container-high relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 1px, #fff 1px, #fff 2px)" }}></div>
        <div className="p-6 md:p-8 flex flex-col gap-6 relative z-10">
          <div className="flex flex-col gap-2 border-b border-outline-variant/50 pb-4">
            <span className="font-mono-technical text-mono-technical text-primary tracking-widest uppercase">{t('regionalTag')}</span>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface uppercase">{t('regionalTitle')}</h2>
          </div>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
            {t('regionalDesc')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="border border-outline-variant/30 p-4 bg-surface flex items-center justify-between group cursor-pointer hover:border-primary transition-colors">
              <span className="font-label-sm text-label-sm text-on-surface uppercase tracking-widest">Kraken</span>
              <span className="material-symbols-outlined text-primary text-[16px] opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">chevron_right</span>
            </div>
            <div className="border border-outline-variant/30 p-4 bg-surface flex items-center justify-between group cursor-pointer hover:border-primary transition-colors">
              <span className="font-label-sm text-label-sm text-on-surface uppercase tracking-widest">Darkness</span>
              <span className="material-symbols-outlined text-primary text-[16px] opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">chevron_right</span>
            </div>
            <div className="border border-outline-variant/30 p-4 bg-surface flex items-center justify-between group cursor-pointer hover:border-primary transition-colors">
              <span className="font-label-sm text-label-sm text-on-surface uppercase tracking-widest">Masacre</span>
              <span className="material-symbols-outlined text-primary text-[16px] opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">chevron_right</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
