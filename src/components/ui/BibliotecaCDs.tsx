"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function BibliotecaCDs({ cds = [] }: { cds?: any[] }) {
  const t = useTranslations('Home');
  const [activeCdId, setActiveCdId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const displayCds: any[] = cds.map((cd: any) => ({
    id: cd.id,
    title: cd.title,
    artist: cd.artist || 'Unknown Artist',
    cover: cd.imageUrl || cd.cover || 'https://dxmaslijicgzrwfmzkuv.supabase.co/storage/v1/object/public/articles/1783486070494.png',
    cdImageUrl: cd.cdImageUrl || null,
    slug: cd.slug || cd.id,
    spineColor: cd.spineColor || '#27272a',
    textColor: cd.textColor || '#d4d4d8'
  }));

  // Inicializar el CD activo con el elemento más reciente (el primero)
  useEffect(() => {
    if (displayCds.length > 0 && !activeCdId) {
      setActiveCdId(displayCds[0].id);
    }
  }, [displayCds, activeCdId]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 250; // Scroll amount in pixels
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (displayCds.length === 0) {
    return null;
  }

  const activeCd = displayCds.find(cd => cd.id === activeCdId) || displayCds[0];
  const isActiveTailwind = activeCd?.spineColor.startsWith('bg-');
  const activeShadowColor = isActiveTailwind ? 'rgba(255,255,255,0.2)' : activeCd?.spineColor;

  return (
    <div className="w-full relative py-12 px-0 md:px-margin-desktop max-w-container-max mx-auto z-10 mt-8">
      
      {/* Encabezado */}
      <div className="flex justify-between items-end mb-8 border-b-2 border-surface-container-highest pb-4 px-margin-mobile md:px-0">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-primary">album</span>
            <span className="font-label-technical text-label-technical text-on-surface-variant">{t('coleccionLabel')}</span>
          </div>
          <h2 className="text-headline-lg font-headline-lg uppercase text-on-surface">{t('nuevosLanzamientos')}</h2>
        </div>
      </div>

      {/* Estructura del Gabinete Amplificador (El Estante) */}
      <div className="relative shadow-2xl rounded-sm md:rounded-xl mx-2 md:mx-0 bg-black border-4 md:border-8 border-[#1a1a1a] shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-20 flex flex-col md:flex-row overflow-hidden">
        
        {/* TEXTURA GLOBAL DEL GABINETE */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 shadow-[inset_0_40px_100px_rgba(0,0,0,1)] z-0"></div>
          <div className="absolute inset-0 opacity-40 mix-blend-screen" 
               style={{ 
                 backgroundImage: 'repeating-linear-gradient(45deg, #111 25%, transparent 25%, transparent 75%, #111 75%, #111), repeating-linear-gradient(45deg, #111 25%, #222 25%, #222 75%, #111 75%, #111)',
                 backgroundPosition: '0 0, 4px 4px',
                 backgroundSize: '8px 8px'
               }}>
          </div>
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white/10 to-transparent z-0"></div>
        </div>

        {/* PANEL IZQUIERDO: ESTANTERÍA DE CDS (70%) */}
        <div className="relative w-full md:w-[65%] lg:w-[70%] pt-6 md:pt-10 pb-4 md:pb-6 border-b md:border-b-0 md:border-r border-white/10 z-10 flex flex-col justify-end">
          
          {/* Repisa (Donde se apoyan los CDs) */}
          <div className="absolute bottom-0 left-0 right-0 h-4 md:h-6 bg-[#0a0a0a] border-t-2 border-white/10 shadow-[0_-5px_15px_rgba(0,0,0,0.8)] z-10"></div>

          {/* Contenedor Flex de CDs */}
          <div 
            ref={scrollContainerRef}
            className="relative z-20 flex items-end min-h-[290px] md:min-h-[340px] pt-10 gap-0 md:gap-px px-4 md:px-6 pb-2 md:pb-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar"
          >
            
            {displayCds.map((cd, index) => {
              const isTailwindClass = cd.spineColor.startsWith('bg-');
              const spineStyle = isTailwindClass ? {} : { backgroundColor: cd.spineColor };
              const spineClasses = isTailwindClass ? cd.spineColor : '';

              const isTailwindText = cd.textColor.startsWith('text-');
              const textStyle = isTailwindText ? {} : { color: cd.textColor };
              const textClasses = isTailwindText ? cd.textColor : '';
              
              const tilt = (index % 5 === 0) ? '-rotate-[1deg]' : (index % 7 === 0) ? 'rotate-[1deg]' : '';
              // Hacemos los CDs más altos dentro del mismo espacio (relativo a la altura del contenedor)
              const height = 'h-[250px] md:h-[300px]';
              const isSelected = activeCdId === cd.id;

              return (
                <div 
                  key={cd.id}
                  className={`relative group perspective-[1000px] z-30 shrink-0 snap-center transition-all duration-500 origin-bottom ${tilt} mx-[1px] ${isSelected ? 'z-[99999] scale-y-105 -translate-y-2' : 'hover:z-[9999] hover:-translate-y-2'}`}
                  onMouseEnter={() => setActiveCdId(cd.id)}
                  onClick={() => setActiveCdId(cd.id)}
                >
                  <div
                    className={`
                      block w-[22px] md:w-[26px] ${height}
                      transform transition-all duration-300 ease-out origin-bottom
                      cursor-pointer flex flex-col justify-between shadow-[2px_0_10px_rgba(0,0,0,0.8)]
                      relative rounded-t-[1px]
                      ${isSelected ? 'shadow-[0_20px_40px_rgba(0,0,0,1)] brightness-110' : ''}
                    `}
                  >
                    {/* Indicador superior de CD seleccionado */}
                    {isSelected && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-t-[6px] border-t-primary border-r-[4px] border-r-transparent animate-bounce"></div>
                    )}

                    <div className="h-[4px] md:h-[5px] w-full bg-gradient-to-b from-white/40 to-white/10 border-b border-black/40 z-20"></div>
                    
                    <div 
                      className={`flex-1 w-full relative overflow-hidden flex items-center justify-center ${spineClasses}`}
                      style={spineStyle}
                    >
                      <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-r from-white/50 to-transparent z-10 pointer-events-none"></div>
                      <div className="absolute inset-y-0 right-0 w-[3px] bg-gradient-to-l from-black/80 to-black/30 z-10 pointer-events-none border-l border-black/50"></div>
                      <div className="absolute top-0 left-0 right-0 h-[8px] bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-10"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-[8px] bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-10"></div>

                      <div 
                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform -rotate-90 whitespace-nowrap font-mono-technical tracking-normal text-[9px] md:text-[10px] ${textClasses} uppercase w-[200px] md:w-[230px] max-w-[200px] md:max-w-[230px] text-center text-ellipsis overflow-hidden z-0`}
                        style={textStyle}
                      >
                        <span className="font-black">{cd.artist}</span> 
                        <span className="mx-2 opacity-50">/</span> 
                        <span className="opacity-90">{cd.title}</span>
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none z-20"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-[300%] -translate-x-[200%] group-hover:animate-[shine_1s_ease-in-out] pointer-events-none z-20"></div>
                    </div>

                    <div className="h-[4px] md:h-[5px] w-full bg-gradient-to-t from-white/30 to-white/10 border-t border-black/40 z-20"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PANEL DERECHO: EXHIBICIÓN DEL CD (30%) */}
        <div className="relative w-full md:w-[35%] lg:w-[30%] bg-[#080808] z-10 flex flex-col items-center justify-center p-6 md:p-8 shadow-[inset_15px_0_30px_rgba(0,0,0,0.9)] min-h-[300px] md:min-h-[280px]">
          
          {activeCd && (
            <div className="w-full flex flex-col items-center animate-fade-in">
              
              {/* Estuche del CD */}
              <div 
                className="w-full max-w-[320px] aspect-[2/1] bg-[#050505] border border-white/20 rounded-sm mb-6 transition-all duration-300"
                style={{
                  boxShadow: `0 10px 40px -10px ${activeShadowColor}`
                }}
              >
                <div className="flex w-full h-full p-[2px] gap-[2px] relative bg-gradient-to-b from-white/10 to-transparent">
                  <div className="absolute top-[10%] left-[3px] w-[6px] h-[15%] bg-white/30 rounded-r-sm z-20 shadow-sm"></div>
                  <div className="absolute bottom-[10%] left-[3px] w-[6px] h-[15%] bg-white/30 rounded-r-sm z-20 shadow-sm"></div>

                  {/* Portada */}
                  <div className="w-1/2 h-full relative bg-[#111] border-r-2 border-black overflow-hidden group/case">
                    <Image 
                      src={activeCd.cover} 
                      alt={activeCd.title} 
                      fill 
                      sizes="(max-width: 768px) 160px, 200px"
                      className="object-cover opacity-100 group-hover/case:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/20 pointer-events-none mix-blend-overlay"></div>
                    <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-black/60 to-transparent pointer-events-none"></div>
                  </div>

                  {/* Disco */}
                  <div className="w-1/2 h-full relative bg-[#090909] flex items-center justify-center overflow-hidden border-l border-white/10 shadow-[inset_10px_0_20px_rgba(0,0,0,0.8)]">
                    <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-black to-transparent pointer-events-none"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-black to-transparent pointer-events-none"></div>

                    <div className="w-[90%] aspect-square rounded-full bg-gradient-to-br from-zinc-800 via-zinc-400 to-zinc-900 border-[1px] border-zinc-500 shadow-[inset_0_0_20px_rgba(0,0,0,0.9),0_10px_20px_rgba(0,0,0,0.5)] flex items-center justify-center relative animate-[spin_4s_linear_infinite] overflow-hidden">
                      {activeCd.cdImageUrl && (
                        <Image 
                          src={activeCd.cdImageUrl} 
                          alt={`Disco de ${activeCd.title}`}
                          fill
                          sizes="(max-width: 768px) 160px, 200px"
                          className="object-cover opacity-90 mix-blend-hard-light"
                        />
                      )}

                      <div className="w-[20%] aspect-square bg-[#090909] rounded-full border-4 border-white/20 shadow-[inset_0_0_5px_rgba(0,0,0,1)] relative z-10 flex items-center justify-center">
                         <div className="w-[40%] aspect-square rounded-full bg-transparent border border-white/10"></div>
                      </div>

                      <div className="absolute inset-0 rounded-full opacity-30 mix-blend-color-dodge pointer-events-none" style={{
                        background: 'conic-gradient(from 0deg at 50% 50%, rgba(255,0,0,0) 0%, rgba(255,154,0,0.5) 10%, rgba(208,222,33,0.5) 20%, rgba(79,220,74,0.5) 30%, rgba(63,218,216,0.5) 40%, rgba(47,201,226,0.5) 50%, rgba(28,127,238,0.5) 60%, rgba(95,21,242,0.5) 70%, rgba(186,12,248,0.5) 80%, rgba(251,7,217,0.5) 90%, rgba(255,0,0,0) 100%)'
                      }}></div>
                      
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.8)_100%)] pointer-events-none z-20"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Título de Exhibición */}
              <div className="text-center mb-6 w-full px-2">
                <span className="font-label-technical text-[10px] text-primary tracking-widest uppercase mb-1 block">{t('cdSeleccionado')}</span>
                <h3 className="font-headline-sm uppercase text-on-surface truncate w-full">{activeCd.title}</h3>
                <p className="font-body-sm text-on-surface-variant truncate w-full">{activeCd.artist}</p>
              </div>

              {/* Botón Acceder a la reseña */}
              <Link 
                href={`/articulo/${activeCd.slug}`}
                className="w-full relative group/btn overflow-hidden border border-primary/50 bg-surface-container hover:bg-primary-container transition-colors duration-300 py-3 flex items-center justify-center shadow-lg"
              >
                <div className="absolute inset-0 bg-primary opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
                <span className="font-label-technical text-xs tracking-widest text-primary group-hover/btn:text-white uppercase flex items-center gap-2 relative z-10 transition-colors">
                  <span className="material-symbols-outlined text-[16px]">headphones</span>
                  {t('cdAccederResena')}
                </span>
                
                {/* Animación de escáner */}
                <div className="absolute top-0 left-0 w-2 h-full bg-primary/40 -translate-x-full group-hover/btn:animate-[scan_1s_ease-in-out_infinite] z-0 filter blur-sm"></div>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <div 
        className="md:hidden flex justify-center mt-6 text-on-surface-variant font-mono-technical text-[9px] uppercase tracking-widest gap-2 items-center opacity-70 cursor-pointer hover:opacity-100 transition-opacity"
        onClick={() => handleScroll('right')}
      >
        <span 
          className="material-symbols-outlined text-[12px] p-2 -m-2" 
          onClick={(e) => { e.stopPropagation(); handleScroll('left'); }}
        >
          swipe_left
        </span>
        <span className="select-none">{t('cdDeslizaExplorar')}</span>
        <span className="material-symbols-outlined text-[12px] p-2 -m-2">swipe_right</span>
      </div>
    </div>
  );
}
