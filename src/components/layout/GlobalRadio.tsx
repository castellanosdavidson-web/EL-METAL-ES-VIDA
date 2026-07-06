"use client";
import React, { useState, useRef, useEffect } from 'react';

export default function GlobalRadio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // You can change this URL to any other valid icecast/shoutcast metal stream
  const STREAM_URL = "https://stream.rockantenne.de/heavy-metal/stream/mp3";

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setHasInteracted(true);
        }).catch((e) => {
          console.error("Autoplay prevented or stream error:", e);
        });
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 group">
      {/* Visualizer effect when playing */}
      {isPlaying && (
        <div className="flex items-end gap-1 px-2 h-6 opacity-80">
          <div className="w-1 bg-primary animate-[bounce_1s_infinite] h-full"></div>
          <div className="w-1 bg-primary animate-[bounce_1.2s_infinite] h-3/4"></div>
          <div className="w-1 bg-primary animate-[bounce_0.8s_infinite] h-full"></div>
          <div className="w-1 bg-primary animate-[bounce_1.5s_infinite] h-1/2"></div>
        </div>
      )}
      
      <div className="bg-surface-container-high border border-outline-variant p-3 shadow-lg shadow-black/50 backdrop-blur-md flex flex-col gap-3 min-w-[220px] transform transition-transform group-hover:scale-105">
        <audio ref={audioRef} src={STREAM_URL} preload="none" />
        
        <div className="flex justify-between items-center border-b border-outline-variant pb-2">
          <span className="font-label-technical text-[10px] text-primary tracking-widest uppercase">
            {isPlaying ? 'TRANSMITIENDO...' : 'RADIO DESCONECTADA'}
          </span>
          <span className="material-symbols-outlined text-sm text-on-surface-variant animate-pulse">
            radio
          </span>
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="font-headline-lg text-sm uppercase text-on-surface">Rock Antenne Heavy</span>
          <span className="font-label-technical text-[9px] text-on-surface-variant uppercase">Señal Pública 192kbps</span>
        </div>

        <div className="flex items-center gap-4 mt-1">
          <button 
            onClick={togglePlay}
            className="w-10 h-10 bg-primary-container text-white flex items-center justify-center hover:bg-background hover:text-primary transition-colors border border-primary-container"
          >
            <span className="material-symbols-outlined">
              {isPlaying ? 'stop' : 'play_arrow'}
            </span>
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
