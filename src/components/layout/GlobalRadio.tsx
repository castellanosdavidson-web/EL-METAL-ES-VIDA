"use client";
import React, { useState, useRef, useEffect } from 'react';

const STATIONS = [
  { id: 'rockantenne', name: 'Rock Antenne Heavy', url: 'https://stream.rockantenne.de/heavy-metal/stream/mp3', tagline: 'Clásicos y Heavy Metal 24/7' },
  { id: 'maximusrock', name: 'Maximus Rock FM', url: 'https://stream.laut.fm/maximusrockfm', tagline: 'Rock & Metal en Castellano' },
  { id: 'metalonly', name: 'Metal Only', url: 'https://stream.laut.fm/metal-only', tagline: 'El soberano del metal alemán' },
  { id: 'classicmetal', name: 'Classic Metal Radio', url: 'https://stream.laut.fm/classic-metal', tagline: 'Heavy, Thrash y Power Metal clásico' }
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

  // Handle station change
  useEffect(() => {
    setTrackInfo(null); // Reset when station changes
    if (audioRef.current) {
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
        <div className="bg-surface-container-high border border-outline-variant p-3 shadow-lg shadow-black/50 backdrop-blur-md flex flex-col gap-3 min-w-[280px] max-w-[320px] transform transition-transform group-hover:scale-105 relative">
          
          <button 
            onClick={() => setIsMinimized(true)}
            className="absolute -top-3 -left-3 w-6 h-6 bg-surface border border-outline-variant text-on-surface-variant hover:text-primary flex items-center justify-center rounded-full z-10 transition-colors shadow-md"
            title="Minimizar Radio"
          >
            <span className="material-symbols-outlined text-[14px]">remove</span>
          </button>
          
          <div className="flex justify-between items-center border-b border-outline-variant pb-2 pl-2">
            <span className="font-label-technical text-[10px] text-primary tracking-widest uppercase">
              {isBuffering ? 'CONECTANDO...' : isPlaying ? 'TRANSMISIÓN ACTIVA' : 'RADIO DESCONECTADA'}
            </span>
            <span className={`material-symbols-outlined text-sm ${isPlaying ? 'text-primary animate-pulse' : 'text-on-surface-variant'}`}>
              radio
            </span>
          </div>
          
          {/* Station Selector */}
          <select 
            className="w-full bg-surface border border-outline-variant text-on-surface font-label-technical text-[11px] uppercase p-2 outline-none focus:border-primary cursor-pointer"
            value={currentStationIdx}
            onChange={(e) => setCurrentStationIdx(Number(e.target.value))}
          >
            {STATIONS.map((station, idx) => (
              <option key={station.id} value={idx}>{station.name}</option>
            ))}
          </select>
          
          {/* Fallback & Live Metadata */}
          <div className="flex flex-col gap-1 bg-surface-container-lowest p-2 border-l-2 border-primary min-h-[48px] justify-center">
            <span className="font-label-technical text-[8px] text-on-surface-variant tracking-widest uppercase">
              {trackInfo ? 'SONANDO AHORA:' : 'INFO:'}
            </span>
            {trackInfo ? (
              <div className="flex flex-col">
                <span className="font-body-md text-xs font-bold text-primary truncate leading-tight" title={trackInfo.title}>
                  {trackInfo.title}
                </span>
                <span className="font-mono-technical text-[9px] text-on-surface-variant truncate uppercase tracking-wider mt-0.5" title={trackInfo.artist}>
                  {trackInfo.artist}
                </span>
              </div>
            ) : (
              <span className="font-body-md text-xs text-on-surface leading-tight glitch-hover truncate" title={STATIONS[currentStationIdx].tagline}>
                {STATIONS[currentStationIdx].tagline}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3 mt-2">
            {!isPlaying && !isBuffering && (
              <button
                onClick={(e) => togglePlay(e)}
                className="w-full bg-primary text-on-primary py-3 px-4 font-label-technical font-bold text-lg uppercase tracking-[0.2em] flex justify-center items-center gap-3 animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform border border-on-primary/30"
              >
                <span className="material-symbols-outlined text-[24px]">play_circle</span>
                INICIAR TRANSMISIÓN
              </button>
            )}

            <div className="flex items-center gap-4">
              {(isPlaying || isBuffering) && (
                <button 
                  onClick={(e) => togglePlay(e)}
                  disabled={isBuffering}
                  className={`w-12 h-10 ${isBuffering ? 'bg-surface-container-highest text-on-surface-variant cursor-wait' : 'bg-primary-container text-white hover:bg-background hover:text-primary'} flex items-center justify-center transition-colors border border-primary-container`}
                >
                  {isBuffering ? (
                    <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                  ) : (
                    <span className="material-symbols-outlined">stop</span>
                  )}
                </button>
              )}
              
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="font-label-technical text-[8px] text-on-surface-variant uppercase">VOLUMEN</span>
                  <span className="font-label-technical text-[8px] text-primary">{Math.round(volume * 100)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-1 bg-background appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-primary"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
