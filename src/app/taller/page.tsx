"use client";
import React from 'react';
import Link from 'next/link';

export default function TallerPlanningPage() {
  return (
    <main className="min-h-screen pt-28 pb-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto flex flex-col justify-center">
      <div className="border-2 border-outline-variant bg-surface-dim p-8 md:p-12 relative overflow-hidden max-w-4xl mx-auto w-full">
        {/* Decorative corner lines */}
        <div className="absolute top-0 right-0 w-24 h-24 border-b border-l border-outline-variant/30 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 border-t border-r border-outline-variant/30 pointer-events-none"></div>
        
        {/* Cyber-industrial header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-surface-container-highest pb-6 mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-primary animate-spin">build</span>
              <span className="font-label-technical text-label-technical text-primary tracking-[0.2em]">CÓDIGO // SECCIÓN TALLER</span>
            </div>
            <h1 className="text-headline-xl md:text-display-md font-headline-lg uppercase text-on-surface">MÓDULO EN PLANIFICACIÓN</h1>
          </div>
          <div className="bg-surface-variant/40 border border-outline-variant/30 px-4 py-2 font-mono-technical text-[10px] text-on-surface-variant uppercase tracking-widest">
            ESTADO: PROTOCOLO_DISEÑO_ACTIVO
          </div>
        </div>

        <p className="font-body-lg text-on-surface-variant mb-8 max-w-2xl">
          El <strong className="text-primary uppercase">Taller de Distorsión</strong> está siendo reprogramado para incorporar simuladores interactivos de audio en tiempo real, calibración digital de gabinetes IR y ruteo avanzado de señales. 
        </p>

        {/* Interactive layout mockup */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="border border-outline-variant/20 bg-surface-container-lowest/50 p-6 rounded">
            <span className="material-symbols-outlined text-3xl text-primary mb-3">graphic_eq</span>
            <h3 className="font-headline-lg text-lg uppercase text-on-surface mb-2">Módulo 01: Simulador IR</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
              Carga tus propias respuestas a impulsos directamente en el navegador y ecualiza tus audios a través de pantallas míticas 4x12.
            </p>
            <span className="text-[10px] font-mono-technical text-primary uppercase tracking-wider block">Fase: Diseño de Interfaz</span>
          </div>

          <div className="border border-outline-variant/20 bg-surface-container-lowest/50 p-6 rounded">
            <span className="material-symbols-outlined text-3xl text-primary mb-3">metronome</span>
            <h3 className="font-headline-lg text-lg uppercase text-on-surface mb-2">Módulo 02: Calculador Rítmico</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
              Alineación temporal de subdivisiones complejas para baterías de metal extremo (Blast beats, síncopas y compases de amalgama).
            </p>
            <span className="text-[10px] font-mono-technical text-primary uppercase tracking-wider block">Fase: Integración de Motor WebAudio</span>
          </div>
        </div>

        {/* Interactive feedback or email list */}
        <div className="bg-primary-container/10 border border-primary-container/30 p-6 text-center rounded">
          <span className="material-symbols-outlined text-4xl text-primary mb-2">terminal</span>
          <h4 className="font-label-technical text-sm text-on-surface uppercase mb-2">¿Tienes alguna idea para este taller?</h4>
          <p className="text-xs text-on-surface-variant mb-6 max-w-lg mx-auto">
            Queremos que la legión tenga las mejores herramientas de calibración de tono y ritmos. Escríbenos directamente o regístrate para notificarte cuando el módulo esté compilado y en línea.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/" className="px-6 py-3 border border-outline-variant text-on-surface font-label-sm text-xs uppercase tracking-widest hover:bg-surface-variant/40 transition-all">
              Volver al Inicio
            </Link>
            <a href="https://fb.com/stars" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-primary-container text-white font-label-sm text-xs uppercase tracking-widest hover:bg-background hover:text-primary transition-all border border-primary-container">
              Sugerir Idea
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
