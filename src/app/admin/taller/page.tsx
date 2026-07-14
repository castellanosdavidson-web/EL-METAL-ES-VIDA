"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { supabase } from '@/utils/supabase';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function ArticulosPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editArticle, setEditArticle] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const [desc, setDesc] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [faqsRaw, setFaqsRaw] = useState('');

  const quillModules = React.useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: function(this: any) {
          const quill = this.quill;
          
          const choice = confirm(
            "¿Deseas SUBIR una imagen desde tu PC?\n\n- Presiona 'Aceptar' para subir desde tu PC.\n- Presiona 'Cancelar' para ingresar una URL de Internet."
          );
          
          if (choice) {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            input.click();

            input.onchange = async () => {
              const file = input.files?.[0];
              if (file) {
                try {
                  const { data: { session } } = await supabase.auth.getSession();
                  const token = session?.access_token;
                  
                  const uploadFormData = new FormData();
                  uploadFormData.append('file', file);
                  
                  const res = await fetch('/api/upload', {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${token}`
                    },
                    body: uploadFormData
                  });
                  
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.error || 'Error en el servidor');
                  
                  const range = quill.getSelection();
                  if (range && data.url) {
                    quill.insertEmbed(range.index, 'image', data.url);
                  }
                } catch (err: any) {
                  alert(`Error al subir la imagen: ${err.message}`);
                }
              }
            };
          } else {
            const url = prompt("Ingresa la URL de la imagen (debe iniciar con http:// o https://):");
            if (url) {
              const range = quill.getSelection();
              if (range) {
                quill.insertEmbed(range.index, 'image', url);
              }
            }
          }
        }
      }
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
        if (!data.error) setArticles(data.filter((a: any) => a.type === 'plugin'));
      })
      .catch(console.error)
      .finally(() => setLoadingArticles(false));
  };

  const handleOpenEdit = (article: any) => {
    setEditArticle(article);
    setDesc(article.desc || '');
    setYoutubeUrl(article.youtubeUrl || '');
    setFaqsRaw(article.faqsRaw || '');
    setMessage('');
    setIsModalOpen(true);
  };

  const handleOpenNew = () => {
    setEditArticle(null);
    setDesc('');
    setYoutubeUrl('');
    setFaqsRaw('');
    setMessage('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    setMessage('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Validar el tamaño del archivo en el cliente para evitar el error 413 de Vercel (4.5 MB límite)
    const imageFile = formData.get('image') as File | null;
    if (imageFile && imageFile.name && imageFile.size > 4 * 1024 * 1024) {
      setMessage('Error: La imagen de portada supera el límite de 4 MB de Vercel. Por favor, comprímela o usa una imagen más ligera.');
      setUploading(false);
      return;
    }

    // Override the description with the ReactQuill state
    // Si hay URL de YouTube, añadirla al final del contenido
    let finalDesc = desc;
    if (youtubeUrl.trim()) {
      finalDesc += `\n<p>${youtubeUrl.trim()}</p>`;
    }
    formData.set('desc', finalDesc);
    setMessage('INICIANDO CARGA...');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) throw new Error('No autorizado');

      formData.append('type', 'plugin');
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
        setMessage(editArticle ? '¡Plugin actualizado con éxito!' : '¡Plugin subido con éxito!');
        fetchArticles(); // Refrescar lista
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
    if (!confirm('¿Estás seguro de eliminar este plugin definitivamente?')) return;
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

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = filteredArticles.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <main className="p-8 flex-1 flex flex-col h-full">
      <div className="space-y-8 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="flex justify-between items-end">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-tight">Taller de Plugins</h2>
            <p className="font-mono-technical text-mono-technical text-on-surface-variant">DIRECTORIO: /SISTEMA/CONTENIDO/TALLER</p>
          </div>
          <button 
            onClick={handleOpenNew}
            className="bg-primary-container text-on-surface font-label-sm text-label-sm uppercase tracking-widest px-8 py-4 border border-primary-container hover:bg-transparent hover:text-primary transition-all duration-200 active:scale-95 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Nuevo Artículo
          </button>
        </div>

        {/* Stats Bar (Bento style) */}
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
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">Crecimiento Mensual</p>
            <p className="font-headline-md text-headline-md text-tertiary">+14.2%</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-4 mb-4">
            <input 
              type="text" 
              placeholder="BUSCAR ARTÍCULO..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-surface-container-lowest border border-outline-variant/20 px-4 py-2 flex-1 text-on-surface focus:border-primary outline-none font-mono-technical"
            />
        </div>

        {/* Main List Table */}
        <div className="border border-outline-variant/20 bg-surface-container-lowest overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant/40">
                  <th className="px-6 py-4 font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Título</th>
                  <th className="px-6 py-4 font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Autor</th>
                  <th className="px-6 py-4 font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Categoría</th>
                  <th className="px-6 py-4 font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Estado</th>
                  <th className="px-6 py-4 font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Fecha</th>
                  <th className="px-6 py-4 font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {loadingArticles ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-primary animate-pulse font-mono-technical uppercase">CARGANDO ARCHIVOS DEL NÚCLEO...</td></tr>
                ) : paginatedArticles.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant font-mono-technical uppercase">NO HAY REGISTROS COINCIDENTES</td></tr>
                ) : (
                  paginatedArticles.map((article, idx) => (
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
                            <p onClick={() => handleOpenEdit(article)} className="font-body-md text-sm text-on-surface font-bold group-hover:text-primary transition-colors cursor-pointer">{article.title}</p>
                            <p className="font-mono-technical text-[10px] text-on-surface-variant uppercase">ID: ART-{article.id.toString().slice(-4)}-X</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-mono-technical text-[10px] text-on-surface whitespace-nowrap">DAVIDSON SCJ</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 border border-outline-variant/40 text-[9px] font-label-sm uppercase tracking-wider text-on-surface-variant">{article.category}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1 h-1 rounded-full ${article.is_hidden ? 'bg-error' : 'bg-primary-container animate-pulse'}`}></span>
                          <span className="text-[10px] text-on-surface uppercase font-bold tracking-wide">{article.is_hidden ? 'Oculto' : 'Publicado'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono-technical text-[10px] text-on-surface-variant">
                        {new Date(article.createdAt || Date.now()).toISOString().split('T')[0]}
                      </td>
                      <td className="px-4 py-3 text-right space-x-1 whitespace-nowrap">
                        <button onClick={() => handleToggleVisibility(article)} className="p-1 hover:text-primary transition-colors" title={article.is_hidden ? "Mostrar" : "Ocultar"}><span className="material-symbols-outlined text-[15px]">{article.is_hidden ? 'visibility_off' : 'visibility'}</span></button>
                        <button onClick={() => handleOpenEdit(article)} className="p-1 hover:text-primary transition-colors" title="Editar"><span className="material-symbols-outlined text-[15px]">edit</span></button>
                        <button onClick={() => handleDelete(article.id)} className="p-1 hover:text-error transition-colors" title="Eliminar"><span className="material-symbols-outlined text-[15px]">delete</span></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination / Footer */}
          <div className="px-6 py-4 bg-surface-container flex justify-between items-center border-t border-outline-variant/20">
            <p className="font-mono-technical text-[11px] text-on-surface-variant uppercase">
              Mostrando {paginatedArticles.length} de {filteredArticles.length} entradas
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
      </div>

      {/* Modal / Formulario */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center backdrop-blur-sm p-4">
          <div className="border border-outline-variant bg-surface-container-low p-8 relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-on-surface-variant hover:text-white">
              <span className="material-symbols-outlined">close</span>
            </button>
            
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface uppercase mb-2">
              {editArticle ? 'EDITAR ARTÍCULO' : 'INYECTAR ARTÍCULO'}
            </h2>
            <p className="font-mono-technical text-mono-technical text-on-surface-variant mb-6">
              PROTOCOLO DE {editArticle ? 'ACTUALIZACIÓN' : 'SUBIDA'} A SUPABASE
            </p>
            
            {message && (
              <div className={`p-4 mb-6 border ${message.includes('Error') ? 'border-error text-error' : 'border-primary text-primary'} font-label-sm uppercase`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Clave de acceso removida - ahora usa token seguro */}

              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm uppercase text-on-surface-variant">Título del Artículo</label>
                <input type="text" name="title" defaultValue={editArticle?.title || ''} required className="bg-surface border border-outline-variant p-3 text-on-surface focus:border-primary outline-none font-headline-md" placeholder="Ej: Mecánica del Blast Beat" />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm uppercase text-on-surface-variant">Descripción / Contenido</label>
                <div className="bg-surface border border-outline-variant text-on-surface">
                  <ReactQuill 
                    theme="snow" 
                    value={desc} 
                    onChange={setDesc} 
                    modules={quillModules}
                    className="bg-background text-on-surface font-body-md" 
                    placeholder="Extracto o contenido del artículo (soporta formato, enlaces, videos, etc)..." 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm uppercase text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-error">play_circle</span>
                  URL de Video de YouTube (Opcional)
                </label>
                <input 
                  type="url" 
                  name="youtubeUrl" 
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="bg-surface border border-outline-variant p-3 text-on-surface focus:border-primary outline-none font-mono-technical text-sm" 
                  placeholder="Ej: https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
                />
                <p className="text-[10px] font-mono-technical text-on-surface-variant/60 uppercase">Pega aquí el enlace de YouTube y se mostrará como video embebido en el artículo</p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm uppercase text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-primary">quiz</span>
                  Preguntas Frecuentes (Opcional)
                </label>
                <textarea 
                  name="faqsRaw" 
                  value={faqsRaw}
                  onChange={(e) => setFaqsRaw(e.target.value)}
                  className="bg-surface border border-outline-variant p-3 text-on-surface focus:border-primary outline-none font-mono-technical h-32" 
                  placeholder="Ejemplo:&#10;Q: ¿Cuál es el formato del plugin?&#10;A: VST3 y AU.&#10;Q: ¿Funciona en Mac M1?&#10;A: Sí, soporte nativo." 
                />
                <p className="text-[10px] font-mono-technical text-on-surface-variant/60 uppercase">Formato requerido: Inicia las preguntas con Q: y las respuestas con A:. Generará el acordeón interactivo.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm uppercase text-on-surface-variant">Categoría</label>
                  <select name="category" defaultValue={editArticle?.category || 'Distorsion'} className="bg-surface border border-outline-variant p-3 text-on-surface focus:border-primary outline-none font-mono-technical">
                    <option value="808">808</option>
                    <option value="Armónicos">Armónicos</option>
                    <option value="Bajo">Bajo</option>
                    <option value="Batería">Batería</option>
                    <option value="Bitcrusher">Bitcrusher</option>
                    <option value="Clipper">Clipper</option>
                    <option value="Compresión">Compresión</option>
                    <option value="De-esser">De-esser</option>
                    <option value="Distorsion">Distorsion</option>
                    <option value="EQs">EQs</option>
                    <option value="Espectro">Espectro</option>
                    <option value="Fases">Fases</option>
                    <option value="Guitarra">Guitarra</option>
                    <option value="Latencia">Latencia</option>
                    <option value="LoFi">LoFi</option>
                    <option value="Orquestal">Orquestal</option>
                    <option value="Piano">Piano</option>
                    <option value="Side-Chain">Side-Chain</option>
                    <option value="Sintes">Sintes</option>
                    <option value="Transiente">Transiente</option>
                    <option value="Vocal">Vocal</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm uppercase text-on-surface-variant">Tiempo de Lectura</label>
                  <input type="text" name="readTime" defaultValue={editArticle?.readTime || ''} className="bg-surface border border-outline-variant p-3 text-on-surface focus:border-primary outline-none font-mono-technical" placeholder="Ej: 12 Minutos" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm uppercase text-on-surface-variant">Fecha de Publ. (Opcional)</label>
                  <input type="datetime-local" name="publishDate" defaultValue={editArticle?.createdAt ? new Date(editArticle.createdAt).toISOString().slice(0, 16) : ''} className="bg-surface border border-outline-variant p-3 text-on-surface focus:border-primary outline-none font-mono-technical" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm uppercase text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-primary">link</span>
                  URL del Sitio Oficial de Descarga
                </label>
                <input 
                  type="url" 
                  name="externalUrl" 
                  defaultValue={editArticle?.externalUrl || ''} 
                  required 
                  className="bg-surface border border-outline-variant p-3 text-on-surface focus:border-primary outline-none font-mono-technical" 
                  placeholder="Ej: https://plugin-nation.com/es/efectos/amplificador..." 
                />
                <p className="text-[10px] font-mono-technical text-on-surface-variant/60 uppercase">Este enlace dirige a los usuarios a la web oficial del desarrollador.</p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm uppercase text-on-surface-variant">Imagen de Portada {editArticle && '(Opcional)'}</label>
                <input type="file" name="image" accept="image/*" required={!editArticle} className="bg-surface border border-outline-variant p-3 text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-primary-container file:text-on-surface hover:file:bg-inverse-primary" />
              </div>

              <button type="submit" disabled={uploading} className="mt-4 bg-primary-container text-on-surface py-4 uppercase font-label-sm font-bold tracking-widest hover:bg-inverse-primary transition-colors disabled:opacity-50">
                {uploading ? 'PROCESANDO...' : (editArticle ? 'GUARDAR CAMBIOS' : 'EJECUTAR INYECCIÓN')}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
