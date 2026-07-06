"use client";
import React, { useState, useRef, useEffect } from 'react';

const STATIONS = [
  { id: 'rockantenne', name: 'Rock Antenne Heavy (General)', url: 'https://stream.rockantenne.de/heavy-metal/stream/mp3', tagline: 'Clásicos y Heavy Metal 24/7' },
  { id: 'metalmeyhem', name: 'Metal Meyhem Radio (Extremo)', url: 'https://s3.radio.co/s23fcff1bd/listen', tagline: 'Metal Extremo, Death y Black' },
  { id: '1fm_highvoltage', name: '1.FM High Voltage (Hard/Heavy)', url: 'https://strm112.1.fm/highvoltage_mobile_mp3', tagline: 'Hard Rock & Heavy Clásico' },
  { id: '1fm_atr', name: '1.FM Aggressive Telepathy', url: 'https://strm112.1.fm/atr_mobile_mp3', tagline: 'Alternativo y Metal Moderno' }
];

export default function GlobalRadio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentStationIdx, setCurrentStationIdx] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Handle station change
  useEffect(() => {
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

  const togglePlay = () => {
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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 group">
      
      {/* HTML5 Audio Core */}
      <audio 
        ref={audioRef} 
        src={STATIONS[currentStationIdx].url} 
        preload="none"
        onPlaying={() => { setIsPlaying(true); setIsBuffering(false); }}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsBuffering(true)}
        onError={() => { setIsPlaying(false); setIsBuffering(false); }}
      />

      {/* Visualizer effect when playing */}
      {isPlaying && !isBuffering && (
        <div className="flex items-end gap-1 px-2 h-6 opacity-80">
          <div className="w-1 bg-primary animate-[bounce_1s_infinite] h-full"></div>
          <div className="w-1 bg-primary animate-[bounce_1.2s_infinite] h-3/4"></div>
          <div className="w-1 bg-primary animate-[bounce_0.8s_infinite] h-full"></div>
          <div className="w-1 bg-primary animate-[bounce_1.5s_infinite] h-1/2"></div>
        </div>
      )}
      
      <div className="bg-surface-container-high border border-outline-variant p-3 shadow-lg shadow-black/50 backdrop-blur-md flex flex-col gap-3 min-w-[280px] max-w-[320px] transform transition-transform group-hover:scale-105">
        
        <div className="flex justify-between items-center border-b border-outline-variant pb-2">
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
        
        {/* Fallback Metadata */}
        <div className="flex flex-col gap-1 bg-surface-container-lowest p-2 border-l-2 border-primary">
          <span className="font-label-technical text-[8px] text-on-surface-variant tracking-widest uppercase">INFO:</span>
          <span className="font-body-md text-sm text-on-surface leading-tight glitch-hover truncate" title={STATIONS[currentStationIdx].tagline}>
            {STATIONS[currentStationIdx].tagline}
          </span>
        </div>

        <div className="flex items-center gap-4 mt-1">
          <button 
            onClick={togglePlay}
            disabled={isBuffering}
            className={`w-12 h-10 ${isBuffering ? 'bg-surface-container-highest text-on-surface-variant cursor-wait' : 'bg-primary-container text-white hover:bg-background hover:text-primary'} flex items-center justify-center transition-colors border border-primary-container`}
          >
            {isBuffering ? (
              <span className="material-symbols-outlined animate-spin text-sm">sync</span>
            ) : (
              <span className="material-symbols-outlined">
                {isPlaying ? 'stop' : 'play_arrow'}
              </span>
            )}
          </button>
          
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
  );
}
