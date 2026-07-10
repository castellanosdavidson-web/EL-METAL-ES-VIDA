import React from 'react';

export default function ClubPrivadoPage() {
  return (
    <main className="flex-1 pt-16 flex flex-col w-full mx-auto px-margin-mobile md:px-margin-desktop mt-stack-loose mb-stack-loose max-w-7xl">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center mb-stack-loose py-stack-loose border-b border-outline-variant/20">
        <span className="material-symbols-outlined text-primary text-6xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg uppercase text-on-surface font-bold tracking-tight mb-stack-tight">
          El Underground no es para todos.
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto mb-stack-loose">
          Únete al Club Privado. Accede a documentales sin censura, análisis técnicos de riffs históricos y una comunidad de élite que valora la pureza del sonido pesado.
        </p>
      </section>

      {/* Pricing Tiers (Hormozi Style) */}
      <section className="mb-stack-loose">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-masonry-gap">
          {/* Tier 1 */}
          <div className="border border-outline-variant/50 p-6 flex flex-col bg-surface-container-low relative group hover:border-primary/50 transition-colors">
            <div className="absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-on-surface-variant">castle</span>
            </div>
            <h3 className="font-headline-md text-headline-md uppercase text-on-surface font-bold mb-2">Cassette</h3>
            <div className="flex items-baseline mb-4">
              <span className="font-display-lg text-display-lg text-primary">$3</span>
              <span className="font-body-md text-body-md text-on-surface-variant ml-2">/mes</span>
            </div>
            <ul className="flex-1 space-y-3 mb-6 font-mono-technical text-mono-technical text-on-surface-variant">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-sm shrink-0">check</span>
                Acceso al foro de la Legión
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-sm shrink-0">check</span>
                1 artículo exclusivo mensual
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-sm shrink-0">check</span>
                Insignia digital básica
              </li>
            </ul>
            <button className="w-full py-4 border-2 border-primary text-primary hover:bg-primary-container hover:text-on-primary-container font-label-sm text-label-sm uppercase tracking-widest transition-colors font-bold">
              Elegir Cassette
            </button>
          </div>

          {/* Tier 2 (Highlighted) */}
          <div className="border border-outline p-6 flex flex-col bg-surface-container relative shadow-[0_0_0_1px_rgba(138,3,3,1)] transform md:-translate-y-4">
            <div className="absolute top-0 right-0 p-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>album</span>
            </div>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-container text-on-primary-container px-3 py-1 font-label-sm text-label-sm uppercase font-bold tracking-widest border border-primary">
              Recomendado
            </div>
            <h3 className="font-headline-md text-headline-md uppercase text-on-surface font-bold mb-2 mt-4">Vinilo</h3>
            <div className="flex items-baseline mb-4">
              <span className="font-display-lg text-display-lg text-primary">$9</span>
              <span className="font-body-md text-body-md text-on-surface-variant ml-2">/mes</span>
            </div>
            <ul className="flex-1 space-y-3 mb-6 font-mono-technical text-mono-technical text-on-surface-variant">
              <li className="flex items-start gap-2 text-on-surface">
                <span className="material-symbols-outlined text-primary text-sm shrink-0">check</span>
                Todo lo de Cassette
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-sm shrink-0">check</span>
                Documentales sin censura
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-sm shrink-0">check</span>
                Análisis técnicos de riffs
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-sm shrink-0">check</span>
                Voto en futuros temas
              </li>
            </ul>
            <button className="w-full py-4 bg-primary-container text-on-primary-container border-2 border-primary hover:bg-inverse-primary font-label-sm text-label-sm uppercase tracking-widest transition-colors font-bold shadow-[inset_0_0_0_1px_rgba(245,245,245,0.2)]">
              Elegir Vinilo
            </button>
          </div>

          {/* Tier 3 */}
          <div className="border border-outline-variant/50 p-6 flex flex-col bg-surface-container-low relative group hover:border-primary/50 transition-colors">
            <div className="absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-on-surface-variant">stars</span>
            </div>
            <h3 className="font-headline-md text-headline-md uppercase text-on-surface font-bold mb-2">Backstage</h3>
            <div className="flex items-baseline mb-4">
              <span className="font-display-lg text-display-lg text-primary">$25</span>
              <span className="font-body-md text-body-md text-on-surface-variant ml-2">/mes</span>
            </div>
            <ul className="flex-1 space-y-3 mb-6 font-mono-technical text-mono-technical text-on-surface-variant">
              <li className="flex items-start gap-2 text-on-surface">
                <span className="material-symbols-outlined text-primary text-sm shrink-0">check</span>
                Todo lo de Vinilo
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-sm shrink-0">check</span>
                Q&amp;A mensual en vivo
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-sm shrink-0">check</span>
                Merchandising exclusivo
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-sm shrink-0">check</span>
                Mención en los créditos
              </li>
            </ul>
            <button className="w-full py-4 border-2 border-primary text-primary hover:bg-primary-container hover:text-on-primary-container font-label-sm text-label-sm uppercase tracking-widest transition-colors font-bold">
              Elegir Backstage
            </button>
          </div>
        </div>
      </section>

      {/* Testimonial Wall */}
      <section className="border-t border-outline-variant/20 pt-stack-loose">
        <h2 className="font-headline-md-mobile text-headline-md-mobile md:font-headline-md md:text-headline-md uppercase text-center text-on-surface font-bold mb-stack-loose tracking-widest">
          La Legión Habla
        </h2>
        <div className="columns-1 md:columns-2 lg:columns-3 gap-masonry-gap space-y-masonry-gap">
          {/* Testimonial 1 */}
          <div className="break-inside-avoid border border-outline-variant/50 p-4 bg-surface-container-lowest">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-surface-variant rounded-none border border-outline-variant overflow-hidden">
                <img alt="Avatar" className="w-full h-full object-cover grayscale opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2f7s2n7leoKZDRad1Xk0mRJ69XIJGEahtItpaDy4VmSKWd63G7I5RDf-Etxzouj9-7qcPZTVFu0CHF9IaDfuCfnY2VwMWvXctQ6OVXxm0w6RvjxJpp4FXgJ4_Jmv-KicCbFoScCNYjEp18AxWKMhgeLHx0_08iJnwk2FXRZ9tjKvW_HQGozur-Qe4OaEdiMZC4yHqkkYKAxm6QA_n2L5priLUKX75j-X3_GlwkdBS1kw5EMkv40plvjPPJqRYd7pk0dCO9YRI4A" />
              </div>
              <div>
                <p className="font-mono-technical text-mono-technical text-on-surface font-bold uppercase">@ThrashMaster</p>
                <p className="font-label-sm text-label-sm text-primary">Vinilo</p>
              </div>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant italic">"El nivel de detalle en los análisis de riffs es enfermo. Esto no se encuentra en ningún otro lado. Puro respeto."</p>
          </div>

          {/* Testimonial 2 */}
          <div className="break-inside-avoid border border-outline-variant/50 p-4 bg-surface-container-lowest">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-surface-variant rounded-none border border-outline-variant overflow-hidden flex items-center justify-center">
                <span className="font-mono-technical text-mono-technical text-on-surface">DO</span>
              </div>
              <div>
                <p className="font-mono-technical text-mono-technical text-on-surface font-bold uppercase">DoomOperative</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Cassette</p>
              </div>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant italic">"Entré por los documentales, me quedé por la comunidad. Gente que sabe de lo que habla, sin posers."</p>
          </div>

          {/* Testimonial 3 */}
          <div className="break-inside-avoid border border-outline-variant/50 p-4 bg-surface-container-lowest border-l-2 border-l-primary">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-surface-variant rounded-none border border-outline-variant overflow-hidden">
                <img alt="Avatar" className="w-full h-full object-cover grayscale opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYhujLwcP0eou50i8a3SCMmzCASjafx6bmERLlbgKJi5_ok6xbYwZ8whvsPjnX4HH4kf1SGji0txPq1EKoaBy_D0gTM19n1zlPoOrPrXYbKfkAnITnT3OwQkLDxzlC-7mKhprO-SR20nMx2eUPg3dxDVHABhThuIyQ-eLqH020rIlbvp4fa4r_YblfvZmn93LkDnuIo3-qUrSYaIWUBwMn_wNpwe7uOWMJL0rNInI_RkZJ79htJgXqdaIaR9y2Ovo0M1tUppwQrA" />
              </div>
              <div>
                <p className="font-mono-technical text-mono-technical text-on-surface font-bold uppercase">@RiffLord666</p>
                <p className="font-label-sm text-label-sm text-primary">Backstage</p>
              </div>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant italic">"Los Q&amp;A en vivo valen cada centavo. Poder hablar directamente sobre la producción del sonido sueco de los 90s es invaluable."</p>
          </div>
        </div>
      </section>
    </main>
  );
}
