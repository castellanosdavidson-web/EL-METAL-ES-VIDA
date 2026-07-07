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
    <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 transition-all duration-300 ${isMinimized ? '' : 'group'}`}>
      
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

      {/* Visualizer effect when playing and not minimized (minimized has its own) */}
      {isPlaying && !isBuffering && !isMinimized && (
        <div className="flex items-end gap-1 px-2 h-6 opacity-80">
          <div className="w-1 bg-primary animate-[bounce_1s_infinite] h-full"></div>
          <div className="w-1 bg-primary animate-[bounce_1.2s_infinite] h-3/4"></div>
          <div className="w-1 bg-primary animate-[bounce_0.8s_infinite] h-full"></div>
          <div className="w-1 bg-primary animate-[bounce_1.5s_infinite] h-1/2"></div>
        </div>
      )}

      {isMinimized ? (
        <div 
          onClick={() => setIsMinimized(false)}
          className="bg-surface-container-high border-2 border-outline-variant p-3 shadow-lg backdrop-blur-md flex items-center gap-3 cursor-pointer hover:border-primary transition-colors hover:scale-105"
        >
          <button 
            onClick={togglePlay}
            disabled={isBuffering}
            className={`w-10 h-10 ${isBuffering ? 'text-on-surface-variant cursor-wait' : 'text-primary hover:text-on-surface'} flex items-center justify-center transition-colors`}
          >
            {isBuffering ? (
              <span className="material-symbols-outlined animate-spin">sync</span>
            ) : (
              <span className="material-symbols-outlined text-[24px]">
                {isPlaying ? 'pause_circle' : 'play_circle'}
              </span>
            )}
          </button>
          
          <div className="flex flex-col max-w-[120px]">
            <span className="font-label-technical text-[10px] text-primary tracking-widest uppercase">
              {isPlaying ? 'EN VIVO' : 'RADIO'}
            </span>
            <span className="font-label-technical text-[8px] text-on-surface-variant truncate" title={trackInfo ? `${trackInfo.title} - ${trackInfo.artist}` : STATIONS[currentStationIdx].name}>
              {trackInfo ? `${trackInfo.title} - ${trackInfo.artist}` : STATIONS[currentStationIdx].name}
            </span>
          </div>

          {isPlaying && !isBuffering && (
            <div className="flex items-end gap-0.5 h-4 ml-1 opacity-80">
              <div className="w-1 bg-primary animate-[bounce_1s_infinite] h-full"></div>
              <div className="w-1 bg-primary animate-[bounce_1.2s_infinite] h-3/4"></div>
              <div className="w-1 bg-primary animate-[bounce_0.8s_infinite] h-full"></div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-surface-container-high border-2 border-outline-variant p-4 shadow-2xl shadow-black/80 backdrop-blur-md flex flex-col gap-4 min-w-[290px] max-w-[320px] transform transition-transform duration-300 group-hover:scale-[1.02] relative rounded-lg">
          
          {/* Estilos CSS del fuego inyectados localmente */}
          <style>{`
            @keyframes flame-glow {
              0% { box-shadow: 0 0 10px rgba(255, 69, 0, 0.4), inset 0 0 5px rgba(255, 69, 0, 0.2); }
              50% { box-shadow: 0 0 25px rgba(255, 140, 0, 0.8), inset 0 0 15px rgba(255, 140, 0, 0.4); }
              100% { box-shadow: 0 0 10px rgba(255, 69, 0, 0.4), inset 0 0 5px rgba(255, 69, 0, 0.2); }
            }
            @keyframes fire-particles {
              0% { background-position: 0% 0%; }
              100% { background-position: 0% -100%; }
            }
            .fire-glow-effect {
              animation: flame-glow 1.5s ease-in-out infinite;
            }
            .fire-active-btn {
              background: linear-gradient(135deg, #d32f2f, #ff6f00, #ffeb3b) !important;
              background-size: 200% 200% !important;
              animation: flame-glow 0.8s ease-in-out infinite alternate !important;
              border-color: #ffeb3b !important;
              color: #000 !important;
            }
          `}</style>
          
          <button 
            onClick={() => setIsMinimized(true)}
            className="absolute -top-3 -left-3 w-7 h-7 bg-surface border-2 border-outline-variant text-on-surface-variant hover:text-primary flex items-center justify-center rounded-full z-10 transition-colors shadow-md hover:border-primary"
            title="Minimizar Radio"
          >
            <span className="material-symbols-outlined text-[16px]">remove</span>
          </button>
          
          {/* Header */}
          <div className="flex justify-between items-center border-b border-outline-variant/50 pb-2 pl-1">
            <span className="font-label-technical text-[9px] text-primary tracking-widest uppercase font-bold">
              {isBuffering ? 'CONECTANDO...' : isPlaying ? 'TRANSMISIÓN ACTIVA' : 'SISTEMA LISTO'}
            </span>
            <span className={`material-symbols-outlined text-base ${isPlaying ? 'text-primary animate-pulse' : 'text-on-surface-variant'}`}>
              local_fire_department
            </span>
          </div>
          
          {/* Station Switcher (⏪ ⏩ CD-Player style) */}
          <div className="flex items-center justify-between bg-surface-container-lowest border border-outline-variant/60 p-1.5 rounded">
            <button 
              onClick={() => setCurrentStationIdx(prev => (prev - 1 + STATIONS.length) % STATIONS.length)}
              className="p-1 text-on-surface-variant hover:text-primary active:scale-95 transition-all flex items-center justify-center"
              title="Emisora Anterior"
            >
              <span className="material-symbols-outlined text-[20px]">skip_previous</span>
            </button>
            
            <div className="flex-1 text-center px-2 select-none truncate">
              <span className="font-label-technical text-[10px] text-on-surface uppercase tracking-wider font-extrabold block truncate">
                {STATIONS[currentStationIdx].name}
              </span>
            </div>

            <button 
              onClick={() => setCurrentStationIdx(prev => (prev + 1) % STATIONS.length)}
              className="p-1 text-on-surface-variant hover:text-primary active:scale-95 transition-all flex items-center justify-center"
              title="Siguiente Emisora"
            >
              <span className="material-symbols-outlined text-[20px]">skip_next</span>
            </button>
          </div>
          
          {/* Fallback & Live Metadata Display */}
          <div className="flex flex-col gap-1 bg-surface-container-lowest/80 p-2.5 border-l-2 border-primary min-h-[56px] justify-center rounded-r">
            <span className="font-label-technical text-[8px] text-on-surface-variant tracking-widest uppercase">
              {trackInfo ? 'SONANDO AHORA:' : 'INFO EMISORA:'}
            </span>
            {trackInfo ? (
              <div className="flex flex-col">
                <span className="font-body-md text-xs font-extrabold text-primary truncate leading-tight" title={trackInfo.title}>
                  {trackInfo.title}
                </span>
                <span className="font-mono-technical text-[9px] text-on-surface-variant/80 truncate uppercase tracking-widest mt-0.5" title={trackInfo.artist}>
                  {trackInfo.artist}
                </span>
              </div>
            ) : (
              <span className="font-body-md text-xs text-on-surface-variant leading-tight truncate" title={STATIONS[currentStationIdx].tagline}>
                {STATIONS[currentStationIdx].tagline}
              </span>
            )}
          </div>

          {/* Central Giant Play/Pause Circular Control */}
          <div className="flex flex-col items-center justify-center py-2 relative">
            {/* Ambient Ember Glow Behind Button */}
            <div className={`absolute w-24 h-24 rounded-full blur-xl opacity-35 transition-all duration-500 ${
              isPlaying ? 'bg-orange-500 scale-110 animate-pulse' : 'bg-red-950 scale-95'
            }`}></div>
            
            <button
              onClick={(e) => togglePlay(e)}
              disabled={isBuffering}
              className={`relative z-10 w-24 h-24 rounded-full border-3 flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-90 ${
                isPlaying 
                  ? 'fire-active-btn text-black shadow-lg' 
                  : 'bg-surface-container-lowest border-outline-variant text-primary hover:border-primary hover:text-white fire-glow-effect'
              }`}
            >
              {isBuffering ? (
                <span className="material-symbols-outlined animate-spin text-[36px]">sync</span>
              ) : (
                <span className="material-symbols-outlined text-[48px] select-none">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              )}
            </button>
            <span className="font-label-technical text-[8px] text-on-surface-variant/60 tracking-widest uppercase mt-2">
              {isPlaying ? 'PAUSAR FUEGO' : 'ENCENDER FUEGO'}
            </span>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3 mt-1 border-t border-outline-variant/30 pt-3">
            <span className="material-symbols-outlined text-sm text-on-surface-variant">
              {volume === 0 ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up'}
            </span>
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span className="font-label-technical text-[7px] text-on-surface-variant uppercase tracking-widest">VOLUMEN</span>
                <span className="font-label-technical text-[7px] text-primary">{Math.round(volume * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-1 bg-surface-container-lowest appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-primary rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
