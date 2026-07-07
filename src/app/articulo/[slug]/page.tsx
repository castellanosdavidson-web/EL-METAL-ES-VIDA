import { supabase } from '@/utils/supabase';
import ArticleClient from './ArticleClient';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getArticleData(slug: string) {
  try {
    const { data: fileData, error } = await supabase.storage
      .from('articles')
      .download('posts.json');
      
    if (!error && fileData) {
      const text = await fileData.text();
      const posts = JSON.parse(text || '[]');
      const found = posts.find((a: any) => a.slug === slug || a.id.toString() === slug);
      if (found) {
        const others = posts.filter((a: any) => a.id !== found.id);
        return { article: found, others };
      }
    }
  } catch (err) {
    console.error('Error fetching post data on server:', err);
  }
  return { article: null, others: [] };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { article } = await getArticleData(slug);
  if (!article) {
    return {
      title: 'Artículo No Encontrado - EL METAL ES VIDA',
    };
  }

  const plainTextDesc = article.desc 
    ? article.desc.replace(/<[^>]*>/g, '').slice(0, 160) 
    : '';

  return {
    title: `${article.title} - EL METAL ES VIDA`,
    description: plainTextDesc,
    openGraph: {
      title: `${article.title} - EL METAL ES VIDA`,
      description: plainTextDesc,
      images: [
        {
          url: article.imageUrl || 'https://elmetalesvida.com/LOGO%202.png',
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${article.title} - EL METAL ES VIDA`,
      description: plainTextDesc,
      images: [article.imageUrl || 'https://elmetalesvida.com/LOGO%202.png'],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const { article, others } = await getArticleData(slug);
  return <ArticleClient initialArticle={article} initialOthers={others} />;
}
