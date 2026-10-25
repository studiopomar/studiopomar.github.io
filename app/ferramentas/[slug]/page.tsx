import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { translations } from '../../i18n/translations';

const siteUrl = 'https://studiopomar.github.io';
const projects = translations.pt.projects;

export function generateStaticParams() {
  return projects.map(({ id }) => ({ slug: id }));
}

function getProject(slug: string) {
  return projects.find((project) => project.id === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const description = `${project.name}: ${project.text} Versão ${project.version}. Veja recursos, compatibilidade e downloads.`;
  const url = `${siteUrl}/ferramentas/${project.id}/`;
  return {
    title: `${project.name} | ${project.type} · Studio Pomar`,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${project.name} | Studio Pomar`, description, url, images: [`${siteUrl}${project.image}`], type: 'website' },
    twitter: { card: 'summary_large_image', title: `${project.name} | Studio Pomar`, description, images: [`${siteUrl}${project.image}`] },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const url = `${siteUrl}/ferramentas/${project.id}/`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.name,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Windows, Linux, macOS',
    softwareVersion: project.version,
    description: project.detail,
    url,
    downloadUrl: project.downloads.source,
    license: project.license,
    author: { '@type': 'Organization', name: 'Studio Pomar', url: siteUrl },
  };

  return (
    <main className="shell" style={{ minHeight: '100vh', paddingTop: 48, paddingBottom: 96 }}>
      <Link href="/#ferramentas">← Voltar às ferramentas</Link>
      <article style={{ maxWidth: 1000, margin: '56px auto' }}>
        <img src={project.image} alt={`Interface do ${project.name}`} width={1200} height={720} style={{ width: '100%', height: 'auto', borderRadius: 24, marginBottom: 32 }} />
        <p className="eyebrow">{project.type} · {project.status}</p>
        <h1 style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', margin: '8px 0 16px' }}>{project.name}</h1>
        <p style={{ fontSize: '1.2rem', maxWidth: 780 }}>{project.detail}</p>
        <dl style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '10px 18px', margin: '28px 0' }}>
          <dt><strong>Versão</strong></dt><dd>{project.version}</dd>
          <dt><strong>Status</strong></dt><dd>{project.status}</dd>
          <dt><strong>Tecnologia</strong></dt><dd>{project.language}</dd>
          <dt><strong>Licença</strong></dt><dd>{project.license}</dd>
        </dl>
        <h2>Recursos</h2>
        <ul>{project.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 28 }}>
          <a className="button button-dark" href={project.href} target="_blank" rel="noreferrer">Repositório e downloads ↗</a>
          <a className="text-link" href={project.downloads.source} target="_blank" rel="noreferrer">Código-fonte ↗</a>
        </div>
        <p style={{ marginTop: 32 }}>{project.tags.join(' · ')}</p>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}
