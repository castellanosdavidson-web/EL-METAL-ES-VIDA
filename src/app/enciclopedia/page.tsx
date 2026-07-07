import React from 'react';
import Image from 'next/image';
import { getServiceSupabase } from '@/utils/supabase';

export const dynamic = 'force-dynamic';

// Removemos los POSTS hardcodeados

export default async function EnciclopediaPage() {
  const serviceSupabase = getServiceSupabase();
  let posts: any[] = [];
  
  try {
    const { data: fileData, error } = await serviceSupabase.storage
      .from('articles')
      .download('posts.json');
      
    if (!error && fileData) {
      const text = await fileData.text();
      posts = JSON.parse(text || '[]');
    }
  } catch (err) {
    console.error('Error fetching posts:', err);
  }

  // Filtrar solo los artículos que tengan un título y desc válidos
  // (Opcionalmente, podríamos invertir el array para mostrar los más recientes primero)
  const sortedPosts = posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <main className="flex-grow pt-[80px] pb-stack-loose px-margin-mobile flex flex-col gap-stack-loose w-full max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="flex flex-col gap-stack-tight border-b border-outline-variant/20 pb-stack-loose">
        <div className="flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined text-[16px]">auto_stories</span>
          <span className="font-mono-technical text-mono-technical uppercase">Archivo Técnico</span>
        </div>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">La Bóveda Histórica.</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          Datos, líneas de tiempo y la ciencia que el 95% de la gente desconoce. Un registro quirúrgico de la evolución sónica y cultural. Catálogo completo de expedientes desclasificados.
        </p>
      </section>

      {/* Encyclopedic Masonry Grid */}
      <section className="columns-1 md:columns-2 lg:columns-3 gap-masonry-gap space-y-masonry-gap">
        {sortedPosts.map((post) => (
          <a href={post.slug ? `/articulo/${post.slug}` : `/articulo/${post.id}`} key={post.id} className="break-inside-avoid border border-outline-variant/30 flex flex-col bg-surface-container-low group cursor-pointer relative overflow-hidden block">
            <div className="w-full relative pt-[75%] bg-surface-variant">
              <Image 
                src={post.imageUrl || '/posts/placeholder.png'} 
                alt={post.title}
                fill
                className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
              />
              <div className="absolute top-2 left-2 bg-surface border border-outline-variant px-2 py-1 flex items-center gap-1 z-10 shadow-md">
                <span className="material-symbols-outlined text-[14px] text-primary">{post.icon || 'article'}</span>
                <span className="font-label-sm text-label-sm uppercase text-on-surface">{post.category}</span>
              </div>
            </div>
            <div className="p-4 flex flex-col gap-2 border-t border-outline-variant/30 bg-surface-container-lowest relative z-20">
              <h2 className="font-headline-md text-headline-md text-on-surface leading-tight group-hover:text-primary transition-colors">{post.title}</h2>
              <div className="font-body-md text-body-md text-on-surface-variant text-sm line-clamp-3" dangerouslySetInnerHTML={{__html: post.desc}} />
              <div className="mt-2 flex items-center gap-2 text-primary font-label-sm text-label-sm uppercase opacity-80 group-hover:opacity-100 cursor-pointer">
                <span>Ver Registro</span>
                <span className="material-symbols-outlined text-[16px] transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            </div>
          </a>
        ))}
      </section>

      {/* Legado Colombiano Highlight */}
      <section className="mt-stack-loose border border-outline-variant bg-surface-container-high relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 1px, #fff 1px, #fff 2px)" }}></div>
        <div className="p-6 md:p-8 flex flex-col gap-6 relative z-10">
          <div className="flex flex-col gap-2 border-b border-outline-variant/50 pb-4">
            <span className="font-mono-technical text-mono-technical text-primary tracking-widest uppercase">Expediente Regional</span>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface uppercase">Legado Colombiano</h2>
          </div>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
            La génesis del sonido extremo en las montañas y ciudades de Colombia. Bandas que forjaron metal en medio del fuego cruzado.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="border border-outline-variant/30 p-4 bg-surface flex items-center justify-between group cursor-pointer hover:border-primary transition-colors">
              <span className="font-label-sm text-label-sm text-on-surface uppercase tracking-widest">Kraken</span>
              <span className="material-symbols-outlined text-primary text-[16px] opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0">chevron_right</span>
            </div>
            <div className="border border-outline-variant/30 p-4 bg-surface flex items-center justify-between group cursor-pointer hover:border-primary transition-colors">
              <span className="font-label-sm text-label-sm text-on-surface uppercase tracking-widest">Darkness</span>
              <span className="material-symbols-outlined text-primary text-[16px] opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0">chevron_right</span>
            </div>
            <div className="border border-outline-variant/30 p-4 bg-surface flex items-center justify-between group cursor-pointer hover:border-primary transition-colors">
              <span className="font-label-sm text-label-sm text-on-surface uppercase tracking-widest">Masacre</span>
              <span className="material-symbols-outlined text-primary text-[16px] opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0">chevron_right</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
