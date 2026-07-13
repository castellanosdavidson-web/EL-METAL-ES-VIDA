"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

const MOCK_CDS = [
  {
    id: 'cd-1',
    title: 'Master of Puppets',
    artist: 'Metallica',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiChJ3mMBD4wJmL7K2REU5uWXax2AN6U8ddF7VK4O8AIHqoIMxmkUN-wLOqH_9xeQv49ybYPTUEVdn-FHFujKXIoiZG71o6SfJF2jlmc64qzHWB61kxMs_qoy-J9ARmXft9sCWZTM-BoZwpAhUarkOS3MSZNUSR3EF-I_DWzD_ishN7kqLpKhvj6YYUekZkgpY9rMBv_IwMXYuZ38T1T3pmyj9DolRDIwyGhSVJ5Onjc9DYRsCtsuU3GBdwrGDgZIEgPYWiVKJNQ',
    slug: 'master-of-puppets-resena',
    spineColor: '#27272a',
    textColor: '#d4d4d8'
  },
  {
    id: 'cd-2',
    title: 'Rust in Peace',
    artist: 'Megadeth',
    cover: 'https://dxmaslijicgzrwfmzkuv.supabase.co/storage/v1/object/public/articles/1783486070494.png',
    slug: 'rust-in-peace',
    spineColor: '#1e3a8a',
    textColor: '#dbeafe'
  },
  {
    id: 'cd-3',
    title: 'The Number of the Beast',
    artist: 'Iron Maiden',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLFAmwPfd1JptEwRrFyPW45HazQyL3Lytz87oUxEMPHcnNj5KSC_eWlmGPGlbyMfQspNmmCmmQ3tDHbPPb-uG7oizSxvLlprfT6KYbsCWdfTxm_SG82GBAacMw4UgKO_WHSfyH7CvjdBA3oWwXdY7f_slUfnk38CWHv6d34xHjlBhTRl5Yc5xpxDV9yRgdsBnFy1jNHw1k1rffvXJCXAdsF4LZcpMF92aR1iqK0noMlh2QWIQyYOgSfAkc2Sf5zKpHYPaLDtTt4g',
    slug: 'number-of-the-beast',
    spineColor: '#450a0a',
    textColor: '#fee2e2'
  },
  {
    id: 'cd-4',
    title: 'Paranoid',
    artist: 'Black Sabbath',
    cover: 'https://dxmaslijicgzrwfmzkuv.supabase.co/storage/v1/object/public/articles/1783486070494.png',
    slug: 'paranoid',
    spineColor: '#09090b',
    textColor: '#e9d5ff'
  },
  {
    id: 'cd-5',
    title: 'Reign in Blood',
    artist: 'Slayer',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiChJ3mMBD4wJmL7K2REU5uWXax2AN6U8ddF7VK4O8AIHqoIMxmkUN-wLOqH_9xeQv49ybYPTUEVdn-FHFujKXIoiZG71o6SfJF2jlmc64qzHWB61kxMs_qoy-J9ARmXft9sCWZTM-BoZwpAhUarkOS3MSZNUSR3EF-I_DWzD_ishN7kqLpKhvj6YYUekZkgpY9rMBv_IwMXYuZ38T1T3pmyj9DolRDIwyGhSVJ5Onjc9DYRsCtsuU3GBdwrGDgZIEgPYWiVKJNQ',
    slug: 'reign-in-blood',
    spineColor: '#7f1d1d',
    textColor: '#ffffff'
  },
  {
    id: 'cd-6',
    title: 'Painkiller',
    artist: 'Judas Priest',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLFAmwPfd1JptEwRrFyPW45HazQyL3Lytz87oUxEMPHcnNj5KSC_eWlmGPGlbyMfQspNmmCmmQ3tDHbPPb-uG7oizSxvLlprfT6KYbsCWdfTxm_SG82GBAacMw4UgKO_WHSfyH7CvjdBA3oWwXdY7f_slUfnk38CWHv6d34xHjlBhTRl5Yc5xpxDV9yRgdsBnFy1jNHw1k1rffvXJCXAdsF4LZcpMF92aR1iqK0noMlh2QWIQyYOgSfAkc2Sf5zKpHYPaLDtTt4g',
    slug: 'painkiller',
    spineColor: '#431407',
    textColor: '#ffedd5'
  },
  {
    id: 'cd-7',
    title: 'Vulgar Display of Power',
    artist: 'Pantera',
    cover: 'https://dxmaslijicgzrwfmzkuv.supabase.co/storage/v1/object/public/articles/1783486070494.png',
    slug: 'vulgar-display',
    spineColor: '#3f3f46',
    textColor: '#f4f4f5'
  }
];

const GENERATED_CDS = Array.from({ length: 28 }).map((_, i) => ({
  id: `cd-gen-${i}`,
  title: `Album ${i + 8}`,
  artist: `Artist ${i + 8}`,
  cover: i % 2 === 0 
    ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLFAmwPfd1JptEwRrFyPW45HazQyL3Lytz87oUxEMPHcnNj5KSC_eWlmGPGlbyMfQspNmmCmmQ3tDHbPPb-uG7oizSxvLlprfT6KYbsCWdfTxm_SG82GBAacMw4UgKO_WHSfyH7CvjdBA3oWwXdY7f_slUfnk38CWHv6d34xHjlBhTRl5Yc5xpxDV9yRgdsBnFy1jNHw1k1rffvXJCXAdsF4LZcpMF92aR1iqK0noMlh2QWIQyYOgSfAkc2Sf5zKpHYPaLDtTt4g'
    : 'https://dxmaslijicgzrwfmzkuv.supabase.co/storage/v1/object/public/articles/1783486070494.png',
  slug: `album-${i + 8}`,
  spineColor: i % 3 === 0 ? '#27272a' : i % 3 === 1 ? '#09090b' : '#1c1917',
  textColor: '#a1a1aa'
}));

const ALL_CDS = [...MOCK_CDS, ...GENERATED_CDS];

export default function BibliotecaCDs({ cds = [] }: { cds?: any[] }) {
  const t = useTranslations('Home');
  const [hoveredCd, setHoveredCd] = useState<string | null>(null);
  const [activeMobileCd, setActiveMobileCd] = useState<string | null>(null);

  // Mapeamos los datos para usar los reales o los de prueba
  const displayCds: any[] = cds.length > 0 ? cds.map((cd: any) => ({
    id: cd.id,
    title: cd.title,
    artist: cd.artist || 'Unknown Artist',
    cover: cd.imageUrl || cd.cover || 'https://dxmaslijicgzrwfmzkuv.supabase.co/storage/v1/object/public/articles/1783486070494.png',
    cdImageUrl: cd.cdImageUrl || null,
    slug: cd.slug,
    spineColor: cd.spineColor || '#27272a',
    textColor: cd.textColor || '#d4d4d8'
  })) : ALL_CDS;

  const handleInteraction = (e: React.MouseEvent, cdId: string) => {
    if (typeof window !== 'undefined' && window.matchMedia("(hover: none)").matches) {
      if (activeMobileCd !== cdId) {
        e.preventDefault();
        setActiveMobileCd(cdId);
        setHoveredCd(cdId);
      }
    }
  };

  return (
    <div className="w-full relative py-12 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto z-[100] mt-8">
      
      {/* Encabezado */}
      <div className="flex justify-between items-end mb-8 border-b-2 border-surface-container-highest pb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-primary">album</span>
            <span className="font-label-technical text-label-technical text-on-surface-variant">{t('coleccionLabel')}</span>
          </div>
          <h2 className="text-headline-lg font-headline-lg uppercase text-on-surface">{t('nuevosLanzamientos')}</h2>
        </div>
      </div>

      {/* Estructura del Estante / Vitrina mejorada */}
      <div className="relative pt-16 px-2 md:px-8 shadow-2xl rounded-t-xl overflow-visible">
        
        {/* Pared trasera de la vitrina (Textura industrial/metálica) */}
        <div className="absolute inset-0 bg-zinc-950 rounded-t-xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]"></div>
          {/* Luz cenital sobre los CDs */}
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white/10 to-transparent"></div>
          {/* Sombra interna para dar profundidad */}
          <div className="absolute inset-0 shadow-[inset_0_20px_50px_rgba(0,0,0,1)]"></div>
        </div>

        {/* Contenedor de CDs flex-wrap para soportar múltiples líneas de CDs */}
        <div className="relative z-10 flex flex-wrap justify-center items-end min-h-[400px] gap-[1px] px-2 md:px-6 pb-0">
          
          {displayCds.map((cd, index) => {
            const isTailwindClass = cd.spineColor.startsWith('bg-');
            const spineStyle = isTailwindClass ? {} : { backgroundColor: cd.spineColor };
            const spineClasses = isTailwindClass ? cd.spineColor : '';

            const isTailwindText = cd.textColor.startsWith('text-');
            const textStyle = isTailwindText ? {} : { color: cd.textColor };
            const textClasses = isTailwindText ? cd.textColor : '';

            return (
              <div 
                key={cd.id}
                className="relative group perspective-[1000px] z-10 hover:z-[99999]"
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
                    block w-[24px] md:w-[28px] 
                    ${spineClasses}
                    border-l-[2px] border-r-[2px] border-t-[2px] border-white/20 bg-clip-padding
                    transform transition-all duration-300 ease-out origin-bottom
                    hover:-translate-y-8 hover:shadow-[0_30px_50px_rgba(0,0,0,1)]
                    cursor-pointer flex items-center justify-center shadow-[3px_0_10px_rgba(0,0,0,0.8)]
                    relative overflow-hidden rounded-t-[2px]
                  `}
                  style={{
                    ...spineStyle,
                    height: index % 5 === 0 ? '336px' : index % 3 === 0 ? '348px' : '342px',
                  }}
                >
                  {/* Reflejos del plástico del estuche (Jewel Case) */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/5 to-transparent pointer-events-none"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-white/20 pointer-events-none"></div>
                  
                  {/* Brillo dinámico en hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-[300%] -translate-x-[200%] group-hover:animate-[shine_1s_ease-in-out]"></div>

                  {/* Texto del lomo ajustado */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div 
                      className={`transform -rotate-90 whitespace-nowrap font-mono-technical tracking-normal text-[8px] md:text-[9px] ${textClasses} uppercase w-[300px] text-center text-ellipsis overflow-hidden`}
                      style={textStyle}
                    >
                      <span className="font-black">{cd.artist}</span> 
                      <span className="mx-2 opacity-50">/</span> 
                      <span className="opacity-90">{cd.title}</span>
                    </div>
                  </div>
                </Link>

                {/* Tooltip / Estuche de CD Abierto */}
                <div 
                  className={`
                    absolute bottom-[110%] left-1/2 -translate-x-1/2 mb-4 
                    w-[320px] md:w-[480px] aspect-[2/1] bg-zinc-950 
                    border border-white/20 rounded-sm shadow-[0_40px_80px_rgba(0,0,0,1)]
                    transition-all duration-300 ease-out origin-bottom z-[99999]
                    ${hoveredCd === cd.id ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}
                  `}
                >
                  {/* Simulación del Jewel Case Abierto */}
                  <div className="flex w-full h-full p-[2px] gap-[2px] relative bg-gradient-to-b from-white/10 to-transparent">
                    
                    {/* Pestañas de plástico del lado izquierdo */}
                    <div className="absolute top-[10%] left-[3px] w-[6px] h-[15%] bg-white/30 rounded-r-sm z-20 shadow-sm"></div>
                    <div className="absolute bottom-[10%] left-[3px] w-[6px] h-[15%] bg-white/30 rounded-r-sm z-20 shadow-sm"></div>

                    {/* Lado Izquierdo: Booklet / Portada */}
                    <div className="w-1/2 h-full relative bg-zinc-900 border-r-2 border-black">
                      <Image 
                        src={cd.cover} 
                        alt={cd.title} 
                        fill 
                        sizes="(max-width: 768px) 160px, 240px"
                        className="object-cover opacity-100"
                      />
                      {/* Brillo de plástico sobre la portada */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-white/30 pointer-events-none mix-blend-overlay"></div>
                    </div>

                    {/* Lado Derecho: Bandeja (Tray) y Disco */}
                    <div className="w-1/2 h-full relative bg-[#111] flex items-center justify-center overflow-hidden border-l border-white/10">
                      
                      {/* Textura de plástico de la bandeja interior */}
                      <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-black to-transparent pointer-events-none"></div>
                      <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-black to-transparent pointer-events-none"></div>

                      {/* El CD (Disco) */}
                      <div className="w-[140px] h-[140px] md:w-[210px] md:h-[210px] rounded-full bg-gradient-to-br from-zinc-700 via-zinc-400 to-zinc-800 border-[1px] border-zinc-400 shadow-[inset_0_0_20px_rgba(0,0,0,0.8),0_10px_20px_rgba(0,0,0,0.5)] flex items-center justify-center relative spin-slow overflow-hidden">
                        
                        {cd.cdImageUrl && (
                          <Image 
                            src={cd.cdImageUrl} 
                            alt={`CD ${cd.title}`} 
                            fill 
                            sizes="(max-width: 768px) 140px, 210px"
                            className="object-cover z-0"
                          />
                        )}

                        {/* Reflejos arcoíris/metálicos del disco */}
                        <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0.6)_45deg,transparent_90deg,rgba(255,255,255,0.6)_135deg,transparent_180deg)] mix-blend-overlay pointer-events-none z-0"></div>
                        
                        {/* Pistas del CD simuladas */}
                        <div className="absolute inset-[15%] rounded-full border border-white/10 pointer-events-none"></div>
                        <div className="absolute inset-[30%] rounded-full border border-black/10 pointer-events-none"></div>
                        
                        {/* Círculo central transparente/plástico */}
                        <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-zinc-900/80 backdrop-blur-md border border-white/20 shadow-[inset_0_0_10px_rgba(0,0,0,1)] z-10 flex items-center justify-center">
                          {/* Agujero central y dientes de sujeción (Spindle) */}
                          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-black border-[4px] border-zinc-700 flex items-center justify-center relative shadow-lg">
                            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-transparent border border-white/40"></div>
                            {/* Dientes del spindle (simulados con border-dashed) */}
                            <div className="absolute inset-[2px] rounded-full border-[3px] border-dashed border-zinc-400/70"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Indicador para mobile */}
                    {activeMobileCd === cd.id && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-primary text-background px-6 py-2 text-[10px] font-label-technical tracking-widest uppercase animate-pulse shadow-2xl whitespace-nowrap z-30 border border-primary-container">
                        {t('tocaParaLeer')}
                      </div>
                    )}

                  </div>
                  
                  {/* Flecha del tooltip apuntando al CD */}
                  <div className="absolute -bottom-[10px] left-1/2 -translate-x-1/2 border-l-[10px] border-l-transparent border-t-[10px] border-t-zinc-950 border-r-[10px] border-r-transparent filter drop-shadow-[0_10px_10px_rgba(0,0,0,1)]"></div>
                </div>
              </div>
            );
          })}
          
        </div>

        {/* Base de la repisa (Estante Metálico) */}
        <div className="relative z-20 h-10 w-full bg-gradient-to-b from-zinc-700 to-zinc-900 border-t-2 border-white/20 shadow-[0_30px_60px_rgba(0,0,0,1)] rounded-b-md flex flex-col justify-start -mx-4 md:-mx-12 px-4 md:px-12" style={{ width: 'calc(100% + 2rem)' }}>
          {/* Borde frontal iluminado de la repisa */}
          <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          {/* Borde inferior oscuro de la repisa */}
          <div className="w-full h-full bg-gradient-to-b from-transparent to-black/80"></div>
        </div>
      </div>
    </div>
  );
}
