'use client';

import React from 'react';
import { SoundToggle } from '../SoundEffects';
import LanguageSelector from '../LanguageSelector';
import ThemeSelector from '../ThemeSelector';
import { useLanguage } from '../LanguageContext';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export default function ManifestoPage() {
  const { t, dir } = useLanguage();
  const m = t.manifestoPage;

  return (
    <main className="manifesto-page">
      <header className="nav-wrapper">
        <nav className="nav shell" aria-label="Navegação principal">
          <a className="brand" href={`${basePath}/`} aria-label="Studio Pomar, início">
            <span className="brand-mark">
              <img src={`${basePath}/studio-pomar-icon.png`} alt="Logo Studio Pomar" />
            </span>
            <span>STUDIO <b>POMAR</b></span>
          </a>
          <div className="nav-links">
            <a href={`${basePath}/#top`}>{t.nav.home}</a>
            <a href={`${basePath}/#vozes`}>{t.nav.voices}</a>
            <a href={`${basePath}/#ferramentas`}>{t.nav.tools}</a>
            <a href={`${basePath}/brapa/`}>{t.nav.phonetics}</a>
            <a href={`${basePath}/o-ritmo-da-terra/`} style={{ textDecoration: 'underline', textUnderlineOffset: '5px' }}>{t.nav.manifesto}</a>
            <a href="https://github.com/studiopomar" target="_blank" rel="noreferrer">{t.nav.github}</a>
            <div className="nav-controls">
              <ThemeSelector />
              <LanguageSelector />
              <SoundToggle />
            </div>
          </div>
        </nav>
      </header>

      <article className="shell manifesto-hero">
        <a href={`${basePath}/`} className="manifesto-back-btn">
          {m.back}
        </a>
        
        <p className="eyebrow">{m.eyebrow}</p>
        
        <h1 className="manifesto-copy">
          {m.title1}<em>{m.titleEm1}</em>{m.title2}<em>{m.titleEm2}</em>
        </h1>

        <p className="manifesto-intro">
          {m.p1}
        </p>
        <p className="manifesto-intro" style={{ marginTop: '16px' }}>
          {m.p2}
        </p>
        <p className="manifesto-intro" style={{ marginTop: '16px' }}>
          {m.p3}
        </p>

        <section style={{ marginTop: '80px' }}>
          <p className="eyebrow">{m.pillarsEyebrow}</p>
          
          <div className="values-5">
            {m.pillars.map((pillar) => (
              <div key={pillar.num}>
                <b>{pillar.num}</b>
                <h3>{pillar.title}</h3>
                <p>{pillar.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="manifesto-commitments" style={{ marginTop: '80px' }}>
          <p className="eyebrow" style={{ margin: 0 }}>STUDIO POMAR</p>
          <h2 style={{ margin: '14px 0 0', fontSize: 'clamp(2rem, 4vw, 3.2rem)', letterSpacing: '-0.05em' }}>
            {m.footerTitle}
          </h2>
          <p className="manifesto-intro" style={{ marginTop: '16px', maxWidth: '700px' }}>
            {m.footerDesc}
          </p>
          <div style={{ marginTop: '36px' }}>
            <a className="button button-dark" href={`${basePath}/`}>
              {m.homeBtn}
            </a>
          </div>
        </section>
      </article>

      <footer>
        <div className="shell footer-main">
          <div>
            <div className="brand footer-brand">
              <span className="brand-mark">
                <img src={`${basePath}/studio-pomar-icon.png`} alt="Logo Studio Pomar" />
              </span>
              <span>STUDIO <b>POMAR</b></span>
            </div>
            <h2>{t.footer.titleMain}<br />{t.footer.titleEm}</h2>
          </div>
          <div className="footer-links">
            <div>
              <p>{t.footer.community}</p>
              <a href="https://github.com/studiopomar" target="_blank" rel="noreferrer">GitHub ↗</a>
              <a href="https://discord.gg/UrygVFXTtQ" target="_blank" rel="noreferrer">Discord ↗</a>
            </div>
            <div>
              <p>{t.footer.content}</p>
              <a href="mailto:studiopomar@proton.me">studiopomar@proton.me</a>
              <a href={`${basePath}/`}>{t.manifestoPage.back}</a>
            </div>
          </div>
        </div>
        <div className="shell footer-bottom">
          <span>© {new Date().getFullYear()} {t.footer.rights}</span>
          <span>{t.footer.subtitle}</span>
        </div>
      </footer>
    </main>
  );
}
