import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const r2Url = process.env.CLOUDFLARE_R2_PUBLIC_URL;
  let articles: any[] = [];
  
  if (r2Url) {
    try {
      const res = await fetch(`${r2Url}/posts.json`, { cache: 'no-store' });
      if (res.ok) {
        const text = await res.text();
        const posts = JSON.parse(text || '[]');
        articles = posts.filter((a: any) => !a.is_hidden);
      }
    } catch (e) {
      console.error('Error fetching sitemap posts', e);
    }
  }

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `https://elmetalesvida.com/es/articulo/${article.slug || article.id}`,
    lastModified: new Date(article.created_at || new Date()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Generamos rutas para los 3 idiomas principales (es, en, pt)
  const baseRoutes: MetadataRoute.Sitemap = [
    { url: 'https://elmetalesvida.com/es', lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: 'https://elmetalesvida.com/en', lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: 'https://elmetalesvida.com/pt', lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: 'https://elmetalesvida.com/es/archivo', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://elmetalesvida.com/en/archivo', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://elmetalesvida.com/pt/archivo', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  ];

  return [...baseRoutes, ...articleEntries];
}
