import React from 'react';
import Image from 'next/image';

const PRODUCTS = [
  {
    id: 1,
    name: "CHALECO 'ARCHIVIST'",
    price: "180.000 COP",
    tag: "SOLO 50 UNIDADES",
    tagIcon: "warning",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwfVPiDaTvyb9SnS3_fwFizZMRcwouSdMJ3soIyiO8i9NNF0TUz_VFxTwPsDi5Twj2meKGbgAIYilr4UlLkluCdUzOOrvebC4TxdA3YRXdmZHzBpzQ90sFa-n3Z2dhcpZYdpOEWL84jBtZHyUKKFxKHHCiH6wPM6rk9Ac-Ao32fvseO6NPyTmOKIH3N2qbNqM2Rr23ukQZpPCx2vszuuoRao-ipwDLQ1lqJ0K8dCbg7rAkGmNDd971B7yjuT459qhXPSwNopRD_g",
    desc: "Denim pesado 14oz. Incluye set base de parches técnicos. Construcción de grado militar.",
    stripeLink: "#", // Aquí pondremos el Payment Link de Stripe
  },
  {
    id: 2,
    name: "CAMISETA DIAGRAMA",
    price: "60.000 COP",
    sizes: ["S", "M", "L", "XL"],
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAl_h6mRmYEsNtmUVv_GbGBTyOAyk0iGVJwcS0hFbnEB7EqnPJ5QAwaOL1-v-L5gOtEAdoRToOdy7MFpkNBOpWGKVvfhRks8DojLczTQficmkX9NHWHKcSnSJXLDkRYKljL0TmKWO2f9cs-65pVDkjvytzQzwqFMVmhkjjRQNfS3bsX3k874Md8Yqk3z8gUbgB2kFXk4oupK81XUINglxWVpWgD-q8ndsdVKopX4v7epY3fn4I-J5l2VVjpL48I4JHyIGMY5QroLw",
    desc: "Algodón pesado 220g. Estampado en serigrafía anticorrosiva de diagrama técnico.",
    stripeLink: "#",
  },
  {
    id: 3,
    name: "PIN METÁLICO 'NÚCLEO'",
    price: "25.000 COP",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVcuMkGn9vyDc8usx4wwZR30a2cXDvEg8LwOunTkZItF-7kpxgfIyDEofyU0lNXqArch76pCvIAe5-i1Lfhh0lfxIcNGFjJiA8Tz3DlR_r6gXSEt79P3OEswHuJE6dPA3YIyPX73tMvDVGmbKpfFzICBCKX9MishgqFa77L4-fjPyKTgmP9oL9SCFlRlFWn1_1b_4o4ulXj2Ie0knZ-BdssMSlLTKCeWYSBTC90J6BhNQDj3P77UisWC0gYwpl64u1JmzC6OMH6A",
    desc: "Aleación de zinc, acabado esmalte rojo sangre. Cierre de seguridad tipo militar.",
    stripeLink: "#",
  },
  {
    id: 4,
    name: "POSTER 'SUBGÉNEROS'",
    price: "40.000 COP",
    tag: "RESERVADO",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9z65bHthzdLlEVBjmt0kX7I7DhWCFoLs_LlOPybk9IifFaFKaGzMMHhy974QHtFh-vHjrzYZGbnIQLtYIGJHl9ULQR2mhbugHXSSRxDYfatlw_jCJ-M320X8b2FM3T6e9SeqJSmRHr3r3Y7-Erz1D4UDvjaqBvEjljv7JO8CcJM98lP0h3mGc5mWH4zdVc53hXfKoCuStk-HyW-cRzkXaU5sAJug31EZtzr4ns3yX5dM0nAQkqJ8NMCK_jLGg7-KDb-JOKEf9Xw",
    desc: "Impresión en papel de archivo 300g. 50x70cm. Mapa de la evolución sónica del metal.",
    stripeLink: "#",
    soldOut: true,
  }
];

export default function TiendaPage() {
  return (
    <main className="flex-grow pt-[80px] pb-stack-loose w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
      {/* Hero Section */}
      <section className="py-stack-loose text-center border-b border-outline-variant/20 mb-stack-loose">
        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-stack-tight text-on-surface">
          Tu Chaleco es tu Historia.
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
          Merch oficial, ediciones limitadas y artefactos técnicos para quienes entienden el código. Equipamiento diseñado con precisión brutalista. Adquisición directa a través del sistema global de pagos.
        </p>
      </section>

      {/* Category Navigation */}
      <nav className="sticky top-[64px] z-40 bg-background/95 backdrop-blur py-stack-tight border-b border-outline-variant/20 mb-gutter overflow-x-auto no-scrollbar">
        <div className="flex gap-gutter px-2">
          <button className="px-4 py-2 bg-primary-container text-on-primary-container font-label-sm text-label-sm uppercase tracking-widest whitespace-nowrap border-2 border-primary-container">
            Todos
          </button>
          <button className="px-4 py-2 border border-outline-variant text-on-surface-variant hover:text-on-surface hover:border-outline font-label-sm text-label-sm uppercase tracking-widest whitespace-nowrap transition-colors">
            Apparel
          </button>
          <button className="px-4 py-2 border border-outline-variant text-on-surface-variant hover:text-on-surface hover:border-outline font-label-sm text-label-sm uppercase tracking-widest whitespace-nowrap transition-colors">
            Hardware (Patches, Pins)
          </button>
        </div>
      </nav>

      {/* Product Catalog */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-masonry-gap space-y-masonry-gap">
        {PRODUCTS.map((product) => (
          <article key={product.id} className="break-inside-avoid flex flex-col border border-outline-variant/20 bg-[#0D0D0D] relative group hover:border-outline transition-colors">
            {/* Tag */}
            {product.tag && (
              <div className={`absolute top-2 left-2 z-10 border px-2 py-1 flex items-center gap-1 ${product.soldOut ? 'border-outline-variant bg-surface' : 'border-outline bg-[#0D0D0D]'}`}>
                {product.tagIcon && <span className="material-symbols-outlined text-primary text-[14px]">{product.tagIcon}</span>}
                <span className={`font-mono-technical text-mono-technical ${product.soldOut ? 'text-on-surface-variant' : 'text-primary'}`}>{product.tag}</span>
              </div>
            )}
            
            <div className={`relative w-full pt-[125%] overflow-hidden border-b border-outline-variant/20 ${product.soldOut ? 'opacity-70 grayscale' : 'bg-surface-container'}`}>
              <Image 
                src={product.img} 
                alt={product.name} 
                fill
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
              />
            </div>
            
            <div className={`p-4 flex flex-col gap-2 ${product.soldOut ? 'opacity-70' : ''}`}>
              <div className="flex justify-between items-start">
                <h3 className="font-headline-md text-headline-md text-on-surface leading-tight">{product.name}</h3>
                <span className="font-mono-technical text-mono-technical text-primary mt-1">{product.price}</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm line-clamp-2">{product.desc}</p>
              
              {product.sizes && (
                <div className="flex gap-2 mt-2">
                  {product.sizes.map(size => (
                    <span key={size} className="border border-outline px-2 py-0.5 font-label-sm text-[10px] text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer">{size}</span>
                  ))}
                </div>
              )}

              <a 
                href={product.stripeLink} 
                target="_blank" 
                rel="noreferrer"
                className={`mt-4 w-full font-label-sm text-label-sm uppercase py-3 border transition-all flex items-center justify-center gap-2 ${
                  product.soldOut 
                    ? 'border-outline-variant text-on-surface-variant cursor-not-allowed' 
                    : 'bg-primary-container hover:bg-inverse-primary text-on-surface border-transparent hover:border-primary'
                }`}
                onClick={(e) => product.soldOut && e.preventDefault()}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {product.soldOut ? 'block' : 'shopping_cart'}
                </span>
                {product.soldOut ? 'AGOTADO' : 'COMPRAR AHORA (STRIPE)'}
              </a>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
