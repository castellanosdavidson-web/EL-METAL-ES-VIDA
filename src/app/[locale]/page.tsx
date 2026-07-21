"use client";
import React, { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import BibliotecaCDs from '@/components/ui/BibliotecaCDs';
import AdBanner from '@/components/layout/AdBanner';
import FloatingLegadoButton from '@/components/ui/FloatingLegadoButton';
const MOCK_ARTICLES = [
  {
    id: 'mock-1',
    title: 'LOS FESTIVALES DE HEAVY METAL MÁS IMPORTANTES DEL MUNDO',
    title_en: 'THE MOST IMPORTANT HEAVY METAL FESTIVALS IN THE WORLD',
    title_pt: 'OS FESTIVAIS DE HEAVY METAL MAIS IMPORTANTES DO MUNDO',
    slug: 'festivales',
    desc: 'El calendario definitivo para todo metalero. Cada año, millones de personas viajan...',
    desc_en: 'The definitive calendar for every metalhead...',
    desc_pt: 'O calendário definitivo para todo headbanger...',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLFAmwPfd1JptEwRrFyPW45HazQyL3Lytz87oUxEMPHcnNj5KSC_eWlmGPGlbyMfQspNmmCmmQ3tDHbPPb-uG7oizSxvLlprfT6KYbsCWdfTxm_SG82GBAacMw4UgKO_WHSfyH7CvjdBA3oWwXdY7f_slUfnk38CWHv6d34xHjlBhTRl5Yc5xpxDV9yRgdsBnFy1jNHw1k1rffvXJCXAdsF4LZcpMF92aR1iqK0noMlh2QWIQyYOgSfAkc2Sf5zKpHYPaLDtTt4g',
    category: 'Historia',
    type: 'article'
  },
  {
    id: 'mock-2',
    title: 'ANATOMÍA DE UNA GUITARRA DE METAL',
    title_en: 'ANATOMY OF A METAL GUITAR',
    title_pt: 'ANATOMIA DE UMA GUITARRA DE METAL',
    slug: 'anatomia-guitarra',
    desc: 'Conoce cada parte y por qué el puente flotante revolucionó el género para siempre.',
    desc_en: 'Know every part and why the floating bridge revolutionized the genre.',
    desc_pt: 'Conheça cada parte e por que a ponte flutuante revolucionou o gênero.',
    imageUrl: 'https://dxmaslijicgzrwfmzkuv.supabase.co/storage/v1/object/public/articles/1783486070494.png',
    category: 'Reseña Técnica',
    type: 'article'
  },
  {
    id: 'mock-3',
    title: 'CÓMO EL METAL SINFÓNICO CAMBIÓ LAS REGLAS',
    title_en: 'HOW SYMPHONIC METAL CHANGED THE RULES',
    title_pt: 'COMO O METAL SINFÔNICO MUDOU AS REGRAS',
    slug: 'metal-sinfonico',
    desc: 'Una inmersión profunda en la mezcla de orquestas clásicas y guitarras distorsionadas.',
    desc_en: 'A deep dive into the mix of classical orchestras and distorted guitars.',
    desc_pt: 'Um mergulho profundo na mistura de orquestras clássicas e guitarras distorcidas.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLFAmwPfd1JptEwRrFyPW45HazQyL3Lytz87oUxEMPHcnNj5KSC_eWlmGPGlbyMfQspNmmCmmQ3tDHbPPb-uG7oizSxvLlprfT6KYbsCWdfTxm_SG82GBAacMw4UgKO_WHSfyH7CvjdBA3oWwXdY7f_slUfnk38CWHv6d34xHjlBhTRl5Yc5xpxDV9yRgdsBnFy1jNHw1k1rffvXJCXAdsF4LZcpMF92aR1iqK0noMlh2QWIQyYOgSfAkc2Sf5zKpHYPaLDtTt4g',
    category: 'Ciencia',
    type: 'article'
  },
  {
    id: 'mock-4',
    title: 'EL IMPACTO DEL THRASH EN LA CULTURA',
    title_en: 'THE IMPACT OF THRASH ON CULTURE',
    title_pt: 'O IMPACTO DO THRASH NA CULTURA',
    slug: 'impacto-thrash',
    desc: 'Cómo la velocidad y agresividad del thrash redefinieron la música pesada de los años 80.',
    desc_en: 'How the speed and aggression of thrash redefined heavy music in the 80s.',
    desc_pt: 'Como a velocidade e a agressividade do thrash redefiniram a música pesada nos anos 80.',
    imageUrl: 'https://dxmaslijicgzrwfmzkuv.supabase.co/storage/v1/object/public/articles/1783486070494.png',
    category: 'Historia',
    type: 'article'
  },
  {
    id: 'mock-5',
    title: 'EL ARTE OSCURO: LAS PORTADAS QUE DEFINIERON EL GÉNERO',
    title_en: 'DARK ART: THE COVERS THAT DEFINED THE GENRE',
    title_pt: 'A ARTE NEGRA: AS CAPAS QUE DEFINIRAM O GÊNERO',
    slug: 'arte-oscuro',
    desc: 'Un recorrido visual por las portadas de discos más emblemáticas del metal.',
    desc_en: 'A visual journey through the most iconic album covers of metal.',
    desc_pt: 'Uma jornada visual pelas capas de álbuns mais icônicas do metal.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLFAmwPfd1JptEwRrFyPW45HazQyL3Lytz87oUxEMPHcnNj5KSC_eWlmGPGlbyMfQspNmmCmmQ3tDHbPPb-uG7oizSxvLlprfT6KYbsCWdfTxm_SG82GBAacMw4UgKO_WHSfyH7CvjdBA3oWwXdY7f_slUfnk38CWHv6d34xHjlBhTRl5Yc5xpxDV9yRgdsBnFy1jNHw1k1rffvXJCXAdsF4LZcpMF92aR1iqK0noMlh2QWIQyYOgSfAkc2Sf5zKpHYPaLDtTt4g',
    category: 'Ciencia',
    type: 'article'
  },
  {
    id: 'mock-6',
    title: 'GUITARRAS DE 7 Y 8 CUERDAS: LA EVOLUCIÓN DEL SONIDO',
    title_en: '7 AND 8 STRING GUITARS: THE EVOLUTION OF SOUND',
    title_pt: 'GUITARRAS DE 7 E 8 CORDAS: A EVOLUÇÃO DO SOM',
    slug: 'guitarras-extendidas',
    desc: 'Cómo el metal progresivo y el djent obligaron a expandir el rango del instrumento principal.',
    desc_en: 'How progressive metal and djent forced the expansion of the main instrument range.',
    desc_pt: 'Como o metal progressivo e o djent forçaram a expansão do alcance do instrumento principal.',
    imageUrl: 'https://dxmaslijicgzrwfmzkuv.supabase.co/storage/v1/object/public/articles/1783486070494.png',
    category: 'Reseña Técnica',
    type: 'article'
  }
];

export default function Home() {
  const t = useTranslations('Home');
  const locale = useLocale();
  const [articles, setArticles] = useState<any[]>([...MOCK_ARTICLES].slice(0, 4));
  const [plugins, setPlugins] = useState<any[]>([]);
  const [gear, setGear] = useState<any[]>([]);
  const [cds, setCds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);
  // Hero overrides from admin settings
  const [heroTitleOverride, setHeroTitleOverride] = useState('');
  const [heroTitle2Override, setHeroTitle2Override] = useState('');
  const [heroSubtitleOverride, setHeroSubtitleOverride] = useState('');

  useEffect(() => {
    // Only use locale-based overrides for ES (admin sets Spanish)
    if (locale === 'es') {
      const ht = localStorage.getItem('hero_title');
      const ht2 = localStorage.getItem('hero_title2');
      const hs = localStorage.getItem('hero_subtitle');
      if (ht) setHeroTitleOverride(ht);
      if (ht2) setHeroTitle2Override(ht2);
      if (hs) setHeroSubtitleOverride(hs);
    }
  }, [locale]);

  const getPlainText = (html: string) => {
    if (!html) return '';
    return html
      .replace(/<[^>]+>/g, ' ')  // strip HTML tags
      .replace(/&nbsp;/g, ' ')   // decode &nbsp;
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/\r?\n/g, ' ')    // strip newlines
      .replace(/\s+/g, ' ')      // collapse whitespace
      .trim();
  };

  const getCategoryIcon = (category?: string) => {
    if (!category) return 'extension';
    const cat = category.toLowerCase();
    if (cat.includes('guitar')) return 'music_note';
    if (cat.includes('bater') || cat.includes('percu')) return 'album';
    if (cat.includes('piano') || cat.includes('teclad')) return 'piano';
    if (cat.includes('distorsion') || cat.includes('distorsión')) return 'graphic_eq';
    if (cat.includes('compres')) return 'compress';
    if (cat.includes('eq')) return 'tune';
    if (cat.includes('vocal') || cat.includes('voz')) return 'mic';
    if (cat.includes('sint')) return 'piano';
    if (cat.includes('bajo')) return 'speaker';
    if (cat.includes('hardware') || cat.includes('arsenal')) return 'hardware';
    if (cat.includes('pedal')) return 'settings_input_component';
    return 'extension';
  };

  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          const filteredArticles = data.filter((a: any) => a.type !== 'plugin' && a.type !== 'gear' && !a.is_hidden);
          const shuffledArticles = filteredArticles
            .map((value: any) => ({ value, sort: Math.random() }))
            .sort((a: any, b: any) => a.sort - b.sort)
            .map(({ value }: any) => value);
          
          let topArticles = shuffledArticles.slice(0, 4);
          if (topArticles.length < 4) {
            const needed = 4 - topArticles.length;
            const dynamicMocks = [...MOCK_ARTICLES].sort(() => Math.random() - 0.5);
            topArticles = [...topArticles, ...dynamicMocks.slice(0, needed)];
          }
          setArticles(topArticles);

          const filteredPlugins = data.filter((a: any) => a.type === 'plugin' && !a.is_hidden);
          const shuffledPlugins = filteredPlugins
            .map((value: any) => ({ value, sort: Math.random() }))
            .sort((a: any, b: any) => a.sort - b.sort)
            .map(({ value }: any) => value);
          setPlugins(shuffledPlugins);

          const filteredGear = data.filter((a: any) => a.type === 'gear' && !a.is_hidden);
          const shuffledGear = filteredGear
            .map((value: any) => ({ value, sort: Math.random() }))
            .sort((a: any, b: any) => a.sort - b.sort)
            .map(({ value }: any) => value);
          setGear(shuffledGear);

          const filteredCds = data.filter((a: any) => a.type === 'cd' && !a.is_hidden && a.isNewRelease === true);
          setCds(filteredCds);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubscribing(true);
    
    const form = e.currentTarget;
    const emailInput = form.elements.namedItem('email') as HTMLInputElement;
    const email = emailInput.value;

    try {
      await fetch('/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      // No matter if success or fail (already subscribed etc), we redirect.
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubscribing(false);
      window.open('https://fb.com/stars', '_blank');
      form.reset();
    }
  };

  return (
    <main className="pt-[96px] sm:pt-[88px] min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col justify-center items-center py-20 md:py-28 overflow-hidden border-b-2 border-outline-variant bg-surface-dim">
        <div className="absolute inset-0 opacity-40 z-0">
          <div className="w-full h-full bg-cover bg-center mix-blend-overlay" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCLFAmwPfd1JptEwRrFyPW45HazQyL3Lytz87oUxEMPHcnNj5KSC_eWlmGPGlbyMfQspNmmCmmQ3tDHbPPb-uG7oizSxvLlprfT6KYbsCWdfTxm_SG82GBAacMw4UgKO_WHSfyH7CvjdBA3oWwXdY7f_slUfnk38CWHv6d34xHjlBhTRl5Yc5xpxDV9yRgdsBnFy1jNHw1k1rffvXJCXAdsF4LZcpMF92aR1iqK0noMlh2QWIQyYOgSfAkc2Sf5zKpHYPaLDtTt4g')" }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50"></div>
          <div className="absolute inset-0 opacity-20 mix-blend-soft-light" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSIjMjIyIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPjxwb2x5Z29uIHBvaW50cz0iMCwwIDQwLDAgNDAsNDAgMCw0MCIvPjwvZz48L3N2Zz4=')" }}></div>
        </div>
        <div className="relative z-10 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <div className="inline-block border border-outline-variant bg-surface-container/50 px-4 py-1 mb-6">
            <span className="font-label-technical text-label-technical text-primary tracking-[0.2em] uppercase">{t('initializing')}</span>
          </div>
          <h1 className="text-headline-xl md:text-display-lg font-display-lg uppercase text-on-surface leading-tight mb-6 drop-shadow-2xl max-w-5xl mx-auto glitch-target">
            {heroTitleOverride || t('heroTitle')}<br/>
            <span className="text-primary-container inline-block transform hover:scale-105 transition-transform duration-300">{heroTitle2Override || t('heroTitle2')}</span><br/>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-10 border-l-2 border-primary-container pl-6 text-left">
            {heroSubtitleOverride || t('heroSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/archivo" className="bg-primary-container text-white border-2 border-primary-container hover:bg-background hover:text-primary transition-all duration-300 px-8 py-4 font-headline-lg text-headline-lg text-[18px] uppercase flex items-center gap-3 group relative overflow-hidden">
              <span className="relative z-10">{t('ctaArchive')}</span>
              <span className="material-symbols-outlined relative z-10 group-hover:translate-x-1 transition-transform">arrow_forward</span>
              <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity"></div>
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="font-label-technical text-label-technical text-on-surface-variant text-[10px]">SCROLL</span>
          <span className="material-symbols-outlined text-primary text-xl">arrow_downward</span>
        </div>
      </section>

      {/* Biblioteca de CDs (Colección) */}
      <BibliotecaCDs cds={cds} />

      {/* Expedientes Destacados (Blog) - Bento Grid */}
      <section id="expedientes" className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="flex justify-between items-end mb-12 border-b-2 border-surface-container-highest pb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-primary">folder_special</span>
              <span className="font-label-technical text-label-technical text-on-surface-variant">{t('section01')}</span>
            </div>
            <h2 className="text-headline-lg font-headline-lg uppercase text-on-surface">{t('expedientesTitle')}</h2>
          </div>
          <Link href="/archivo" className="font-label-technical text-label-technical text-primary hover:underline flex items-center gap-1">
            {t('verTodos')} <span className="material-symbols-outlined text-sm">arrow_outward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-1 bg-surface-container-high border-2 border-outline-variant p-1">
            {/* Main Feature */}
            {articles[0] && (
              <Link href={articles[0].slug ? `/articulo/${articles[0].slug}` : `/articulo/${articles[0].id}`} className="md:col-span-8 bg-surface-dim relative group overflow-hidden border-t-4 border-primary-container hover:border-primary transition-colors duration-300 flex flex-col h-[500px] cursor-pointer block">
                <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-80 grayscale group-hover:grayscale-0 transition-all duration-500" style={{ backgroundImage: `url('${articles[0].imageUrl}')` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
                <div className="relative z-10 mt-auto p-8 border-t border-surface-container-highest/50 bg-background/80 backdrop-blur-sm">
                  <div className="flex gap-2 mb-4">
                    <span className="bg-surface border border-outline-variant px-2 py-1 font-label-technical text-label-technical text-primary uppercase">{articles[0].category || 'CATEGORIA'}</span>
                  </div>
                  <h3 className="text-headline-lg font-headline-lg uppercase text-on-surface mb-3 group-hover:text-primary transition-colors" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{locale === 'en' ? (articles[0].title_en || articles[0].title) : locale === 'pt' ? (articles[0].title_pt || articles[0].title) : articles[0].title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {getPlainText(locale === 'en' ? (articles[0].desc_en || articles[0].desc) : locale === 'pt' ? (articles[0].desc_pt || articles[0].desc) : articles[0].desc)}
                  </p>
                </div>
              </Link>
            )}

            {/* Secondary Features */}
            {articles[1] && (
              <Link href={articles[1].slug ? `/articulo/${articles[1].slug}` : `/articulo/${articles[1].id}`} className="md:col-span-4 bg-surface relative group overflow-hidden border-t-4 border-secondary-container hover:border-primary-container transition-colors duration-300 flex flex-col h-[500px] md:h-auto cursor-pointer block">
                <div className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-80 grayscale group-hover:grayscale-0 transition-all duration-500" style={{ backgroundImage: `url('${articles[1].imageUrl}')` }}></div>
                <div className="relative z-10 mt-auto p-6 bg-gradient-to-t from-background to-background/20 h-full flex flex-col justify-end">
                  <span className="bg-surface border border-outline-variant px-2 py-1 font-label-technical text-label-technical text-primary w-max mb-3 uppercase">{articles[1].category || 'CATEGORIA'}</span>
                  <h3 className="text-headline-lg-mobile font-headline-lg uppercase text-on-surface leading-tight mb-2 group-hover:text-primary transition-colors" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{locale === 'en' ? (articles[1].title_en || articles[1].title) : locale === 'pt' ? (articles[1].title_pt || articles[1].title) : articles[1].title}</h3>
                </div>
              </Link>
            )}

            {articles[2] && (
              <Link href={articles[2].slug ? `/articulo/${articles[2].slug}` : `/articulo/${articles[2].id}`} className="md:col-span-4 bg-surface relative group overflow-hidden border-t-4 border-secondary-container hover:border-primary-container transition-colors duration-300 flex flex-col h-[500px] md:h-auto cursor-pointer block">
                <div className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-80 grayscale group-hover:grayscale-0 transition-all duration-500" style={{ backgroundImage: `url('${articles[2].imageUrl}')` }}></div>
                <div className="relative z-10 mt-auto p-6 bg-gradient-to-t from-background to-background/20 h-full flex flex-col justify-end">
                  <span className="bg-surface border border-outline-variant px-2 py-1 font-label-technical text-label-technical text-primary w-max mb-3 uppercase">{articles[2].category || 'CATEGORIA'}</span>
                  <h3 className="text-headline-lg-mobile font-headline-lg uppercase text-on-surface leading-tight mb-2 group-hover:text-primary transition-colors" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{locale === 'en' ? (articles[2].title_en || articles[2].title) : locale === 'pt' ? (articles[2].title_pt || articles[2].title) : articles[2].title}</h3>
                </div>
              </Link>
            )}

            {articles[3] && (
              <Link href={articles[3].slug ? `/articulo/${articles[3].slug}` : `/articulo/${articles[3].id}`} className="md:col-span-8 bg-surface-dim relative group overflow-hidden border-t-4 border-secondary-container hover:border-primary-container transition-colors duration-300 flex flex-col h-[500px] md:h-auto cursor-pointer block">
                <div className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-80 grayscale group-hover:grayscale-0 transition-all duration-500" style={{ backgroundImage: `url('${articles[3].imageUrl || articles[1].imageUrl}')` }}></div>
                <div className="relative z-10 mt-auto p-6 bg-gradient-to-t from-background to-background/20 h-full flex flex-col justify-end">
                  <span className="bg-surface border border-outline-variant px-2 py-1 font-label-technical text-label-technical text-primary w-max mb-3 uppercase">{articles[3].category || 'CATEGORIA'}</span>
                  <h3 className="text-headline-lg font-headline-lg uppercase text-on-surface leading-tight mb-2 group-hover:text-primary transition-colors" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{locale === 'en' ? (articles[3].title_en || articles[3].title) : locale === 'pt' ? (articles[3].title_pt || articles[3].title) : articles[3].title}</h3>
                </div>
              </Link>
            )}

          </div>
      </section>

      <section className="mb-12 px-0 md:px-4">
        <AdBanner 
          dataAdSlot="6644660314" 
          dataAdFormat="auto" 
          dataFullWidthResponsive={true} 
          className="rounded shadow-[0_0_15px_rgba(255,255,255,0.05)]"
        />
      </section>

      {/* Animated Marquee Transition 1 */}
      <div className="relative w-full py-2 md:py-3 bg-surface-container-highest overflow-hidden z-20 shadow-[0_0_30px_rgba(var(--md-sys-color-primary),0.15)] -skew-y-2 my-6 md:my-12">
        <div className="flex w-[200%] animate-[marquee_20s_linear_infinite]">
          <div className="flex-1 flex justify-around items-center opacity-30">
            <span className="font-headline-xl text-xl md:text-2xl uppercase tracking-widest text-primary font-black whitespace-nowrap px-4">{t('marqueeTaller')}</span>
            <span className="font-headline-xl text-xl md:text-2xl uppercase tracking-widest text-primary font-black whitespace-nowrap px-4">{t('marqueeTaller')}</span>
            <span className="font-headline-xl text-xl md:text-2xl uppercase tracking-widest text-primary font-black whitespace-nowrap px-4">{t('marqueeTaller')}</span>
            <span className="font-headline-xl text-xl md:text-2xl uppercase tracking-widest text-primary font-black whitespace-nowrap px-4">{t('marqueeTaller')}</span>
          </div>
          <div className="flex-1 flex justify-around items-center opacity-30">
            <span className="font-headline-xl text-xl md:text-2xl uppercase tracking-widest text-primary font-black whitespace-nowrap px-4">{t('marqueeTaller')}</span>
            <span className="font-headline-xl text-xl md:text-2xl uppercase tracking-widest text-primary font-black whitespace-nowrap px-4">{t('marqueeTaller')}</span>
            <span className="font-headline-xl text-xl md:text-2xl uppercase tracking-widest text-primary font-black whitespace-nowrap px-4">{t('marqueeTaller')}</span>
            <span className="font-headline-xl text-xl md:text-2xl uppercase tracking-widest text-primary font-black whitespace-nowrap px-4">{t('marqueeTaller')}</span>
          </div>
        </div>
      </div>

      {/* Taller de Distorsión */}
      <section id="taller" className="py-12 md:py-16 bg-surface-dim relative overflow-hidden">
        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="border-l-4 border-primary-container pl-6 mb-12">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-primary">electric_bolt</span>
              <span className="font-label-technical text-label-technical text-on-surface-variant">{t('section02')}</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-headline-xl font-headline-xl uppercase text-on-surface">{t('tallerSectionTitle')}</h2>
                <p className="font-body-md text-on-surface-variant mt-4 max-w-xl">{t('tallerSubtitle')}</p>
              </div>
              <Link href="/taller" className="group flex items-center gap-2 text-primary hover:text-white transition-colors border border-primary hover:bg-primary px-6 py-3 font-label-technical text-label-technical uppercase tracking-widest shrink-0">
                <span className="material-symbols-outlined text-lg group-hover:animate-pulse">apps</span>
                {t('verTodoTaller')}
              </Link>
            </div>
          </div>
          
          <div className="md:hidden flex justify-center text-primary font-mono-technical text-[9px] uppercase tracking-widest gap-2 items-center opacity-70 mb-4 animate-pulse">
            <span className="material-symbols-outlined text-[12px]">swipe_left</span>
            <span className="select-none">{t('Taller.deslizaExplorar')}</span>
            <span className="material-symbols-outlined text-[12px]">swipe_right</span>
          </div>

          <div className="overflow-hidden group/carousel relative w-full">
            {plugins.length > 0 ? (
              <div className="flex gap-6 overflow-x-auto hide-scrollbar snap-x snap-mandatory md:overflow-visible md:animate-[marquee_10s_linear_infinite] md:hover:[animation-play-state:paused] w-full md:w-max pb-4" style={{ animationDuration: `${Math.max(20, plugins.length * 10)}s` }}>
                {[...plugins, ...plugins, ...plugins, ...plugins].map((plugin, idx) => (
                  <div key={`${plugin.id}-${idx}`} className={`w-[85vw] md:w-[350px] shrink-0 bg-surface border border-outline-variant hover:border-primary transition-colors group relative overflow-hidden h-[480px] snap-center ${idx >= plugins.length ? 'hidden md:flex' : 'flex'} flex-col`}>
                    <Link href={plugin.slug ? `/articulo/${plugin.slug}` : `/articulo/${plugin.id}`} className="flex flex-col flex-grow">
                      {plugin.imageUrl && (
                        <div className="w-full h-[180px] bg-surface-container-highest relative overflow-hidden shrink-0 border-b border-outline-variant">
                          <div className="absolute top-4 left-4 z-20 bg-surface-container-highest/90 backdrop-blur-sm border border-outline-variant px-3 py-1 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm text-primary">{getCategoryIcon(plugin.category)}</span>
                            <span className="font-label-technical text-[10px] uppercase tracking-widest text-on-surface">{plugin.category || 'TALLER'}</span>
                          </div>
                          <Image src={plugin.imageUrl} alt={plugin.title} fill unoptimized={true} sizes="(max-width: 768px) 100vw, 350px" priority={idx < 3} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                        </div>
                      )}
                      <div className="flex flex-col flex-grow relative p-6 pb-0">
                        {!plugin.imageUrl && (
                          <>
                            <div className="absolute -right-8 -top-8 opacity-5 group-hover:opacity-10 group-hover:scale-150 transition-all duration-700 pointer-events-none">
                              <span className="material-symbols-outlined text-[120px]">{getCategoryIcon(plugin.category)}</span>
                            </div>
                            <div className="w-12 h-12 bg-surface-container-high border border-outline-variant flex items-center justify-center mb-6 group-hover:bg-primary-container transition-colors shrink-0 relative z-10">
                              <span className="material-symbols-outlined text-on-surface">{getCategoryIcon(plugin.category)}</span>
                            </div>
                          </>
                        )}
                        <h3 className="font-headline-sm text-xl font-bold uppercase text-on-surface mb-2 leading-tight group-hover:text-primary transition-colors relative z-10" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{locale === 'en' ? (plugin.title_en || plugin.title) : locale === 'pt' ? (plugin.title_pt || plugin.title) : plugin.title}</h3>
                        <p className="font-body-md text-on-surface-variant text-sm overflow-hidden relative z-10" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {getPlainText(locale === 'en' ? (plugin.desc_en || plugin.desc) : locale === 'pt' ? (plugin.desc_pt || plugin.desc) : plugin.desc)}
                        </p>
                      </div>
                    </Link>
                    <div className="p-6 pt-4 mt-auto flex items-center justify-between gap-4 border-t border-transparent group-hover:border-outline-variant/30 transition-colors shrink-0">
                      <Link href={plugin.slug ? `/articulo/${plugin.slug}` : `/articulo/${plugin.id}`} className="text-on-surface-variant hover:text-primary transition-colors font-label-technical text-[11px] uppercase tracking-widest flex items-center gap-1 group/link">
                        {t('verHerramienta')}
                        <span className="material-symbols-outlined text-[16px] group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
                      </Link>
                      <a href={plugin.externalUrl || '#'} target="_blank" rel="noopener noreferrer" className="border border-outline-variant hover:border-primary text-on-surface hover:text-primary transition-colors font-label-technical text-[10px] uppercase tracking-widest px-3 py-2 flex items-center gap-2 bg-surface-container-lowest hover:bg-primary/10">
                        {t('enlace')}
                        <span className="material-symbols-outlined text-[14px]">exit_to_app</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full text-center py-12 border border-dashed border-outline-variant/30">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">extension_off</span>
                <p className="font-mono-technical text-xs text-on-surface-variant uppercase">{t('ningunPlugin')}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Animated Marquee Transition 2 */}
      <div className="relative w-full py-2 md:py-3 bg-surface-container-highest overflow-hidden z-20 shadow-[0_0_30px_rgba(var(--md-sys-color-error),0.15)] skew-y-2 my-6 md:my-12">
        <div className="flex w-[200%] animate-[marquee_20s_linear_infinite_reverse]">
          <div className="flex-1 flex justify-around items-center opacity-30">
            <span className="font-headline-xl text-xl md:text-2xl uppercase tracking-widest text-error font-black whitespace-nowrap px-4">{t('marqueeArsenal')}</span>
            <span className="font-headline-xl text-xl md:text-2xl uppercase tracking-widest text-error font-black whitespace-nowrap px-4">{t('marqueeArsenal')}</span>
            <span className="font-headline-xl text-xl md:text-2xl uppercase tracking-widest text-error font-black whitespace-nowrap px-4">{t('marqueeArsenal')}</span>
            <span className="font-headline-xl text-xl md:text-2xl uppercase tracking-widest text-error font-black whitespace-nowrap px-4">{t('marqueeArsenal')}</span>
          </div>
          <div className="flex-1 flex justify-around items-center opacity-30">
            <span className="font-headline-xl text-xl md:text-2xl uppercase tracking-widest text-error font-black whitespace-nowrap px-4">{t('marqueeArsenal')}</span>
            <span className="font-headline-xl text-xl md:text-2xl uppercase tracking-widest text-error font-black whitespace-nowrap px-4">{t('marqueeArsenal')}</span>
            <span className="font-headline-xl text-xl md:text-2xl uppercase tracking-widest text-error font-black whitespace-nowrap px-4">{t('marqueeArsenal')}</span>
            <span className="font-headline-xl text-xl md:text-2xl uppercase tracking-widest text-error font-black whitespace-nowrap px-4">{t('marqueeArsenal')}</span>
          </div>
        </div>
      </div>

      {/* Arsenal */}
      <section id="arsenal" className="py-12 md:py-16 bg-background relative overflow-hidden">
        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="border-l-4 border-error pl-6 mb-12">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-error">hardware</span>
              <span className="font-label-technical text-label-technical text-on-surface-variant">{t('section03')}</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-headline-xl font-headline-xl uppercase text-on-surface">{t('arsenalSectionTitle')}</h2>
                <p className="font-body-md text-on-surface-variant mt-4 max-w-xl">{t('arsenalSubtitle')}</p>
              </div>
              <Link href="/tienda" className="group flex items-center gap-2 text-error hover:text-white transition-colors border border-error hover:bg-error px-6 py-3 font-label-technical text-label-technical uppercase tracking-widest shrink-0">
                <span className="material-symbols-outlined text-lg group-hover:animate-pulse">grid_view</span>
                {t('verTodoArsenal')}
              </Link>
            </div>
          </div>

          <div className="md:hidden flex justify-center text-error font-mono-technical text-[9px] uppercase tracking-widest gap-2 items-center opacity-70 mb-4 animate-pulse">
            <span className="material-symbols-outlined text-[12px]">swipe_left</span>
            <span className="select-none">{t('Tienda.deslizaExplorar')}</span>
            <span className="material-symbols-outlined text-[12px]">swipe_right</span>
          </div>

          <div className="overflow-hidden group/carousel relative w-full">
            {gear.length > 0 ? (
              <div className="flex gap-6 overflow-x-auto hide-scrollbar snap-x snap-mandatory md:overflow-visible md:animate-[marquee_10s_linear_infinite] md:hover:[animation-play-state:paused] w-full md:w-max pb-4" style={{ animationDuration: `${Math.max(20, gear.length * 10)}s` }}>
                {[...gear, ...gear, ...gear, ...gear].map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className={`w-[85vw] md:w-[350px] shrink-0 bg-surface-dim border border-outline-variant hover:border-error transition-colors group relative overflow-hidden h-[480px] snap-center ${idx >= gear.length ? 'hidden md:flex' : 'flex'} flex-col`}>
                    <a href={item.externalUrl || '#'} target="_blank" rel="noopener noreferrer" className="flex flex-col flex-grow">
                      {item.imageUrl && (
                        <div className="w-full h-[180px] bg-white relative overflow-hidden shrink-0 border-b border-outline-variant">
                          <div className="absolute top-4 left-4 z-20 bg-surface-container-highest/90 backdrop-blur-sm border border-outline-variant px-3 py-1 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm text-error">{getCategoryIcon(item.category)}</span>
                            <span className="font-label-technical text-[10px] uppercase tracking-widest text-on-surface">{item.category || 'EQUIPAMIENTO'}</span>
                          </div>
                          <Image src={item.imageUrl} alt={item.title} fill unoptimized={true} sizes="(max-width: 768px) 100vw, 350px" priority={idx < 3} className="w-full h-full object-contain p-4 grayscale group-hover:grayscale-0 transition-all duration-500" />
                        </div>
                      )}
                      <div className="flex flex-col flex-grow relative p-6 pb-0">
                        {!item.imageUrl && (
                          <>
                            <div className="absolute -right-8 -top-8 opacity-5 group-hover:opacity-10 group-hover:scale-150 transition-all duration-700 pointer-events-none">
                              <span className="material-symbols-outlined text-[120px]">{getCategoryIcon(item.category)}</span>
                            </div>
                            <div className="w-12 h-12 bg-surface border border-outline-variant flex items-center justify-center mb-6 group-hover:bg-error/20 transition-colors shrink-0 relative z-10">
                              <span className="material-symbols-outlined text-on-surface">{getCategoryIcon(item.category)}</span>
                            </div>
                          </>
                        )}
                        <h3 className="font-headline-sm text-xl font-bold uppercase text-on-surface mb-2 leading-tight group-hover:text-error transition-colors relative z-10" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{locale === 'en' ? (item.title_en || item.title) : locale === 'pt' ? (item.title_pt || item.title) : item.title}</h3>
                        <p className="font-body-md text-on-surface-variant text-sm overflow-hidden relative z-10" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {getPlainText(locale === 'en' ? (item.desc_en || item.desc) : locale === 'pt' ? (item.desc_pt || item.desc) : item.desc)}
                        </p>
                      </div>
                    </a>
                    <div className="p-6 pt-4 mt-auto flex items-center gap-4 border-t border-transparent group-hover:border-outline-variant/30 transition-colors shrink-0">
                      <a href={item.externalUrl || '#'} target="_blank" rel="noopener noreferrer" className="w-full border border-error bg-error/10 hover:bg-error text-error hover:text-white transition-colors font-label-technical text-[12px] uppercase tracking-widest px-4 py-3 flex items-center justify-center gap-2">
                        {t('enlace') || 'VER PRODUCTO'}
                        <span className="material-symbols-outlined text-[16px]">exit_to_app</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full text-center py-12 border border-dashed border-outline-variant/30">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">production_quantity_limits</span>
                <p className="font-mono-technical text-xs text-on-surface-variant uppercase">{t('ningunEquipo')}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <FloatingLegadoButton />
    </main>
  );
}
