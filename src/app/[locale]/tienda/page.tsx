"use client";
import React, { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';

const TiendaProductImage = ({ src, alt, priority }: { src: string; alt: string; priority: boolean }) => {
  const [hasError, setHasError] = useState(false);
  
  if (hasError || !src) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-surface-container">
        <span className="material-symbols-outlined text-on-surface-variant text-4xl">image</span>
      </div>
    );
  }

  return (
    <Image 
      src={src} 
      alt={alt} 
      fill 
      sizes="(max-width: 768px) 100vw, 33vw"
      priority={priority}
      onError={() => setHasError(true)}
      className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700 ease-out" 
    />
  );
};

export default function TiendaPage() {
  const locale = useLocale();
  const t = useTranslations('Tienda');
  const [gear, setGear] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');

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
          const gearItems = data.filter((a: any) => a.type === 'gear' && !a.is_hidden);
          setGear(gearItems);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = ['Todos', ...Array.from(new Set(gear.map(item => item.category)))].filter(Boolean);

  const filteredGear = gear.filter(item => {
    const matchCat = selectedCategory === 'Todos' || item.category === selectedCategory;
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (item.desc && item.desc.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <main className="flex-grow pt-[160px] pb-stack-loose w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
      {/* Hero Section */}
      <section className="py-stack-loose text-center border-b border-outline-variant/20 mb-stack-loose">
        <div className="flex justify-center items-center gap-3 mb-2">
          <span className="material-symbols-outlined text-primary text-[32px]">shopping_cart</span>
        </div>
        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-stack-tight text-on-surface uppercase">
          {t('title')}
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto mb-6">
          {t('desc')} 
        </p>
        
        {/* Amazon Affiliate Disclaimer */}
        <div className="inline-block border border-outline-variant/30 bg-surface-container-low p-4 text-left max-w-3xl">
          <p className="font-mono-technical text-[10px] text-on-surface-variant uppercase tracking-widest flex items-start gap-2">
            <span className="material-symbols-outlined text-[14px] text-primary">info</span>
            <span>
              <strong>{t('affiliateTitle')}</strong> {t('affiliateDesc')}
            </span>
          </p>
        </div>
      </section>

      {/* Filters & Search */}
      <div className="sticky top-[80px] z-40 bg-background/95 backdrop-blur py-4 border-b border-outline-variant/20 mb-8 flex flex-col gap-4">
        
        {/* Search Bar */}
        <div className="relative w-full max-w-md mx-auto md:mx-0">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input 
            type="text" 
            placeholder={t('searchPlaceholder')} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border border-outline-variant py-3 pl-12 pr-4 text-on-surface focus:border-primary outline-none font-body-md"
          />
        </div>

        {/* Category Navigation */}
        <div className="flex flex-wrap gap-3">
          {categories.map((cat: any) => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 font-label-sm text-label-sm uppercase tracking-widest transition-colors border ${
                selectedCategory === cat 
                  ? 'bg-primary-container text-on-primary-container border-primary-container' 
                  : 'border-outline-variant text-on-surface-variant hover:text-on-surface hover:border-outline'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Catalog */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-masonry-gap space-y-masonry-gap">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin">sync</span>
          </div>
        ) : filteredGear.length === 0 ? (
          <div className="break-inside-avoid col-span-full text-center py-12 border border-dashed border-outline-variant/30">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">inventory_2</span>
            <p className="font-mono-technical text-xs text-on-surface-variant uppercase">{t('empty')}</p>
          </div>
        ) : (
          filteredGear.map((product, idx) => (
            <article key={product.id} className="break-inside-avoid flex flex-col border border-outline-variant/20 bg-[#0D0D0D] relative group hover:border-primary transition-colors">
              <div className="absolute top-2 left-2 z-10 border border-outline bg-[#0D0D0D] px-2 py-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-primary">{getCategoryIcon(product.category)}</span>
                <span className="font-mono-technical text-mono-technical text-primary uppercase">{product.category}</span>
              </div>
              
              <div className="relative w-full pt-[100%] overflow-hidden border-b border-outline-variant/20 bg-white">
                <TiendaProductImage src={product.imageUrl} alt={product.title} priority={idx < 3} />
              </div>
              
              <div className="p-6 flex flex-col gap-4 flex-grow">
                <h3 className="font-headline-lg text-headline-lg text-on-surface leading-tight group-hover:text-primary transition-colors pb-2">{locale === 'en' ? (product.title_en || product.title) : locale === 'pt' ? (product.title_pt || product.title) : product.title}</h3>
                
                <div 
                  className="font-body-md text-body-md text-on-surface-variant text-sm break-words overflow-hidden w-full [&_p]:mb-2 [&_p:last-child]:mb-0" 
                  dangerouslySetInnerHTML={{ __html: locale === 'en' ? (product.desc_en || product.desc) : locale === 'pt' ? (product.desc_pt || product.desc) : product.desc }}
                />
                
                <a 
                  href={product.externalUrl} 
                  target="_blank" 
                  rel="noreferrer nofollow"
                  className="mt-4 w-full font-label-sm text-label-sm uppercase py-4 border transition-all flex items-center justify-center gap-2 bg-primary-container hover:bg-inverse-primary text-on-surface border-transparent hover:border-primary"
                >
                  <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                  {t('viewAmazon')}
                </a>
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
