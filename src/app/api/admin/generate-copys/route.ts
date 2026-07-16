import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';
import { GoogleGenAI } from '@google/genai';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // Authenticate the admin
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'Falta token de autenticación' }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Acceso Denegado' }, { status: 401 });
    }

    const body = await request.json();
    const { title, desc, url } = body;

    if (!title) {
      return NextResponse.json({ error: 'Título requerido' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Falta configurar GEMINI_API_KEY en el servidor' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const cleanDesc = desc ? desc.replace(/<[^>]*>/g, '').slice(0, 1000) : '';

    let reelUrl = url ? `${url}?utm_source=facebook&utm_medium=reel&utm_campaign=org` : '';
    let postUrl = url ? `${url}?utm_source=facebook&utm_medium=social&utm_campaign=org` : '';
    let tiktokUrl = url ? `${url}?utm_source=tiktok&utm_medium=video&utm_campaign=org` : '';

    const prompt = `Actúas como un estratega experto en Redes Sociales y Copywriting de alto impacto enfocado en la escena del Metal y la música extrema para el portal "EL METAL ES VIDA". Tu objetivo es crear copys altamente optimizados para maximizar la retención, los comentarios y las compartidas, alineados con los algoritmos actuales. El tono debe ser brutal, agresivo, técnico y apasionado, pero adaptado al formato de cada red social.

Analiza el siguiente título y resumen de un artículo:
Título: ${title}
Contenido/Resumen: ${cleanDesc}

Genera exactamente 3 copys con los siguientes requerimientos específicos:

1. "facebook_reel": Copy optimizado para un REEL de Facebook.
   - Gancho (Hook) ultra-brutal en la primera línea.
   - Párrafos muy cortos o listas (bullet points) para fácil lectura rápida.
   - Explicación de qué verán en el video.
   - Llamado a la acción (CTA) claro para comentar o compartir.
   - Usa emojis potentes (🔥, 🎸, 💀) y hashtags del nicho.
   ${url ? `- IMPORTANTE: Al final del copy, debes incluir obligatoriamente este enlace con UTM para el rastreo: ${reelUrl}` : ''}

2. "facebook_post": Copy clásico para un POST de Facebook.
   - Enfoque en Storytelling o debate técnico para incentivar la discusión (el algoritmo prioriza los hilos de comentarios largos).
   - Estructura limpia con espacios en blanco.
   - Debe retar o motivar al lector a dar su opinión técnica (ej: "¿Cuál es tu afinación favorita?", "¿Has probado este circuito?").
   ${url ? `- IMPORTANTE: Llamado a la acción para leer la nota completa en el sitio, incluyendo obligatoriamente este enlace con UTM: ${postUrl}` : '- Llamado a la acción para leer la nota completa en el sitio.'}

3. "tiktok": Copy optimizado para TIKTOK.
   - Gancho inicial cortísimo en MAYÚSCULAS para capturar la atención en menos de 2 segundos.
   - Texto directo, dinámico, usando lenguaje coloquial/técnico de la escena.
   - Pregunta clave para fomentar que comenten el video (relevancia algorítmica).
   - Bloque de hashtags estratégicos y trending del metal (ej: #metalero #guitartok #metalcolombiano).
   ${url ? `- IMPORTANTE: Menciona que el enlace está en la bio y escribe este enlace al final para que lo referencien: ${tiktokUrl}` : ''}

Debes responder estrictamente en formato JSON con la siguiente estructura de claves (no agregues bloques de markdown como \`\`\`json, solo devuelve el objeto crudo):
{
  "facebook_reel": "Tu copy de reel...",
  "facebook_post": "Tu copy de post...",
  "tiktok": "Tu copy de tiktok..."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    let rawText = response.text || '{}';
    let result = {};
    try {
      const startIndex = rawText.indexOf('{');
      const endIndex = rawText.lastIndexOf('}');
      if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        const jsonStr = rawText.substring(startIndex, endIndex + 1);
        result = JSON.parse(jsonStr);
      } else {
        result = JSON.parse(rawText);
      }
    } catch (parseError: any) {
      console.error('Failed to parse Gemini response:', rawText);
      throw new Error('La IA generó un formato inesperado. Por favor, intenta de nuevo.');
    }
    // Fallback: Si la IA omite el enlace, se lo anexamos manualmente.
    let finalReel = result.facebook_reel || '';
    let finalPost = result.facebook_post || '';
    let finalTiktok = result.tiktok || '';

    if (url && reelUrl && !finalReel.includes(reelUrl)) finalReel += `\n\n👇 Entra aquí:\n${reelUrl}`;
    if (url && postUrl && !finalPost.includes(postUrl)) finalPost += `\n\n👇 Entra aquí:\n${postUrl}`;
    if (url && tiktokUrl && !finalTiktok.includes(tiktokUrl)) finalTiktok += `\n\n🔗 ${tiktokUrl}`;

    return NextResponse.json({
      success: true,
      facebook_reel: finalReel,
      facebook_post: finalPost,
      tiktok: finalTiktok
    });
  } catch (error: any) {
    console.error('Error generating social copies:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}
