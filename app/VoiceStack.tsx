'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useSound } from './SoundEffects';
import { VoiceItem } from './i18n/translations';
import { useLanguage } from './LanguageContext';

interface VoiceStackProps {
  voices: VoiceItem[];
}

export default function VoiceStack({ voices }: VoiceStackProps) {
  const { language } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const { playCardSelect, playWhoosh } = useSound();
  
  const trackRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  
  const positionRef = useRef<number>(0);
  const startXRef = useRef<number | null>(null);
  const dragStartPosRef = useRef<number>(0);
  const hasMovedRef = useRef<boolean>(false);

  // Keep the static HTML concise for crawlers; add visual loop copies after hydration.
  const repeatedVoices = isHydrated ? [...voices, ...voices, ...voices, ...voices] : voices;

  // Card dimensions for calculation
  const cardWidth = 250;
  const cardGap = 22;
  const singleSetWidth = voices.length * (cardWidth + cardGap);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    let lastTimestamp = performance.now();

    const animate = (timestamp: number) => {
      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      if (!isHovered && !isDragging && trackRef.current) {
        // Slow continuous rolling speed (~24px per second)
        const speed = 0.024 * delta;
        positionRef.current -= speed;

        // Wrap around seamlessly
        if (positionRef.current <= -singleSetWidth) {
          positionRef.current += singleSetWidth;
        } else if (positionRef.current > 0) {
          positionRef.current -= singleSetWidth;
        }

        trackRef.current.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isHovered, isDragging, singleSetWidth]);

  // Drag and Swipe logic
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    startXRef.current = clientX;
    dragStartPosRef.current = positionRef.current;
    hasMovedRef.current = false;
  };

  const handleDragMove = (clientX: number) => {
    if (startXRef.current === null || !trackRef.current) return;
    const diff = clientX - startXRef.current;
    
    if (Math.abs(diff) > 5) {
      hasMovedRef.current = true;
    }

    let newPos = dragStartPosRef.current + diff;
    
    // Wrap around while dragging
    if (newPos <= -singleSetWidth) {
      newPos += singleSetWidth;
      dragStartPosRef.current += singleSetWidth;
    } else if (newPos > 0) {
      newPos -= singleSetWidth;
      dragStartPosRef.current -= singleSetWidth;
    }

    positionRef.current = newPos;
    trackRef.current.style.transform = `translate3d(${newPos}px, 0, 0)`;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    startXRef.current = null;
    setTimeout(() => {
      hasMovedRef.current = false;
    }, 50);
  };

  // Card 3D tilt on hover
  const handleMouseMoveCard = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    const rotateX = (centerY - y) / 10; 
    const rotateY = (x - centerX) / 10;

    const px = (x / box.width) * 100;
    const py = (y / box.height) * 100;

    card.style.setProperty('--rx', `${rotateX}deg`);
    card.style.setProperty('--ry', `${rotateY}deg`);
    card.style.setProperty('--x', `${px}%`);
    card.style.setProperty('--y', `${py}%`);
  };

  const handleMouseLeaveCard = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  };

  const handleCardClick = (voice: VoiceItem) => {
    if (hasMovedRef.current) return;
    playCardSelect();
    
    // Navigate smoothly to the voice profile section
    const slug = voice.name.toLowerCase().replace(/\s+/g, '-');
    const targetEl = document.getElementById(`voice-${slug}`) || document.getElementById('vozes');
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    playWhoosh();
    positionRef.current += (cardWidth + cardGap);
    if (positionRef.current > 0) {
      positionRef.current -= singleSetWidth;
    }
    if (trackRef.current) {
      trackRef.current.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)';
      trackRef.current.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
      setTimeout(() => {
        if (trackRef.current) trackRef.current.style.transition = 'none';
      }, 400);
    }
  };

  const handleNext = () => {
    playWhoosh();
    positionRef.current -= (cardWidth + cardGap);
    if (positionRef.current <= -singleSetWidth) {
      positionRef.current += singleSetWidth;
    }
    if (trackRef.current) {
      trackRef.current.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)';
      trackRef.current.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
      setTimeout(() => {
        if (trackRef.current) trackRef.current.style.transition = 'none';
      }, 400);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) > 1) {
      positionRef.current -= delta * 0.85;
      if (positionRef.current <= -singleSetWidth) {
        positionRef.current += singleSetWidth;
      } else if (positionRef.current > 0) {
        positionRef.current -= singleSetWidth;
      }
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
      }
    }
  };

  return (
    <div 
      className="voice-carousel-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="voice-slider-wrapper"
        data-lenis-prevent="true"
        onWheel={handleWheel}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
      >
        <div 
          className={`voice-slider-track ${isDragging ? 'dragging' : ''}`}
          ref={trackRef}
          style={{ transform: 'translate3d(0, 0, 0)' }}
        >
          {repeatedVoices.map((voice, idx) => {
            const originalIndex = idx % voices.length;

            return (
              <article 
                className="pokemon-card"
                key={`${voice.name}-${idx}`}
                aria-hidden={idx >= voices.length ? true : undefined}
                style={{ 
                  '--accent': voice.accent,
                } as React.CSSProperties}
                onMouseMove={handleMouseMoveCard}
                onMouseLeave={handleMouseLeaveCard}
                onClick={() => handleCardClick(voice)}
                title={`Clique para ver o perfil completo de ${voice.name}`}
              >
                <div className="card-border-glow" />
                <div className="card-inner">
                  <div className="card-header">
                    <span className="card-number">0{originalIndex + 1}</span>
                    <span className="card-name">{voice.name}</span>
                    <span className="card-type-icon">★</span>
                  </div>
                  
                  <div className="card-image-container">
                    <img src={voice.image} alt={`Arte de ${voice.name}`} draggable="false" loading={idx < 2 ? 'eager' : 'lazy'} decoding="async" />
                    <div className="voice-card-shine" />
                  </div>
                  
                  <div className="card-footer">
                    <div className="card-meta-row">
                      <span>{voice.meta}</span>
                      <span className="card-engine-badge">{voice.tags[0]}</span>
                    </div>
                    <div className="card-desc-box">
                      <p>{voice.detail}</p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="carousel-nav-row">
        <button 
          className="carousel-arrow-btn" 
          onClick={handlePrev}
          aria-label="Previous"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span className="carousel-hint">
          {language === 'pt' && 'Slider contínuo · Arraste ou clique para navegar'}
          {language === 'en' && 'Continuous slider · Drag or click to navigate'}
          {language === 'ar' && 'شريط متحرك مستمر · اسحب أو انقر للتنقل'}
          {language === 'ru' && 'Непрерывный слайдер · Перетащите или нажмите'}
          {language === 'ja' && '連続スライダー · ドラッグまたはクリックで移動'}
        </span>
        <button 
          className="carousel-arrow-btn" 
          onClick={handleNext}
          aria-label="Next"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
