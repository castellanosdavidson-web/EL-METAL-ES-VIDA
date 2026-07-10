import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/utils/supabase';
import { GoogleGenAI } from '@google/genai';

export const dynamic = 'force-dynamic';

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

export async function GET() {
  try {
    const serviceSupabase = getServiceSupabase();
    
    // Download current posts
    const { data: fileData, error: downloadError } = await serviceSupabase.storage
      .from('articles')
      .download('posts.json');

    if (downloadError || !fileData) {
      return NextResponse.json({ error: 'No se pudo descargar posts.json' }, { status: 500 });
    }

    const text = await fileData.text();
    let posts = JSON.parse(text || '[]');
    let translatedCount = 0;

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      let needsUpdate = false;

      if (!post.title_pt || !post.desc_pt || !post.similarBands || post.similarBands.length === 0 || !post.similarBands_en || !post.similarBands_pt || (post.faqsRaw && (!post.faqs_en || !post.faqs_pt))) {
        needsUpdate = true;
      }

      if (needsUpdate) {
        console.log(`Translating article [${i+1}/${posts.length}]: ${post.title}`);
        const result = await translateContent(post.title, post.desc || '', post.faqsRaw || '');
        
        if (result.title_pt && result.desc_pt) {
          posts[i] = {
            ...post,
            title_en: post.title_en || result.title_en,
            desc_en: post.desc_en || result.desc_en,
            title_pt: post.title_pt || result.title_pt,
            desc_pt: post.desc_pt || result.desc_pt,
            similarBands: post.similarBands && post.similarBands.length > 0 ? post.similarBands : result.similarBands,
            similarBands_en: post.similarBands_en && post.similarBands_en.length > 0 ? post.similarBands_en : result.similarBands_en,
            similarBands_pt: post.similarBands_pt && post.similarBands_pt.length > 0 ? post.similarBands_pt : result.similarBands_pt,
            faqs: post.faqs || [],
            faqsRaw: post.faqsRaw || '',
            faqs_en: post.faqs_en && post.faqs_en.length > 0 ? post.faqs_en : result.faqs_en,
            faqs_pt: post.faqs_pt && post.faqs_pt.length > 0 ? post.faqs_pt : result.faqs_pt,
            seoKeywords: post.seoKeywords || ''
          };
          translatedCount++;
          
          // Incremental upload so we don't lose progress if execution ends or times out
          await serviceSupabase.storage
            .from('articles')
            .upload('posts.json', JSON.stringify(posts), {
              upsert: true,
              contentType: 'application/json'
            });
        }
        
        // Wait 2.5 seconds to avoid Gemini 503 Spike / Rate limits
        await new Promise(resolve => setTimeout(resolve, 2500));
      } else {
        // Just make sure keys are defined
        posts[i] = {
          ...post,
          title_en: post.title_en || '',
          desc_en: post.desc_en || '',
          title_pt: post.title_pt || '',
          desc_pt: post.desc_pt || '',
          similarBands: post.similarBands || [],
          similarBands_en: post.similarBands_en || [],
          similarBands_pt: post.similarBands_pt || [],
          faqs: post.faqs || [],
          faqsRaw: post.faqsRaw || '',
          faqs_en: post.faqs_en || [],
          faqs_pt: post.faqs_pt || [],
          seoKeywords: post.seoKeywords || ''
        };
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Migración completada. Artículos traducidos en esta tanda: ${translatedCount}`,
      totalArticles: posts.length 
    });
  } catch (error: any) {
    console.error('Error during migration:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
