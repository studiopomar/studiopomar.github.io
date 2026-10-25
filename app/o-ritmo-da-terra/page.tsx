import type { Metadata } from 'next';
import ManifestoContent from './ManifestoContent';

const title = 'O Ritmo da Terra | Manifesto do Studio Pomar';
const description = 'Conheça os princípios do Studio Pomar: tecnologia aberta, preservação de voicebanks, autonomia criativa e síntese vocal feita em comunidade.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: 'https://studiopomar.github.io/o-ritmo-da-terra/' },
  openGraph: { title, description, url: 'https://studiopomar.github.io/o-ritmo-da-terra/', type: 'article' },
};

export default function ManifestoRoute() {
  return <ManifestoContent />;
}
