"use client";
import React, { useState, useRef, useEffect } from 'react';

const STATIONS = [
  { id: 'rockantenne', name: 'Rock Antenne Heavy', url: 'https://stream.rockantenne.de/heavy-metal/stream/mp3', tagline: 'Clásicos y Heavy Metal 24/7' },
  { id: 'metalcore', name: 'Metalcore Radio', url: 'https://stream.laut.fm/metalcore', tagline: 'Metalcore, Deathcore & Hardcore extremo' },
  { id: 'brutaldeath', name: 'Brutal Death Radio', url: 'https://stream.laut.fm/brutal-death', tagline: 'Death Metal, Brutal Slam & Grindcore' },
  { id: 'maximusrock', name: 'Maximus Rock FM', url: 'https://stream.laut.fm/maximusrockfm', tagline: 'Rock & Metal en Castellano' },
  { id: 'metalcolombia', name: 'Metal Radio Colombia', url: 'https://stream.zeno.fm/qwnpbyb0c7vuv', tagline: 'Poder y Metal colombiano las 24 horas' },
  { id: 'wacken', name: 'Wacken Radio', url: 'https://stream.laut.fm/wacken', tagline: 'La radio oficial de la comunidad de Wacken' }
];

export default function GlobalRadio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentStationIdx, setCurrentStationIdx] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [trackInfo, setTrackInfo] = useState<{ title: string; artist: string } | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
        title: trackInfo ? trackInfo.title : STATIONS[currentStationIdx].name,
        artist: trackInfo ? trackInfo.artist : STATIONS[currentStationIdx].tagline,
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
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
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
              {STATIONS[currentStationIdx].name}
            </span>
            <h3 className="font-headline-lg text-lg font-bold text-on-surface leading-tight tracking-tight mt-1" title={trackInfo ? trackInfo.title : STATIONS[currentStationIdx].tagline}>
              {trackInfo ? trackInfo.title : STATIONS[currentStationIdx].tagline}
            </h3>
            {trackInfo && (
              <p className="font-mono-technical text-[11px] text-on-surface-variant/90 tracking-wider uppercase mt-1.5 truncate">
                {trackInfo.artist}
              </p>
            )}
          </div>

          {/* Expanded Controls */}
          <div className="flex flex-col gap-6 items-center px-4 mb-6">
            <div className="flex items-center justify-between w-full max-w-[280px]">
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
                className="text-on-surface hover:text-primary active:scale-90 transition-all flex items-center justify-center p-3"
                title="Siguiente Emisora"
              >
                <span className="material-symbols-outlined text-[32px]">skip_next</span>
              </button>
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
          src={STATIONS[currentStationIdx].url} 
          preload="none"
          autoPlay={true}
          onPlaying={() => { setIsPlaying(true); setIsBuffering(false); }}
          onPause={() => setIsPlaying(false)}
          onWaiting={() => setIsBuffering(true)}
          onError={() => { setIsPlaying(false); setIsBuffering(false); }}
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
        `}</style>

        {/* 1. NOW PLAYING INFO (LEFT SECTION) */}
        <div className="flex items-center gap-3.5 w-[55%] md:w-1/3 min-w-0">
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
              {STATIONS[currentStationIdx].name}
            </span>
            <span className="font-body-md text-xs md:text-sm font-extrabold text-on-surface truncate leading-tight mt-0.5" title={trackInfo ? trackInfo.title : STATIONS[currentStationIdx].tagline}>
              {trackInfo ? trackInfo.title : STATIONS[currentStationIdx].tagline}
            </span>
            {trackInfo && (
              <span className="font-mono-technical text-[9px] md:text-[10px] text-on-surface-variant/70 truncate uppercase tracking-widest mt-0.5" title={trackInfo.artist}>
                {trackInfo.artist}
              </span>
            )}
          </div>
        </div>

        {/* 2. PLAYBACK CONTROLS (CENTER SECTION) */}
        <div className="flex flex-col items-center justify-center gap-1 w-[45%] md:w-1/3">
          <div className="flex items-center gap-3.5 md:gap-6">
            {/* Previous Station */}
            <button 
              onClick={(e) => { e.stopPropagation(); setCurrentStationIdx(prev => (prev - 1 + STATIONS.length) % STATIONS.length); }}
              className="text-on-surface-variant hover:text-primary active:scale-90 transition-all flex items-center justify-center p-1.5"
              title="Emisora Anterior"
            >
              <span className="material-symbols-outlined text-[22px] md:text-[26px]">skip_previous</span>
            </button>

            {/* Circular Play Button */}
            <button
              onClick={(e) => togglePlay(e)}
              disabled={isBuffering}
              className={`w-11 h-11 md:w-13 md:h-13 rounded-full border-2 flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-90 ${
                isPlaying 
                  ? 'fire-active-btn text-black shadow-md' 
                  : 'bg-surface border-outline-variant text-primary hover:border-primary hover:text-white fire-glow-effect'
              }`}
            >
              {isBuffering ? (
                <span className="material-symbols-outlined animate-spin text-[20px] md:text-[22px]">sync</span>
              ) : (
                <span className="material-symbols-outlined text-[26px] md:text-[30px] select-none">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              )}
            </button>

            {/* Next Station */}
            <button 
              onClick={(e) => { e.stopPropagation(); setCurrentStationIdx(prev => (prev + 1) % STATIONS.length); }}
              className="text-on-surface-variant hover:text-primary active:scale-90 transition-all flex items-center justify-center p-1.5"
              title="Siguiente Emisora"
            >
              <span className="material-symbols-outlined text-[22px] md:text-[26px]">skip_next</span>
            </button>
          </div>
          
          {/* Connection status */}
          <span className="hidden sm:inline-block font-label-technical text-[7.5px] text-on-surface-variant/50 tracking-wider uppercase mt-0.5">
            {isBuffering ? 'Conectando...' : isPlaying ? 'En vivo' : 'Desconectado'}
          </span>
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
