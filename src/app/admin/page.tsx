"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

export default function AdminDashboard() {
  const [articles, setArticles] = useState<any[]>([]);
  const [plugins, setPlugins] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  
  const [analyticsData, setAnalyticsData] = useState<any>({
    activeUsers: '--',
    newUsers: '--',
    views: '--',
    avgEngagementMins: '--',
  });
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchArticles();
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      if (!data.error) {
        setAnalyticsData(data);
      } else {
        console.error('Analytics Error:', data.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const fetchArticles = () => {
    setLoadingArticles(true);
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setArticles(data.filter((a: any) => a.type === 'article' || !a.type));
          setPlugins(data.filter((a: any) => a.type === 'plugin'));
          setProducts(data.filter((a: any) => a.type === 'gear'));
        }
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

    const imageFile = formData.get('image') as File | null;
    if (imageFile && imageFile.name && imageFile.size > 4 * 1024 * 1024) {
      setMessage('Error: La imagen de portada supera el límite de 4 MB de Vercel. Por favor, comprímela o usa una imagen más ligera.');
      setUploading(false);
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
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
        setMessage('¡Artículo subido con éxito!');
        form.reset();
        fetchArticles(); 
        setTimeout(() => {
          setIsModalOpen(false);
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

  return (
    <main className="p-8 flex-1">
      {/* Quick Stats Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-6 gap-masonry-gap mb-stack-loose">
        <div className="md:col-span-2 technical-border p-gutter flex flex-col justify-between hover:bg-surface-container-low transition-colors group p-4 bg-surface-container-low">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Archivos Técnicos</span>
          <div className="flex items-baseline justify-between mt-base">
            <span className="font-display-lg text-display-lg text-primary">{articles.length}</span>
            <span className="text-primary-container material-symbols-outlined">article</span>
          </div>
        </div>
        <div className="md:col-span-2 technical-border p-gutter flex flex-col justify-between hover:bg-surface-container-low transition-colors group p-4 bg-surface-container-low">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Plugins (Taller)</span>
          <div className="flex items-baseline justify-between mt-base">
            <span className="font-display-lg text-display-lg text-primary">{plugins.length}</span>
            <span className="text-primary-container material-symbols-outlined">build</span>
          </div>
        </div>
        <div className="md:col-span-2 technical-border p-gutter flex flex-col justify-between hover:bg-surface-container-low transition-colors group p-4 bg-surface-container-low">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Productos (Afiliados)</span>
          <div className="flex items-baseline justify-between mt-base">
            <span className="font-display-lg text-display-lg text-primary">{products.length}</span>
            <span className="text-primary-container material-symbols-outlined">shopping_cart</span>
          </div>
        </div>

        {/* Analytics Row */}
        <div className="md:col-span-2 technical-border p-gutter flex flex-col justify-between hover:bg-surface-container-low transition-colors group p-4 bg-surface-container-low relative overflow-hidden">
          {loadingAnalytics && <div className="absolute top-0 left-0 w-full h-1 bg-primary animate-pulse"></div>}
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Visitas a Páginas (30d)</span>
          <div className="flex items-baseline justify-between mt-base">
            <span className="font-display-lg text-display-lg text-tertiary">{analyticsData.views}</span>
            <span className="text-primary-container material-symbols-outlined">visibility</span>
          </div>
        </div>
        <div className="md:col-span-2 technical-border p-gutter flex flex-col justify-between hover:bg-surface-container-low transition-colors group p-4 bg-surface-container-low relative overflow-hidden">
          {loadingAnalytics && <div className="absolute top-0 left-0 w-full h-1 bg-primary animate-pulse"></div>}
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Tiempo Prom. (Minutos)</span>
          <div className="flex items-baseline justify-between mt-base">
            <span className="font-display-lg text-display-lg text-tertiary">{analyticsData.avgEngagementMins}</span>
            <span className="text-primary-container material-symbols-outlined">timer</span>
          </div>
        </div>
        <div className="md:col-span-2 technical-border p-gutter flex flex-col justify-between hover:bg-surface-container-low transition-colors group p-4 bg-surface-container-low relative overflow-hidden">
          {loadingAnalytics && <div className="absolute top-0 left-0 w-full h-1 bg-primary animate-pulse"></div>}
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Usuarios Activos (30d)</span>
          <div className="flex items-baseline justify-between mt-base">
            <span className="font-display-lg text-display-lg text-primary">{analyticsData.activeUsers}</span>
            <span className="text-primary-container material-symbols-outlined">group</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-masonry-gap items-start">
        {/* Recents Articles Table */}
        <div className="xl:col-span-3 technical-border overflow-hidden bg-surface-container-lowest">
          <div className="bg-surface-variant/20 p-4 border-b border-outline-variant/20 flex justify-between items-center">
            <h2 className="font-headline-md text-headline-md text-on-surface">ARTÍCULOS RECIENTES</h2>
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
    </main>
  );
}
