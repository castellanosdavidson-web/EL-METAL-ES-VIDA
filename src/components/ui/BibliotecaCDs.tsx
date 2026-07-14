"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function BibliotecaCDs({ cds = [] }: { cds?: any[] }) {
  const t = useTranslations('Home');
  const [hoveredCd, setHoveredCd] = useState<string | null>(null);
  const [activeMobileCd, setActiveMobileCd] = useState<string | null>(null);

  // Ya no usamos mocks. Si no hay CDs reales, simplemente devolvemos vacío o mensaje.
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

  // Auto-open middle CD on mobile for better interaction discovery
  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768 && displayCds.length > 0) {
      const middleIndex = Math.floor(displayCds.length / 2);
      setTimeout(() => {
        setActiveMobileCd(displayCds[middleIndex].id);
      }, 500);
    }
  }, [displayCds]);

  const handleInteraction = (e: React.MouseEvent, cdId: string) => {
    if (typeof window !== 'undefined' && window.matchMedia("(hover: none)").matches) {
      if (activeMobileCd !== cdId) {
        e.preventDefault();
        setActiveMobileCd(cdId);
        setHoveredCd(cdId);
      }
    }
  };

  if (displayCds.length === 0) {
    return null; // Don't show anything if there are no CDs yet
  }

  return (
    <div className="w-full relative py-12 px-0 md:px-margin-desktop max-w-container-max mx-auto z-[100] mt-8">
      
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
      <div className="relative pt-10 md:pt-16 pb-4 md:pb-8 shadow-2xl rounded-sm md:rounded-xl mx-2 md:mx-0 overflow-hidden bg-black border-4 md:border-8 border-[#1a1a1a] shadow-[inset_0_0_10px_rgba(0,0,0,1),_0_20px_50px_rgba(0,0,0,0.8)]">
        
        {/* Textura Tolex y Grill (Malla Frontal de Amplificador) */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Tolex interior shadows */}
          <div className="absolute inset-0 shadow-[inset_0_40px_100px_rgba(0,0,0,1)] z-0"></div>
          {/* Malla del amplificador (Grill cloth pattern) */}
          <div className="absolute inset-0 opacity-40 mix-blend-screen" 
               style={{ 
                 backgroundImage: 'repeating-linear-gradient(45deg, #111 25%, transparent 25%, transparent 75%, #111 75%, #111), repeating-linear-gradient(45deg, #111 25%, #222 25%, #222 75%, #111 75%, #111)',
                 backgroundPosition: '0 0, 4px 4px',
                 backgroundSize: '8px 8px'
               }}>
          </div>
          {/* Luz cenital sobre los CDs */}
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white/10 to-transparent z-0"></div>
        </div>

        {/* Repisa (Donde se apoyan los CDs) */}
        <div className="absolute bottom-0 left-0 right-0 h-4 md:h-6 bg-[#0a0a0a] border-t-2 border-white/10 shadow-[0_-5px_15px_rgba(0,0,0,0.8)] z-20"></div>

        {/* Contenedor de CDs con Scroll Horizontal en Mobile y Flex Wrap en Desktop */}
        <div className="relative z-10 flex md:flex-wrap md:justify-center items-end min-h-[350px] md:min-h-[400px] gap-1 px-4 md:px-6 pb-2 md:pb-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar">
          
          {displayCds.map((cd, index) => {
            const isTailwindClass = cd.spineColor.startsWith('bg-');
            const spineStyle = isTailwindClass ? {} : { backgroundColor: cd.spineColor };
            const spineClasses = isTailwindClass ? cd.spineColor : '';

            const isTailwindText = cd.textColor.startsWith('text-');
            const textStyle = isTailwindText ? {} : { color: cd.textColor };
            const textClasses = isTailwindText ? cd.textColor : '';
            
            // Variaciones aleatorias para realismo
            const tilt = (index % 3 === 0) ? '-rotate-[1deg]' : (index % 5 === 0) ? 'rotate-[1deg]' : '';
            const height = index % 4 === 0 ? 'h-[280px] md:h-[336px]' : index % 3 === 0 ? 'h-[290px] md:h-[348px]' : 'h-[285px] md:h-[342px]';

            return (
              <div 
                key={cd.id}
                className={`relative group perspective-[1000px] z-10 hover:z-[99999] shrink-0 snap-center transition-transform duration-500 origin-bottom ${tilt}`}
                onMouseEnter={() => setHoveredCd(cd.id)}
                onMouseLeave={() => {
                  setHoveredCd(null);
                  setActiveMobileCd(null);
                }}
              >
                <Link 
                  href={`/articulo/${cd.slug}`}
                  onClick={(e) => handleInteraction(e, cd.id)}
                  className={`
                    block w-[28px] md:w-[32px] 
                    ${spineClasses} ${height}
                    border-l border-r border-t border-white/20 bg-clip-padding
                    transform transition-all duration-300 ease-out origin-bottom
                    hover:-translate-y-4 md:hover:-translate-y-8 hover:shadow-[0_30px_50px_rgba(0,0,0,1)] hover:rotate-0
                    cursor-pointer flex items-center justify-center shadow-[-5px_0_15px_rgba(0,0,0,0.6)]
                    relative overflow-hidden rounded-t-[3px] rounded-br-[1px]
                  `}
                  style={spineStyle}
                >
                  {/* Reflejos cilíndricos del plástico del estuche (Jewel Case) */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-white/20 to-black/60 pointer-events-none"></div>
                  <div className="absolute inset-y-0 left-0 w-[2px] bg-white/40 pointer-events-none"></div>
                  <div className="absolute inset-y-0 right-0 w-[1px] bg-black/60 pointer-events-none"></div>
                  
                  {/* Brillo dinámico en hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-[300%] -translate-x-[200%] group-hover:animate-[shine_1s_ease-in-out]"></div>

                  {/* Texto del lomo ajustado */}
                  <div 
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform -rotate-90 whitespace-nowrap font-mono-technical tracking-normal text-[10px] md:text-[11px] ${textClasses} uppercase w-[250px] md:w-[300px] max-w-[250px] md:max-w-[300px] text-center text-ellipsis overflow-hidden drop-shadow-md`}
                    style={textStyle}
                  >
                    <span className="font-black">{cd.artist}</span> 
                    <span className="mx-2 opacity-50">/</span> 
                    <span className="opacity-90">{cd.title}</span>
                  </div>
                </Link>

                {/* Tooltip / Estuche de CD Abierto */}
                <Link 
                  href={`/articulo/${cd.slug}`}
                  className={`
                    absolute bottom-[115%] left-1/2 -translate-x-1/2 mb-4 
                    w-[280px] md:w-[480px] aspect-[2/1] bg-[#050505] 
                    border border-white/20 rounded-sm shadow-[0_40px_80px_rgba(0,0,0,1)]
                    transition-all duration-300 ease-out origin-bottom z-[99999]
                    ${(hoveredCd === cd.id || activeMobileCd === cd.id) ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}
                  `}
                >
                  {/* Simulación del Jewel Case Abierto */}
                  <div className="flex w-full h-full p-[2px] gap-[2px] relative bg-gradient-to-b from-white/10 to-transparent">
                    
                    {/* Pestañas de plástico del lado izquierdo */}
                    <div className="absolute top-[10%] left-[3px] w-[6px] h-[15%] bg-white/30 rounded-r-sm z-20 shadow-sm"></div>
                    <div className="absolute bottom-[10%] left-[3px] w-[6px] h-[15%] bg-white/30 rounded-r-sm z-20 shadow-sm"></div>

                    {/* Lado Izquierdo: Booklet / Portada */}
                    <div className="w-1/2 h-full relative bg-[#111] border-r-2 border-black overflow-hidden group/case">
                      <Image 
                        src={cd.cover} 
                        alt={cd.title} 
                        fill 
                        sizes="(max-width: 768px) 140px, 240px"
                        className="object-cover opacity-100 group-hover/case:scale-105 transition-transform duration-700"
                      />
                      {/* Brillo de plástico sobre la portada */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/20 pointer-events-none mix-blend-overlay"></div>
                      {/* Sombra interna tipo booklet */}
                      <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-black/60 to-transparent pointer-events-none"></div>
                    </div>

                    {/* Lado Derecho: Bandeja (Tray) y Disco */}
                    <div className="w-1/2 h-full relative bg-[#090909] flex items-center justify-center overflow-hidden border-l border-white/10 shadow-[inset_10px_0_20px_rgba(0,0,0,0.8)]">
                      
                      {/* Textura de plástico de la bandeja interior */}
                      <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-black to-transparent pointer-events-none"></div>
                      <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-black to-transparent pointer-events-none"></div>

                      {/* El CD (Disco) */}
                      <div className="w-[120px] h-[120px] md:w-[210px] md:h-[210px] rounded-full bg-gradient-to-br from-zinc-800 via-zinc-400 to-zinc-900 border-[1px] border-zinc-500 shadow-[inset_0_0_20px_rgba(0,0,0,0.9),0_10px_20px_rgba(0,0,0,0.5)] flex items-center justify-center relative spin-slow overflow-hidden group-hover/case:scale-105 transition-transform duration-700">
                        
                        {cd.cdImageUrl && (
                          <Image 
                            src={cd.cdImageUrl} 
                            alt={`Disco de ${cd.title}`}
                            fill
                            sizes="(max-width: 768px) 120px, 210px"
                            className="object-cover opacity-90 mix-blend-hard-light"
                          />
                        )}

                        {/* Agujero central del CD */}
                        <div className="w-[20px] h-[20px] md:w-[35px] md:h-[35px] bg-[#090909] rounded-full border-4 md:border-[6px] border-white/20 shadow-[inset_0_0_5px_rgba(0,0,0,1)] relative z-10 flex items-center justify-center">
                           <div className="w-[10px] h-[10px] md:w-[15px] md:h-[15px] rounded-full bg-transparent border border-white/10"></div>
                        </div>

                        {/* Efecto de arcoíris (holograma) de los CDs reales */}
                        <div className="absolute inset-0 rounded-full opacity-30 mix-blend-color-dodge pointer-events-none" style={{
                          background: 'conic-gradient(from 0deg at 50% 50%, rgba(255,0,0,0) 0%, rgba(255,154,0,0.5) 10%, rgba(208,222,33,0.5) 20%, rgba(79,220,74,0.5) 30%, rgba(63,218,216,0.5) 40%, rgba(47,201,226,0.5) 50%, rgba(28,127,238,0.5) 60%, rgba(95,21,242,0.5) 70%, rgba(186,12,248,0.5) 80%, rgba(251,7,217,0.5) 90%, rgba(255,0,0,0) 100%)'
                        }}></div>
                        
                        {/* Reflejos radiales en el CD */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.8)_100%)] pointer-events-none z-20"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Etiqueta interactiva para mobile */}
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 md:hidden text-primary font-mono-technical text-[10px] uppercase tracking-widest whitespace-nowrap bg-background/80 px-3 py-1 rounded-full border border-primary/30 backdrop-blur-sm animate-pulse">
                    Toca para reseña completa
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Scroll Hint para Mobile */}
      <div className="md:hidden flex justify-center mt-6 text-on-surface-variant font-mono-technical text-[9px] uppercase tracking-widest gap-2 items-center opacity-70">
        <span className="material-symbols-outlined text-[12px]">swipe_left</span>
        Desliza para explorar la colección
        <span className="material-symbols-outlined text-[12px]">swipe_right</span>
      </div>
    </div>
  );
}
