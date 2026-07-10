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
    const { title, desc } = body;

    if (!title) {
      return NextResponse.json({ error: 'Título requerido' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Falta configurar GEMINI_API_KEY en el servidor' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const cleanDesc = desc ? desc.replace(/<[^>]*>/g, '').slice(0, 1000) : '';

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

2. "facebook_post": Copy clásico para un POST de Facebook.
   - Enfoque en Storytelling o debate técnico para incentivar la discusión (el algoritmo prioriza los hilos de comentarios largos).
   - Estructura limpia con espacios en blanco.
   - Debe retar o motivar al lector a dar su opinión técnica (ej: "¿Cuál es tu afinación favorita?", "¿Has probado este circuito?").
   - Llamado a la acción para leer la nota completa en el sitio.

3. "tiktok": Copy optimizado para TIKTOK.
   - Gancho inicial cortísimo en MAYÚSCULAS para capturar la atención en menos de 2 segundos.
   - Texto directo, dinámico, usando lenguaje coloquial/técnico de la escena.
   - Pregunta clave para fomentar que comenten el video (relevancia algorítmica).
   - Bloque de hashtags estratégicos y trending del metal (ej: #metalero #guitartok #metalcolombiano).

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

    const result = JSON.parse(response.text || '{}');
    
    return NextResponse.json({
      success: true,
      facebook_reel: result.facebook_reel || '',
      facebook_post: result.facebook_post || '',
      tiktok: result.tiktok || ''
    });
  } catch (error: any) {
    console.error('Error generating social copies:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}
