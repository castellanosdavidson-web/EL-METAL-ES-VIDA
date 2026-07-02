import React from 'react';
import Image from 'next/image';

const POSTS = [
  { id: 1, img: "post 1.png", title: "Acústica del Caos", desc: "Patrones de onda destructivos en afinaciones drop-A. Análisis espectral de la pesadez.", category: "Ciencia del Sonido", icon: "graphic_eq" },
  { id: 2, img: "post 2.png", title: "Metálica Estructural", desc: "La densidad del titanio vs la densidad del Death Metal. Un paralelismo sonoro.", category: "Ciencia del Sonido", icon: "biotech" },
  { id: 3, img: "post 3.png", title: "Pedales de Distorsión V1", desc: "Circuitos integrados de la vieja escuela. Mapeo esquemático del Boss DS-1 original.", category: "Historia", icon: "history" },
  { id: 4, img: "post 4.png", title: "Frecuencias Subgraves", desc: "El impacto físico del bajo a 40Hz en el sistema nervioso humano durante conciertos en vivo.", category: "Anatomía", icon: "monitor_heart" },
  { id: 5, img: "post 5.png", title: "Sintaxis del Blast Beat", desc: "Matemáticas aplicadas a los ritmos de batería a más de 250 BPM. Precisión milimétrica.", category: "Ciencia del Sonido", icon: "speed" },
  { id: 6, img: "post 6.png", title: "Iconografía Oculta", desc: "Decodificando los símbolos arcanos en las portadas del Black Metal noruego de los 90s.", category: "Símbolos", icon: "visibility" },
  { id: 7, img: "post 7.png", title: "Amplificación a Válvulas", desc: "Termodinámica de los cabezales Marshall de 100 watts al máximo rendimiento sostenido.", category: "Equipamiento", icon: "speaker" },
  { id: 8, img: "post 8.png", title: "Cuerdas y Tensión", desc: "Calibres de cuerdas y su relación con la fatiga del material tras 100 horas de thrash.", category: "Equipamiento", icon: "construction" },
  { id: 9, img: "Post 9.png", title: "Génesis del Growl", desc: "Anatomía vocal: estrés en las cuerdas vocales al ejecutar guturales profundos sostenidos.", category: "Anatomía", icon: "record_voice_over" },
  { id: 10, img: "Post 10.png", title: "Logos Ilegibles", desc: "Estudio tipográfico de por qué la ilegibilidad se convirtió en el estándar estético del Death Metal.", category: "Símbolos", icon: "draw" },
  { id: 11, img: "Post 11.png", title: "El Factor Mosh Pit", desc: "Cinemática de multitudes: simulación de colisiones y flujos de energía en círculos de la muerte.", category: "Anatomía", icon: "groups" },
  { id: 12, img: "Post 12.png", title: "Vanguardia Sudamericana", desc: "Registro técnico de las primeras grabaciones de Sepultura y su influencia tectónica.", category: "Historia", icon: "public" },
  { id: 13, img: "Post 13.png", title: "Ecualización en V", desc: "El corte de medios: análisis psicológico del impacto de la EQ extrema en los oyentes de los 80s.", category: "Ciencia del Sonido", icon: "tune" },
  { id: 14, img: "Post 14.png", title: "Madera y Resonancia", desc: "Densidad de la caoba frente al aliso y su mito o realidad en la propagación de riffs densos.", category: "Equipamiento", icon: "forest" },
  { id: 15, img: "Post 15.png", title: "Estética de Púas", desc: "Aerodinámica de las púas de guitarra de 2.0mm vs 0.8mm en la velocidad de picking alterno.", category: "Equipamiento", icon: "speed" },
  { id: 16, img: "Post 16.png", title: "Mitología de la Cinta", desc: "Saturación magnética y distorsión armónica en grabaciones análogas de demos de 1985.", category: "Ciencia del Sonido", icon: "cassette_tape" },
  { id: 17, img: "Post 17.png", title: "Biomecánica del Doble Pedal", desc: "Optimización del esfuerzo muscular de los gemelos en ráfagas de doble bombo prolongadas.", category: "Anatomía", icon: "directions_run" },
  { id: 18, img: "Post 18.png", title: "Oscuridad Analógica", desc: "Decadencia y renacimiento de los formatos análogos en la era de la producción clínica digital.", category: "Historia", icon: "album" }
];

export default function EnciclopediaPage() {
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
          Datos, líneas de tiempo y la ciencia que el 95% de la gente desconoce. Un registro quirúrgico de la evolución sónica y cultural. Catálogo completo de 18 expedientes desclasificados.
        </p>
      </section>

      {/* Encyclopedic Masonry Grid */}
      <section className="columns-1 md:columns-2 lg:columns-3 gap-masonry-gap space-y-masonry-gap">
        {POSTS.map((post) => (
          <article key={post.id} className="break-inside-avoid border border-outline-variant/30 flex flex-col bg-surface-container-low group cursor-pointer relative overflow-hidden">
            <div className="w-full relative pt-[75%] bg-surface-variant">
              <Image 
                src={`/posts/${post.img}`} 
                alt={post.title}
                fill
                className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
              />
              <div className="absolute top-2 left-2 bg-surface border border-outline-variant px-2 py-1 flex items-center gap-1 z-10 shadow-md">
                <span className="material-symbols-outlined text-[14px] text-primary">{post.icon}</span>
                <span className="font-label-sm text-label-sm uppercase text-on-surface">{post.category}</span>
              </div>
            </div>
            <div className="p-4 flex flex-col gap-2 border-t border-outline-variant/30 bg-surface-container-lowest relative z-20">
              <h2 className="font-headline-md text-headline-md text-on-surface leading-tight group-hover:text-primary transition-colors">{post.title}</h2>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm">{post.desc}</p>
              <a 
                href={`/posts/${post.img}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-2 flex items-center gap-2 text-primary font-label-sm text-label-sm uppercase opacity-80 group-hover:opacity-100 cursor-pointer"
              >
                <span>Ver Registro</span>
                <span className="material-symbols-outlined text-[16px] transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </a>
            </div>
          </article>
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
