import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/utils/supabase';

const POSTS = [
  { id: 1, imageUrl: "/posts/post 1.png", title: "Acústica del Caos", desc: "Patrones de onda destructivos en afinaciones drop-A. Análisis espectral de la pesadez.", category: "Ciencia del Sonido", icon: "graphic_eq" },
  { id: 2, imageUrl: "/posts/post 2.png", title: "Metálica Estructural", desc: "La densidad del titanio vs la densidad del Death Metal. Un paralelismo sonoro.", category: "Ciencia del Sonido", icon: "biotech" },
  { id: 3, imageUrl: "/posts/post 3.png", title: "Pedales de Distorsión V1", desc: "Circuitos integrados de la vieja escuela. Mapeo esquemático del Boss DS-1 original.", category: "Historia", icon: "history" },
  { id: 4, imageUrl: "/posts/post 4.png", title: "Frecuencias Subgraves", desc: "El impacto físico del bajo a 40Hz en el sistema nervioso humano durante conciertos en vivo.", category: "Anatomía", icon: "monitor_heart" },
  { id: 5, imageUrl: "/posts/post 5.png", title: "Sintaxis del Blast Beat", desc: "Matemáticas aplicadas a los ritmos de batería a más de 250 BPM. Precisión milimétrica.", category: "Ciencia del Sonido", icon: "speed" },
  { id: 6, imageUrl: "/posts/post 6.png", title: "Iconografía Oculta", desc: "Decodificando los símbolos arcanos en las portadas del Black Metal noruego de los 90s.", category: "Símbolos", icon: "visibility" },
  { id: 7, imageUrl: "/posts/post 7.png", title: "Amplificación a Válvulas", desc: "Termodinámica de los cabezales Marshall de 100 watts al máximo rendimiento sostenido.", category: "Equipamiento", icon: "speaker" },
  { id: 8, imageUrl: "/posts/post 8.png", title: "Cuerdas y Tensión", desc: "Calibres de cuerdas y su relación con la fatiga del material tras 100 horas de thrash.", category: "Equipamiento", icon: "construction" },
  { id: 9, imageUrl: "/posts/Post 9.png", title: "Génesis del Growl", desc: "Anatomía vocal: estrés en las cuerdas vocales al ejecutar guturales profundos sostenidos.", category: "Anatomía", icon: "record_voice_over" },
  { id: 10, imageUrl: "/posts/Post 10.png", title: "Logos Ilegibles", desc: "Estudio tipográfico de por qué la ilegibilidad se convirtió en el estándar estético del Death Metal.", category: "Símbolos", icon: "draw" },
  { id: 11, imageUrl: "/posts/Post 11.png", title: "El Factor Mosh Pit", desc: "Cinemática de multitudes: simulación de colisiones y flujos de energía en círculos de la muerte.", category: "Anatomía", icon: "groups" },
  { id: 12, imageUrl: "/posts/Post 12.png", title: "Vanguardia Sudamericana", desc: "Registro técnico de las primeras grabaciones de Sepultura y su influencia tectónica.", category: "Historia", icon: "public" },
  { id: 13, imageUrl: "/posts/Post 13.png", title: "Ecualización en V", desc: "El corte de medios: análisis psicológico del impacto de la EQ extrema en los oyentes de los 80s.", category: "Ciencia del Sonido", icon: "tune" },
  { id: 14, imageUrl: "/posts/Post 14.png", title: "Madera y Resonancia", desc: "Densidad de la caoba frente al aliso y su mito o realidad en la propagación de riffs densos.", category: "Equipamiento", icon: "forest" },
  { id: 15, imageUrl: "/posts/Post 15.png", title: "Estética de Púas", desc: "Aerodinámica de las púas de guitarra de 2.0mm vs 0.8mm en la velocidad de picking alterno.", category: "Equipamiento", icon: "speed" },
  { id: 16, imageUrl: "/posts/Post 16.png", title: "Mitología de la Cinta", desc: "Saturación magnética y distorsión armónica en grabaciones análogas de demos de 1985.", category: "Ciencia del Sonido", icon: "cassette_tape" },
  { id: 17, imageUrl: "/posts/Post 17.png", title: "Biomecánica del Doble Pedal", desc: "Optimización del esfuerzo muscular de los gemelos en ráfagas de doble bombo prolongadas.", category: "Anatomía", icon: "directions_run" },
  { id: 18, imageUrl: "/posts/Post 18.png", title: "Oscuridad Analógica", desc: "Decadencia y renacimiento de los formatos análogos en la era de la producción clínica digital.", category: "Historia", icon: "album" }
].map(p => ({ ...p, createdAt: new Date().toISOString() }));

export async function GET() {
  try {
    const serviceSupabase = getServiceSupabase();
    
    // Upload updated posts
    const { error: updateError } = await serviceSupabase.storage
      .from('articles')
      .upload('posts.json', JSON.stringify(POSTS), {
        upsert: true,
        contentType: 'application/json'
      });

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, count: POSTS.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
