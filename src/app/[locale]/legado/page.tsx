"use client";
import React, { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import BibliotecaCDs from '@/components/ui/BibliotecaCDs';

export default function LegadoColombianoPage() {
  const locale = useLocale();
  // Using Archive translations for common things or we can hardcode for this specific page
  const t = useTranslations('Archive');
  const [posts, setPosts] = useState<any[]>([]);
  const [cds, setCds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('TODOS');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const getPlainText = (html: string) => {
    if (!html) return '';
    return html
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/\r?\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          const legacyItems = data.filter((a: any) => a.isColombianLegacy && !a.is_hidden);
          const articles = legacyItems.filter((a: any) => a.type !== 'cd' && a.type !== 'plugin' && a.type !== 'gear');
          const legacyCds = legacyItems.filter((a: any) => a.type === 'cd');
          setPosts(articles);
          setCds(legacyCds);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = ['TODOS', ...Array.from(new Set(posts.map(p => p.category || 'Banda')))].sort();
  const filteredPosts = selectedCategory === 'TODOS' 
    ? posts 
    : posts.filter(p => (p.category || 'Banda') === selectedCategory);

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="flex-grow pt-[160px] pb-stack-loose px-margin-mobile flex flex-col gap-stack-loose w-full mx-auto relative min-h-screen bg-background">
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-12 relative z-10">
        {/* Hero Section */}
        <section className="flex flex-col gap-stack-tight border-b border-outline-variant/30 pb-10">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-[20px]">landscape</span>
            <span className="font-mono-technical text-mono-technical uppercase tracking-[0.25em]">Expediente Regional</span>
          </div>
          <h1 className="font-headline-lg-mobile md:text-display-lg text-display-md text-on-surface uppercase tracking-wider drop-shadow-md">{t('regionalTitle')}</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-4 leading-relaxed">
            {t('regionalDesc')}
          </p>
        </section>

        {/* Category Filter Tabs */}
        {!loading && posts.length > 0 && (
          <section className="flex flex-wrap gap-3 border-b border-outline-variant/10 pb-6 -mt-6">
            {categories.map((cat) => (
              <button 
                key={cat as string} 
                onClick={() => {
                  setSelectedCategory(cat as string);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 font-mono-technical text-[10px] md:text-xs uppercase tracking-widest transition-all duration-300 border ${
                  selectedCategory === cat 
                    ? 'bg-primary-container text-white border-primary-container' 
                    : 'border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-primary/50'
                }`}
              >
                {cat as string}
              </button>
            ))}
          </section>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="font-mono-technical text-primary animate-pulse tracking-widest text-xs uppercase">{t('loading')}</span>
          </div>
        ) : (
          <>
            {/* Articles / Bands Grid */}
            <section className="mt-2">
              <div className="flex items-center gap-2 text-primary mb-8 border-b border-outline-variant/20 pb-4">
                <span className="material-symbols-outlined text-[18px]">auto_stories</span>
                <h2 className="font-headline-md text-headline-md text-on-surface uppercase">Expedientes Biográficos</h2>
              </div>

              {posts.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-outline-variant/20 rounded">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">folder_open</span>
                  <p className="font-mono-technical text-xs text-on-surface-variant uppercase">{t('empty')}</p>
                </div>
              ) : (
                <>
                  <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedPosts.map((post, idx) => (
                      <Link 
                        href={post.slug ? `/articulo/${post.slug}` : `/articulo/${post.id}`} 
                        key={post.id} 
                        className="border border-outline-variant/30 flex flex-col bg-surface-container-low group cursor-pointer relative overflow-hidden h-full"
                      >
                        <div className="w-full relative pt-[75%] bg-surface-variant flex-shrink-0">
                          <Image 
                            src={post.imageUrl || '/posts/placeholder.png'} 
                            alt={post.title}
                            fill
                            unoptimized={true}
                            sizes="(max-width: 768px) 100vw, 33vw"
                            priority={idx < 3}
                            className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
                          />
                          <div className="absolute top-2 left-2 bg-surface border border-outline-variant px-2 py-1 flex items-center gap-1 z-10 shadow-md">
                            <span className="font-label-sm text-label-sm uppercase text-on-surface">{post.category || 'Banda'}</span>
                          </div>
                        </div>
                        <div className="p-4 flex flex-col gap-2 border-t border-outline-variant/30 bg-surface-container-lowest relative z-20 flex-grow">
                          <h2 className="font-headline-md text-headline-md text-on-surface leading-tight group-hover:text-primary transition-colors uppercase">{locale === 'en' && post.title_en ? post.title_en : locale === 'pt' && post.title_pt ? post.title_pt : post.title}</h2>
                          <p className="font-body-md text-body-md text-on-surface-variant text-sm line-clamp-3 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {getPlainText(locale === 'en' && post.desc_en ? post.desc_en : locale === 'pt' && post.desc_pt ? post.desc_pt : post.desc)}
                          </p>
                          <div className="mt-auto pt-4 flex items-center gap-2 text-primary font-label-sm text-label-sm uppercase opacity-80 group-hover:opacity-100 cursor-pointer">
                            <span>Leer Expediente</span>
                            <span className="material-symbols-outlined text-[16px] transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </section>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <section className="flex justify-center items-center gap-2 mt-12 pt-6 border-t border-outline-variant/10">
                      <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="w-10 h-10 flex items-center justify-center border border-outline-variant/30 bg-surface text-on-surface disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary transition-colors"
                      >
                        <span className="material-symbols-outlined">chevron_left</span>
                      </button>
                      
                      <div className="flex gap-1">
                        {Array.from({length: totalPages}).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-10 h-10 flex items-center justify-center font-mono-technical text-sm border transition-colors ${
                              currentPage === i + 1 
                                ? 'border-primary bg-primary text-white' 
                                : 'border-outline-variant/30 bg-surface text-on-surface hover:border-primary/50'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>

                      <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="w-10 h-10 flex items-center justify-center border border-outline-variant/30 bg-surface text-on-surface disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary transition-colors"
                      >
                        <span className="material-symbols-outlined">chevron_right</span>
                      </button>
                    </section>
                  )}
                </>
              )}
            </section>

            {/* CD Library Section - Moved to bottom */}
            {cds.length > 0 && (
              <section className="mt-12 pt-12 border-t border-outline-variant/20">
                <BibliotecaCDs cds={cds} title="Colección Metal Colombiano" hideLink={true} />
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
