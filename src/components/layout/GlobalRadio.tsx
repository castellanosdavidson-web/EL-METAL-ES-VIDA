"use client";
import React, { useState, useRef, useEffect } from 'react';
import IcecastMetadataPlayer from 'icecast-metadata-player';

const STATIONS = [
  { id: 'rockantenne', name: 'Rock Antenne Heavy (General)', url: 'https://stream.rockantenne.de/heavy-metal/stream/mp3' },
  { id: 'fluxfm', name: 'FluxFM Metal (Alternativo)', url: 'http://channels.fluxfm.de/metal-fm/stream.mp3' },
  { id: 'metalmeyhem', name: 'Metal Meyhem Radio', url: 'https://s3.radio.co/s23fcff1bd/listen' },
  { id: 'chronix', name: 'ChroniX Radio (Aggression)', url: 'http://chronix.streamerr.co:8040/stream' }
];

export default function GlobalRadio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentStationIdx, setCurrentStationIdx] = useState(0);
  const [nowPlaying, setNowPlaying] = useState<string>('CONECTANDO AL SATÉLITE...');
  const [hasInteracted, setHasInteracted] = useState(false);
  
  const playerRef = useRef<IcecastMetadataPlayer | null>(null);
  const audioFallbackRef = useRef<HTMLAudioElement | null>(null);
  const [isCORSBlocked, setIsCORSBlocked] = useState(false);

  // Initialize the player
  useEffect(() => {
    // Stop previous if exists
    if (playerRef.current) {
      playerRef.current.stop();
      playerRef.current = null;
    }
    
    setIsCORSBlocked(false);
    setNowPlaying('CONECTANDO...');

    try {
      const player = new IcecastMetadataPlayer(STATIONS[currentStationIdx].url, {
        onMetadata: (metadata: any) => {
          if (metadata && metadata.StreamTitle) {
            setNowPlaying(metadata.StreamTitle);
          } else {
            setNowPlaying('TRANSMITIENDO SEÑAL');
          }
        },
        onPlay: () => {
          setIsPlaying(true);
        },
        onStop: () => {
          setIsPlaying(false);
          setNowPlaying('RADIO DESCONECTADA');
        },
        onError: (message: string, err?: Error) => {
          console.error("Icecast Error (posible bloqueo CORS):", err);
          setIsCORSBlocked(true);
          setNowPlaying('INFORMACIÓN OCULTA (CORS)');
          
          // Fallback a HTML5 Audio
          if (audioFallbackRef.current) {
             if (isPlaying) {
               audioFallbackRef.current.play().catch(console.error);
             }
          }
        }
      });
      
      player.audioElement.volume = volume;
      playerRef.current = player;
      
      // If we were already playing, play the new station
      if (isPlaying) {
        player.play();
      }

    } catch (error) {
      console.error("Error creating player:", error);
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.stop();
      }
    };
  }, [currentStationIdx]); // Re-run when station changes

  // Update volume
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.audioElement.volume = volume;
    }
    if (audioFallbackRef.current) {
      audioFallbackRef.current.volume = volume;
    }
  }, [volume]);

  // Global Interaction Autoplay
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted && !isPlaying) {
        setHasInteracted(true);
        if (!isCORSBlocked && playerRef.current) {
          playerRef.current.play();
        } else if (isCORSBlocked && audioFallbackRef.current) {
          audioFallbackRef.current.play().catch(console.error);
        }
      }
      // Clean up after first interaction
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
  }, [hasInteracted, isPlaying, isCORSBlocked]);

  const togglePlay = () => {
    setHasInteracted(true);
    
    if (isPlaying) {
      if (!isCORSBlocked && playerRef.current) playerRef.current.stop();
      if (isCORSBlocked && audioFallbackRef.current) audioFallbackRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!isCORSBlocked && playerRef.current) {
        playerRef.current.play();
      } else if (isCORSBlocked && audioFallbackRef.current) {
        audioFallbackRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 group">
      
      {/* HTML5 Fallback Player in case CORS blocks the JS fetch */}
      <audio 
        ref={audioFallbackRef} 
        src={STATIONS[currentStationIdx].url} 
        preload="none" 
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Visualizer effect when playing */}
      {isPlaying && (
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
            {isPlaying ? 'TRANSMISIÓN ACTIVA' : 'RADIO DESCONECTADA'}
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
        
        {/* Now Playing Metadata */}
        <div className="flex flex-col gap-1 bg-surface-container-lowest p-2 border-l-2 border-primary">
          <span className="font-label-technical text-[8px] text-on-surface-variant tracking-widest uppercase">SONANDO AHORA:</span>
          <span className="font-body-md text-sm text-on-surface leading-tight glitch-hover truncate" title={nowPlaying}>
            {nowPlaying}
          </span>
        </div>

        <div className="flex items-center gap-4 mt-1">
          <button 
            onClick={togglePlay}
            className="w-12 h-10 bg-primary-container text-white flex items-center justify-center hover:bg-background hover:text-primary transition-colors border border-primary-container"
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
