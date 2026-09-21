import type { Metadata } from 'next';
import './globals.css';
import SmoothScroll from './SmoothScroll';
import OrchardBackground from './OrchardBackground';
import { SoundProvider } from './SoundEffects';
import { LanguageProvider } from './LanguageContext';
import { ThemeProvider } from './ThemeContext';
import BackToTop from './BackToTop';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const siteUrl = 'https://studiopomar.github.io';
const ogImageUrl = `${siteUrl}/studio-pomar-icon-4096.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Studio Pomar | Vozes que criam raízes',
  description: 'Coletivo de voicebanks e ferramentas livres para UTAU e OpenUTAU. Vozes brasileiras e tecnologia aberta em síntese vocal.',
  keywords: [
    'Studio Pomar',
    'POMAR',
    'UTAU Brasil',
    'OpenUTAU',
    'DiffSinger',
    'Sintetizador de voz',
    'Voicebanks brasileiros',
    'Kamafeu',
    'VIICTOR',
    'YOHJI',
    'EDDIE',
    'LLANE CROW',
    'MIZUKI',
    'Kodama Kito',
    'Kito',
    'Apollyo XII',
    'Apollyo',
    'Vocaloid Brasil',
    'Software livre de áudio',
    'Síntese vocal',
    'VSynth BR'
  ],
  authors: [{ name: 'Studio Pomar', url: 'https://github.com/studiopomar' }],
  creator: 'Studio Pomar',
  publisher: 'Studio Pomar',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: `${basePath}/studio-pomar-icon-4096.png`, type: 'image/png' },
      { url: `${basePath}/favicon.png`, type: 'image/png' },
    ],
    apple: `${basePath}/studio-pomar-icon-4096.png`,
    shortcut: `${basePath}/studio-pomar-icon-4096.png`,
  },
  openGraph: {
    title: 'Studio Pomar | Vozes que criam raízes',
    description: 'Coletivo de voicebanks e ferramentas livres para UTAU e OpenUTAU. Feito pela comunidade, para a comunidade.',
    url: siteUrl,
    siteName: 'Studio Pomar',
    images: [
      {
        url: ogImageUrl,
        width: 800,
        height: 800,
        alt: 'Studio Pomar (Vozes que criam raízes)',
        type: 'image/png',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Studio Pomar | Vozes que criam raízes',
    description: 'Coletivo de voicebanks e ferramentas livres para UTAU e OpenUTAU.',
    images: [ogImageUrl],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'Studio Pomar',
      url: siteUrl,
      logo: ogImageUrl,
      image: ogImageUrl,
      sameAs: [
        'https://github.com/studiopomar',
        'https://vsynthbr.fandom.com/pt-br/wiki/VIICTOR',
        'https://vsynthbr.fandom.com/pt-br/wiki/Kodama_Kito',
        'https://vsynthbr.fandom.com/pt-br/wiki/Apollyo_XII',
        'https://vocadb.net/Ar/86115',
      ],
      description: 'Coletivo de voicebanks e ferramentas livres para UTAU, OpenUTAU e síntese vocal brasileira.',
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'Studio Pomar | Vozes que criam raízes',
      publisher: {
        '@id': `${siteUrl}/#organization`,
      },
      inLanguage: 'pt-BR',
      description: 'Voicebanks brasileiros e ferramentas livres para UTAU e OpenUTAU.',
    },
    {
      '@type': 'SoftwareApplication',
      name: 'KAMAFEU',
      operatingSystem: 'Cross-platform',
      applicationCategory: 'MultimediaApplication',
      url: 'https://github.com/studiopomar/kamafeu',
      description: 'Sintetizador concatenativo multifaixa e editor de voz UTAU/OpenUTAU em Rust com processamento DSP nativo.',
      author: {
        '@id': `${siteUrl}/#organization`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Inline script to set theme before hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('studio_pomar_theme');if(t==='summer'||t==='autumn'||t==='night'){document.documentElement.setAttribute('data-theme',t);}else{document.documentElement.setAttribute('data-theme','summer');}}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <LanguageProvider>
            <SoundProvider>
              <OrchardBackground />
              <SmoothScroll>
                {children}
              </SmoothScroll>
              <BackToTop />
            </SoundProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
