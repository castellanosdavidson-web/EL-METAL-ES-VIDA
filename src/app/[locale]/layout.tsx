import type { Metadata } from "next";
import { Syne, JetBrains_Mono, Hanken_Grotesk } from "next/font/google";
import "../globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

import Script from 'next/script';

const logoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL || ''}/storage/v1/object/public/articles/logo.png`;
const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-H5DD80FFKE';

export const metadata: Metadata = {
  title: "EL METAL ES VIDA - Cultura Extrema",
  description: "El archivo técnico definitivo para la legión. Desglosamos la agresión sonora, documentamos el equipo, reseñas de bandas, enciclopedia de metal y transmisiones de radio en vivo.",
  keywords: ["metal", "heavy metal", "rock", "metal colombiano", "musica extrema", "cultura extrema", "gabinete", "amplificador", "wacken", "el metal es vida"],
  authors: [{ name: "El Metal Es Vida" }],
  creator: "El Metal Es Vida",
  publisher: "El Metal Es Vida",
  metadataBase: new URL('https://elmetalesvida.com'),
  icons: {
    icon: [
      { url: logoUrl },
      { url: '/LOGO 2.png', rel: 'icon' }
    ],
    shortcut: logoUrl,
    apple: logoUrl,
  },
  openGraph: {
    title: "EL METAL ES VIDA - Cultura Extrema",
    description: "El archivo técnico definitivo para la legión. Enciclopedia, reseñas, comunidad y radio en vivo.",
    url: 'https://elmetalesvida.com',
    siteName: 'EL METAL ES VIDA',
    images: [
      {
        url: logoUrl || '/LOGO 2.png',
        width: 800,
        height: 800,
        alt: 'EL METAL ES VIDA'
      },
    ],
    locale: 'es_CO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "EL METAL ES VIDA - Cultura Extrema",
    description: "El archivo técnico definitivo para la legión.",
    images: [logoUrl || '/LOGO 2.png'],
  }
};

import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';

import {routing} from '@/i18n/routing';

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>) {
  const { locale } = await params;
  
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${syne.variable} ${jetbrains.variable} ${hanken.variable} dark`}
    >
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TWWHZ5P3');`
          }}
        />
        {/* Google Analytics (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-H5DD80FFKE"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-H5DD80FFKE');
            `
          }}
        />
        <link rel="icon" href={logoUrl} />
        <link rel="apple-touch-icon" href={logoUrl} />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#0d0d0d" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-background antialiased selection:bg-primary-container selection:text-on-primary-container">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-TWWHZ5P3"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <NextIntlClientProvider messages={messages}>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
