'use client';

import React from 'react';
import { useLanguage } from '../LanguageContext';
import { newsTranslations } from '../i18n/translations';
import { SoundToggle } from '../SoundEffects';
import LanguageSelector from '../LanguageSelector';
import ThemeSelector from '../ThemeSelector';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const backParticles = [
  { x: '12%', y: '82%', delay: '-2s', duration: '18s', drift: '34px', scale: '.55' },
  { x: '28%', y: '94%', delay: '-11s', duration: '21s', drift: '-26px', scale: '.72' },
  { x: '45%', y: '76%', delay: '-7s', duration: '19s', drift: '22px', scale: '.48' },
  { x: '63%', y: '90%', delay: '-15s', duration: '23s', drift: '-38px', scale: '.62' },
  { x: '82%', y: '84%', delay: '-4s', duration: '20s', drift: '28px', scale: '.5' },
];

const frontParticles = [
  { x: '20%', y: '88%', delay: '-8s', duration: '13s', drift: '48px', scale: '.82' },
  { x: '38%', y: '102%', delay: '-1s', duration: '15s', drift: '-36px', scale: '1.05' },
  { x: '55%', y: '92%', delay: '-10s', duration: '12s', drift: '30px', scale: '.72' },
  { x: '72%', y: '106%', delay: '-5s', duration: '16s', drift: '-50px', scale: '1.18' },
  { x: '90%', y: '84%', delay: '-12s', duration: '14s', drift: '26px', scale: '.9' },
];

export default function NewsContent() {
  const { t, language, dir } = useLanguage();
  const copy = newsTranslations[language];

  return (
    <main className="news-page" dir={dir}>
      <header className="nav-wrapper">
        <nav className="nav shell" aria-label="Navegação principal">
          <a className="brand" href={`${basePath}/`} aria-label="Studio Pomar, início">
            <span className="brand-mark"><img src={`${basePath}/studio-pomar-icon.png`} alt="Logo Studio Pomar" /></span>
            <span>STUDIO <b>POMAR</b></span>
          </a>
          <div className="nav-links news-nav-links">
            <a href={`${basePath}/#top`}>{t.nav.home}</a>
            <a href={`${basePath}/novidades/`} aria-current="page">{t.nav.news}</a>
            <a href={`${basePath}/#vozes`}>{t.nav.voices}</a>
            <a href={`${basePath}/#ferramentas`}>{t.nav.tools}</a>
            <a href={`${basePath}/brapa/`}>{t.nav.phonetics}</a>
            <a href={`${basePath}/o-ritmo-da-terra/`}>{t.nav.manifesto}</a>
            <a href="https://github.com/studiopomar" target="_blank" rel="noreferrer">{t.nav.github}</a>
          </div>
          <div className="nav-controls news-nav-controls">
            <ThemeSelector />
            <LanguageSelector />
            <SoundToggle />
          </div>
        </nav>
      </header>

      <article className="news-feature shell">
        <div className="news-copy">
          <a className="news-back" href={`${basePath}/`}>← {copy.backHome}</a>
          <p className="news-eyebrow"><span />{copy.eyebrow}</p>
          <div className="news-edition">STUDIO POMAR <span className="news-mark-star" aria-hidden="true" /> {copy.announcementBadge}</div>
          <h1>{copy.title}<span>.</span></h1>
          <p className="news-description">{copy.description}</p>
          <div className="news-status"><span className="news-status-dot" />{copy.comingSoon}</div>
          <div className="news-signature"><span>01</span><span>VOZES QUE CRIAM RAÍZES</span><span className="news-mark-star" aria-hidden="true" /></div>
        </div>

        <div className="news-art-wrap">
          <div className="news-particle-layer news-particles-back" aria-hidden="true">
            {backParticles.map((particle, index) => (
              <span
                className="news-particle news-particle-back"
                key={`back-${index}`}
                style={{
                  left: particle.x,
                  top: particle.y,
                  animationDelay: particle.delay,
                  animationDuration: particle.duration,
                  '--particle-drift': particle.drift,
                  '--particle-scale': particle.scale,
                } as React.CSSProperties}
              />
            ))}
          </div>
          <div className="news-art-orbit news-art-orbit-one" />
          <div className="news-art-orbit news-art-orbit-two" />
          <div className="news-art-halo" aria-hidden="true" />
          <span className="news-art-spark news-art-spark-one" aria-hidden="true" />
          <span className="news-art-spark news-art-spark-two" aria-hidden="true" />
          <span className="news-art-index">POMAR · 2026</span>
          <div className="news-art-depth">
            <picture>
              <source media="(prefers-reduced-motion: reduce)" srcSet={`${basePath}/raphaello_diff.webp`} />
              <img src={`${basePath}/raphaello-idle.webp`} alt={copy.imageAlt} width="686" height="920" fetchPriority="high" />
            </picture>
          </div>
          <div className="news-particle-layer news-particles-front" aria-hidden="true">
            {frontParticles.map((particle, index) => (
              <span
                className="news-particle news-particle-front"
                key={`front-${index}`}
                style={{
                  left: particle.x,
                  top: particle.y,
                  animationDelay: particle.delay,
                  animationDuration: particle.duration,
                  '--particle-drift': particle.drift,
                  '--particle-scale': particle.scale,
                } as React.CSSProperties}
              />
            ))}
          </div>
          <span className="news-art-caption">{copy.title.toUpperCase()}</span>
        </div>

        <div className="news-bottomline">
          <span>{copy.bottomline}</span>
          <a href={`${basePath}/#vozes`}>{copy.voicesLink} <span aria-hidden="true">↗</span></a>
        </div>
      </article>
    </main>
  );
}
