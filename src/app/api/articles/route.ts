import { NextResponse } from 'next/server';
import { getServiceSupabase, supabase } from '@/utils/supabase';
import { GoogleGenAI } from '@google/genai';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const S3 = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});
const R2_PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL!;
const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME!;

function cleanAndParseJSON(text: string) {
  if (!text) return {};
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/, '').trim();
  }
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (innerErr) {
        throw e;
      }
    }
    throw e;
  }
}

async function translateContent(title: string, desc: string, faqsRaw: string): Promise<{
  title_en: string, 
  desc_en: string, 
  title_pt: string, 
  desc_pt: string, 
  similarBands: Array<{ band: string, song: string, description: string }>,
  similarBands_en: Array<{ band: string, song: string, description: string }>,
  similarBands_pt: Array<{ band: string, song: string, description: string }>,
  faqs_en: Array<{ question: string, answer: string }>,
  faqs_pt: Array<{ question: string, answer: string }>
}> {
  if (!process.env.GEMINI_API_KEY || !title) {
    return { title_en: '', desc_en: '', title_pt: '', desc_pt: '', similarBands: [], similarBands_en: [], similarBands_pt: [], faqs_en: [], faqs_pt: [] };
  }

  let retries = 3;
  let delay = 2500;
  let lastError: any = null;

  while (retries > 0) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Translate the following title, HTML description, and FAQs from Spanish to English AND Portuguese. 
ALSO, analyze the content (which is about metal music/production) and recommend exactly 5 similar underground metal bands (Colombian or International). For each band, provide a song name and a 1-sentence description explaining why they fit. Generate these 5 recommendations and provide their descriptions in Spanish, English, and Portuguese.

Return a JSON object exactly with these keys: 
"title_en", "desc_en", "title_pt", "desc_pt", 
"similarBands" (array of {band, song, description}), 
"similarBands_en" (array of {band, song, description}), 
"similarBands_pt" (array of {band, song, description}),
"faqs_en" (array of {question, answer}),
"faqs_pt" (array of {question, answer}).

Do not modify any HTML tags, classes, or URLs in the description during translation.

Title: ${title}
Description: ${desc}
FAQs: ${faqsRaw}`;

      const response = await ai.models.generateContent({
        model: 'gemini-flash-lite-latest',
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      
      const result = cleanAndParseJSON(response.text || '{}');
      if (!result.title_en || !result.title_pt) {
        throw new Error('La respuesta de Gemini no contiene las traducciones esperadas.');
      }
      
      return {
        title_en: result.title_en || '',
        desc_en: result.desc_en || '',
        title_pt: result.title_pt || '',
        desc_pt: result.desc_pt || '',
        similarBands: result.similarBands || [],
        similarBands_en: result.similarBands_en || [],
        similarBands_pt: result.similarBands_pt || [],
        faqs_en: result.faqs_en || [],
        faqs_pt: result.faqs_pt || []
      };
    } catch (error: any) {
      lastError = error;
      console.error(`Translation attempt failed (attempts left: ${retries - 1}):`, error.message || error);
      retries--;
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(`Error de traducción IA: ${lastError?.message || 'El servicio de Gemini no está disponible temporalmente.'}`);
}

function parseFAQs(faqsRaw: string): Array<{ question: string; answer: string }> {
  if (!faqsRaw) return [];
  const faqs: Array<{ question: string; answer: string }> = [];
  const lines = faqsRaw.split('\n');
  let currentFaq: { question: string; answer: string } | null = null;
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.toLowerCase().startsWith('q:')) {
      if (currentFaq) faqs.push(currentFaq);
      currentFaq = { question: trimmed.slice(2).trim(), answer: '' };
    } else if (trimmed.toLowerCase().startsWith('a:') && currentFaq) {
      currentFaq.answer = trimmed.slice(2).trim();
    } else if (currentFaq) {
      if (currentFaq.answer) {
        currentFaq.answer += '\n' + trimmed;
      } else {
        currentFaq.answer = trimmed;
      }
    }
  }
  if (currentFaq) faqs.push(currentFaq);
  return faqs.filter(f => f.question.trim() !== '' && f.answer.trim() !== '');
}

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await supabase.storage.from('articles').download('posts.json');
    if (error) throw error;
    
    const text = await data.text();
    const posts = JSON.parse(text || '[]');
    
    // Devolver los artículos (ordenados del más reciente al más antiguo)
    return NextResponse.json(posts.reverse());
  } catch (error: any) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'Falta token de autenticación' }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Acceso Denegado (Token inválido)' }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const artist = formData.get('artist') as string | null;
    const spineColor = formData.get('spineColor') as string | null;
    const textColor = formData.get('textColor') as string | null;
    const desc = formData.get('desc') as string;
    const category = formData.get('category') as string;
    const readTime = formData.get('readTime') as string;
    const youtubeUrl = formData.get('youtubeUrl') as string;
    const image = formData.get('image') as File;
    const cdImage = formData.get('cdImage') as File;
    const clientAudioUrl = formData.get('audioUrl') as string | null;
    const clientImageUrl = formData.get('imageUrl') as string | null;
    const type = (formData.get('type') as string) || 'article';
    const externalUrl = formData.get('externalUrl') as string | null;
    const publishDate = formData.get('publishDate') as string | null;
    const seoKeywords = formData.get('seoKeywords') as string || '';
    const faqsRaw = formData.get('faqsRaw') as string || '';
    const faqs = parseFAQs(faqsRaw);
    const isColombianLegacy = formData.get('isColombianLegacy') === 'on';
    const isNewRelease = formData.get('isNewRelease') === 'on';

    const serviceSupabase = getServiceSupabase();

    let imageUrl = clientImageUrl || '';
    if (image && image.name) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await S3.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: image.type || 'image/jpeg',
      }));
      imageUrl = `${R2_PUBLIC_URL}/${fileName}`;
    }

    let cdImageUrl = '';
    if (cdImage && cdImage.name) {
      const fileExt = cdImage.name.split('.').pop();
      const fileName = `cd_${Date.now()}.${fileExt}`;
      const arrayBuffer = await cdImage.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await S3.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: cdImage.type || 'image/jpeg',
      }));
      cdImageUrl = `${R2_PUBLIC_URL}/${fileName}`;
    }

    let audioUrl = clientAudioUrl || '';

    // Download existing posts
    const { data: fileData, error: downloadError } = await serviceSupabase.storage
      .from('articles')
      .download('posts.json');

    let posts = [];
    if (!downloadError && fileData) {
      const text = await fileData.text();
      posts = JSON.parse(text || '[]');
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    // Translate content and generate recommendations via AI
    const { title_en, desc_en, title_pt, desc_pt, similarBands, similarBands_en, similarBands_pt, faqs_en, faqs_pt } = await translateContent(title, desc || '', faqsRaw || '');

    const newPost = {
      id: Date.now().toString(),
      title,
      artist: artist || '',
      spineColor: spineColor || '',
      textColor: textColor || '',
      title_en,
      title_pt,
      slug: slug + '-' + Date.now().toString().slice(-4),
      desc: desc || '',
      desc_en,
      desc_pt,
      youtubeUrl: youtubeUrl || '',
      category,
      readTime: readTime || '',
      imageUrl,
      cdImageUrl,
      audioUrl,
      type,
      externalUrl: externalUrl || '',
      seoKeywords,
      faqsRaw,
      faqs,
      isColombianLegacy,
      isNewRelease,
      faqs_en,
      faqs_pt,
      similarBands,
      similarBands_en,
      similarBands_pt,
      createdAt: publishDate ? new Date(publishDate).toISOString() : new Date().toISOString()
    };

    posts.push(newPost);

    // Upload updated posts
    const { error: updateError } = await serviceSupabase.storage
      .from('articles')
      .upload('posts.json', JSON.stringify(posts), {
        upsert: true,
        contentType: 'application/json'
      });

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, post: newPost });
  } catch (error: any) {
    console.error('Error saving article:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'Falta token de autenticación' }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Acceso Denegado (Token inválido)' }, { status: 401 });
    }

    const formData = await request.formData();
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const artist = formData.get('artist') as string | null;
    const spineColor = formData.get('spineColor') as string | null;
    const textColor = formData.get('textColor') as string | null;
    const desc = formData.get('desc') as string;
    const category = formData.get('category') as string;
    const readTime = formData.get('readTime') as string;
    const youtubeUrl = formData.get('youtubeUrl') as string;
    const image = formData.get('image') as File | null;
    const cdImage = formData.get('cdImage') as File | null;
    const clientAudioUrl = formData.get('audioUrl') as string | null;
    const clientImageUrl = formData.get('imageUrl') as string | null;
    const type = formData.get('type') as string | null;
    const externalUrl = formData.get('externalUrl') as string | null;
    const publishDate = formData.get('publishDate') as string | null;
    const seoKeywords = formData.get('seoKeywords') as string | null;
    const faqsRaw = formData.get('faqsRaw') as string | null;
    const isColombianLegacy = formData.get('isColombianLegacy') === 'on';
    const isNewRelease = formData.get('isNewRelease') === 'on';

    const serviceSupabase = getServiceSupabase();

    // Obtener los artículos existentes
    const { data: fileData, error: downloadError } = await serviceSupabase.storage
      .from('articles')
      .download('posts.json');

    if (downloadError || !fileData) {
      throw new Error('No se pudo descargar la base de datos de artículos.');
    }

    const text = await fileData.text();
    let posts = JSON.parse(text || '[]');

    const postIndex = posts.findIndex((p: any) => p.id.toString() === id.toString());
    if (postIndex === -1) {
      return NextResponse.json({ error: 'Artículo no encontrado' }, { status: 404 });
    }

    let imageUrl = clientImageUrl || posts[postIndex].imageUrl;

    if (image && image.name && image.size > 0) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await S3.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: image.type || 'image/jpeg',
      }));
      imageUrl = `${R2_PUBLIC_URL}/${fileName}`;
    }

    let cdImageUrl = posts[postIndex].cdImageUrl || '';
    if (cdImage && cdImage.name && cdImage.size > 0) {
      const fileExt = cdImage.name.split('.').pop();
      const fileName = `cd_${Date.now()}.${fileExt}`;
      const arrayBuffer = await cdImage.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await S3.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: cdImage.type || 'image/jpeg',
      }));
      cdImageUrl = `${R2_PUBLIC_URL}/${fileName}`;
    }

    let audioUrl = clientAudioUrl || posts[postIndex].audioUrl || '';

    let slug = posts[postIndex].slug;
    if (!slug) {
      slug = (title || posts[postIndex].title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + id.toString().slice(-4);
    }

    const finalTitle = title || posts[postIndex].title;
    const finalDesc = desc !== null ? desc : posts[postIndex].desc;
    
    // Translate content via AI
    let title_en = posts[postIndex].title_en;
    let desc_en = posts[postIndex].desc_en;
    let title_pt = posts[postIndex].title_pt;
    let desc_pt = posts[postIndex].desc_pt;
    let similarBands = posts[postIndex].similarBands || [];
    let similarBands_en = posts[postIndex].similarBands_en || [];
    let similarBands_pt = posts[postIndex].similarBands_pt || [];
    let faqs_en = posts[postIndex].faqs_en || [];
    let faqs_pt = posts[postIndex].faqs_pt || [];

    if (finalTitle) {
      const translated = await translateContent(finalTitle, finalDesc || '', faqsRaw !== null ? faqsRaw : (posts[postIndex].faqsRaw || ''));
      if (translated.title_en) {
        title_en = translated.title_en;
        desc_en = translated.desc_en;
        title_pt = translated.title_pt;
        desc_pt = translated.desc_pt;
        similarBands = translated.similarBands;
        similarBands_en = translated.similarBands_en;
        similarBands_pt = translated.similarBands_pt;
        faqs_en = translated.faqs_en;
        faqs_pt = translated.faqs_pt;
      }
    }

    // Actualizar el post
    posts[postIndex] = {
      ...posts[postIndex],
      title: finalTitle,
      artist: artist !== null ? artist : posts[postIndex].artist,
      spineColor: spineColor !== null ? spineColor : posts[postIndex].spineColor,
      textColor: textColor !== null ? textColor : posts[postIndex].textColor,
      title_en,
      title_pt,
      slug: slug,
      desc: finalDesc,
      desc_en,
      desc_pt,
      youtubeUrl: youtubeUrl !== null ? youtubeUrl : (posts[postIndex].youtubeUrl || ''),
      category: category || posts[postIndex].category,
      readTime: readTime !== null ? readTime : posts[postIndex].readTime,
      imageUrl: imageUrl,
      cdImageUrl: cdImageUrl,
      audioUrl: audioUrl,
      type: type || posts[postIndex].type || 'article',
      externalUrl: externalUrl !== null ? externalUrl : (posts[postIndex].externalUrl || ''),
      seoKeywords: seoKeywords !== null ? seoKeywords : (posts[postIndex].seoKeywords || ''),
      faqsRaw: faqsRaw !== null ? faqsRaw : posts[postIndex].faqsRaw,
      faqs: faqsRaw !== null ? parseFAQs(faqsRaw) : posts[postIndex].faqs,
      isColombianLegacy: formData.has('isColombianLegacy') ? isColombianLegacy : posts[postIndex].isColombianLegacy,
      isNewRelease: formData.has('isNewRelease') ? isNewRelease : posts[postIndex].isNewRelease,
      faqs_en: faqs_en,
      faqs_pt: faqs_pt,
      similarBands: similarBands,
      similarBands_en: similarBands_en,
      similarBands_pt: similarBands_pt,
      updatedAt: new Date().toISOString(),
      ...(publishDate && { createdAt: new Date(publishDate).toISOString() })
    };

    // Subir nuevamente los posts
    const { error: updateError } = await serviceSupabase.storage
      .from('articles')
      .upload('posts.json', JSON.stringify(posts), {
        upsert: true,
        contentType: 'application/json'
      });

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, post: posts[postIndex] });
  } catch (error: any) {
    console.error('Error updating article:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'Falta token de autenticación' }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Acceso Denegado (Token inválido)' }, { status: 401 });
    }

    const { id, is_hidden } = await request.json();

    const serviceSupabase = getServiceSupabase();

    const { data: fileData, error: downloadError } = await serviceSupabase.storage
      .from('articles')
      .download('posts.json');

    if (downloadError || !fileData) {
      throw new Error('No se pudo descargar la base de datos de artículos.');
    }

    const text = await fileData.text();
    let posts = JSON.parse(text || '[]');

    const postIndex = posts.findIndex((p: any) => p.id.toString() === id.toString());
    if (postIndex === -1) {
      return NextResponse.json({ error: 'Artículo no encontrado' }, { status: 404 });
    }

    posts[postIndex].is_hidden = is_hidden;

    const { error: updateError } = await serviceSupabase.storage
      .from('articles')
      .upload('posts.json', JSON.stringify(posts), {
        upsert: true,
        contentType: 'application/json'
      });

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'Falta token de autenticación' }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Acceso Denegado (Token inválido)' }, { status: 401 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    const serviceSupabase = getServiceSupabase();

    const { data: fileData, error: downloadError } = await serviceSupabase.storage
      .from('articles')
      .download('posts.json');

    if (downloadError || !fileData) {
      throw new Error('No se pudo descargar la base de datos de artículos.');
    }

    const text = await fileData.text();
    let posts = JSON.parse(text || '[]');

    posts = posts.filter((p: any) => p.id.toString() !== id.toString());

    const { error: updateError } = await serviceSupabase.storage
      .from('articles')
      .upload('posts.json', JSON.stringify(posts), {
        upsert: true,
        contentType: 'application/json'
      });

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
