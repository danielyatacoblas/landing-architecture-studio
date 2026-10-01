import type { Metadata, Viewport } from 'next';
import { Familjen_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const sans = Familjen_Grotesk({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://landing-architecture-studio-danielyatacoblas-projects.vercel.app'),
  title: 'Celosía — Arquitectura para el sol de Lima',
  description: 'Estudio de arquitectura en Barranco. Mueve el sol sobre una maqueta 3D y mira dónde cae la sombra. Diseño demo de Daniel Yataco · WhatsApp 975 118 790.',
  openGraph: { title: 'Celosía — Diseñamos la sombra antes que la casa', description: 'Estudio solar interactivo en 3D.', images: ['/img/hero.jpg'] },
};

export const viewport: Viewport = { themeColor: '#e7e4dd', width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
