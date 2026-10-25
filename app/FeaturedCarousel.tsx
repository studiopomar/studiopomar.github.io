'use client';

import React, { useRef, useState } from 'react';
import { useLanguage } from './LanguageContext';
import { newsTranslations } from './i18n/translations';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export default function FeaturedCarousel() {
  const { t, language, dir } = useLanguage();
  const [activeSlide, setActiveSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const news = newsTranslations[language];
  const isRaphaello = activeSlide === 1;

  const showSlide = (slide: number) => setActiveSlide((slide + 2) % 2);
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === (dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft')) {
      event.preventDefault();
      showSlide(activeSlide - 1);
    } else if (event.key === (dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight')) {
      event.preventDefault();
      showSlide(activeSlide + 1);
    }
  };

  return (
    <div
      className={`spotlight-carousel${isRaphaello ? ' is-raphaello' : ''}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={news.announcementBadge}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null; }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null) return;
        const delta = event.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) > 45) showSlide(activeSlide + (delta < 0 ? (dir === 'rtl' ? -1 : 1) : (dir === 'rtl' ? 1 : -1)));
        touchStartX.current = null;
      }}
    >
      <article className="spotlight-card">
        <div className="spotlight-header">
          <div className="spotlight-badge">
            <span className="spotlight-dot" />
            <span>{isRaphaello ? news.announcementBadge : t.hero.spotlightBadge}</span>
          </div>
          <span className="spotlight-version">{isRaphaello ? news.comingSoon : t.hero.spotlightVersion}</span>
        </div>

        <div className="spotlight-content" id="spotlight-content" aria-live="polite" aria-atomic="true">
          <a
            href={isRaphaello ? `${basePath}/novidades/` : 'https://github.com/studiopomar/kamafeu'}
            target={isRaphaello ? undefined : '_blank'}
            rel={isRaphaello ? undefined : 'noreferrer'}
            className={`spotlight-preview${isRaphaello ? ' spotlight-preview-raphaello' : ''}`}
            aria-label={isRaphaello ? news.cardAction : t.hero.spotlightOpen}
          >
            <img
              src={isRaphaello ? `${basePath}/raphaello_diff.webp` : `${basePath}/kamafeu.png`}
              alt={isRaphaello ? news.imageAlt : 'Interface do Kamafeu'}
              loading="lazy"
              decoding="async"
            />
            <span className="spotlight-preview-overlay">
              {isRaphaello ? news.cardAction : t.hero.spotlightOpen}
            </span>
          </a>

          <div className="spotlight-details">
            <div className="spotlight-title-row">
              <h3>{isRaphaello ? news.title : t.hero.spotlightTitle}</h3>
              <span className="spotlight-category">{isRaphaello ? news.cardCategory : t.hero.spotlightCategory}</span>
            </div>
            <p>{isRaphaello ? news.cardDescription : t.hero.spotlightDesc}</p>
            <div className="spotlight-actions">
              {isRaphaello ? (
                <a href={`${basePath}/novidades/`} className="spotlight-btn-primary">{news.cardAction}</a>
              ) : (
                <>
                  <a href="https://github.com/studiopomar/kamafeu" target="_blank" rel="noreferrer" className="spotlight-btn-primary">
                    {t.hero.spotlightSource}
                  </a>
                  <a href="#ferramentas" className="spotlight-btn-ghost">{t.hero.spotlightTools}</a>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="spotlight-controls">
          <button type="button" onClick={() => showSlide(activeSlide - 1)} aria-label={news.previousCard} aria-controls="spotlight-content">
            <span aria-hidden="true">{dir === 'rtl' ? '›' : '‹'}</span>
          </button>
          <div className="spotlight-pagination" aria-label={`${activeSlide + 1} / 2`}>
            {[0, 1].map((slide) => (
              <button
                key={slide}
                type="button"
                className={activeSlide === slide ? 'active' : ''}
                aria-label={`${slide + 1} / 2`}
                aria-current={activeSlide === slide ? 'true' : undefined}
                onClick={() => showSlide(slide)}
              />
            ))}
          </div>
          <button type="button" onClick={() => showSlide(activeSlide + 1)} aria-label={news.nextCard} aria-controls="spotlight-content">
            <span aria-hidden="true">{dir === 'rtl' ? '‹' : '›'}</span>
          </button>
        </div>
      </article>
    </div>
  );
}
