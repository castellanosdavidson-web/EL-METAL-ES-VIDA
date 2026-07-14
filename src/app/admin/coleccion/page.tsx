"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { supabase } from '@/utils/supabase';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function ColeccionPage() {
  const [cds, setCds] = useState<any[]>([]);
  const [loadingCds, setLoadingCds] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCd, setEditCd] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);
  
  // Form fields
  const [desc, setDesc] = useState('');
  const [artist, setArtist] = useState('');
  const [spineColor, setSpineColor] = useState('#27272a');
  const [textColor, setTextColor] = useState('#ffffff');
  const [isNewRelease, setIsNewRelease] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [discPreview, setDiscPreview] = useState<string | null>(null);


  const [seoKeywords, setSeoKeywords] = useState('');
  const [faqsRaw, setFaqsRaw] = useState('');

  const quillModules = React.useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        ['link', 'image', 'video'],
        ['clean']
      ]
    }
  }), []);

  useEffect(() => {
    fetchCds();
    
    // Check for "banda" query param to auto-open modal for quick CD add
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const bandaParam = urlParams.get('banda');
      if (bandaParam) {
        // Use timeout to let the component mount fully before opening modal
        setTimeout(() => {
          handleOpenNew(bandaParam);
          window.history.replaceState({}, document.title, window.location.pathname);
        }, 100);
      }
    }
  }, []);

  const fetchCds = () => {
    setLoadingCds(true);
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setCds(data.filter((a: any) => a.type === 'cd'));
      })
      .catch(console.error)
      .finally(() => setLoadingCds(false));
  };

  const handleOpenEdit = (cd: any) => {
    setEditCd(cd);
    setDesc(cd.desc || '');
    setArtist(cd.artist || '');
    setSpineColor(cd.spineColor || '#27272a');
    setTextColor(cd.textColor || '#d4d4d8');
    setSeoKeywords(cd.seoKeywords || '');
    setFaqsRaw(cd.faqsRaw || '');
    setMessage('');
    setIsModalOpen(true);
  };

  const handleOpenNew = (eOrArtist?: React.MouseEvent | string) => {
    setEditCd(null);
    setDesc('');
    setArtist(typeof eOrArtist === 'string' ? eOrArtist : '');
    setSpineColor('#27272a');
    setTextColor('#d4d4d8');
    setSeoKeywords('');
    setFaqsRaw('');
    setMessage('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    setMessage('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      if (!token) throw new Error('No estás autenticado');

      const formElement = document.getElementById('cdForm') as HTMLFormElement;
      const formData = new FormData(formElement);
      formData.set('desc', desc);
      formData.set('type', 'cd');
      formData.set('artist', artist);
      formData.set('spineColor', spineColor);
      formData.set('textColor', textColor);
      formData.set('seoKeywords', seoKeywords);
      formData.set('faqsRaw', faqsRaw);
      
      // Default category
      if (!formData.get('category')) {
        formData.set('category', 'Reseña');
      }

      if (editCd) {
        formData.append('id', editCd.id);
      }

      const res = await fetch('/api/articles', {
        method: editCd ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al guardar');
      }

      setMessage('CD guardado exitosamente.');
      setTimeout(() => {
        setIsModalOpen(false);
        fetchCds();
      }, 1500);

    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este CD?')) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      const res = await fetch(`/api/articles?id=${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchCds();
    } catch (error: any) {
      alert(`Error al eliminar: ${error.message}`);
    }
  };

  const handleToggleHidden = async (id: string, currentHidden: boolean) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      const res = await fetch('/api/articles', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id, is_hidden: !currentHidden })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchCds();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const filteredCds = cds.filter(cd => 
    cd.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (cd.artist && cd.artist.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredCds.length / ITEMS_PER_PAGE);
  const paginatedCds = filteredCds.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="p-8 pb-32">
      <div className="flex justify-between items-end mb-8 border-b border-outline-variant/30 pb-4">
        <div>
          <h1 className="text-3xl font-headline-lg uppercase text-primary">Nuevos Lanzamientos (CDs)</h1>
          <p className="text-on-surface-variant font-body-md mt-2">Gestiona la librería de CDs (Portadas, Reseñas y Estilos).</p>
        </div>
        <button 
          onClick={handleOpenNew}
          className="bg-primary text-background px-6 py-2 uppercase tracking-widest font-bold hover:bg-primary/90 flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add_circle</span> NUEVO CD
        </button>
      </div>

      <div className="mb-6 relative">
        <span className="material-symbols-outlined absolute left-4 top-3 text-on-surface-variant">search</span>
        <input 
          type="text" 
          placeholder="Buscar álbum o artista..." 
          className="w-full bg-surface-container border border-outline-variant/30 text-on-surface p-3 pl-12 focus:border-primary focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loadingCds ? (
        <div className="text-center py-20 text-on-surface-variant animate-pulse font-mono-technical">CARGANDO_DISCOS...</div>
      ) : (
        <div className="bg-surface-container border border-outline-variant/30">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface-dim uppercase text-[10px] tracking-widest text-on-surface-variant">
                <th className="p-4">Portada</th>
                <th className="p-4">Título & Banda</th>
                <th className="p-4">Colores Lomo</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCds.map((cd) => (
                <tr key={cd.id} className="border-b border-outline-variant/10 hover:bg-surface-variant/20 transition-colors">
                  <td className="p-4">
                    <img src={cd.imageUrl} alt={cd.title} className="w-12 h-12 object-cover border border-outline-variant/50" />
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-on-surface">{cd.title}</div>
                    <div className="text-xs text-primary">{cd.artist || 'Sin Banda'}</div>
                    <div className="text-[10px] text-on-surface-variant mt-1 opacity-60">/{cd.slug}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: cd.spineColor }} title="Fondo"></div>
                      <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: cd.textColor }} title="Texto"></div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${cd.is_hidden ? 'bg-error-container text-error' : 'bg-primary-container text-white'}`}>
                      {cd.is_hidden ? 'Oculto' : 'Público'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleToggleHidden(cd.id, cd.is_hidden)} className="w-8 h-8 flex items-center justify-center bg-surface-dim hover:bg-surface-variant text-on-surface transition-colors" title={cd.is_hidden ? "Publicar" : "Ocultar"}>
                        <span className="material-symbols-outlined text-sm">{cd.is_hidden ? 'visibility' : 'visibility_off'}</span>
                      </button>
                      <button onClick={() => handleOpenEdit(cd)} className="w-8 h-8 flex items-center justify-center bg-surface-dim hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button onClick={() => handleDelete(cd.id)} className="w-8 h-8 flex items-center justify-center bg-surface-dim hover:bg-error-container hover:text-error transition-colors">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedCds.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-on-surface-variant font-mono-technical">SIN_RESULTADOS</td>
                </tr>
              )}
            </tbody>
          </table>
          
          {/* Pagination / Footer */}
          <div className="px-6 py-4 bg-surface-container flex justify-between items-center border-t border-outline-variant/20">
            <p className="font-mono-technical text-[11px] text-on-surface-variant uppercase">
              Mostrando {paginatedCds.length} de {filteredCds.length} entradas
            </p>
            {totalPages > 1 && (
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center border border-outline-variant/20 hover:bg-primary-container hover:text-on-surface transition-colors active:scale-90 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-xs">chevron_left</span>
                </button>
                <span className="flex items-center justify-center font-mono-technical text-xs px-2 text-on-surface-variant">
                  {currentPage} / {totalPages}
                </span>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center border border-outline-variant/20 hover:bg-primary-container hover:text-on-surface transition-colors active:scale-90 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-xs">chevron_right</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Editor de CD */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-container border border-outline-variant/30 max-w-4xl w-full my-8 p-0 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-dim sticky top-0 z-20">
              <h2 className="text-xl font-headline-lg uppercase text-primary">{editCd ? 'Editar Lanzamiento' : 'Nuevo Lanzamiento'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-on-surface-variant hover:text-error">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="cdForm" onSubmit={handleSubmit} className="flex flex-col gap-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Datos Básicos */}
                  <div className="flex flex-col gap-4 border border-outline-variant/20 p-4 bg-surface-dim/30">
                    <h3 className="font-label-technical text-primary mb-2">INFO DEL ÁLBUM</h3>
                    
                    <div>
                      <label className="block text-xs uppercase text-on-surface-variant mb-1 font-bold">Banda / Artista</label>
                      <input type="text" name="artist" defaultValue={editCd?.artist} required placeholder="Ej: Iron Maiden" className="w-full bg-background border border-outline-variant/50 p-2 focus:border-primary text-on-surface" onChange={(e) => setArtist(e.target.value)} />
                    </div>

                    <div>
                      <label className="block text-xs uppercase text-on-surface-variant mb-1 font-bold">Título del Álbum</label>
                      <input type="text" name="title" defaultValue={editCd?.title} required placeholder="Ej: The Number of the Beast" className="w-full bg-background border border-outline-variant/50 p-2 focus:border-primary text-on-surface" />
                    </div>

                    <div>
                      <label className="block text-xs uppercase text-on-surface-variant mb-1 font-bold">Portada (Imagen Jewel Case)</label>
                      <input 
                        type="file" 
                        name="image" 
                        accept="image/*" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = URL.createObjectURL(file);
                            setCoverPreview(url);
                          }
                        }}
                        className="w-full bg-background border border-outline-variant/50 p-2 text-on-surface file:bg-primary file:text-background file:border-0 file:px-4 file:py-1 file:mr-4 file:font-bold file:uppercase file:text-xs" 
                      />
                      {(coverPreview || editCd?.imageUrl) && (
                        <div className="mt-2 flex gap-4 items-center">
                          <img src={coverPreview || editCd?.imageUrl} alt="preview" className="w-16 h-16 object-cover border border-white/20" />
                          <span className="text-xs text-on-surface-variant">Portada Actual</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs uppercase text-on-surface-variant mb-1 font-bold">Mockup de Disco (Opcional)</label>
                      <input 
                        type="file" 
                        name="cdImage" 
                        accept="image/*" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = URL.createObjectURL(file);
                            setDiscPreview(url);
                          }
                        }}
                        className="w-full bg-background border border-outline-variant/50 p-2 text-on-surface file:bg-primary file:text-background file:border-0 file:px-4 file:py-1 file:mr-4 file:font-bold file:uppercase file:text-xs" 
                      />
                      <p className="text-[10px] text-on-surface-variant mt-1">Si subes un diseño de CD (PNG sin fondo preferiblemente), reemplazará el CD por defecto.</p>
                      {(discPreview || editCd?.cdImageUrl) && (
                        <div className="mt-2 flex gap-4 items-center">
                          <img src={discPreview || editCd?.cdImageUrl} alt="cd preview" className="w-16 h-16 object-cover border border-white/20 rounded-full" />
                          <span className="text-xs text-on-surface-variant">Disco Actual</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Estilo Visual */}
                  <div className="flex flex-col gap-4 border border-outline-variant/20 p-4 bg-surface-dim/30">
                    <h3 className="font-label-technical text-primary mb-2">ESTILO VISUAL (LOMO)</h3>
                    
                    <div>
                      <label className="block text-xs uppercase text-on-surface-variant mb-1 font-bold">Color del Lomo (CSS / HEX)</label>
                      <div className="flex gap-2">
                        <input type="color" value={spineColor.startsWith('#') ? spineColor : '#000000'} onChange={(e) => setSpineColor(e.target.value)} className="w-10 h-10 border-0 p-0 cursor-pointer" />
                        <input type="text" value={spineColor} onChange={(e) => setSpineColor(e.target.value)} placeholder="Ej: #661C10 o bg-red-950" className="flex-1 bg-background border border-outline-variant/50 p-2 focus:border-primary text-on-surface" />
                      </div>
                      <p className="text-[10px] text-on-surface-variant mt-1">Escribe el código HEX (ej. #661c10) o una clase Tailwind.</p>
                    </div>

                    <div>
                      <label className="block text-xs uppercase text-on-surface-variant mb-1 font-bold">Color del Texto (CSS / HEX)</label>
                      <div className="flex gap-2">
                        <input type="color" value={textColor.startsWith('#') ? textColor : '#ffffff'} onChange={(e) => setTextColor(e.target.value)} className="w-10 h-10 border-0 p-0 cursor-pointer" />
                        <input type="text" value={textColor} onChange={(e) => setTextColor(e.target.value)} placeholder="Ej: #FFFFFF" className="flex-1 bg-background border border-outline-variant/50 p-2 focus:border-primary text-on-surface" />
                      </div>
                    </div>

                    {/* Previsualización del lomo en tiempo real */}
                    <div className="mt-4 pt-4 border-t border-outline-variant/30 flex justify-center">
                       <div 
                         className="w-[28px] h-[250px] border-l-[2px] border-r-[2px] border-t-[2px] border-white/20 bg-clip-padding relative shadow-lg overflow-hidden"
                         style={{ backgroundColor: spineColor.startsWith('#') ? spineColor : undefined }}
                       >
                         <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/5 to-transparent pointer-events-none"></div>
                         <div 
                           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform -rotate-90 whitespace-nowrap font-mono-technical tracking-normal text-[9px] uppercase w-[220px] max-w-[220px] text-center text-ellipsis overflow-hidden"
                           style={{ color: textColor.startsWith('#') ? textColor : undefined }}
                         >
                           <span className="font-black">{artist || 'BANDA'}</span> <span className="mx-2 opacity-50">/</span> <span className="opacity-90">{editCd?.title || 'ÁLBUM'}</span>
                         </div>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Artículo / Reseña Completa */}
                <div className="flex flex-col gap-4 border border-outline-variant/20 p-4 bg-surface-dim/30">
                    <h3 className="font-label-technical text-primary mb-2">CONTENIDO DEL ARTÍCULO (PÁGINA DE DESTINO)</h3>
                    <div>
                      <label className="block text-xs uppercase text-on-surface-variant mb-1 font-bold">Categoría (Opcional)</label>
                      <input type="text" name="category" defaultValue={editCd?.category || 'Reseña'} className="w-full bg-background border border-outline-variant/50 p-2 focus:border-primary text-on-surface" />
                    </div>
                    <div className="flex items-center gap-3 bg-background border border-outline-variant/50 p-3">
                      <input 
                        type="checkbox" 
                        name="isNewRelease" 
                        id="isNewRelease"
                        defaultChecked={editCd ? editCd.isNewRelease : false} 
                        className="w-5 h-5 accent-primary cursor-pointer"
                      />
                      <div>
                        <label htmlFor="isNewRelease" className="font-label-technical text-sm text-on-surface cursor-pointer font-bold uppercase">
                          Mostrar en "Nuevos Lanzamientos" (Home)
                        </label>
                        <p className="text-[10px] text-on-surface-variant mt-1 leading-tight">
                          Si marcas esta casilla, el CD aparecerá en el carrusel de lanzamientos del inicio. <br/>
                          Si la desmarcas, solo aparecerá dentro del expediente de la Banda.
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-on-surface-variant mb-1 font-bold">Tiempo de Lectura</label>
                      <input type="text" name="readTime" defaultValue={editCd?.readTime || '5 MIN'} className="w-full bg-background border border-outline-variant/50 p-2 focus:border-primary text-on-surface" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-on-surface-variant mb-1 font-bold">Contenido Principal (Español)</label>
                      <div className="bg-surface border border-outline-variant text-on-surface">
                        <ReactQuill theme="snow" value={desc} onChange={setDesc} modules={quillModules} className="h-[300px] mb-12" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase text-on-surface-variant mb-1 font-bold">Palabras Clave SEO (Comas)</label>
                      <input type="text" value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} placeholder="metal, album, review..." className="w-full bg-background border border-outline-variant/50 p-2 focus:border-primary text-on-surface" />
                    </div>
                </div>
              </form>
            </div>
            
            <div className="p-4 border-t border-outline-variant/30 flex justify-end gap-4 bg-surface-dim sticky bottom-0 z-20">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border border-outline-variant/50 hover:bg-surface-variant transition-colors uppercase font-bold text-sm">
                Cancelar
              </button>
              <button type="submit" form="cdForm" disabled={uploading} className="bg-primary text-background px-8 py-2 font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-50">
                {uploading ? 'GUARDANDO...' : 'GUARDAR ÁLBUM'}
              </button>
            </div>
            
            {message && <div className="absolute top-4 right-4 bg-background border border-primary p-4 z-[200] shadow-2xl"><p className="text-primary font-mono-technical">{message}</p></div>}
          </div>
        </div>
      )}
    </div>
  );
}
