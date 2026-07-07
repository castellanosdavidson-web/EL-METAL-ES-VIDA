"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

export default function AdminDashboard() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    setMessage('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('¡Artículo subido con éxito!');
        form.reset();
        fetchArticles(); // Refrescar lista
        setTimeout(() => {
          setIsModalOpen(false);
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

  return (
    <main className="p-8 flex-1">
      {/* Quick Stats Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-masonry-gap mb-stack-loose">
        <div className="technical-border p-gutter flex flex-col justify-between hover:bg-surface-container-low transition-colors group p-4 bg-surface-container-low">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Total Artículos</span>
          <div className="flex items-baseline justify-between mt-base">
            <span className="font-display-lg text-display-lg text-primary">{articles.length}</span>
            <span className="text-primary-container material-symbols-outlined">article</span>
          </div>
        </div>
        <div className="technical-border p-gutter flex flex-col justify-between hover:bg-surface-container-low transition-colors group p-4 bg-surface-container-low">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Nuevos Miembros</span>
          <div className="flex items-baseline justify-between mt-base">
            <span className="font-display-lg text-display-lg text-primary">0</span>
            <span className="text-primary-container material-symbols-outlined">person_add</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-masonry-gap items-start">
        {/* Recents Articles Table */}
        <div className="xl:col-span-3 technical-border overflow-hidden bg-surface-container-lowest">
          <div className="bg-surface-variant/20 p-4 border-b border-outline-variant/20 flex justify-between items-center">
            <h2 className="font-headline-md text-headline-md text-on-surface">ARTÍCULOS RECIENTES</h2>
            <button onClick={() => setIsModalOpen(true)} className="bg-primary-container hover:bg-inverse-primary transition-colors px-4 py-2 text-white font-bold uppercase font-label-sm text-label-sm tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">edit_note</span>
              NUEVO_ARTICULO
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-dim/50 border-b border-outline-variant/10 font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
                  <th className="p-4">Título</th>
                  <th className="p-4">Autor</th>
                  <th className="p-4">Categoría</th>
                  <th className="p-4">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 font-body-md text-body-md">
                {loadingArticles ? (
                  <tr><td colSpan={4} className="p-4 text-center text-primary animate-pulse">CARGANDO ARCHIVOS...</td></tr>
                ) : articles.length === 0 ? (
                  <tr><td colSpan={4} className="p-4 text-center text-on-surface-variant">NO HAY ARTÍCULOS EN LA BASE DE DATOS</td></tr>
                ) : (
                  articles.slice(0, 5).map((article) => (
                    <tr key={article.id} className="hover:bg-surface-variant/10 transition-colors">
                      <td className="p-4 font-semibold text-primary">{article.title}</td>
                      <td className="p-4 text-on-surface-variant">OPERATOR_01</td>
                      <td className="p-4"><span className="technical-border px-2 py-0.5 text-[10px] uppercase font-bold text-on-surface-variant bg-surface">{article.category}</span></td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                          <span className="text-[12px] uppercase">Publicado</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* System Health */}
      <section className="mt-8 technical-border p-4 bg-surface-container-lowest/50 relative overflow-hidden h-32 flex items-center justify-center">
        <div className="relative z-10 text-center">
          <p className="font-mono-technical text-mono-technical text-primary-container animate-pulse">SYSTEM_STATUS: NOMINAL // ARCHIVE_INTEGRITY: 100%</p>
        </div>
      </section>

      {/* Modal / Formulario */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center backdrop-blur-sm p-4">
          <div className="border border-outline-variant bg-surface-container-low p-8 relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-on-surface-variant hover:text-white">
              <span className="material-symbols-outlined">close</span>
            </button>
            
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface uppercase mb-2">INJECTAR ARTÍCULO</h2>
            <p className="font-mono-technical text-mono-technical text-on-surface-variant mb-6">PROTOCOLO DE SUBIDA A SUPABASE</p>
            
            {message && (
              <div className={`p-4 mb-6 border ${message.includes('Error') ? 'border-error text-error' : 'border-primary text-primary'} font-label-sm uppercase`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm uppercase text-on-surface-variant">Título del Artículo</label>
                <input type="text" name="title" required className="bg-surface border border-outline-variant p-3 text-on-surface focus:border-primary outline-none font-headline-md" placeholder="Ej: Mecánica del Blast Beat" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm uppercase text-on-surface-variant">Categoría</label>
                  <select name="category" className="bg-surface border border-outline-variant p-3 text-on-surface focus:border-primary outline-none font-mono-technical">
                    <option value="Noticias">Noticias</option>
                    <option value="Documental Histórico">Documental Histórico</option>
                    <option value="Análisis Técnico">Análisis Técnico</option>
                    <option value="Ciencia Sonora">Ciencia Sonora</option>
                    <option value="Equipamiento">Equipamiento</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm uppercase text-on-surface-variant">Tiempo de Lectura</label>
                  <input type="text" name="readTime" required className="bg-surface border border-outline-variant p-3 text-on-surface focus:border-primary outline-none font-mono-technical" placeholder="Ej: 12 Minutos" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm uppercase text-on-surface-variant">Imagen de Portada</label>
                <input type="file" name="image" accept="image/*" required className="bg-surface border border-outline-variant p-3 text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-primary-container file:text-on-surface hover:file:bg-inverse-primary" />
              </div>

              <button type="submit" disabled={uploading} className="mt-4 bg-primary-container text-on-surface py-4 uppercase font-label-sm font-bold tracking-widest hover:bg-inverse-primary transition-colors disabled:opacity-50">
                {uploading ? 'SUBIENDO DATOS...' : 'EJECUTAR INJECCIÓN'}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
