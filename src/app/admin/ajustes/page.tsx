"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

export default function AjustesPage() {
  const [isCommitting, setIsCommitting] = useState(false);
  const [commitStatus, setCommitStatus] = useState('Confirmar Configuración');
  
  const [logoUrl, setLogoUrl] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [coverUrl, setCoverUrl] = useState('');
  const [uploadingCover, setUploadingCover] = useState(false);

  useEffect(() => {
    // Check if logo exists
    const checkLogo = async () => {
      const { data } = supabase.storage.from('articles').getPublicUrl('logo.png');
      if (data && data.publicUrl) {
        setLogoUrl(data.publicUrl + '?t=' + Date.now());
      }
    };
    // Check if cover exists
    const checkCover = async () => {
      const { data } = supabase.storage.from('articles').getPublicUrl('cover.png');
      if (data && data.publicUrl) {
        setCoverUrl(data.publicUrl + '?t=' + Date.now());
      }
    };
    checkLogo();
    checkCover();
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingLogo(true);
    try {
      const { error } = await supabase.storage
        .from('articles')
        .upload('logo.png', file, { upsert: true, cacheControl: '0' });
      
      if (error) {
        alert('Error subiendo logo: ' + error.message);
      } else {
        const { data } = supabase.storage.from('articles').getPublicUrl('logo.png');
        setLogoUrl(data.publicUrl + '?t=' + Date.now());
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingCover(true);
    try {
      const { error } = await supabase.storage
        .from('articles')
        .upload('cover.png', file, { upsert: true, cacheControl: '0' });
      
      if (error) {
        alert('Error subiendo carátula: ' + error.message);
      } else {
        const { data } = supabase.storage.from('articles').getPublicUrl('cover.png');
        setCoverUrl(data.publicUrl + '?t=' + Date.now());
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setUploadingCover(false);
    }
  };

  const handleCommit = () => {
    setIsCommitting(true);
    setCommitStatus('SINCRONIZANDO...');
    setTimeout(() => {
      setCommitStatus('ÉXITO_CONFIRMACIÓN');
      setTimeout(() => {
        setIsCommitting(false);
        setCommitStatus('Confirmar Configuración');
      }, 2000);
    }, 1500);
  };

  return (
    <main className="p-8 flex-1 flex flex-col h-full bg-[radial-gradient(circle,#5a413d_1px,transparent_1px)]" style={{ backgroundSize: '32px 32px' }}>
      <div className="space-y-12 max-w-5xl mx-auto w-full bg-surface/90 p-4 backdrop-blur-sm">
        {/* Page Header */}
        <header className="border-l-4 border-primary-container pl-6 py-2">
          <h1 className="font-headline-lg text-headline-lg uppercase tracking-tight text-on-surface">Configuración del Sistema</h1>
          <p className="font-mono-technical text-mono-technical text-on-surface-variant max-w-2xl mt-2 uppercase">Ajustar parámetros del núcleo, tokens de identidad estética y protocolos de seguridad para la matriz ambiental METAL_CORE.</p>
        </header>

        {/* Navigation Tabs (Local) */}
        <div className="flex border-b border-outline-variant/20 gap-8 pb-0">
          <button className="border-b-2 border-primary-container pb-4 px-2 font-label-sm text-label-sm uppercase tracking-widest text-on-surface">Visión General</button>
          <button className="pb-4 px-2 font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">Logs</button>
          <button className="pb-4 px-2 font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">Acceso API</button>
        </div>

        <div className="grid grid-cols-1 gap-12">
          {/* General Settings */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-outline-variant/10 pb-2">
              <h3 className="font-headline-md text-headline-md text-primary uppercase">01_Matriz_General</h3>
              <span className="font-mono-technical text-mono-technical text-on-surface-variant/50">[ PRIORIDAD: ALTA ]</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Nombre del Sitio</label>
                <input className="w-full bg-surface-container-low border-b-2 border-outline-variant focus:border-primary-container p-4 font-mono-technical outline-none text-on-surface transition-all" type="text" defaultValue="ECOSISTEMA_METAL_CORE" />
                <p className="text-[10px] text-on-surface-variant/60 uppercase">Identificador del sistema para protocolos externos.</p>
              </div>
              <div className="space-y-4">
                <label className="block font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Índice de Metadatos SEO</label>
                <textarea className="w-full bg-surface-container-low border-b-2 border-outline-variant focus:border-primary-container p-4 font-mono-technical outline-none text-on-surface transition-all" rows={3} defaultValue="Interfaz técnica de lujo de alto rendimiento para gestión administrativa central."></textarea>
              </div>
            </div>
          </section>

          {/* Brand Identity */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-outline-variant/10 pb-2">
              <h3 className="font-headline-md text-headline-md text-primary uppercase">02_Identidad_Visual</h3>
              <span className="font-mono-technical text-mono-technical text-on-surface-variant/50">[ ESTÉTICA_SISTEMA ]</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-4 space-y-6">
                <div className="space-y-3">
                  <label className="block font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Logo Principal</label>
                  <div className="relative h-36 w-full border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center group cursor-pointer hover:border-primary-container transition-colors bg-surface-container-lowest overflow-hidden rounded">
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer z-20" title="Subir Logo" />
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-2 relative z-10 bg-black/50" />
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-primary text-3xl mb-1">upload_file</span>
                        <p className="font-label-sm text-[10px] uppercase tracking-tighter text-on-surface-variant z-10">{uploadingLogo ? 'SUBIENDO...' : 'SOLTAR_LOGO_AQUÍ'}</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Carátula del Reproductor</label>
                  <div className="relative h-36 w-full border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center group cursor-pointer hover:border-primary-container transition-colors bg-surface-container-lowest overflow-hidden rounded">
                    <input type="file" accept="image/*" onChange={handleCoverUpload} className="absolute inset-0 opacity-0 cursor-pointer z-20" title="Subir Carátula" />
                    {coverUrl ? (
                      <img src={coverUrl} alt="Carátula" className="w-full h-full object-contain p-2 relative z-10 bg-black/50" />
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-primary text-3xl mb-1">image</span>
                        <p className="font-label-sm text-[10px] uppercase tracking-tighter text-on-surface-variant z-10">{uploadingCover ? 'SUBIENDO...' : 'SOLTAR_CARÁTULA'}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="md:col-span-8 space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <label className="block font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Color de Acento (HEX)</label>
                    <div className="flex gap-2">
                      <div className="w-12 h-12 bg-primary-container border border-outline-variant"></div>
                      <input className="flex-1 bg-surface-container-low border-b-2 border-outline-variant focus:border-primary-container p-4 font-mono-technical outline-none text-on-surface transition-all" type="text" defaultValue="#8A0303" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="block font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Escalado de Interfaz</label>
                    <select className="w-full bg-surface-container-low border-b-2 border-outline-variant focus:border-primary-container p-4 font-mono-technical outline-none text-on-surface appearance-none transition-all cursor-pointer">
                      <option>100%_POR_DEFECTO</option>
                      <option>110%_MEJORADO</option>
                      <option>90%_COMPACTO</option>
                    </select>
                  </div>
                </div>
                <div className="p-6 bg-surface-container border border-outline-variant/30 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-label-sm text-label-sm uppercase font-bold text-on-surface">Habilitar Movimiento Dinámico</p>
                      <p className="font-mono-technical text-[11px] text-on-surface-variant mt-1">Activa fondos sombreados acelerados por GPU.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Security Settings */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-outline-variant/10 pb-2">
              <h3 className="font-headline-md text-headline-md text-primary uppercase">03_Seguridad_Encriptación</h3>
              <span className="font-mono-technical text-mono-technical text-on-surface-variant/50">[ ESTADO: PROTEGIDO ]</span>
            </div>
            <div className="space-y-8">
              {/* Eliminadas las API keys innecesarias a petición del usuario */}

              {/* Password Management */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                <div className="space-y-4">
                  <label className="block font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Contraseña de Acceso Admin</label>
                  <input className="w-full bg-surface-container-low border-b-2 border-outline-variant focus:border-primary-container p-4 font-mono-technical outline-none text-on-surface transition-all" placeholder="••••••••••••••••" type="password" />
                </div>
                <div className="space-y-4">
                  <label className="block font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Confirmar Nueva Contraseña</label>
                  <input className="w-full bg-surface-container-low border-b-2 border-outline-variant focus:border-primary-container p-4 font-mono-technical outline-none text-on-surface transition-all" placeholder="••••••••••••••••" type="password" />
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 border border-error-container/30 bg-error-container/5">
                <span className="material-symbols-outlined text-primary">warning</span>
                <p className="font-mono-technical text-[11px] text-primary/80 uppercase">Advertencia: Cambiar los protocolos de seguridad puede desconectar sesiones de terminal activas y requerir autenticación inmediata en todos los nodos de hardware.</p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Action Bar */}
        <div className="pt-12 border-t border-outline-variant/20 flex flex-col md:flex-row items-center justify-between gap-6 pb-8">
          <div className="flex flex-col">
            <p className="font-label-sm text-label-sm uppercase text-on-surface-variant">Última Modificación: 2024-05-20 14:32:01 UTC</p>
            <p className="font-mono-technical text-[10px] text-on-surface-variant/50 uppercase">Hash: 0x99A...F2B1</p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button className="flex-1 md:flex-initial px-8 py-4 border border-outline-variant font-label-sm text-label-sm uppercase font-bold tracking-widest hover:bg-surface-variant transition-colors text-on-surface">Descartar Cambios</button>
            <button 
              onClick={handleCommit}
              className={`flex-1 md:flex-initial px-10 py-4 ${isCommitting ? (commitStatus.includes('ÉXITO') ? 'bg-green-800' : 'bg-primary-container animate-pulse') : 'bg-primary-container'} text-on-surface font-label-sm text-label-sm uppercase font-bold tracking-widest hover:bg-inverse-primary transition-all active:scale-95 shadow-lg shadow-primary-container/20`}
            >
              {commitStatus}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
