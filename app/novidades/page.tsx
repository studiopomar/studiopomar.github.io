import type { Metadata } from 'next';
import NewsContent from './NewsContent';

const title = 'Raphaello em breve | Novidades do Studio Pomar';
const description = 'Uma nova voz está chegando ao Studio Pomar. Conheça o primeiro teaser de Raphaello.';
const url = 'https://studiopomar.github.io/novidades/';
const image = 'https://studiopomar.github.io/raphaello_diff.webp';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: {
    title,
    description,
    url,
    siteName: 'Studio Pomar',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: image, width: 1200, height: 1698, alt: 'Raphaello, nova voz anunciada pelo Studio Pomar' }],
  },
  twitter: { card: 'summary_large_image', title, description, images: [image] },
};

export default function NewsPage() {
  return <NewsContent />;
}
