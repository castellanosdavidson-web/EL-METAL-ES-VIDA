import type { Metadata } from "next";
import { Syne, JetBrains_Mono, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
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

const logoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL || ''}/storage/v1/object/public/articles/logo.png`;

export const metadata: Metadata = {
  title: "EL METAL ES VIDA - Cultura Extrema",
  description: "El medio definitivo de cultura extrema.",
  icons: {
    icon: [
      { url: logoUrl },
      { url: '/LOGO 2.png', rel: 'icon' }
    ],
    shortcut: logoUrl,
    apple: logoUrl,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      translate="no"
      className={`${syne.variable} ${jetbrains.variable} ${hanken.variable} dark notranslate`}
    >
      <head>
        <meta name="google" content="notranslate" />
        <link rel="icon" href={logoUrl} />
        <link rel="apple-touch-icon" href={logoUrl} />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-background antialiased selection:bg-primary-container selection:text-on-primary-container">
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
