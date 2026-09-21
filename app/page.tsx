'use client';

import React from 'react';
import VoiceStack from './VoiceStack';
import VoiceProfiles from './VoiceProfiles';
import ToolProfiles from './ToolProfiles';
import { SoundToggle } from './SoundEffects';
import LanguageSelector from './LanguageSelector';
import ThemeSelector from './ThemeSelector';
import { useLanguage } from './LanguageContext';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export default function Home() {
  const { t, dir } = useLanguage();

  const voices = t.voices.map(v => ({
    ...v,
    image: `${basePath}${v.image}`,
    audioSample: v.audioSample ? `${basePath}${v.audioSample}` : undefined,
  }));

  const projects = t.projects.map(p => ({
    ...p,
    image: `${basePath}${p.image}`,
  }));

  return (
    <main>
      <header className="nav-wrapper">
        <nav className="nav shell" aria-label="Navegação principal">
          <a className="brand" href="#top" aria-label="Studio Pomar, início">
            <span className="brand-mark">
              <img src={`${basePath}/studio-pomar-icon.png`} alt="Logo Studio Pomar" />
            </span>
            <span>STUDIO <b>POMAR</b></span>
          </a>
          <div className="nav-links">
            <a href="#top">{t.nav.home}</a>
            <a href="#vozes">{t.nav.voices}</a>
            <a href="#ferramentas">{t.nav.tools}</a>
            <a href={`${basePath}/brapa/`}>{t.nav.phonetics}</a>
            <a href={`${basePath}/o-ritmo-da-terra/`}>{t.nav.manifesto}</a>
            <a href="https://github.com/studiopomar" target="_blank" rel="noreferrer">{t.nav.github}</a>
            <div className="nav-controls">
              <ThemeSelector />
              <LanguageSelector />
              <SoundToggle />
            </div>
          </div>
        </nav>
      </header>

      <section className="hero shell" id="top">
        <div className="hero-copy">
          <div className="spotlight-card">
            <div className="spotlight-header">
              <div className="spotlight-badge">
                <span className="spotlight-dot" />
                <span>{t.hero.spotlightBadge}</span>
              </div>
              <span className="spotlight-version">{t.hero.spotlightVersion}</span>
            </div>

            <div className="spotlight-content">
              <a 
                href="https://github.com/studiopomar/kamafeu" 
                target="_blank" 
                rel="noreferrer"
                className="spotlight-preview"
                aria-label="Abrir repositório do Kamafeu no GitHub"
              >
                <img src={`${basePath}/kamafeu.png`} alt="Interface do Kamafeu" />
                <div className="spotlight-preview-overlay">
                  <span>{t.hero.spotlightOpen}</span>
                </div>
              </a>

              <div className="spotlight-details">
                <div className="spotlight-title-row">
                  <h3>{t.hero.spotlightTitle}</h3>
                  <span className="spotlight-category">{t.hero.spotlightCategory}</span>
                </div>
                <p>{t.hero.spotlightDesc}</p>
                <div className="spotlight-actions">
                  <a href="https://github.com/studiopomar/kamafeu" target="_blank" rel="noreferrer" className="spotlight-btn-primary">
                    {t.hero.spotlightSource}
                  </a>
                  <a href="#ferramentas" className="spotlight-btn-ghost">
                    {t.hero.spotlightTools}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <p className="eyebrow">{t.hero.eyebrow}</p>
          <h1>{t.hero.titleMain}<br /><em>{t.hero.titleEm}</em></h1>
          <p className="intro">{t.hero.intro}</p>
          <div className="hero-actions">
            <a className="button button-dark" href="#vozes">{t.hero.ctaVoices} <span>{dir === 'rtl' ? '↙' : '↘'}</span></a>
            <a className="text-link" href="#ferramentas">{t.hero.ctaProjects}</a>
          </div>
        </div>

        <VoiceStack voices={voices} />
      </section>

      <div className="ticker" aria-hidden="true"><span>{t.ticker}</span></div>

      <section className="voices-section" id="vozes">
        <div className="shell">
          <div className="section-head">
            <div>
              <p className="eyebrow">{t.voicesSection.eyebrow}</p>
              <h2>{t.voicesSection.titleMain}<br /><em>{t.voicesSection.titleEm}</em></h2>
            </div>
            <p>{t.voicesSection.desc}</p>
          </div>

          <VoiceProfiles voices={voices} />
        </div>
      </section>

      <section className="projects-section" id="ferramentas">
        <div className="shell">
          <div className="section-head light-head">
            <div>
              <p className="eyebrow">{t.toolsSection.eyebrow}</p>
              <h2>{t.toolsSection.titleMain}<br /><em>{t.toolsSection.titleEm}</em></h2>
            </div>
            <p>{t.toolsSection.desc}</p>
          </div>
          <ToolProfiles projects={projects} />
        </div>
      </section>

      <section className="manifesto shell">
        <p className="eyebrow">{t.manifestoSection.eyebrow}</p>
        <p className="manifesto-copy">
          {t.manifestoSection.copyMain}<em>{t.manifestoSection.copyEm1}</em>{t.manifestoSection.copyMid}<em>{t.manifestoSection.copyEm2}</em>
        </p>
        <div className="values">
          <div><b>01</b><h3>{t.manifestoSection.v1Title}</h3><p>{t.manifestoSection.v1Text}</p></div>
          <div><b>02</b><h3>{t.manifestoSection.v2Title}</h3><p>{t.manifestoSection.v2Text}</p></div>
          <div><b>03</b><h3>{t.manifestoSection.v3Title}</h3><p>{t.manifestoSection.v3Text}</p></div>
        </div>
        <div style={{ marginTop: '48px' }}>
          <a className="button button-dark" href={`${basePath}/o-ritmo-da-terra/`}>
            {t.manifestoSection.readManifesto} <span>{dir === 'rtl' ? '←' : '→'}</span>
          </a>
        </div>
      </section>

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
              <a href={`${basePath}/brapa/`}>{t.nav.phonetics}</a>
              <a href={`${basePath}/o-ritmo-da-terra/`}>{t.nav.manifesto}</a>
              <a href="#top">{t.footer.backToTop}</a>
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
