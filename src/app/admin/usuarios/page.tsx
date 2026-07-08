"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

export default function UsuariosPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const res = await fetch('/api/subscribers', {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });
      const data = await res.json();
      if (!data.error) {
        setSubscribers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    if (subscribers.length === 0) return;
    
    const headers = ['Email', 'Fecha de Registro'];
    const csvRows = ['sep=,', headers.join(',')];
    
    subscribers.forEach(sub => {
      const date = new Date(sub.created_at).toISOString();
      csvRows.push(`${sub.email},${date}`);
    });
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `suscriptores_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    setMessage('PROCESANDO...');
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail.trim() })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('USUARIO AÑADIDO CON ÉXITO');
        setNewEmail('');
        fetchSubscribers();
        setTimeout(() => {
          setIsModalOpen(false);
          setMessage('');
        }, 1500);
      } else {
        setMessage(`ERROR: ${data.error}`);
      }
    } catch (err) {
      setMessage('ERROR DE CONEXIÓN');
    }
  };

  const handleDelete = async (email: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente a ${email}?`)) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`/api/subscribers?email=${encodeURIComponent(email)}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });
      if (res.ok) {
        fetchSubscribers();
      } else {
        const data = await res.json();
        alert(`Error al eliminar: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión al eliminar');
    }
  };

  return (
    <main className="p-8 flex-1 flex flex-col h-full">
      <div className="space-y-8 max-w-7xl mx-auto w-full">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-outline-variant/10 pb-4">
          <div>
            <h2 className="font-display-lg text-display-lg text-on-surface leading-tight mb-2 uppercase tracking-tight">La Legión</h2>
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-primary-container"></span>
              <p className="font-mono-technical text-mono-technical text-primary uppercase tracking-widest">Archivo de Personal Registrado // TOTAL_CUENTA: {subscribers.length}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleDownloadCSV}
              className="px-6 py-3 border border-outline-variant/30 text-on-surface font-label-sm uppercase tracking-widest hover:bg-surface-variant/40 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Exportar_CSV
            </button>
            <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-primary-container text-on-primary font-label-sm uppercase tracking-widest hover:bg-inverse-primary transition-all active:scale-95 flex items-center gap-2 border border-primary-container">
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              Registrar_Nuevo
            </button>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-masonry-gap">
          <div className="border border-outline-variant/20 p-6 bg-surface-container-lowest">
            <p className="font-label-sm text-on-surface-variant uppercase mb-2">Total_Correos</p>
            <p className="font-headline-lg text-headline-lg text-on-surface">{subscribers.length}</p>
            <div className="w-full bg-outline-variant/20 h-1 mt-4">
              <div className="bg-primary h-full w-[100%]"></div>
            </div>
          </div>
        </div>

        {/* USERS TABLE CONTAINER */}
        <div className="border border-outline-variant/20 bg-surface-container-lowest overflow-hidden">
          <div className="bg-surface-variant/30 p-4 border-b border-outline-variant/20 flex justify-between items-center">
            <div className="flex gap-4">
              <button className="font-label-sm uppercase text-primary border-b-2 border-primary pb-1">Todos_Los_Miembros</button>
              <button className="font-label-sm uppercase text-on-surface-variant hover:text-on-surface transition-colors pb-1">Suspendidos</button>
              <button className="font-label-sm uppercase text-on-surface-variant hover:text-on-surface transition-colors pb-1">Auth_Pendiente</button>
            </div>
            <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">filter_list</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-surface-container-highest/50">
                  <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/20">Nombre de Usuario</th>
                  <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/20">Email</th>
                  <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/20">Fecha de Registro</th>
                  <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/20 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-primary animate-pulse font-mono-technical">CARGANDO_BASE_DE_DATOS...</td>
                  </tr>
                ) : subscribers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-on-surface-variant font-mono-technical">NO HAY REGISTROS TODAVÍA</td>
                  </tr>
                ) : (
                  subscribers.map((sub, idx) => (
                    <tr key={idx} className="hover:bg-surface-variant/20 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-surface-container border border-outline-variant/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">person</span>
                          </div>
                          <span className="font-mono-technical text-on-surface font-bold uppercase tracking-tight">SUBSCRIPTOR_{idx+1}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-on-surface-variant font-mono-technical">{sub.email}</td>
                      <td className="px-6 py-5 text-on-surface-variant font-mono-technical">
                        {new Date(sub.created_at).toLocaleDateString()} {new Date(sub.created_at).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(sub.email);
                              alert('Correo copiado al portapapeles');
                            }}
                            className="w-8 h-8 flex items-center justify-center border border-outline-variant/20 text-on-surface-variant hover:text-primary transition-all" 
                            title="Copiar Correo"
                          >
                            <span className="material-symbols-outlined text-[18px]">content_copy</span>
                          </button>
                          <button 
                            onClick={() => handleDelete(sub.email)}
                            className="w-8 h-8 flex items-center justify-center border border-outline-variant/20 text-on-surface-variant hover:text-error transition-all" 
                            title="Eliminar Perfil"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* TABLE FOOTER / PAGINATION */}
          <div className="bg-surface-container p-4 border-t border-outline-variant/20 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="font-mono-technical text-[12px] text-on-surface-variant">MOSTRANDO_ENTRADAS: 1-4_DE_12402</p>
            <div className="flex gap-2">
              <button className="w-10 h-10 border border-outline-variant/20 flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors disabled:opacity-20" disabled>
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="w-10 h-10 border border-primary text-primary flex items-center justify-center bg-primary-container/10">1</button>
              <button className="w-10 h-10 border border-outline-variant/20 flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors">2</button>
              <button className="w-10 h-10 border border-outline-variant/20 flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors">3</button>
              <span className="flex items-center px-2 text-on-surface-variant">...</span>
              <button className="w-10 h-10 border border-outline-variant/20 flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors">1240</button>
              <button className="w-10 h-10 border border-outline-variant/20 flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* RECENT ACTIVITY LOG */}
        <div className="mt-8">
          <h3 className="font-label-sm text-on-surface uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">history</span>
            Log_Auditoría_Seguridad
          </h3>
          <div className="space-y-2">
            <div className="p-4 border border-outline-variant/20 bg-surface-container-lowest flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-error animate-pulse"></div>
                <p className="font-mono-technical text-sm"><span className="text-primary">ADMIN_01</span> emitió PERMANENT_BAN a <span className="text-on-surface font-bold">LURKER_99</span></p>
              </div>
              <p className="font-mono-technical text-[10px] text-on-surface-variant">08:42:12_UTC</p>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center backdrop-blur-sm p-4">
          <div className="border border-outline-variant bg-surface-container-low p-8 relative w-full max-w-md">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-on-surface-variant hover:text-white">
              <span className="material-symbols-outlined">close</span>
            </button>
            
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface uppercase mb-2">AÑADIR USUARIO</h2>
            <p className="font-mono-technical text-mono-technical text-on-surface-variant mb-6">REGISTRO MANUAL EN LA BASE DE DATOS</p>
            
            {message && (
              <div className={`p-4 mb-6 border ${message.includes('ERROR') ? 'border-error text-error' : 'border-primary text-primary'} font-label-sm uppercase`}>
                {message}
              </div>
            )}

            <form onSubmit={handleAddSubscriber} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm uppercase text-on-surface-variant">Correo Electrónico</label>
                <input 
                  type="email" 
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required 
                  className="bg-surface border border-outline-variant p-3 text-on-surface focus:border-primary outline-none font-mono-technical" 
                  placeholder="ejemplo@correo.com" 
                />
              </div>

              <button type="submit" className="bg-primary-container text-on-surface py-4 uppercase font-label-sm font-bold tracking-widest hover:bg-inverse-primary transition-colors">
                EJECUTAR REGISTRO
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
