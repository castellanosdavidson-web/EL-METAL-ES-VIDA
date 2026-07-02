import React from 'react';

export default function EnciclopediaPage() {
  return (
    <main className="flex-grow pt-[80px] pb-stack-loose px-margin-mobile flex flex-col gap-stack-loose md:max-w-4xl md:mx-auto w-full">
      {/* Hero Section */}
      <section className="flex flex-col gap-stack-tight border-b border-outline-variant/20 pb-stack-loose">
        <div className="flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined text-[16px]">auto_stories</span>
          <span className="font-mono-technical text-mono-technical uppercase">Archivo Técnico</span>
        </div>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">La Bóveda Histórica.</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          Datos, líneas de tiempo y la ciencia que el 95% de la gente desconoce. Un registro quirúrgico de la evolución sónica y cultural.
        </p>
      </section>

      {/* Filter Bar */}
      <section className="w-full overflow-x-auto hide-scrollbar -mx-margin-mobile px-margin-mobile">
        <div className="flex gap-3 min-w-max pb-2">
          <button className="border border-outline-variant bg-surface-container-high text-on-surface px-4 py-2 rounded-sm font-label-sm text-label-sm uppercase transition-colors">Todo</button>
          <button className="border border-outline-variant/20 text-on-surface-variant hover:text-on-surface hover:border-outline-variant px-4 py-2 rounded-sm font-label-sm text-label-sm uppercase transition-colors">Historia Colombia</button>
          <button className="border border-outline-variant/20 text-on-surface-variant hover:text-on-surface hover:border-outline-variant px-4 py-2 rounded-sm font-label-sm text-label-sm uppercase transition-colors">Ciencia del Sonido</button>
          <button className="border border-outline-variant/20 text-on-surface-variant hover:text-on-surface hover:border-outline-variant px-4 py-2 rounded-sm font-label-sm text-label-sm uppercase transition-colors">Símbolos</button>
        </div>
      </section>

      {/* Encyclopedic Masonry Grid */}
      <section className="columns-1 md:columns-2 gap-masonry-gap space-y-masonry-gap">
        {/* Item 1 */}
        <article className="break-inside-avoid border border-outline-variant/30 flex flex-col bg-surface-container-low group cursor-pointer relative overflow-hidden">
          <div className="w-full h-48 bg-surface-variant relative">
            <img className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover:opacity-100 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQ3wBQXZ-xu6MyZk6WCuIFSPEn4edMEnIHQyVR9aHY33j7t4r9Vjq6kCznliQk5PXtBRTNVp5UalCsBGv75VNBwtcgiSCu_ZU_AGKRwhzYZzZlNTUNySdOALcoZFsnR4zTtzklyCVKBbXfXNGBt-R8m_pgSnqIadmn9VnQIDl_qEGBTA9lkWlOT5Hv34ax9t2zurz9KjH4rQFi2BXNRV8-ZcoHTXsmzjdJm_p5riEtRjjV6IHHelebx2gY_rCQugsmOFIxiHEF4w" alt="Infographic" />
            <div className="absolute top-2 left-2 bg-surface border border-outline-variant px-2 py-1 flex items-center gap-1 z-10">
              <span className="material-symbols-outlined text-[14px] text-primary">biotech</span>
              <span className="font-label-sm text-label-sm uppercase text-on-surface">Anatomía</span>
            </div>
          </div>
          <div className="p-4 flex flex-col gap-2 border-t border-outline-variant/30">
            <h2 className="font-headline-md text-headline-md text-on-surface leading-tight">Evolución Cinética del Headbanging</h2>
            <p className="font-body-md text-body-md text-on-surface-variant text-sm">Análisis biomecánico del impacto cervical (1970-1995).</p>
            <div className="mt-2 flex items-center gap-2 text-primary font-label-sm text-label-sm uppercase">
              <span>Ver Registro</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </div>
          </div>
        </article>

        {/* Item 2 */}
        <article className="break-inside-avoid border border-outline-variant/30 flex flex-col bg-surface-container-low group cursor-pointer relative overflow-hidden">
          <div className="w-full h-64 bg-surface-variant relative">
            <img className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover:opacity-100 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDH1KLVhF9LXP1NeJeDqlBL3x3JZH2D5tRQR8hOstndCw8nndika4Ka_hoJQbpF3Z-QOr4ujaoSGlucbsIx8Bli83UijN_BZUZlDHAll2kt835DDVXGrlipsmWHzufjjLSQCUhHj6BoseUV04QNO9riPQn7KJctbd1ZnC6mJzhpEnVi1Xga_kfcAnkYsWy1lquDjZ4ufQxTbeRmn3F0cUDKjVNTFrfLe-Gjdk-GcKUCOO69gMWWv3NoUTKdPZQB0gx_pFuloGvR3Q" alt="Timeline" />
            <div className="absolute top-2 left-2 bg-surface border border-outline-variant px-2 py-1 flex items-center gap-1 z-10">
              <span className="material-symbols-outlined text-[14px] text-primary">history</span>
              <span className="font-label-sm text-label-sm uppercase text-on-surface">Línea de Tiempo</span>
            </div>
          </div>
          <div className="p-4 flex flex-col gap-2 border-t border-outline-variant/30">
            <h2 className="font-headline-md text-headline-md text-on-surface leading-tight">La Guerra de la Distorsión</h2>
            <p className="font-body-md text-body-md text-on-surface-variant text-sm">Desde el Boss DS-1 hasta el HM-2: la ingeniería detrás del tono sueco.</p>
          </div>
        </article>

        {/* Item 3 */}
        <article className="break-inside-avoid border border-outline-variant/30 flex flex-col bg-surface-container-low group cursor-pointer relative overflow-hidden">
          <div className="p-4 flex flex-col gap-4 border-b border-outline-variant/30">
            <div className="bg-surface border border-outline-variant px-2 py-1 flex items-center gap-1 w-max">
              <span className="material-symbols-outlined text-[14px] text-primary">data_object</span>
              <span className="font-label-sm text-label-sm uppercase text-on-surface">Data Cruda</span>
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface leading-tight">Decibelios Letales</h2>
            <p className="font-body-md text-body-md text-on-surface-variant text-sm">Registros históricos de los conciertos más ruidosos documentados antes de la regulación de 1999.</p>
          </div>
          <div className="p-4 bg-surface-container flex flex-col gap-2 font-mono-technical text-mono-technical text-on-surface-variant">
            <div className="flex justify-between border-b border-outline-variant/20 pb-1"><span>MOTÖRHEAD (1984)</span> <span className="text-primary">130 dB</span></div>
            <div className="flex justify-between border-b border-outline-variant/20 pb-1"><span>MANOWAR (1984)</span> <span className="text-primary">129.5 dB</span></div>
            <div className="flex justify-between pb-1"><span>AC/DC (1981)</span> <span className="text-primary">130+ dB</span></div>
          </div>
        </article>
      </section>

      {/* Legado Colombiano Highlight */}
      <section className="mt-stack-loose border border-outline-variant bg-surface-container-high relative overflow-hidden">
        {/* Cassette Texture Overlay */}
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
