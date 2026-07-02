"use client";
import React, { useState, useEffect } from 'react';

export default function ArticulosPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editArticle, setEditArticle] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = () => {
    setLoadingArticles(true);
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setArticles(data);
      })
      .catch(console.error)
      .finally(() => setLoadingArticles(false));
  };

  const handleOpenEdit = (article: any) => {
    setEditArticle(article);
    setMessage('');
    setIsModalOpen(true);
  };

  const handleOpenNew = () => {
    setEditArticle(null);
    setMessage('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    setMessage('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    if (editArticle) {
      formData.append('id', editArticle.id);
    }

    try {
      const response = await fetch('/api/articles', {
        method: editArticle ? 'PUT' : 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(editArticle ? '¡Artículo actualizado con éxito!' : '¡Artículo subido con éxito!');
        fetchArticles(); // Refrescar lista
        setTimeout(() => {
          setIsModalOpen(false);
          setEditArticle(null);
          setMessage('');
        }, 2000);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      setMessage('Error de conexión.');
    } finally {
      setUploading(false);
    }
  };

  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="p-8 flex-1 flex flex-col h-full">
      <div className="space-y-8 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="flex justify-between items-end">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-tight">Archivos Técnicos</h2>
            <p className="font-mono-technical text-mono-technical text-on-surface-variant">DIRECTORIO: /SISTEMA/CONTENIDO/ARTICULOS</p>
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
            <p className="font-headline-md text-headline-md text-on-surface">{articles.length}</p>
          </div>
          <div className="p-6 border border-outline-variant/20 bg-surface-container-lowest">
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">Borradores</p>
            <p className="font-headline-md text-headline-md text-on-surface">0</p>
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
                ) : filteredArticles.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant font-mono-technical uppercase">NO HAY REGISTROS COINCIDENTES</td></tr>
                ) : (
                  filteredArticles.map((article, idx) => (
                    <tr key={article.id} className="hover:bg-surface-variant/10 transition-colors group">
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
                            <p className="font-mono-technical text-[10px] text-on-surface-variant uppercase">ID: ART-{article.id.toString().slice(-4)}-X</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 font-mono-technical text-mono-technical text-on-surface">ADMIN_01</td>
                      <td className="px-6 py-5">
                        <span className="px-3 py-1 border border-outline-variant/40 text-[10px] font-label-sm uppercase tracking-wider text-on-surface-variant">{article.category}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-primary-container rounded-full animate-pulse"></span>
                          <span className="font-label-sm text-label-sm text-on-surface uppercase">Publicado</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 font-mono-technical text-mono-technical text-on-surface-variant">
                        {new Date(article.createdAt || Date.now()).toISOString().split('T')[0]}
                      </td>
                      <td className="px-6 py-5 text-right space-x-2">
                        <button className="p-2 hover:text-primary transition-colors" title="Ver"><span className="material-symbols-outlined text-sm">visibility</span></button>
                        <button onClick={() => handleOpenEdit(article)} className="p-2 hover:text-primary transition-colors" title="Editar"><span className="material-symbols-outlined text-sm">edit</span></button>
                        <button className="p-2 hover:text-error transition-colors" title="Eliminar"><span className="material-symbols-outlined text-sm">delete</span></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination / Footer */}
          <div className="px-6 py-4 bg-surface-container flex justify-between items-center border-t border-outline-variant/20">
            <p className="font-mono-technical text-[11px] text-on-surface-variant uppercase">Mostrando {filteredArticles.length} entradas</p>
            <div className="flex gap-2">
              <button className="w-8 h-8 flex items-center justify-center border border-outline-variant/20 hover:bg-primary-container hover:text-on-surface transition-colors active:scale-90">
                <span className="material-symbols-outlined text-xs">chevron_left</span>
              </button>
              <button className="w-8 h-8 flex items-center justify-center bg-primary-container text-on-surface font-mono-technical text-xs">1</button>
              <button className="w-8 h-8 flex items-center justify-center border border-outline-variant/20 hover:bg-primary-container hover:text-on-surface transition-colors active:scale-90">
                <span className="material-symbols-outlined text-xs">chevron_right</span>
              </button>
            </div>
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
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm uppercase text-on-surface-variant">Clave de Acceso</label>
                <input type="password" name="password" required className="bg-surface border border-outline-variant p-3 text-on-surface focus:border-primary outline-none font-mono-technical" placeholder="Contraseña de admin" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm uppercase text-on-surface-variant">Título del Artículo</label>
                <input type="text" name="title" defaultValue={editArticle?.title || ''} required className="bg-surface border border-outline-variant p-3 text-on-surface focus:border-primary outline-none font-headline-md" placeholder="Ej: Mecánica del Blast Beat" />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm uppercase text-on-surface-variant">Descripción / Contenido</label>
                <textarea name="desc" defaultValue={editArticle?.desc || ''} required className="bg-surface border border-outline-variant p-3 text-on-surface focus:border-primary outline-none font-body-md min-h-[100px]" placeholder="Extracto o contenido del artículo..."></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm uppercase text-on-surface-variant">Categoría</label>
                  <select name="category" defaultValue={editArticle?.category || 'Documental Histórico'} className="bg-surface border border-outline-variant p-3 text-on-surface focus:border-primary outline-none font-mono-technical">
                    <option value="Ciencia del Sonido">Ciencia del Sonido</option>
                    <option value="Historia">Historia</option>
                    <option value="Anatomía">Anatomía</option>
                    <option value="Equipamiento">Equipamiento</option>
                    <option value="Símbolos">Símbolos</option>
                    <option value="Documental Histórico">Documental Histórico</option>
                    <option value="Análisis Técnico">Análisis Técnico</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm uppercase text-on-surface-variant">Tiempo de Lectura</label>
                  <input type="text" name="readTime" defaultValue={editArticle?.readTime || ''} className="bg-surface border border-outline-variant p-3 text-on-surface focus:border-primary outline-none font-mono-technical" placeholder="Ej: 12 Minutos" />
                </div>
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
