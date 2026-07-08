"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { supabase } from '@/utils/supabase';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function GearPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editArticle, setEditArticle] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [desc, setDesc] = useState('');

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
    fetchArticles();
  }, []);

  const fetchArticles = () => {
    setLoadingArticles(true);
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setArticles(data.filter((a: any) => a.type === 'gear'));
      })
      .catch(console.error)
      .finally(() => setLoadingArticles(false));
  };

  const handleOpenEdit = (article: any) => {
    setEditArticle(article);
    setDesc(article.desc || '');
    setMessage('');
    setIsModalOpen(true);
  };

  const handleOpenNew = () => {
    setEditArticle(null);
    setDesc('');
    setMessage('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    setMessage('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    const imageFile = formData.get('image') as File | null;
    if (imageFile && imageFile.name && imageFile.size > 4 * 1024 * 1024) {
      setMessage('Error: La imagen de portada supera el límite de 4 MB de Vercel. Por favor, comprímela o usa una imagen más ligera.');
      setUploading(false);
      return;
    }

    formData.set('desc', desc);
    setMessage('INICIANDO CARGA...');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) throw new Error('No autorizado');

      formData.append('type', 'gear');
      if (editArticle) {
        formData.append('id', editArticle.id);
      }

      setMessage('EJECUTANDO INYECCIÓN AL SERVIDOR...');

      const response = await fetch('/api/articles', {
        method: editArticle ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const responseText = await response.text();
      let data: any;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        data = { error: `Servidor retornó código ${response.status}: ${responseText.slice(0, 100)}` };
      }

      if (response.ok) {
        setMessage(editArticle ? '¡Producto actualizado con éxito!' : '¡Producto subido con éxito!');
        fetchArticles();
        setTimeout(() => {
          setIsModalOpen(false);
          setEditArticle(null);
          setMessage('');
        }, 2000);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setMessage(`Error de conexión: ${err.message || err}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto definitivamente?')) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch(`/api/articles?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchArticles();
      } else {
        const data = await res.json();
        alert(`Error al eliminar: ${data.error}`);
      }
    } catch (e) { console.error(e); }
  };

  const handleToggleVisibility = async (article: any) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const newHiddenState = !article.is_hidden;
      const res = await fetch(`/api/articles`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: article.id, is_hidden: newHiddenState })
      });
      if (res.ok) {
        fetchArticles();
      } else {
        const data = await res.json();
        alert(`Error al ocultar: ${data.error}`);
      }
    } catch (e) { console.error(e); }
  };

  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="p-8 flex-1 flex flex-col h-full">
      <div className="space-y-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-tight">Afiliados Amazon</h2>
            <p className="font-mono-technical text-mono-technical text-on-surface-variant">DIRECTORIO: /SISTEMA/TIENDA/PRODUCTOS</p>
          </div>
          <button 
            onClick={handleOpenNew}
            className="bg-primary-container text-on-surface font-label-sm text-label-sm uppercase tracking-widest px-8 py-4 border border-primary-container hover:bg-transparent hover:text-primary transition-all duration-200 active:scale-95 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Añadir Producto
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-masonry-gap">
          <div className="p-6 border border-outline-variant/20 bg-surface-container-lowest">
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">Total Entradas</p>
            <p className="font-headline-md text-headline-md text-primary">{articles.length}</p>
          </div>
          <div className="p-6 border border-outline-variant/20 bg-surface-container-lowest">
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">Publicados</p>
            <p className="font-headline-md text-headline-md text-on-surface">{articles.filter((a:any) => !a.is_hidden).length}</p>
          </div>
          <div className="p-6 border border-outline-variant/20 bg-surface-container-lowest">
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">Borradores / Ocultos</p>
            <p className="font-headline-md text-headline-md text-on-surface">{articles.filter((a:any) => a.is_hidden).length}</p>
          </div>
          <div className="p-6 border border-outline-variant/20 bg-surface-container-lowest">
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">Estado API</p>
            <p className="font-headline-md text-headline-md text-tertiary">ACTIVO</p>
          </div>
        </div>

        <div className="flex gap-4 mb-4">
            <input 
              type="text" 
              placeholder="BUSCAR PRODUCTO..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-surface-container-lowest border border-outline-variant/20 px-4 py-2 flex-1 text-on-surface focus:border-primary outline-none font-mono-technical"
            />
        </div>

        <div className="border border-outline-variant/20 bg-surface-container-lowest overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant/40">
                  <th className="px-6 py-4 font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Producto</th>
                  <th className="px-6 py-4 font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Autor</th>
                  <th className="px-6 py-4 font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Categoría</th>
                  <th className="px-6 py-4 font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Estado</th>
                  <th className="px-6 py-4 font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {loadingArticles ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-primary animate-pulse font-mono-technical uppercase">CARGANDO INVENTARIO...</td></tr>
                ) : filteredArticles.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant font-mono-technical uppercase">NO HAY REGISTROS COINCIDENTES</td></tr>
                ) : (
                  filteredArticles.map((article, idx) => (
                    <tr key={article.id} className={`hover:bg-surface-variant/10 transition-colors group ${article.is_hidden ? 'opacity-50' : ''}`}>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-surface-container border border-outline-variant/20 overflow-hidden shrink-0">
                            {article.imageUrl ? (
                              <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-surface-variant/30">
                                <span className="material-symbols-outlined text-on-surface-variant">image</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p onClick={() => handleOpenEdit(article)} className="font-body-lg text-on-surface font-bold group-hover:text-primary transition-colors cursor-pointer">{article.title}</p>
                            <p className="font-mono-technical text-[10px] text-on-surface-variant uppercase">SKU: GEAR-{article.id.toString().slice(-4)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 font-mono-technical text-mono-technical text-on-surface">ADMIN_01</td>
                      <td className="px-6 py-5">
                        <span className="px-3 py-1 border border-outline-variant/40 text-[10px] font-label-sm uppercase tracking-wider text-on-surface-variant">{article.category}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${article.is_hidden ? 'bg-error' : 'bg-primary-container animate-pulse'}`}></span>
                          <span className="font-label-sm text-label-sm text-on-surface uppercase">{article.is_hidden ? 'Oculto' : 'Publicado'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right space-x-2">
                        <button onClick={() => handleToggleVisibility(article)} className="p-2 hover:text-primary transition-colors" title={article.is_hidden ? "Mostrar" : "Ocultar"}><span className="material-symbols-outlined text-sm">{article.is_hidden ? 'visibility_off' : 'visibility'}</span></button>
                        <button onClick={() => handleOpenEdit(article)} className="p-2 hover:text-primary transition-colors" title="Editar"><span className="material-symbols-outlined text-sm">edit</span></button>
                        <button onClick={() => handleDelete(article.id)} className="p-2 hover:text-error transition-colors" title="Eliminar"><span className="material-symbols-outlined text-sm">delete</span></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center backdrop-blur-sm p-4">
          <div className="border border-outline-variant bg-surface-container-low p-8 relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-on-surface-variant hover:text-white">
              <span className="material-symbols-outlined">close</span>
            </button>
            
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface uppercase mb-2">
              {editArticle ? 'EDITAR PRODUCTO' : 'AÑADIR PRODUCTO (AFILIADO)'}
            </h2>
            <p className="font-mono-technical text-mono-technical text-on-surface-variant mb-6">
              SISTEMA DE MONETIZACIÓN AMAZON
            </p>
            
            {message && (
              <div className={`p-4 mb-6 border ${message.includes('Error') ? 'border-error text-error' : 'border-primary text-primary'} font-label-sm uppercase`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm uppercase text-on-surface-variant">Nombre del Producto</label>
                <input type="text" name="title" defaultValue={editArticle?.title || ''} required className="bg-surface border border-outline-variant p-3 text-on-surface focus:border-primary outline-none font-headline-md" placeholder="Ej: Focusrite Scarlett 2i2" />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm uppercase text-on-surface-variant flex items-center justify-between">
                  <span>Reseña / Descripción</span>
                  <span className="text-[10px] text-primary lowercase">(Recomendado: Máx 200 caracteres)</span>
                </label>
                <div className="bg-surface border border-outline-variant text-on-surface">
                  <ReactQuill 
                    theme="snow" 
                    value={desc} 
                    onChange={setDesc} 
                    modules={quillModules}
                    className="bg-background text-on-surface font-body-md" 
                    placeholder="Descripción rápida y precisa del equipo para no saturar el diseño..." 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm uppercase text-on-surface-variant">Categoría</label>
                  <select name="category" defaultValue={editArticle?.category || 'Audio Pro'} className="bg-surface border border-outline-variant p-3 text-on-surface focus:border-primary outline-none font-mono-technical">
                    <option value="Guitarras">Guitarras</option>
                    <option value="Amplificadores">Amplificadores</option>
                    <option value="Pedales">Pedales</option>
                    <option value="Audio Pro">Audio Pro</option>
                    <option value="Accesorios">Accesorios</option>
                    <option value="Batería">Batería</option>
                    <option value="Bajo">Bajo</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm uppercase text-on-surface-variant">Fecha de Publ. (Opcional)</label>
                  <input type="datetime-local" name="publishDate" defaultValue={editArticle?.createdAt ? new Date(editArticle.createdAt).toISOString().slice(0, 16) : ''} className="bg-surface border border-outline-variant p-3 text-on-surface focus:border-primary outline-none font-mono-technical" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm uppercase text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-primary">shopping_cart</span>
                  Enlace de Afiliado (Amazon)
                </label>
                <input 
                  type="url" 
                  name="externalUrl" 
                  defaultValue={editArticle?.externalUrl || ''} 
                  required 
                  className="bg-surface border border-outline-variant p-3 text-on-surface focus:border-primary outline-none font-mono-technical" 
                  placeholder="Ej: https://amzn.to/..." 
                />
                <p className="text-[10px] font-mono-technical text-on-surface-variant/60 uppercase">Enlace directo para generar comisión al hacer clic.</p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm uppercase text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-primary">image</span>
                  URL de la Imagen (Opción 1)
                </label>
                <input 
                  type="url" 
                  name="imageUrl" 
                  defaultValue={editArticle?.imageUrl || ''} 
                  className="bg-surface border border-outline-variant p-3 text-on-surface focus:border-primary outline-none font-mono-technical" 
                  placeholder="Ej: https://m.media-amazon.com/images/..." 
                />
                <p className="text-[10px] font-mono-technical text-on-surface-variant/60 uppercase">Pega aquí el enlace de la imagen de Amazon si no quieres descargarla.</p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm uppercase text-on-surface-variant">Imagen del Producto (Opción 2: Archivo local)</label>
                <input type="file" name="image" accept="image/*" className="bg-surface border border-outline-variant p-3 text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-primary-container file:text-on-surface hover:file:bg-inverse-primary" />
              </div>

              <button type="submit" disabled={uploading} className="mt-4 bg-primary-container text-on-surface py-4 uppercase font-label-sm font-bold tracking-widest hover:bg-inverse-primary transition-colors disabled:opacity-50">
                {uploading ? 'PROCESANDO...' : (editArticle ? 'GUARDAR CAMBIOS' : 'INYECTAR A BASE DE DATOS')}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
