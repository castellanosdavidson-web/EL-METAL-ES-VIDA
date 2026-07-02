"use client";
import React, { useState, useEffect } from 'react';

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
      const response = await fetch('/api/articles', {
        method: 'POST',
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
    <div className="bg-background min-h-screen text-on-surface font-body-md overflow-x-hidden flex">
      {/* SideNavBar */}
      <aside className="fixed left-0 top-0 h-screen flex flex-col border-r border-outline-variant/20 bg-surface-dim w-64 z-50">
        <div className="p-gutter flex flex-col gap-base">
          <h1 className="font-headline-md text-headline-md text-primary tracking-tighter uppercase font-bold mt-4">METAL_ARCHIVE</h1>
          <div className="flex items-center gap-stack-tight mt-stack-loose">
            <div className="w-10 h-10 bg-primary-container rounded-sm flex items-center justify-center overflow-hidden">
              <span className="material-symbols-outlined text-white">person</span>
            </div>
            <div>
              <p className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface">OPERATOR_01</p>
              <p className="text-[10px] uppercase tracking-tighter text-on-surface-variant opacity-60">System Administrator</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 mt-stack-loose flex flex-col">
          <a className="flex items-center gap-stack-tight bg-primary text-on-primary font-bold px-4 py-3 border-l-4 border-on-primary-fixed-variant" href="#">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest">Dashboard</span>
          </a>
          <a className="flex items-center gap-stack-tight text-on-surface-variant hover:bg-surface-variant/30 px-4 py-3 border-l-4 border-transparent hover:text-primary transition-all" href="#">
            <span className="material-symbols-outlined">article</span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest">Artículos</span>
          </a>
          <a className="flex items-center gap-stack-tight text-on-surface-variant hover:bg-surface-variant/30 px-4 py-3 border-l-4 border-transparent hover:text-primary transition-all" href="#">
            <span className="material-symbols-outlined">inventory_2</span>
            <span class="font-label-sm text-label-sm uppercase tracking-widest">Productos</span>
          </a>
          <a className="flex items-center gap-stack-tight text-on-surface-variant hover:bg-surface-variant/30 px-4 py-3 border-l-4 border-transparent hover:text-primary transition-all" href="#">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest">Ajustes</span>
          </a>
        </nav>
        <div className="mt-auto border-t border-outline-variant/10 p-gutter flex flex-col gap-base">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary-container hover:bg-inverse-primary text-white font-bold py-3 px-4 flex items-center justify-center gap-2 uppercase font-label-sm text-label-sm tracking-widest mb-gutter transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            NEW_ENTRY
          </button>
          <a className="flex items-center gap-stack-tight text-on-surface-variant hover:text-error px-2 py-1 font-label-sm text-label-sm uppercase transition-all mb-4" href="/">
            <span className="material-symbols-outlined">logout</span>
            Exit to Home
          </a>
        </div>
      </aside>

      {/* Main Canvas */}
      <div className="ml-64 w-full flex-1 flex flex-col max-w-[calc(100vw-16rem)] min-h-screen">
        {/* TopNavBar */}
        <header className="sticky top-0 z-40 flex justify-between items-center w-full px-gutter bg-background border-b border-outline-variant/20 h-16">
          <div className="flex items-center gap-gutter">
            <span className="material-symbols-outlined text-primary ml-4">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-on-surface-variant font-mono-technical text-mono-technical w-64 uppercase tracking-widest outline-none" placeholder="SEARCH_ARCHIVE..." type="text"/>
          </div>
          <div className="flex items-center gap-gutter pr-gutter">
            <span className="font-mono-technical text-mono-technical text-primary">v2.4.0_CORE</span>
          </div>
        </header>

        <main className="p-8 flex-1">
          {/* Quick Stats Bento Grid */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-masonry-gap mb-stack-loose">
            <div className="technical-border p-gutter flex flex-col justify-between hover:bg-surface-container-low transition-colors group p-4 bg-surface-container-low">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Total Artículos</span>
              <div className="flex items-baseline justify-between mt-base">
                <span className="font-display-lg text-display-lg text-primary">{articles.length}</span>
                <span className="text-primary-container material-symbols-outlined">article</span>
              </div>
            </div>
            <div className="technical-border p-gutter flex flex-col justify-between hover:bg-surface-container-low transition-colors group p-4 bg-surface-container-low">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Total Productos</span>
              <div className="flex items-baseline justify-between mt-base">
                <span className="font-display-lg text-display-lg text-primary">0</span>
                <span className="text-primary-container material-symbols-outlined">inventory_2</span>
              </div>
            </div>
            <div className="technical-border p-gutter flex flex-col justify-between hover:bg-surface-container-low transition-colors group p-4 bg-surface-container-low">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Ventas del Mes</span>
              <div className="flex items-baseline justify-between mt-base">
                <span className="font-display-lg text-display-lg text-primary">$0</span>
                <span className="text-primary-container material-symbols-outlined">payments</span>
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
            <div className="xl:col-span-2 technical-border overflow-hidden bg-surface-container-lowest">
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
                      articles.map((article) => (
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

            {/* Featured Products Placeholder */}
            <div className="technical-border flex flex-col h-full bg-surface-container-lowest">
              <div className="bg-surface-variant/20 p-4 border-b border-outline-variant/20 flex justify-between items-center">
                <h2 className="font-headline-md text-headline-md text-on-surface">PRODUCTOS TOP</h2>
              </div>
              <div className="p-4 flex flex-col gap-4">
                <p className="text-on-surface-variant text-sm text-center py-8">Conecta la tienda para ver estadísticas reales.</p>
              </div>
            </div>
          </div>

          {/* System Health */}
          <section className="mt-8 technical-border p-4 bg-surface-container-lowest/50 relative overflow-hidden h-32 flex items-center justify-center">
            <div className="relative z-10 text-center">
              <p className="font-mono-technical text-mono-technical text-primary-container animate-pulse">SYSTEM_STATUS: NOMINAL // ARCHIVE_INTEGRITY: 100%</p>
            </div>
          </section>
        </main>
      </div>

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
                <label className="font-label-sm text-label-sm uppercase text-on-surface-variant">Clave de Acceso</label>
                <input type="password" name="password" required className="bg-surface border border-outline-variant p-3 text-on-surface focus:border-primary outline-none font-mono-technical" placeholder="Contraseña de admin" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm uppercase text-on-surface-variant">Título del Artículo</label>
                <input type="text" name="title" required className="bg-surface border border-outline-variant p-3 text-on-surface focus:border-primary outline-none font-headline-md" placeholder="Ej: Mecánica del Blast Beat" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm uppercase text-on-surface-variant">Categoría</label>
                  <select name="category" className="bg-surface border border-outline-variant p-3 text-on-surface focus:border-primary outline-none font-mono-technical">
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
    </div>
  );
}
