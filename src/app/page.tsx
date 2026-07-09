"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [articles, setArticles] = useState<any[]>([]);
  const [plugins, setPlugins] = useState<any[]>([]);
  const [gear, setGear] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);

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
          const filteredArticles = data.filter((a: any) => a.type !== 'plugin' && a.type !== 'gear' && !a.is_hidden);
          const shuffledArticles = filteredArticles
            .map((value: any) => ({ value, sort: Math.random() }))
            .sort((a: any, b: any) => a.sort - b.sort)
            .map(({ value }: any) => value);
          setArticles(shuffledArticles.slice(0, 3));

          const filteredPlugins = data.filter((a: any) => a.type === 'plugin' && !a.is_hidden);
          const shuffledPlugins = filteredPlugins
            .map((value: any) => ({ value, sort: Math.random() }))
            .sort((a: any, b: any) => a.sort - b.sort)
            .map(({ value }: any) => value);
          setPlugins(shuffledPlugins.slice(0, 3));

          const filteredGear = data.filter((a: any) => a.type === 'gear' && !a.is_hidden);
          const shuffledGear = filteredGear
            .map((value: any) => ({ value, sort: Math.random() }))
            .sort((a: any, b: any) => a.sort - b.sort)
            .map(({ value }: any) => value);
          setGear(shuffledGear.slice(0, 3));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubscribing(true);
    
    const form = e.currentTarget;
    const emailInput = form.elements.namedItem('email') as HTMLInputElement;
    const email = emailInput.value;

    try {
      await fetch('/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      // No matter if success or fail (already subscribed etc), we redirect.
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubscribing(false);
      window.open('https://fb.com/stars', '_blank');
      form.reset();
    }
  };

  return (
    <main className="pt-[88px] min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b-2 border-outline-variant bg-surface-dim">
        <div className="absolute inset-0 opacity-40 z-0">
          <div className="w-full h-full bg-cover bg-center mix-blend-overlay" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCLFAmwPfd1JptEwRrFyPW45HazQyL3Lytz87oUxEMPHcnNj5KSC_eWlmGPGlbyMfQspNmmCmmQ3tDHbPPb-uG7oizSxvLlprfT6KYbsCWdfTxm_SG82GBAacMw4UgKO_WHSfyH7CvjdBA3oWwXdY7f_slUfnk38CWHv6d34xHjlBhTRl5Yc5xpxDV9yRgdsBnFy1jNHw1k1rffvXJCXAdsF4LZcpMF92aR1iqK0noMlh2QWIQyYOgSfAkc2Sf5zKpHYPaLDtTt4g')" }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50"></div>
          <div className="absolute inset-0 opacity-20 mix-blend-soft-light" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSIjMjIyIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPjxwb2x5Z29uIHBvaW50cz0iMCwwIDQwLDAgNDAsNDAgMCw0MCIvPjwvZz48L3N2Zz4=')" }}></div>
        </div>
        <div className="relative z-10 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center pb-24">
          <div className="inline-block border border-outline-variant bg-surface-container/50 px-4 py-1 mb-6">
            <span className="font-label-technical text-label-technical text-primary tracking-[0.2em] uppercase">Inicializando Sistema. v2.4</span>
          </div>
          <h1 className="text-headline-xl md:text-display-lg font-display-lg uppercase text-on-surface leading-tight mb-6 drop-shadow-2xl max-w-5xl mx-auto glitch-target">
            NO ES RUIDO.<br/>
            <span className="text-primary-container inline-block transform hover:scale-105 transition-transform duration-300">ES HISTORIA,</span><br/>
            CIENCIA Y HERMANDAD.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-10 border-l-2 border-primary-container pl-6 text-left">
            El archivo técnico definitivo para la legión. Desglosamos la agresión sonora, documentamos el equipo y forjamos acero. 
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/archivo" className="bg-primary-container text-white border-2 border-primary-container hover:bg-background hover:text-primary transition-all duration-300 px-8 py-4 font-headline-lg text-headline-lg text-[18px] uppercase flex items-center gap-3 group relative overflow-hidden">
              <span className="relative z-10">Ingresar al Archivo</span>
              <span className="material-symbols-outlined relative z-10 group-hover:translate-x-1 transition-transform">arrow_forward</span>
              <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity"></div>
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="font-label-technical text-label-technical text-on-surface-variant text-[10px]">SCROLL</span>
          <span className="material-symbols-outlined text-primary text-xl">arrow_downward</span>
        </div>
      </section>

      {/* Expedientes Destacados (Blog) - Bento Grid */}
      <section id="expedientes" className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto border-b-2 border-outline-variant">
        <div className="flex justify-between items-end mb-12 border-b-2 border-surface-container-highest pb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-primary">folder_special</span>
              <span className="font-label-technical text-label-technical text-on-surface-variant">SECCIÓN 01</span>
            </div>
            <h2 className="text-headline-lg font-headline-lg uppercase text-on-surface">Expedientes Destacados</h2>
          </div>
          <Link href="/archivo" className="font-label-technical text-label-technical text-primary hover:underline flex items-center gap-1">
            VER TODOS <span className="material-symbols-outlined text-sm">arrow_outward</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="font-label-technical text-primary animate-pulse tracking-widest">Sincronizando Base de Datos...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-1 bg-surface-container-high border-2 border-outline-variant p-1">
            {/* Main Feature */}
            {articles[0] && (
              <Link href={articles[0].slug ? `/articulo/${articles[0].slug}` : `/articulo/${articles[0].id}`} className="md:col-span-8 bg-surface-dim relative group overflow-hidden border-t-4 border-primary-container hover:border-primary transition-colors duration-300 flex flex-col h-[500px] cursor-pointer block">
                <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity duration-500 mix-blend-luminosity" style={{ backgroundImage: `url('${articles[0].imageUrl}')` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
                <div className="relative z-10 mt-auto p-8 border-t border-surface-container-highest/50 bg-background/80 backdrop-blur-sm">
                  <div className="flex gap-2 mb-4">
                    <span className="bg-surface border border-outline-variant px-2 py-1 font-label-technical text-label-technical text-primary">HISTORIA</span>
                    <span className="bg-surface border border-outline-variant px-2 py-1 font-label-technical text-label-technical text-on-surface-variant">DOC-094</span>
                  </div>
                  <h3 className="text-headline-lg font-headline-lg uppercase text-on-surface mb-3 group-hover:text-primary transition-colors">{articles[0].title}</h3>
                  <div className="font-body-md text-body-md text-on-surface-variant max-w-2xl line-clamp-2" dangerouslySetInnerHTML={{__html: articles[0].desc}} />
                </div>
              </Link>
            )}

            {/* Secondary Features */}
            {articles[1] && (
              <Link href={articles[1].slug ? `/articulo/${articles[1].slug}` : `/articulo/${articles[1].id}`} className="md:col-span-4 bg-surface relative group overflow-hidden border-t-4 border-secondary-container hover:border-primary-container transition-colors duration-300 flex flex-col h-[500px] md:h-auto cursor-pointer block">
                <div className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-50 transition-opacity duration-500 mix-blend-luminosity" style={{ backgroundImage: `url('${articles[1].imageUrl}')` }}></div>
                <div className="relative z-10 mt-auto p-6 bg-gradient-to-t from-background to-background/20 h-full flex flex-col justify-end">
                  <span className="bg-surface border border-outline-variant px-2 py-1 font-label-technical text-label-technical text-primary w-max mb-3">CIENCIA</span>
                  <h3 className="text-headline-lg-mobile font-headline-lg uppercase text-on-surface leading-tight mb-2 group-hover:text-primary transition-colors">{articles[1].title}</h3>
                </div>
              </Link>
            )}

            {articles[2] && (
              <Link href={articles[2].slug ? `/articulo/${articles[2].slug}` : `/articulo/${articles[2].id}`} className="md:col-span-4 bg-surface p-6 border-t-4 border-secondary-container hover:border-primary-container transition-colors duration-300 flex flex-col justify-between group cursor-pointer block">
                <div>
                  <span className="font-label-technical text-label-technical text-on-surface-variant mb-4 block">RESEÑA TÉCNICA</span>
                  <h3 className="font-headline-lg text-headline-lg-mobile text-on-surface mb-3 uppercase group-hover:text-primary transition-colors">{articles[2].title}</h3>
                  <div className="font-body-md text-on-surface-variant line-clamp-3" dangerouslySetInnerHTML={{__html: articles[2].desc}} />
                </div>
                <div className="mt-6 border-t border-outline-variant pt-4 flex justify-between items-center">
                  <span className="font-label-technical text-label-technical text-on-surface-variant">LECTURA: {articles[2].readTime || '8 MIN'}</span>
                  <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </Link>
            )}

            {/* Default bottom span if we don't have enough articles or just as a static banner */}
            <article className="md:col-span-8 bg-surface-dim p-8 border-t-4 border-secondary-container hover:border-primary-container transition-colors duration-300 flex flex-col md:flex-row gap-8 items-center group">
              <div className="w-full md:w-1/3 aspect-square relative border border-outline-variant">
                <div className="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-500" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDiChJ3mMBD4wJmL7K2REU5uWXax2AN6U8ddF7VK4O8AIHqoIMxmkUN-wLOqH_9xeQv49ybYPTUEVdn-FHFujKXIoiZG71o6SfJF2jlmc64qzHWB61kxMs_qoy-J9ARmXft9sCWZTM-BoZwpAhUarkOS3MSZNUSR3EF-I_DWzD_ishN7kqLpKhvj6YYUekZkgpY9rMBv_IwMXYuZ38T1T3pmyj9DolRDIwyGhSVJ5Onjc9DYRsCtsuU3GBdwrGDgZIEgPYWiVKJNQ')" }}></div>
              </div>
              <div className="w-full md:w-2/3">
                <span className="bg-primary-container text-white px-2 py-1 font-label-technical text-label-technical mb-4 inline-block">HERMANDAD</span>
                <h3 className="font-headline-lg text-headline-lg uppercase text-on-surface mb-3 group-hover:text-primary transition-colors">Entrevista: Arquitectos del Caos</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6">Diálogo sin censura sobre las técnicas vocales extremas y la prevención de daño en las cuerdas vocales con pioneros del género.</p>
                <button className="text-primary font-label-technical text-label-technical uppercase flex items-center gap-2 hover:text-white transition-colors">
                  Acceder al Registro <span className="material-symbols-outlined text-sm">terminal</span>
                </button>
              </div>
            </article>

          </div>
        )}
      </section>

      {/* Animated Marquee Transition 1 */}
      <div className="relative w-full py-4 md:py-6 bg-surface-container-highest border-y-2 border-primary overflow-hidden z-20 shadow-[0_0_30px_rgba(var(--md-sys-color-primary),0.15)] -skew-y-2 my-6 md:my-12">
        <div className="flex w-[200%] animate-[marquee_25s_linear_infinite]">
          <div className="flex-1 flex justify-around items-center opacity-30">
            <span className="font-headline-xl text-3xl md:text-5xl uppercase tracking-widest text-primary font-black whitespace-nowrap px-4">⛧ TALLER ⛧</span>
            <span className="font-headline-xl text-3xl md:text-5xl uppercase tracking-widest text-transparent whitespace-nowrap px-4" style={{ WebkitTextStroke: '1px var(--md-sys-color-primary)' }}>DISTORSIÓN</span>
            <span className="font-headline-xl text-3xl md:text-5xl uppercase tracking-widest text-primary font-black whitespace-nowrap px-4">⛧ TALLER ⛧</span>
            <span className="font-headline-xl text-3xl md:text-5xl uppercase tracking-widest text-transparent whitespace-nowrap px-4" style={{ WebkitTextStroke: '1px var(--md-sys-color-primary)' }}>DISTORSIÓN</span>
          </div>
          <div className="flex-1 flex justify-around items-center opacity-30">
            <span className="font-headline-xl text-3xl md:text-5xl uppercase tracking-widest text-primary font-black whitespace-nowrap px-4">⛧ TALLER ⛧</span>
            <span className="font-headline-xl text-3xl md:text-5xl uppercase tracking-widest text-transparent whitespace-nowrap px-4" style={{ WebkitTextStroke: '1px var(--md-sys-color-primary)' }}>DISTORSIÓN</span>
            <span className="font-headline-xl text-3xl md:text-5xl uppercase tracking-widest text-primary font-black whitespace-nowrap px-4">⛧ TALLER ⛧</span>
            <span className="font-headline-xl text-3xl md:text-5xl uppercase tracking-widest text-transparent whitespace-nowrap px-4" style={{ WebkitTextStroke: '1px var(--md-sys-color-primary)' }}>DISTORSIÓN</span>
          </div>
        </div>
      </div>

      {/* Taller de Distorsión */}
      <section id="taller" className="py-12 md:py-16 bg-surface-dim relative overflow-hidden">
        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="border-l-4 border-primary-container pl-6 mb-12">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-primary">electric_bolt</span>
              <span className="font-label-technical text-label-technical text-on-surface-variant">SECCIÓN 02</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-headline-xl font-headline-xl uppercase text-on-surface">Taller de Distorsión</h2>
                <p className="font-body-md text-on-surface-variant mt-4 max-w-xl">Herramientas analíticas y calibración de equipo. Sólo para ingenieros del sonido pesado.</p>
              </div>
              <Link href="/taller" className="group flex items-center gap-2 text-primary hover:text-white transition-colors border border-primary hover:bg-primary px-6 py-3 font-label-technical text-label-technical uppercase tracking-widest shrink-0">
                <span className="material-symbols-outlined text-lg group-hover:animate-pulse">apps</span>
                VER TODO EL TALLER
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plugins.length > 0 ? (
              plugins.map((plugin) => (
                <div key={plugin.id} className="bg-surface border border-outline-variant hover:border-primary transition-colors group flex flex-col h-full relative overflow-hidden">
                  <Link href={plugin.slug ? `/articulo/${plugin.slug}` : `/articulo/${plugin.id}`} className="flex flex-col flex-grow">
                    {plugin.imageUrl && (
                      <div className="w-full aspect-[16/9] bg-surface-container-highest relative overflow-hidden shrink-0 border-b border-outline-variant">
                        <div className="absolute top-4 left-4 z-20 bg-surface-container-highest/90 backdrop-blur-sm border border-outline-variant px-3 py-1 flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm text-primary">{getCategoryIcon(plugin.category)}</span>
                          <span className="font-label-technical text-[10px] uppercase tracking-widest text-on-surface">{plugin.category || 'TALLER'}</span>
                        </div>
                        <img src={plugin.imageUrl} alt={plugin.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                      </div>
                    )}
                    <div className="flex flex-col flex-grow relative p-6 pb-0">
                      {!plugin.imageUrl && (
                        <>
                          <div className="absolute -right-8 -top-8 opacity-5 group-hover:opacity-10 group-hover:scale-150 transition-all duration-700 pointer-events-none">
                            <span className="material-symbols-outlined text-[120px]">{getCategoryIcon(plugin.category)}</span>
                          </div>
                          <div className="w-12 h-12 bg-surface-container-high border border-outline-variant flex items-center justify-center mb-6 group-hover:bg-primary-container transition-colors shrink-0 relative z-10">
                            <span className="material-symbols-outlined text-on-surface">{getCategoryIcon(plugin.category)}</span>
                          </div>
                        </>
                      )}
                      <h3 className="font-headline-lg text-headline-lg-mobile uppercase text-on-surface mb-2 leading-tight group-hover:text-primary transition-colors relative z-10">{plugin.title}</h3>
                      <div className="font-body-md text-on-surface-variant text-sm flex-grow line-clamp-3 relative z-10" dangerouslySetInnerHTML={{__html: plugin.desc}} />
                    </div>
                  </Link>
                  <div className="p-6 pt-4 mt-auto flex items-center justify-between gap-4 border-t border-transparent group-hover:border-outline-variant/30 transition-colors">
                    <Link href={plugin.slug ? `/articulo/${plugin.slug}` : `/articulo/${plugin.id}`} className="text-on-surface-variant hover:text-primary transition-colors font-label-technical text-[11px] uppercase tracking-widest flex items-center gap-1 group/link">
                      VER HERRAMIENTA
                      <span className="material-symbols-outlined text-[16px] group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
                    </Link>
                    <a href={plugin.externalUrl || '#'} target="_blank" rel="noopener noreferrer" className="border border-outline-variant hover:border-primary text-on-surface hover:text-primary transition-colors font-label-technical text-[10px] uppercase tracking-widest px-3 py-2 flex items-center gap-2 bg-surface-container-lowest hover:bg-primary/10">
                      ENLACE
                      <span className="material-symbols-outlined text-[14px]">exit_to_app</span>
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-1 md:col-span-3 text-center py-12 border border-dashed border-outline-variant/30">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">extension_off</span>
                <p className="font-mono-technical text-xs text-on-surface-variant uppercase">Ningún plugin ha sido cargado en el taller.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Animated Marquee Transition 2 */}
      <div className="relative w-full py-4 md:py-6 bg-surface-container-highest border-y-2 border-error overflow-hidden z-20 shadow-[0_0_30px_rgba(var(--md-sys-color-error),0.15)] skew-y-2 my-6 md:my-12">
        <div className="flex w-[200%] animate-[marquee_20s_linear_infinite_reverse]">
          <div className="flex-1 flex justify-around items-center opacity-30">
            <span className="font-headline-xl text-3xl md:text-5xl uppercase tracking-widest text-error font-black whitespace-nowrap px-4">X ARSENAL X</span>
            <span className="font-headline-xl text-3xl md:text-5xl uppercase tracking-widest text-transparent whitespace-nowrap px-4" style={{ WebkitTextStroke: '1px var(--md-sys-color-error)' }}>EQUIPAMIENTO</span>
            <span className="font-headline-xl text-3xl md:text-5xl uppercase tracking-widest text-error font-black whitespace-nowrap px-4">X ARSENAL X</span>
            <span className="font-headline-xl text-3xl md:text-5xl uppercase tracking-widest text-transparent whitespace-nowrap px-4" style={{ WebkitTextStroke: '1px var(--md-sys-color-error)' }}>EQUIPAMIENTO</span>
          </div>
          <div className="flex-1 flex justify-around items-center opacity-30">
            <span className="font-headline-xl text-3xl md:text-5xl uppercase tracking-widest text-error font-black whitespace-nowrap px-4">X ARSENAL X</span>
            <span className="font-headline-xl text-3xl md:text-5xl uppercase tracking-widest text-transparent whitespace-nowrap px-4" style={{ WebkitTextStroke: '1px var(--md-sys-color-error)' }}>EQUIPAMIENTO</span>
            <span className="font-headline-xl text-3xl md:text-5xl uppercase tracking-widest text-error font-black whitespace-nowrap px-4">X ARSENAL X</span>
            <span className="font-headline-xl text-3xl md:text-5xl uppercase tracking-widest text-transparent whitespace-nowrap px-4" style={{ WebkitTextStroke: '1px var(--md-sys-color-error)' }}>EQUIPAMIENTO</span>
          </div>
        </div>
      </div>

      {/* Arsenal */}
      <section id="arsenal" className="py-12 md:py-16 bg-background relative overflow-hidden">
        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="border-l-4 border-error pl-6 mb-12">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-error">hardware</span>
              <span className="font-label-technical text-label-technical text-on-surface-variant">SECCIÓN 03</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-headline-xl font-headline-xl uppercase text-on-surface">El Arsenal</h2>
                <p className="font-body-md text-on-surface-variant mt-4 max-w-xl">Equipamiento, hardware y enlaces de afiliados cuidadosamente seleccionados para llevar tu sonido al extremo.</p>
              </div>
              <Link href="/tienda" className="group flex items-center gap-2 text-error hover:text-white transition-colors border border-error hover:bg-error px-6 py-3 font-label-technical text-label-technical uppercase tracking-widest shrink-0">
                <span className="material-symbols-outlined text-lg group-hover:animate-pulse">grid_view</span>
                VER TODO EL ARSENAL
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {gear.length > 0 ? (
              gear.map((item) => (
                <div key={item.id} className="bg-surface-dim border border-outline-variant hover:border-error transition-colors group flex flex-col h-full relative overflow-hidden">
                  <Link href={item.slug ? `/articulo/${item.slug}` : `/articulo/${item.id}`} className="flex flex-col flex-grow">
                    {item.imageUrl && (
                      <div className="w-full aspect-[16/9] bg-surface-container-highest relative overflow-hidden shrink-0 border-b border-outline-variant">
                        <div className="absolute top-4 left-4 z-20 bg-surface-container-highest/90 backdrop-blur-sm border border-outline-variant px-3 py-1 flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm text-error">{getCategoryIcon(item.category)}</span>
                          <span className="font-label-technical text-[10px] uppercase tracking-widest text-on-surface">{item.category || 'EQUIPAMIENTO'}</span>
                        </div>
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                      </div>
                    )}
                    <div className="flex flex-col flex-grow relative p-6 pb-0">
                      {!item.imageUrl && (
                        <>
                          <div className="absolute -right-8 -top-8 opacity-5 group-hover:opacity-10 group-hover:scale-150 transition-all duration-700 pointer-events-none">
                            <span className="material-symbols-outlined text-[120px]">{getCategoryIcon(item.category)}</span>
                          </div>
                          <div className="w-12 h-12 bg-surface border border-outline-variant flex items-center justify-center mb-6 group-hover:bg-error/20 transition-colors shrink-0 relative z-10">
                            <span className="material-symbols-outlined text-on-surface">{getCategoryIcon(item.category)}</span>
                          </div>
                        </>
                      )}
                      <h3 className="font-headline-lg text-headline-lg-mobile uppercase text-on-surface mb-2 leading-tight group-hover:text-error transition-colors relative z-10">{item.title}</h3>
                      <div className="font-body-md text-on-surface-variant text-sm flex-grow line-clamp-3 relative z-10" dangerouslySetInnerHTML={{__html: item.desc}} />
                    </div>
                  </Link>
                  <div className="p-6 pt-4 mt-auto flex items-center justify-between gap-4 border-t border-transparent group-hover:border-outline-variant/30 transition-colors">
                    <Link href={item.slug ? `/articulo/${item.slug}` : `/articulo/${item.id}`} className="text-on-surface-variant hover:text-error transition-colors font-label-technical text-[11px] uppercase tracking-widest flex items-center gap-1 group/link">
                      VER HERRAMIENTA
                      <span className="material-symbols-outlined text-[16px] group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
                    </Link>
                    <a href={item.externalUrl || '#'} target="_blank" rel="noopener noreferrer" className="border border-outline-variant hover:border-error text-on-surface hover:text-error transition-colors font-label-technical text-[10px] uppercase tracking-widest px-3 py-2 flex items-center gap-2 bg-surface-container-lowest hover:bg-error/10">
                      ENLACE
                      <span className="material-symbols-outlined text-[14px]">exit_to_app</span>
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-1 md:col-span-3 text-center py-12 border border-dashed border-outline-variant/30">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">production_quantity_limits</span>
                <p className="font-mono-technical text-xs text-on-surface-variant uppercase">El arsenal está vacío por el momento.</p>
              </div>
            )}
          </div>
        </div>
      </section>

    </main>
  );
}
