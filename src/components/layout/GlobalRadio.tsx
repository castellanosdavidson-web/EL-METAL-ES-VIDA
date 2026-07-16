"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';

const STATIONS = [
  { id: 'rockantenne', name: 'Rock Antenne Heavy', url: 'https://stream.rockantenne.de/heavy-metal/stream/mp3', tagline: 'Clásicos y Heavy Metal 24/7' },
  { id: 'metalcore', name: 'Metalcore Radio', url: 'https://stream.laut.fm/metalcore', tagline: 'Metalcore, Deathcore & Hardcore extremo' },
  { id: 'brutaldeath', name: 'Brutal Death Radio', url: 'https://stream.laut.fm/deathmetal', tagline: 'Death Metal, Brutal Slam & Grindcore' },
  { id: 'latinmetal', name: 'Metal Caravan', url: 'https://stream.laut.fm/metalcaravan', tagline: 'Metal Underground Internacional' },
  { id: 'wacken', name: 'Wacken Radio', url: 'https://stream.laut.fm/wacken', tagline: 'La radio oficial de la comunidad de Wacken' }
];

const TRANSLATIONS: Record<string, { header: string; status: { connecting: string, live: string, offline: string }; list: Record<string, { name: string; tagline: string }> }> = {
  es: {
    header: 'EMISORAS DISPONIBLES',
    status: { connecting: 'Conectando...', live: 'En línea', offline: 'Desconectado' },
    list: {
      rockantenne: { name: 'Rock Antenne Heavy', tagline: 'Clásicos y Heavy Metal 24/7' },
      metalcore: { name: 'Metalcore Radio', tagline: 'Metalcore, Deathcore y Hardcore extremo' },
      brutaldeath: { name: 'Brutal Death Radio', tagline: 'Death Metal, Brutal Slam y Grindcore' },
      latinmetal: { name: 'Metal Caravan', tagline: 'Metal Underground Internacional' },
      wacken: { name: 'Wacken Radio', tagline: 'La radio oficial de la comunidad de Wacken' }
    }
  },
  en: {
    header: 'AVAILABLE STATIONS',
    status: { connecting: 'Connecting...', live: 'Online', offline: 'Offline' },
    list: {
      rockantenne: { name: 'Rock Antenne Heavy', tagline: 'Classics & Heavy Metal 24/7' },
      metalcore: { name: 'Metalcore Radio', tagline: 'Extreme Metalcore, Deathcore & Hardcore' },
      brutaldeath: { name: 'Brutal Death Radio', tagline: 'Death Metal, Brutal Slam & Grindcore' },
      latinmetal: { name: 'Metal Caravan', tagline: 'International Underground Metal' },
      wacken: { name: 'Wacken Radio', tagline: 'Official radio of the Wacken community' }
    }
  },
  pt: {
    header: 'ESTAÇÕES DISPONÍVEIS',
    status: { connecting: 'Conectando...', live: 'Online', offline: 'Desconectado' },
    list: {
      rockantenne: { name: 'Rock Antenne Heavy', tagline: 'Clássicos e Heavy Metal 24/7' },
      metalcore: { name: 'Metalcore Radio', tagline: 'Metalcore, Deathcore e Hardcore extremo' },
      brutaldeath: { name: 'Brutal Death Radio', tagline: 'Death Metal, Brutal Slam e Grindcore' },
      latinmetal: { name: 'Metal Caravan', tagline: 'Metal Underground Internacional' },
      wacken: { name: 'Wacken Radio', tagline: 'A rádio oficial da comunidade de Wacken' }
    }
  }
};

export default function GlobalRadio() {
  const locale = useLocale();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentStationIdx, setCurrentStationIdx] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [trackInfo, setTrackInfo] = useState<{ title: string; artist: string } | null>(null);
  
  // Dropdown states & refs
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const mobileDropdownRef = useRef<HTMLDivElement | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Translated station variables
  const currentTrans = TRANSLATIONS[locale] || TRANSLATIONS.es;
  const currentStation = STATIONS[currentStationIdx];
  const currentStationName = currentTrans.list[currentStation.id]?.name || currentStation.name;
  const currentStationTagline = currentTrans.list[currentStation.id]?.tagline || currentStation.tagline;

  // Poll ICY Metadata
  useEffect(() => {
    let intervalId: any;

    const fetchMetadata = async () => {
      try {
        const stationUrl = STATIONS[currentStationIdx].url;
        const res = await fetch(`/api/radio-metadata?url=${encodeURIComponent(stationUrl)}`);
        const data = await res.json();
        
        if (data && !data.error && data.raw) {
          setTrackInfo({ title: data.title, artist: data.artist });
        } else {
          setTrackInfo(null);
        }
      } catch (err) {
        console.error('Error fetching radio metadata:', err);
      }
    };

    if (isPlaying) {
      fetchMetadata();
      intervalId = setInterval(fetchMetadata, 20000); // Poll every 20s
    } else {
      setTrackInfo(null);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlaying, currentStationIdx]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'mediaSession' in navigator && isPlaying) {
      const coverUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/articles/cover.png`;
      const logoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/articles/logo.png`;
      
      navigator.mediaSession.metadata = new MediaMetadata({
        title: trackInfo ? trackInfo.title : currentStationName,
        artist: trackInfo ? trackInfo.artist : currentStationTagline,
        album: 'EL METAL ES VIDA',
        artwork: [
          { src: coverUrl, sizes: '512x512', type: 'image/png' },
          { src: logoUrl, sizes: '512x512', type: 'image/png' },
          { src: '/LOGO 2.png', sizes: '512x512', type: 'image/png' }
        ]
      });

      navigator.mediaSession.playbackState = 'playing';

      navigator.mediaSession.setActionHandler('play', () => {
        if (audioRef.current) {
          audioRef.current.play().then(() => setIsPlaying(true));
        }
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      });
    } else if (typeof window !== 'undefined' && 'mediaSession' in navigator) {
      navigator.mediaSession.playbackState = 'paused';
    }
  }, [isPlaying, trackInfo, currentStationIdx]);

  // Handle station change
  useEffect(() => {
    setTrackInfo(null); // Reset when station changes
    if (audioRef.current) {
      audioRef.current.load(); // ¡IMPORTANTE! Forzar la recarga del nuevo src del audio
      if (isPlaying) {
        setIsBuffering(true);
        audioRef.current.play().then(() => {
          setIsBuffering(false);
        }).catch((err) => {
          console.error("Error al reproducir estación:", err);
          setIsPlaying(false);
          setIsBuffering(false);
        });
      }
    }
  }, [currentStationIdx]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Global Interaction Autoplay
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted && !isPlaying && audioRef.current) {
        setHasInteracted(true);
        setIsBuffering(true);
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setIsBuffering(false);
        }).catch(err => {
          console.error("Autoplay prevent logic triggered:", err);
          setIsBuffering(false);
        });
      }
      
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('touchend', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });
    window.addEventListener('touchend', handleFirstInteraction, { once: true });
    window.addEventListener('scroll', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('touchend', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
    };
  }, [hasInteracted, isPlaying]);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setHasInteracted(true);
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsBuffering(true);
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setIsBuffering(false);
      }).catch((err) => {
        console.error("Error al intentar reproducir:", err);
        setIsBuffering(false);
      });
    }
  };

  return (
    <>
      {/* 3. MOBILE FULL-SCREEN EXPANDED PLAYER OVERLAY */}
      {isMobileExpanded && (
        <div className="fixed inset-0 z-50 bg-background/98 flex flex-col justify-between p-6 animate-fade-in md:hidden">
          {/* Top Header */}
          <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3">
            <button 
              onClick={() => setIsMobileExpanded(false)}
              className="text-on-surface hover:text-primary transition-colors flex items-center justify-center p-2"
            >
              <span className="material-symbols-outlined text-3xl">expand_more</span>
            </button>
            <span className="font-label-technical text-xs text-primary tracking-widest uppercase font-extrabold">
              {isPlaying ? 'Transmitiendo en Vivo' : 'Radio Desconectada'}
            </span>
            <div className="w-10"></div> {/* Spacer for alignment */}
          </div>

          {/* Large Artwork */}
          <div className="flex-1 flex flex-col justify-center items-center py-6">
            <div className="relative w-64 h-64 border-2 border-outline-variant rounded-lg overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.7)] bg-surface-container-lowest">
              <img 
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/articles/cover.png`}
                onError={(e) => { 
                  const logoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/articles/logo.png`;
                  if (e.currentTarget.src !== logoUrl) {
                    e.currentTarget.src = logoUrl;
                  } else {
                    e.currentTarget.src = "/LOGO 2.png";
                  }
                }}
                alt="Carátula" 
                className="w-full h-full object-contain p-4"
              />
            </div>
          </div>

          {/* Song Info */}
          <div className="px-2 mb-4">
            <span className="font-label-technical text-[10px] text-primary tracking-widest uppercase font-extrabold block mb-1">
              {currentStationName}
            </span>
            <h3 className="font-headline-lg text-lg font-bold text-on-surface leading-tight tracking-tight mt-1" title={trackInfo ? trackInfo.title : currentStationTagline}>
              {trackInfo ? trackInfo.title : currentStationTagline}
            </h3>
            {trackInfo && (
              <p className="font-mono-technical text-[11px] text-on-surface-variant/90 tracking-wider uppercase mt-1.5 truncate">
                {trackInfo.artist}
              </p>
            )}
          </div>

          {/* Expanded Controls */}
          <div className="flex flex-col gap-6 items-center px-4 mb-6">
            <div className="flex items-center justify-between w-full max-w-[280px] relative" ref={mobileDropdownRef}>
              <button 
                onClick={() => setCurrentStationIdx(prev => (prev - 1 + STATIONS.length) % STATIONS.length)}
                className="text-on-surface hover:text-primary active:scale-90 transition-all flex items-center justify-center p-3"
                title="Emisora Anterior"
              >
                <span className="material-symbols-outlined text-[32px]">skip_previous</span>
              </button>

              <button
                onClick={(e) => togglePlay(e)}
                disabled={isBuffering}
                className={`w-20 h-20 rounded-full border-3 flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-90 ${
                  isPlaying 
                    ? 'fire-active-btn text-black shadow-xl' 
                    : 'bg-surface border-outline-variant text-primary hover:border-primary'
                }`}
              >
                {isBuffering ? (
                  <span className="material-symbols-outlined animate-spin text-[32px]">sync</span>
                ) : (
                  <span className="material-symbols-outlined text-[44px] select-none">
                    {isPlaying ? 'pause' : 'play_arrow'}
                  </span>
                )}
              </button>

              <button 
                onClick={() => setCurrentStationIdx(prev => (prev + 1) % STATIONS.length)}
                className="text-primary hover:text-white active:scale-90 transition-all flex items-center justify-center p-3 animate-pulse"
                style={{ filter: 'drop-shadow(0 0 8px var(--primary))' }}
                title="Siguiente Emisora"
              >
                <span className="material-symbols-outlined text-[32px]">skip_next</span>
              </button>

              <button 
                onClick={(e) => { e.stopPropagation(); setIsDropdownOpen(!isDropdownOpen); }}
                className={`text-on-surface hover:text-primary active:scale-90 transition-all flex items-center justify-center p-3 rounded-full ${isDropdownOpen ? 'text-primary bg-primary/10' : ''}`}
                title="Seleccionar Emisora"
              >
                <span className="material-symbols-outlined text-[32px]">radio</span>
              </button>

              {/* Mobile Floating Dropdown */}
              {isDropdownOpen && (
                <div className="absolute bottom-[90px] left-1/2 -translate-x-1/2 z-50 bg-background/98 border border-outline-variant p-2 w-64 max-h-60 overflow-y-auto rounded shadow-2xl backdrop-blur-md">
                  <div className="font-mono-technical text-[9px] text-primary/80 uppercase tracking-wider font-extrabold px-3 py-1.5 border-b border-outline-variant/30 text-center">
                    {currentTrans.header}
                  </div>
                  <div className="mt-1 divide-y divide-outline-variant/10">
                    {STATIONS.map((station, idx) => {
                      const tName = currentTrans.list[station.id]?.name || station.name;
                      const tTagline = currentTrans.list[station.id]?.tagline || station.tagline;
                      const active = idx === currentStationIdx;
                      return (
                        <button
                          key={station.id}
                          onClick={() => {
                            setCurrentStationIdx(idx);
                            setIsPlaying(true);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 flex flex-col gap-0.5 hover:bg-primary-container/20 transition-colors ${active ? 'bg-primary-container/10 border-l-2 border-primary' : ''}`}
                        >
                          <div className="flex justify-between items-center w-full">
                            <span className={`font-body-md text-xs font-bold uppercase tracking-wide ${active ? 'text-primary' : 'text-on-surface'}`}>
                              {tName}
                            </span>
                            {active && <span className="material-symbols-outlined text-[14px] text-primary align-middle">radio_button_checked</span>}
                          </div>
                          <span className="font-mono-technical text-[9px] text-on-surface-variant/70 leading-normal line-clamp-1">{tTagline}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Volume control in expanded view */}
            <div className="flex items-center gap-3 w-full max-w-[280px]">
              <span className="material-symbols-outlined text-lg text-on-surface-variant select-none">
                {volume === 0 ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up'}
              </span>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-surface-container-lowest appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary rounded"
              />
              <span className="font-label-technical text-[10px] text-primary w-8 text-right">{Math.round(volume * 100)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* STANDARD SPOTIFY BOTTOM BAR */}
      <div 
        onClick={() => {
          // On mobile screens, clicking the bar expands it
          if (window.innerWidth < 768) {
            setIsMobileExpanded(true);
          }
        }}
        className="fixed bottom-0 left-0 w-full z-40 bg-background/96 backdrop-blur-md border-t-2 border-outline-variant/80 pb-5 pt-3.5 md:py-4 px-4 md:px-8 flex items-center justify-between shadow-[0_-8px_30px_rgba(0,0,0,0.55)] cursor-pointer md:cursor-default"
      >
        {/* HTML5 Audio Core */}
        <audio 
          ref={audioRef}
          autoPlay
          src={STATIONS[currentStationIdx].url}
          onPlay={() => { setIsPlaying(true); setIsBuffering(false); }}
          onPause={() => setIsPlaying(false)}
          onWaiting={() => setIsBuffering(true)}
          onStalled={() => {
            if (isPlaying && audioRef.current) {
              // Si el buffer se estanca (común en background móvil), forzamos recarga y reproducción
              audioRef.current.load();
              audioRef.current.play().catch(console.error);
            }
          }}
          onError={(e) => {
            console.error("Audio player error:", e);
            if (isPlaying && audioRef.current) {
              setIsBuffering(true);
              setTimeout(() => {
                if (audioRef.current && isPlaying) {
                  audioRef.current.load();
                  audioRef.current.play()
                    .then(() => setIsBuffering(false))
                    .catch((err) => {
                      console.error("Auto-reconnect failed:", err);
                      setIsPlaying(false);
                      setIsBuffering(false);
                    });
                }
              }, 2500); // Intenta reconectar tras 2.5s
            } else {
              setIsPlaying(false);
              setIsBuffering(false);
            }
          }}
        />
        
        {/* Estilos CSS del fuego inyectados localmente */}
        <style>{`
          @keyframes flame-glow {
            0% { box-shadow: 0 0 8px rgba(255, 69, 0, 0.4), inset 0 0 4px rgba(255, 69, 0, 0.2); }
            50% { box-shadow: 0 0 18px rgba(255, 140, 0, 0.7), inset 0 0 10px rgba(255, 140, 0, 0.3); }
            100% { box-shadow: 0 0 8px rgba(255, 69, 0, 0.4), inset 0 0 4px rgba(255, 69, 0, 0.2); }
          }
          .fire-active-btn {
            background: linear-gradient(135deg, #d32f2f, #ff6f00, #ffeb3b) !important;
            background-size: 200% 200% !important;
            animation: flame-glow 0.8s ease-in-out infinite alternate !important;
            border-color: #ffeb3b !important;
            color: #000 !important;
          }
          .fire-glow-effect {
            animation: flame-glow 1.5s ease-in-out infinite;
          }
           @keyframes radio-btn-glow {
             0% { transform: scale(1); filter: drop-shadow(0 0 2px #ff0000); color: #d32f2f; }
             50% { transform: scale(1.15); filter: drop-shadow(0 0 10px #ff0000); color: #ff1a1a; }
             100% { transform: scale(1); filter: drop-shadow(0 0 2px #ff0000); color: #d32f2f; }
           }
           .animate-radio-glow {
             animation: radio-btn-glow 1.2s ease-in-out infinite;
           }
        `}</style>

        {/* 1. NOW PLAYING INFO (LEFT SECTION) */}
        <div className="flex items-center gap-3.5 w-[50%] md:w-1/3 min-w-0">
          <div className="relative w-12 h-12 md:w-14 md:h-14 flex-shrink-0 border border-outline-variant bg-surface-container-lowest overflow-hidden rounded shadow-sm">
            <img 
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/articles/cover.png`}
              onError={(e) => { 
                const logoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/articles/logo.png`;
                if (e.currentTarget.src !== logoUrl) {
                  e.currentTarget.src = logoUrl;
                } else {
                  e.currentTarget.src = "/LOGO 2.png";
                }
              }}
              alt="Carátula" 
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="flex flex-col min-w-0">
            <span className="font-label-technical text-[8px] md:text-[9.5px] text-primary tracking-widest uppercase font-extrabold truncate">
              {currentStationName}
            </span>
            <span className="font-body-md text-xs md:text-sm font-extrabold text-on-surface truncate leading-tight mt-0.5" title={trackInfo ? trackInfo.title : currentStationTagline}>
              {trackInfo ? trackInfo.title : currentStationTagline}
            </span>
            {trackInfo && (
              <span className="font-mono-technical text-[9px] md:text-[10px] text-on-surface-variant/70 truncate uppercase tracking-widest mt-0.5" title={trackInfo.artist}>
                {trackInfo.artist}
              </span>
            )}
          </div>
        </div>

        {/* 2. PLAYBACK CONTROLS (CENTER SECTION) */}
        <div className="flex flex-col items-center justify-center w-[50%] md:w-1/3 pr-5 md:pr-0">
          <div className="grid grid-cols-3 items-center justify-items-center w-full max-w-[170px] md:max-w-[220px] relative" ref={dropdownRef}>
            {/* Left Col: Previous Station */}
            <div className="flex justify-end w-full pr-2">
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setCurrentStationIdx(prev => (prev - 1 + STATIONS.length) % STATIONS.length); 
                  setIsPlaying(true);
                }}
                className="text-on-surface-variant hover:text-primary active:scale-90 transition-all flex items-center justify-center p-1.5"
                title="Emisora Anterior"
              >
                <span className="material-symbols-outlined text-[20px] md:text-[24px]">skip_previous</span>
              </button>
            </div>

            {/* Center Col: Play button and Status */}
            <div className="flex flex-col items-center justify-center">
              <button
                onClick={(e) => togglePlay(e)}
                disabled={isBuffering}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-90 ${
                  isPlaying 
                    ? 'fire-active-btn text-black shadow-md' 
                    : 'bg-surface border-outline-variant text-primary hover:border-primary hover:text-white fire-glow-effect'
                }`}
              >
                {isBuffering ? (
                  <span className="material-symbols-outlined animate-spin text-[18px] md:text-[20px]">sync</span>
                ) : (
                  <span className="material-symbols-outlined text-[24px] md:text-[28px] select-none">
                    {isPlaying ? 'pause' : 'play_arrow'}
                  </span>
                )}
              </button>
              
              {/* Connection status nested here under Play button */}
              <span className="hidden sm:block whitespace-nowrap font-label-technical text-[7.5px] text-on-surface-variant/50 tracking-wider uppercase mt-1">
                {isBuffering ? currentTrans.status.connecting : isPlaying ? currentTrans.status.live : currentTrans.status.offline}
              </span>
            </div>

            {/* Right Col: Next Station & Selector */}
            <div className="flex justify-start items-center gap-1 w-full pl-2">
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setCurrentStationIdx(prev => (prev + 1) % STATIONS.length); 
                  setIsPlaying(true);
                }}
                className="text-on-surface-variant hover:text-primary active:scale-90 transition-all flex items-center justify-center p-1.5"
                title="Siguiente Emisora"
              >
                <span className="material-symbols-outlined text-[20px] md:text-[24px]">skip_next</span>
              </button>

              <button 
                onClick={(e) => { e.stopPropagation(); setIsDropdownOpen(!isDropdownOpen); }}
                className={`active:scale-90 transition-all flex items-center justify-center p-1.5 rounded-full ${isDropdownOpen ? 'text-primary bg-primary/10' : 'animate-radio-glow'}`}
                title="Seleccionar Emisora"
              >
                <span className="material-symbols-outlined text-[20px] md:text-[24px]">radio</span>
              </button>
            </div>

            {/* Dropdown Menu floating upward */}
            {isDropdownOpen && (
              <div className="fixed md:absolute bottom-[75px] md:bottom-[55px] left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:right-auto md:w-64 z-50 bg-background/98 border border-outline-variant/80 p-2 max-h-64 overflow-y-auto rounded shadow-[0_-8px_30px_rgba(0,0,0,0.8)] backdrop-blur-md">
                <div className="font-mono-technical text-[9px] text-primary/80 uppercase tracking-wider font-extrabold px-3 py-1.5 border-b border-outline-variant/30 text-center">
                  {currentTrans.header}
                </div>
                <div className="mt-1 divide-y divide-outline-variant/10">
                  {STATIONS.map((station, idx) => {
                    const tName = currentTrans.list[station.id]?.name || station.name;
                    const tTagline = currentTrans.list[station.id]?.tagline || station.tagline;
                    const active = idx === currentStationIdx;
                    return (
                      <button
                        key={station.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentStationIdx(idx);
                          setIsPlaying(true);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex flex-col gap-0.5 hover:bg-primary-container/20 transition-colors ${active ? 'bg-primary-container/10 border-l-2 border-primary' : ''}`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className={`font-body-md text-xs font-bold uppercase tracking-wide ${active ? 'text-primary' : 'text-on-surface'}`}>
                            {tName}
                          </span>
                          {active && <span className="material-symbols-outlined text-[14px] text-primary align-middle">radio_button_checked</span>}
                        </div>
                        <span className="font-mono-technical text-[9px] text-on-surface-variant/70 leading-normal line-clamp-1">{tTagline}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. UTILITY CONTROLS (RIGHT SECTION) - Hidden on Mobile */}
        <div className="hidden md:flex items-center justify-end gap-5 w-1/3">
          {/* Volume controls */}
          <div className="flex items-center gap-2 max-w-[130px] w-full">
            <span className="material-symbols-outlined text-[15px] text-on-surface-variant select-none">
              {volume === 0 ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up'}
            </span>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-1 bg-surface-container-lowest appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-primary rounded"
            />
            <span className="font-label-technical text-[7.5px] text-primary w-6 text-right">{Math.round(volume * 100)}%</span>
          </div>
          
          {/* Small live visualizer wave animation */}
          {isPlaying && !isBuffering && (
            <div className="flex items-end gap-0.5 h-3.5 opacity-80 flex-shrink-0">
              <div className="w-[1.5px] bg-primary animate-[bounce_1s_infinite] h-full"></div>
              <div className="w-[1.5px] bg-primary animate-[bounce_1.2s_infinite] h-[70%]"></div>
              <div className="w-[1.5px] bg-primary animate-[bounce_0.8s_infinite] h-full"></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
