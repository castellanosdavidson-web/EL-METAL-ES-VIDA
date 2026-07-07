"use client";
import React, { useState, useRef, useEffect } from 'react';

const STATIONS = [
  { id: 'rockantenne', name: 'Rock Antenne Heavy', url: 'https://stream.rockantenne.de/heavy-metal/stream/mp3', tagline: 'Clásicos y Heavy Metal 24/7' },
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

  // Update Media Session Metadata & System Player Thumbnail
  useEffect(() => {
    if (typeof window !== 'undefined' && 'mediaSession' in navigator && isPlaying) {
      const logoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/articles/logo.png`;
      
      navigator.mediaSession.metadata = new MediaMetadata({
        title: trackInfo ? trackInfo.title : STATIONS[currentStationIdx].name,
        artist: trackInfo ? trackInfo.artist : STATIONS[currentStationIdx].tagline,
        album: 'EL METAL ES VIDA',
        artwork: [
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
    <div className="fixed bottom-0 left-0 w-full z-50 bg-background/95 backdrop-blur-md border-t-2 border-outline-variant/80 py-3.5 px-4 md:px-8 flex items-center justify-between shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
      
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
      <div className="flex items-center gap-3 w-[60%] md:w-1/3 min-w-0">
        <div className="relative w-11 h-11 md:w-12 md:h-12 flex-shrink-0 border border-outline-variant bg-surface-container-lowest overflow-hidden rounded shadow-sm">
          <img 
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/articles/logo.png`}
            onError={(e) => { e.currentTarget.src = "/LOGO 2.png"; }}
            alt="Logo" 
            className="w-full h-full object-contain"
          />
          {isPlaying && !isBuffering && (
            <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-base animate-pulse">local_fire_department</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col min-w-0">
          <span className="font-label-technical text-[7.5px] md:text-[8.5px] text-primary tracking-widest uppercase font-extrabold truncate">
            {STATIONS[currentStationIdx].name}
          </span>
          <span className="font-body-md text-[11px] md:text-xs font-extrabold text-on-surface truncate leading-tight mt-0.5" title={trackInfo ? trackInfo.title : STATIONS[currentStationIdx].tagline}>
            {trackInfo ? trackInfo.title : STATIONS[currentStationIdx].tagline}
          </span>
          {trackInfo && (
            <span className="font-mono-technical text-[8px] md:text-[9px] text-on-surface-variant/70 truncate uppercase tracking-widest mt-0.5" title={trackInfo.artist}>
              {trackInfo.artist}
            </span>
          )}
        </div>
      </div>

      {/* 2. PLAYBACK CONTROLS (CENTER SECTION) */}
      <div className="flex flex-col items-center justify-center gap-1 w-[40%] md:w-1/3">
        <div className="flex items-center gap-3 md:gap-5">
          {/* Previous Station */}
          <button 
            onClick={() => setCurrentStationIdx(prev => (prev - 1 + STATIONS.length) % STATIONS.length)}
            className="text-on-surface-variant hover:text-primary active:scale-90 transition-all flex items-center justify-center p-1"
            title="Emisora Anterior"
          >
            <span className="material-symbols-outlined text-[20px] md:text-[24px]">skip_previous</span>
          </button>

          {/* Circular Play Button */}
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

          {/* Next Station */}
          <button 
            onClick={() => setCurrentStationIdx(prev => (prev + 1) % STATIONS.length)}
            className="text-on-surface-variant hover:text-primary active:scale-90 transition-all flex items-center justify-center p-1"
            title="Siguiente Emisora"
          >
            <span className="material-symbols-outlined text-[20px] md:text-[24px]">skip_next</span>
          </button>
        </div>
        
        {/* Connection status */}
        <span className="hidden sm:inline-block font-label-technical text-[7px] text-on-surface-variant/50 tracking-wider uppercase mt-0.5">
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
  );
}
