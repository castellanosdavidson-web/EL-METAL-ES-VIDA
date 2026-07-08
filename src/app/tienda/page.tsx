"use client";
import React, { useState, useEffect } from 'react';

export default function TiendaPage() {
  const [gear, setGear] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

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

  const filteredGear = selectedCategory === 'Todos' 
    ? gear 
    : gear.filter(item => item.category === selectedCategory);

  return (
    <main className="flex-grow pt-[160px] pb-stack-loose w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
      {/* Hero Section */}
      <section className="py-stack-loose text-center border-b border-outline-variant/20 mb-stack-loose">
        <div className="flex justify-center items-center gap-3 mb-2">
          <span className="material-symbols-outlined text-primary text-[32px]">shopping_cart</span>
        </div>
        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-stack-tight text-on-surface uppercase">
          Arsenal Recomendado
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto mb-6">
          Selección curada de equipo, instrumentos y herramientas de audio para forjar tu propio sonido extremo. 
        </p>
        
        {/* Amazon Affiliate Disclaimer */}
        <div className="inline-block border border-outline-variant/30 bg-surface-container-low p-4 text-left max-w-3xl">
          <p className="font-mono-technical text-[10px] text-on-surface-variant uppercase tracking-widest flex items-start gap-2">
            <span className="material-symbols-outlined text-[14px] text-primary">info</span>
            <span>
              <strong>Divulgación de Afiliados:</strong> Al hacer clic en los enlaces de los productos, serás redirigido a Amazon. Si realizas una compra, "El Metal es Vida" puede recibir una pequeña comisión sin costo adicional para ti. Esto ayuda a mantener vivo el proyecto.
            </span>
          </p>
        </div>
      </section>

      {/* Category Navigation */}
      <nav className="sticky top-[80px] z-40 bg-background/95 backdrop-blur py-4 border-b border-outline-variant/20 mb-8 overflow-x-auto no-scrollbar">
        <div className="flex gap-4 px-2">
          {categories.map((cat: any) => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 font-label-sm text-label-sm uppercase tracking-widest whitespace-nowrap transition-colors border ${
                selectedCategory === cat 
                  ? 'bg-primary-container text-on-primary-container border-primary-container' 
                  : 'border-outline-variant text-on-surface-variant hover:text-on-surface hover:border-outline'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      {/* Product Catalog */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-masonry-gap space-y-masonry-gap">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin">sync</span>
          </div>
        ) : filteredGear.length === 0 ? (
          <div className="break-inside-avoid col-span-full text-center py-12 border border-dashed border-outline-variant/30">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">inventory_2</span>
            <p className="font-mono-technical text-xs text-on-surface-variant uppercase">El arsenal está vacío por el momento.</p>
          </div>
        ) : (
          filteredGear.map((product) => (
            <article key={product.id} className="break-inside-avoid flex flex-col border border-outline-variant/20 bg-[#0D0D0D] relative group hover:border-primary transition-colors">
              <div className="absolute top-2 left-2 z-10 border border-outline bg-[#0D0D0D] px-2 py-1 flex items-center gap-1">
                <span className="font-mono-technical text-mono-technical text-primary uppercase">{product.category}</span>
              </div>
              
              <div className="relative w-full pt-[100%] overflow-hidden border-b border-outline-variant/20 bg-white">
                {product.imageUrl ? (
                  <>
                    <img 
                      src={product.imageUrl} 
                      alt={product.title} 
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling;
                        if (fallback) fallback.classList.remove('hidden');
                      }}
                      className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700 ease-out" 
                    />
                    <div className="hidden absolute inset-0 flex items-center justify-center bg-surface-container">
                      <span className="material-symbols-outlined text-on-surface-variant text-4xl">image</span>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-surface-container">
                    <span className="material-symbols-outlined text-on-surface-variant text-4xl">image</span>
                  </div>
                )}
              </div>
              
              <div className="p-6 flex flex-col gap-4 flex-grow">
                <h3 className="font-headline-lg text-headline-lg text-on-surface leading-tight group-hover:text-primary transition-colors pb-2">{product.title}</h3>
                
                <div 
                  className="font-body-md text-body-md text-on-surface-variant text-sm" 
                  dangerouslySetInnerHTML={{ __html: product.desc }}
                />
                
                <a 
                  href={product.externalUrl} 
                  target="_blank" 
                  rel="noreferrer nofollow"
                  className="mt-4 w-full font-label-sm text-label-sm uppercase py-4 border transition-all flex items-center justify-center gap-2 bg-primary-container hover:bg-inverse-primary text-on-surface border-transparent hover:border-primary"
                >
                  <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                  VER EN AMAZON
                </a>
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
