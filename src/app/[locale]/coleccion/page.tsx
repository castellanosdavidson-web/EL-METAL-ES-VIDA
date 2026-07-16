"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function ColeccionPage() {
  const t = useTranslations('Home'); // Reusing Home translations or standard ones
  const [cds, setCds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCdId, setActiveCdId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          const filteredCds = data.filter((a: any) => a.type === 'cd' && !a.is_hidden);
          setCds(filteredCds);
          if (filteredCds.length > 0) {
            setActiveCdId(filteredCds[0].id);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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

  const activeCd = displayCds.find(cd => cd.id === activeCdId) || displayCds[0];
  const isActiveTailwind = activeCd?.spineColor.startsWith('bg-');
  const activeShadowColor = isActiveTailwind ? 'rgba(255,255,255,0.2)' : activeCd?.spineColor;

  // Chunk CDs into shelves of 12
  const cdsPerShelf = 12;
  const shelves = [];
  for (let i = 0; i < displayCds.length; i += cdsPerShelf) {
    shelves.push(displayCds.slice(i, i + cdsPerShelf));
  }

  return (
    <main className="pt-[96px] sm:pt-[88px] min-h-screen bg-black">
      {/* Header */}
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 border-b-2 border-surface-container-highest">
        <div className="flex items-center gap-3 mb-2">
          <span className="material-symbols-outlined text-primary">library_music</span>
          <span className="font-label-technical text-label-technical text-on-surface-variant uppercase">Arsenal</span>
        </div>
        <h1 className="text-headline-xl md:text-display-lg font-display-lg uppercase text-on-surface leading-tight">
          La Gran Biblioteca
        </h1>
        <p className="font-body-lg text-on-surface-variant max-w-3xl mt-4">
          Explora la colección completa de discos. Pasea por los estantes y descubre las joyas del metal.
        </p>
      </div>

      <div className="max-w-[1920px] mx-auto w-full flex flex-col lg:flex-row relative">
        
        {/* LEFT PANEL: The Shelves */}
        <div className="w-full lg:w-[70%] p-4 md:p-8 bg-black z-10">
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <span className="material-symbols-outlined text-5xl text-primary animate-spin">sync</span>
            </div>
          ) : shelves.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-white/20">
              <span className="material-symbols-outlined text-5xl text-white/40 mb-4">album</span>
              <p className="font-mono-technical uppercase text-white/60">No hay CDs en la colección aún.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-12 md:gap-16">
              {shelves.map((shelfCds, shelfIdx) => (
                <div key={shelfIdx} className="relative w-full">
                  
                  {/* Shelf Background/Texture */}
                  <div className="absolute inset-0 shadow-[inset_0_40px_100px_rgba(0,0,0,1)] z-0 pointer-events-none border-4 border-[#1a1a1a] rounded-sm">
                    <div className="absolute inset-0 opacity-40 mix-blend-screen" 
                         style={{ 
                           backgroundImage: 'repeating-linear-gradient(45deg, #111 25%, transparent 25%, transparent 75%, #111 75%, #111), repeating-linear-gradient(45deg, #111 25%, #222 25%, #222 75%, #111 75%, #111)',
                           backgroundPosition: '0 0, 4px 4px',
                           backgroundSize: '8px 8px'
                         }}>
                    </div>
                  </div>

                  {/* Wood/Metal Base of Shelf */}
                  <div className="absolute bottom-0 left-0 right-0 h-6 bg-[#0a0a0a] border-t-2 border-white/10 shadow-[0_-5px_15px_rgba(0,0,0,0.8)] z-10"></div>

                  {/* Shelf Content (CDs) */}
                  <div className="relative z-20 flex items-end min-h-[300px] pt-10 px-4 md:px-8 pb-4 overflow-x-auto hide-scrollbar">
                    {shelfCds.map((cd, index) => {
                      const isTailwindClass = cd.spineColor.startsWith('bg-');
                      const spineStyle = isTailwindClass ? {} : { backgroundColor: cd.spineColor };
                      const spineClasses = isTailwindClass ? cd.spineColor : '';

                      const isTailwindText = cd.textColor.startsWith('text-');
                      const textStyle = isTailwindText ? {} : { color: cd.textColor };
                      const textClasses = isTailwindText ? cd.textColor : '';
                      
                      const tilt = (index % 5 === 0) ? '-rotate-[1deg]' : (index % 7 === 0) ? 'rotate-[1deg]' : '';
                      const isSelected = activeCdId === cd.id;

                      return (
                        <Link 
                          href={`/articulo/${cd.slug}`}
                          key={cd.id}
                          className={`relative group perspective-[1000px] z-30 shrink-0 transition-all duration-500 origin-bottom ${tilt} mx-[1px] ${isSelected ? 'z-[99999] scale-y-105 -translate-y-2' : 'hover:z-[9999] hover:-translate-y-2'} block`}
                          onMouseEnter={() => setActiveCdId(cd.id)}
                          onClick={() => setActiveCdId(cd.id)}
                        >
                          <div
                            className={`
                              block w-[24px] md:w-[30px] h-[260px] md:h-[280px]
                              transform transition-all duration-300 ease-out origin-bottom
                              cursor-pointer flex flex-col justify-between shadow-[2px_0_10px_rgba(0,0,0,0.8)]
                              relative rounded-t-[1px]
                              ${isSelected ? 'shadow-[0_20px_40px_rgba(0,0,0,1)] brightness-110' : ''}
                            `}
                          >
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
                                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform -rotate-90 whitespace-nowrap font-mono-technical tracking-normal text-[10px] md:text-[11px] ${textClasses} uppercase w-[220px] md:w-[250px] max-w-[220px] md:max-w-[250px] text-center text-ellipsis overflow-hidden z-0`}
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
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* RIGHT PANEL: Sticky Active CD Viewer */}
        <div className="w-full lg:w-[30%] bg-[#080808] border-l border-white/10 shadow-[inset_15px_0_30px_rgba(0,0,0,0.9)] relative z-20">
          <div className="lg:sticky lg:top-[88px] w-full min-h-[400px] lg:h-[calc(100vh-88px)] flex flex-col items-center justify-center p-8">
            
            {activeCd ? (
              <div className="w-full flex flex-col items-center animate-fade-in">
                {/* Estuche del CD */}
                <div 
                  className="w-full max-w-[350px] aspect-[2/1] bg-[#050505] border border-white/20 rounded-sm mb-8 transition-all duration-300"
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
                            className="object-cover rounded-full mix-blend-overlay opacity-80"
                          />
                        )}
                        <div className="w-[30%] aspect-square rounded-full bg-[#050505] border-[2px] border-zinc-700 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] flex items-center justify-center relative z-10">
                           <div className="w-[15%] aspect-square rounded-full bg-transparent border-[1px] border-white/10 shadow-[0_0_2px_rgba(0,0,0,0.5)]"></div>
                        </div>
                        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0.3)_30deg,transparent_60deg,transparent_180deg,rgba(255,255,255,0.3)_210deg,transparent_240deg)] pointer-events-none"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center px-4 w-full">
                  <div className="inline-block bg-surface-container border border-outline-variant px-3 py-1 mb-4 font-label-technical text-label-technical text-primary uppercase tracking-[0.2em]">
                    SELECCIONADO
                  </div>
                  <h3 className="text-headline-lg font-headline-lg text-on-surface uppercase mb-2 leading-tight drop-shadow-lg">{activeCd.title}</h3>
                  <p className="font-body-lg text-on-surface-variant uppercase tracking-widest">{activeCd.artist}</p>
                  
                  <div className="mt-8">
                    <Link href={`/articulo/${activeCd.slug}`} className="group inline-flex items-center gap-2 bg-primary text-white hover:bg-white hover:text-primary transition-all px-8 py-4 font-label-technical text-label-technical uppercase tracking-widest border-2 border-primary hover:border-white">
                      ESCUCHAR AHORA
                      <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">play_arrow</span>
                    </Link>
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center opacity-30">
                <span className="material-symbols-outlined text-6xl mb-4">touch_app</span>
                <p className="font-mono-technical uppercase">Selecciona un álbum de la estantería</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
