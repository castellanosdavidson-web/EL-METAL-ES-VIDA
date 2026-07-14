"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function AdminSearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          const query = q.toLowerCase();
          const filtered = data.filter((item: any) => 
            (item.title && item.title.toLowerCase().includes(query)) ||
            (item.desc && item.desc.toLowerCase().includes(query)) ||
            (item.artist && item.artist.toLowerCase().includes(query)) ||
            (item.category && item.category.toLowerCase().includes(query))
          );
          setResults(filtered);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [q]);

  const getSectionPath = (category: string, type: string) => {
    if (category === 'Bandas') return '/admin/bandas';
    if (category === 'Reseña' || type === 'cd') return '/admin/coleccion';
    if (category === 'Afiliado' || type === 'gear') return '/admin/productos';
    if (type === 'plugin') return '/admin/taller';
    return '/admin/articulos';
  };

  const getIconForCategory = (category: string, type: string) => {
    if (category === 'Bandas') return 'groups';
    if (category === 'Reseña' || type === 'cd') return 'album';
    if (category === 'Afiliado' || type === 'gear') return 'shopping_cart';
    if (type === 'plugin') return 'build';
    return 'article';
  };

  return (
    <main className="p-8 flex-1 flex flex-col h-full bg-background">
      <div className="space-y-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex justify-between items-end border-b-2 border-surface-container-highest pb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-primary">search</span>
              <span className="font-label-technical text-label-technical text-on-surface-variant">BÚSQUEDA GLOBAL</span>
            </div>
            <h1 className="text-headline-lg font-headline-lg uppercase text-on-surface tracking-tighter">
              Resultados para: "{q}"
            </h1>
          </div>
        </div>

        {/* Results List */}
        <div className="bg-surface border border-outline-variant/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent"></div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/20 bg-surface-container/50">
                  <th className="px-6 py-4 font-mono-technical text-[10px] text-on-surface-variant uppercase tracking-widest">TÍTULO / INFO</th>
                  <th className="px-6 py-4 font-mono-technical text-[10px] text-on-surface-variant uppercase tracking-widest">MÓDULO</th>
                  <th className="px-6 py-4 font-mono-technical text-[10px] text-on-surface-variant uppercase tracking-widest text-right">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {loading ? (
                  <tr><td colSpan={3} className="px-6 py-12 text-center text-primary animate-pulse font-mono-technical uppercase">BUSCANDO EN LA BASE DE DATOS...</td></tr>
                ) : results.length === 0 ? (
                  <tr><td colSpan={3} className="px-6 py-12 text-center text-on-surface-variant font-mono-technical uppercase">NO SE ENCONTRARON RESULTADOS PARA ESTE TÉRMINO</td></tr>
                ) : (
                  results.map((item, idx) => {
                    const sectionPath = getSectionPath(item.category, item.type);
                    const icon = getIconForCategory(item.category, item.type);
                    return (
                      <tr key={item.id} className="hover:bg-surface-variant/10 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-surface-container rounded-sm border border-outline-variant/30 flex items-center justify-center shrink-0 overflow-hidden relative">
                              {item.imageUrl || item.cdImageUrl ? (
                                <img src={item.imageUrl || item.cdImageUrl} alt={item.title} className="w-full h-full object-cover" />
                              ) : (
                                <span className="material-symbols-outlined text-on-surface-variant/50">{icon}</span>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-on-surface font-headline-sm uppercase leading-tight line-clamp-1">{item.title}</p>
                              <p className="text-xs text-on-surface-variant line-clamp-1 max-w-lg mt-1 font-body-sm">{item.desc?.substring(0, 100)}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-surface-container border border-outline-variant/20 font-mono-technical text-[9px] uppercase tracking-wider text-on-surface">
                            <span className="material-symbols-outlined text-[12px] text-primary">{icon}</span>
                            {item.category || item.type || 'General'}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <Link href={sectionPath} className="inline-flex items-center gap-2 px-3 py-1.5 border border-primary/50 text-primary hover:bg-primary hover:text-on-primary transition-colors text-xs font-mono-technical uppercase">
                            Ir al Módulo
                            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-surface-container flex justify-between items-center border-t border-outline-variant/20">
            <p className="font-mono-technical text-[11px] text-on-surface-variant uppercase">
              Total encontrados: {results.length}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
