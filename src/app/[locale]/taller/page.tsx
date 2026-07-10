"use client";
import React, { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';

export default function TallerPage() {
  const locale = useLocale();
  const t = useTranslations('Taller');
  const [plugins, setPlugins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');

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

  const getCategoryIcon = (category?: string) => {
    if (!category) return 'extension';
    const cat = category.toLowerCase();
    if (cat.includes('guitar')) return 'music_note';
    if (cat.includes('bater') || cat.includes('percu')) return 'album';
    if (cat.includes('piano') || cat.includes('teclad')) return 'piano';
    if (cat.includes('distorsion') || cat.includes('distorsión')) return 'graphic_eq';
    if (cat.includes('compres')) return 'compress';
    if (cat.includes('eq')) return 'tune';
    if (cat.includes('vocal') || cat.includes('voz')) return 'mic';
    if (cat.includes('sint')) return 'piano';
    if (cat.includes('bajo')) return 'speaker';
    if (cat.includes('hardware') || cat.includes('arsenal')) return 'hardware';
    if (cat.includes('pedal')) return 'settings_input_component';
    return 'extension';
  };

  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setPlugins(data.filter((a: any) => a.type === 'plugin' && !a.is_hidden));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    'Todos',
    '808', 'Armónicos', 'Bajo', 'Batería', 'Bitcrusher', 'Clipper', 
    'Compresión', 'De-esser', 'Distorsion', 'EQs', 'Espectro', 'Fases', 
    'Guitarra', 'Latencia', 'LoFi', 'Orquestal', 'Piano', 'Side-Chain', 
    'Sintes', 'Transiente', 'Vocal'
  ];

  const sortedPlugins = [...plugins].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filteredPlugins = selectedCategory === 'Todos' 
    ? sortedPlugins 
    : sortedPlugins.filter(p => p.category === selectedCategory);

  return (
    <main className="flex-grow pt-[160px] pb-stack-loose px-margin-mobile flex flex-col gap-stack-loose w-full max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="flex flex-col gap-stack-tight border-b border-outline-variant/20 pb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-[16px]">build</span>
              <span className="font-mono-technical text-mono-technical uppercase">{t('tag')}</span>
            </div>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface leading-normal pb-2">{t('title')}</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-2">
              {t('desc')}
            </p>
          </div>
          <div className="bg-surface-variant/40 border border-outline-variant/30 px-4 py-2 font-mono-technical text-[10px] text-on-surface-variant uppercase tracking-widest">
            {t('status')}
          </div>
        </div>
        
        {/* Disclaimer */}
        <div className="mt-4 p-4 border border-error/50 bg-error/10 flex items-start gap-3">
          <span className="material-symbols-outlined text-error mt-0.5">warning</span>
          <p className="font-mono-technical text-xs text-on-surface-variant leading-relaxed">
            <strong className="text-error uppercase">{t('important')}</strong> {t('disclaimer')}
          </p>
        </div>
      </section>

      {/* Category Filter Tabs */}
      <section className="flex flex-wrap gap-2 md:gap-3 border-b border-outline-variant/10 pb-6">
        {categories.map((cat) => (
          <button 
            key={cat} 
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 md:px-4 md:py-2 font-mono-technical text-[10px] md:text-xs uppercase tracking-widest transition-all duration-300 border ${
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
      ) : filteredPlugins.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-outline-variant/20 rounded">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">extension_off</span>
          <p className="font-mono-technical text-xs text-on-surface-variant uppercase">{t('empty')}</p>
        </div>
      ) : (
        /* Encyclopedic Masonry Grid */
        <section className="columns-1 md:columns-2 lg:columns-3 gap-masonry-gap space-y-masonry-gap">
          {filteredPlugins.map((plugin, idx) => (
            <Link 
              href={plugin.slug ? `/articulo/${plugin.slug}` : `/articulo/${plugin.id}`} 
              key={plugin.id} 
              className="break-inside-avoid border border-outline-variant/30 flex flex-col bg-surface-container-low group cursor-pointer relative overflow-hidden block"
            >
              <div className="w-full relative pt-[75%] bg-surface-variant">
                <Image 
                  src={plugin.imageUrl || '/posts/placeholder.png'} 
                  alt={plugin.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={idx < 3}
                  className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
                />
                <div className="absolute top-2 left-2 bg-surface border border-outline-variant px-2 py-1 flex items-center gap-1 z-10 shadow-md">
                  <span className="material-symbols-outlined text-[14px] text-primary">{getCategoryIcon(plugin.category)}</span>
                  <span className="font-label-sm text-label-sm uppercase text-on-surface">{plugin.category}</span>
                </div>
              </div>
              <div className="p-4 flex flex-col gap-2 border-t border-outline-variant/30 bg-surface-container-lowest relative z-20">
                  <h3 className="font-headline-lg text-headline-lg-mobile uppercase text-on-surface mb-2 leading-tight group-hover:text-primary transition-colors relative z-10">{locale === 'en' ? (plugin.title_en || plugin.title) : locale === 'pt' ? (plugin.title_pt || plugin.title) : plugin.title}</h3>
                  <p className="font-body-md text-on-surface-variant text-sm overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {getPlainText(locale === 'en' ? (plugin.desc_en || plugin.desc) : locale === 'pt' ? (plugin.desc_pt || plugin.desc) : plugin.desc)}
                  </p>
                <div className="mt-2 flex items-center gap-2 text-primary font-label-sm text-label-sm uppercase opacity-80 group-hover:opacity-100 cursor-pointer">
                  <span>{t('viewTool')}</span>
                  <span className="material-symbols-outlined text-[16px] transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
