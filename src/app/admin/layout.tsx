import type { Metadata } from "next";
import { Syne, JetBrains_Mono, Hanken_Grotesk } from "next/font/google";
import "../globals.css";
import AdminClientLayout from "./AdminClientLayout";

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

export const metadata: Metadata = {
  title: "Admin - EL METAL ES VIDA",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${syne.variable} ${jetbrains.variable} ${hanken.variable} dark`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
      </head>
      <body className="bg-background text-on-background antialiased selection:bg-primary-container selection:text-on-primary-container">
        <AdminClientLayout>
          {children}
        </AdminClientLayout>
      </body>
    </html>
  );
}
