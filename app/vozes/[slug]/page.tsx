import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { translations } from '../../i18n/translations';

const siteUrl = 'https://studiopomar.github.io';
const voices = translations.pt.voices;

export function generateStaticParams() {
  return voices.map(({ id }) => ({ slug: id }));
}

function getVoice(slug: string) {
  return voices.find((voice) => voice.id === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const voice = getVoice(slug);
  if (!voice) return {};
  const description = `${voice.name}: ${voice.detail} Compatibilidade, idiomas, amostra e download oficial no Studio Pomar.`;
  const url = `${siteUrl}/vozes/${voice.id}/`;
  return {
    title: `${voice.name} | Voicebank UTAU · Studio Pomar`,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${voice.name} | Studio Pomar`, description, url, images: [`${siteUrl}${voice.image}`], type: 'profile' },
    twitter: { card: 'summary_large_image', title: `${voice.name} | Studio Pomar`, description, images: [`${siteUrl}${voice.image}`] },
  };
}

export default async function VoicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const voice = getVoice(slug);
  if (!voice) notFound();
  const url = `${siteUrl}/vozes/${voice.id}/`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${voice.name} | Studio Pomar`,
    description: voice.specs.description,
    url,
    inLanguage: 'pt-BR',
    isPartOf: { '@id': `${siteUrl}/#website` },
  };

  return (
    <main className="shell" style={{ minHeight: '100vh', paddingTop: 48, paddingBottom: 96 }}>
      <Link href="/#vozes">← Voltar às vozes</Link>
      <article className="seo-detail-grid">
        <img src={voice.image} alt={`Arte de ${voice.name}`} width={720} height={900} style={{ width: '100%', height: 'auto', borderRadius: 24 }} />
        <div>
          <p className="eyebrow">{voice.meta}</p>
          <h1 style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', margin: '8px 0 16px' }}>{voice.name}</h1>
          <p>{voice.specs.description}</p>
          <dl style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '10px 18px', margin: '28px 0' }}>
            <dt><strong>Formatos e motores</strong></dt><dd>{voice.specs.engines}</dd>
            <dt><strong>Idiomas</strong></dt><dd>{voice.specs.languages}</dd>
            <dt><strong>Alcance vocal</strong></dt><dd>{voice.specs.range}</dd>
            <dt><strong>Identidade</strong></dt><dd>{voice.specs.species}</dd>
            <dt><strong>Criador</strong></dt><dd><a href={voice.owner} target="_blank" rel="noreferrer">{voice.ownerName}</a></dd>
          </dl>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <a className="button button-dark" href={voice.specs.downloadUrl} target="_blank" rel="noreferrer">Baixar voicebank ↗</a>
            <a className="text-link" href={voice.profile} target="_blank" rel="noreferrer">Perfil e informações ↗</a>
          </div>
          <p style={{ marginTop: 32 }}>{voice.tags.join(' · ')}</p>
        </div>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}
