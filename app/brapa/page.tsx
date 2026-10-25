import type { Metadata } from 'next';
import BrapaContent from './BrapaContent';

const title = 'BRAPA | Fonética do português brasileiro para UTAU';
const description = 'Consulte o guia BRAPA de fonemas, símbolos e exemplos de pronúncia do português brasileiro para voicebanks e projetos de síntese vocal.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: 'https://studiopomar.github.io/brapa/' },
  openGraph: { title, description, url: 'https://studiopomar.github.io/brapa/', type: 'article' },
};

export default function BrapaPage() {
  return <BrapaContent />;
}
