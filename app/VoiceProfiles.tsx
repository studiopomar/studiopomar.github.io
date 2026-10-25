'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSound } from './SoundEffects';
import { useLanguage } from './LanguageContext';
import { VoiceItem } from './i18n/translations';
import FloatingAudioPlayer from './FloatingAudioPlayer';
import { CloseIcon, LeafIcon, PlayIcon, PauseIcon } from './Icons';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

interface VoiceProfilesProps {
  voices: VoiceItem[];
}

type FilterCategory = 'all' | 'br' | 'multilingual' | 'diffsinger' | 'utau' | 'pioneers';

export default function VoiceProfiles({ voices }: VoiceProfilesProps) {
  const { t } = useLanguage();
  const [selectedVoice, setSelectedVoice] = useState<VoiceItem | null>(null);
  
  // Audio playback and floating player state
  const [activeAudioVoice, setActiveAudioVoice] = useState<VoiceItem | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isPlayerVisible, setIsPlayerVisible] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  // Filter and search state
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const { playModalOpen, playModalClose, playClick } = useSound();

  const handleOpenModal = (voice: VoiceItem) => {
    playModalOpen();
    setSelectedVoice(voice);
  };

  const handleCloseModal = () => {
    playModalClose();
    setSelectedVoice(null);
  };

  // Memoized filter counts
  const filterCounts = React.useMemo(() => {
    return {
      all: voices.length,
      br: voices.filter(v => v.id !== 'llane-crow').length,
      multilingual: voices.filter(v => v.tags.some(tag => /multi/i.test(tag)) || (v.specs?.languages && v.specs.languages.includes('·'))).length,
      diffsinger: voices.filter(v => v.tags.includes('DiffSinger') || (v.specs?.engines && v.specs.engines.includes('DiffSinger'))).length,
      utau: voices.filter(v => v.tags.includes('UTAU') || v.tags.includes('OpenUTAU') || (v.specs?.engines && /utau/i.test(v.specs.engines))).length,
      pioneers: voices.filter(v => v.tags.some(tag => /pioneir|пионер|先駆者|الرواد/i.test(tag)) || ['viictor', 'yohji', 'eddie', 'llane-crow'].includes(v.id)).length,
    };
  }, [voices]);

  // Memoized filtered voice items
  const filteredVoices = React.useMemo(() => {
    return voices.filter(voice => {
      // 1. Category pill filter
      if (activeFilter === 'br' && voice.id === 'llane-crow') return false;
      if (activeFilter === 'multilingual' && !voice.tags.some(tag => /multi/i.test(tag)) && !(voice.specs?.languages && voice.specs.languages.includes('·'))) return false;
      if (activeFilter === 'diffsinger' && !voice.tags.includes('DiffSinger') && !(voice.specs?.engines && voice.specs.engines.includes('DiffSinger'))) return false;
      if (activeFilter === 'utau' && !voice.tags.includes('UTAU') && !voice.tags.includes('OpenUTAU') && !(voice.specs?.engines && /utau/i.test(voice.specs.engines))) return false;
      if (activeFilter === 'pioneers' && !voice.tags.some(tag => /pioneir|пионер|先駆者|الرواد/i.test(tag)) && !['viictor', 'yohji', 'eddie', 'llane-crow'].includes(voice.id)) return false;

      // 2. Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const matchName = voice.name.toLowerCase().includes(q);
      const matchDetail = voice.detail.toLowerCase().includes(q);
      const matchMeta = voice.meta.toLowerCase().includes(q);
      const matchTags = voice.tags.some(tag => tag.toLowerCase().includes(q));
      const matchOwner = voice.ownerName.toLowerCase().includes(q);
      const matchEngines = voice.specs?.engines.toLowerCase().includes(q) ?? false;
      const matchLanguages = voice.specs?.languages.toLowerCase().includes(q) ?? false;
      const matchSpecies = voice.specs?.species.toLowerCase().includes(q) ?? false;

      return matchName || matchDetail || matchMeta || matchTags || matchOwner || matchEngines || matchLanguages || matchSpecies;
    });
  }, [voices, activeFilter, searchQuery]);

  // Keep selectedVoice and activeAudioVoice updated if language changes
  useEffect(() => {
    if (selectedVoice) {
      const updated = voices.find((v) => v.id === selectedVoice.id);
      if (updated) {
        setSelectedVoice(updated);
      }
    }
    if (activeAudioVoice) {
      const updatedActive = voices.find((v) => v.id === activeAudioVoice.id);
      if (updatedActive) {
        setActiveAudioVoice(updatedActive);
      }
    }
  }, [voices]);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (selectedVoice) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedVoice]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioElRef.current) {
        audioElRef.current.pause();
        audioElRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch {}
      }
    };
  }, []);

  // Stop current audio preview (both HTML5 audio and Web Audio synthesizer)
  const stopPreview = () => {
    if (audioElRef.current) {
      audioElRef.current.pause();
      audioElRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {
        // Ignore
      }
      audioCtxRef.current = null;
    }
    setIsPlayingAudio(false);
    setIsPlayerVisible(false);
  };

  const playVoicePreview = (voice: VoiceItem) => {
    // If the same voice is already loaded
    if (activeAudioVoice?.id === voice.id && isPlayerVisible) {
      if (isPlayingAudio) {
        if (audioElRef.current) {
          audioElRef.current.pause();
          setIsPlayingAudio(false);
          return;
        } else {
          stopPreview();
          return;
        }
      } else {
        if (audioElRef.current) {
          audioElRef.current.play().catch(() => {});
          setIsPlayingAudio(true);
          return;
        }
      }
    }

    // Stop ongoing audio cleanly without unmounting floating player
    if (audioElRef.current) {
      audioElRef.current.pause();
      audioElRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {}
      audioCtxRef.current = null;
    }

    // Switch active voice immediately (smoothly transitions colors via CSS)
    setActiveAudioVoice(voice);
    setIsPlayingAudio(true);
    setIsPlayerVisible(true);
    setCurrentTime(0);
    setProgress(0);
    setDuration(0);

    // If real audio sample file is provided, play it!
    if (voice.audioSample) {
      try {
        const audio = new Audio(voice.audioSample);
        audioElRef.current = audio;

        audio.ontimeupdate = () => {
          if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
            setCurrentTime(audio.currentTime);
            setDuration(audio.duration);
            setProgress((audio.currentTime / audio.duration) * 100);
          }
        };

        audio.onloadedmetadata = () => {
          if (audio.duration && !isNaN(audio.duration)) {
            setDuration(audio.duration);
          }
        };

        audio.onplay = () => {
          setIsPlayingAudio(true);
        };

        audio.onpause = () => {
          setIsPlayingAudio(false);
        };

        audio.onended = () => {
          setIsPlayingAudio(false);
          setProgress(100);
          if (audio.duration) setCurrentTime(audio.duration);
          // Graceful fade out after track finishes
          timeoutRef.current = setTimeout(() => {
            setIsPlayerVisible(false);
            audioElRef.current = null;
          }, 450);
        };

        audio.onerror = () => {
          setIsPlayingAudio(false);
          setIsPlayerVisible(false);
          audioElRef.current = null;
        };

        audio.play().catch(() => {
          setIsPlayingAudio(false);
          setIsPlayerVisible(false);
          audioElRef.current = null;
        });

        return;
      } catch {
        // Fallback to synth
      }
    }

    // Web Audio Synthesizer Fallback
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    audioCtxRef.current = ctx;

    const melodyMap: Record<string, { notes: number[]; durations: number[]; baseFreq: number }> = {
      'VIICTOR': {
        notes: [261.63, 329.63, 392.0, 440.0, 523.25],
        durations: [0.22, 0.22, 0.22, 0.28, 0.55],
        baseFreq: 261.63,
      },
      'YOHJI': {
        notes: [196.0, 246.94, 293.66, 329.63, 392.0],
        durations: [0.25, 0.25, 0.25, 0.32, 0.6],
        baseFreq: 196.0,
      },
      'EDDIE': {
        notes: [146.83, 185.0, 220.0, 293.66, 369.99],
        durations: [0.2, 0.2, 0.22, 0.26, 0.55],
        baseFreq: 146.83,
      },
      'MIZUKI': {
        notes: [349.23, 440.0, 523.25, 659.25, 880.0],
        durations: [0.18, 0.18, 0.2, 0.24, 0.5],
        baseFreq: 349.23,
      },
      'LLANE CROW': {
        notes: [130.81, 196.0, 261.63, 311.13, 392.0],
        durations: [0.28, 0.28, 0.28, 0.35, 0.65],
        baseFreq: 130.81,
      },
      'KODAMA KITO': {
        notes: [164.81, 196.0, 246.94, 293.66, 329.63],
        durations: [0.22, 0.22, 0.24, 0.28, 0.55],
        baseFreq: 164.81,
      },
      'APOLLYO XII': {
        notes: [220.0, 261.63, 311.13, 369.99, 440.0],
        durations: [0.22, 0.22, 0.24, 0.28, 0.55],
        baseFreq: 220.0,
      },
      'apollyo': {
        notes: [220.0, 261.63, 311.13, 369.99, 440.0],
        durations: [0.22, 0.22, 0.24, 0.28, 0.55],
        baseFreq: 220.0,
      },
    };

    const config = melodyMap[voice.name] || melodyMap[voice.id] || melodyMap['KODAMA KITO'] || melodyMap['VIICTOR'];
    let startTime = ctx.currentTime + 0.05;

    config.notes.forEach((freq, idx) => {
      const dur = config.durations[idx];

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(freq, startTime);
      osc2.frequency.setValueAtTime(freq * 1.002, startTime);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq * 2.2, startTime);
      filter.Q.setValueAtTime(3.5, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.08, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(startTime);
      osc2.start(startTime);
      osc1.stop(startTime + dur);
      osc2.stop(startTime + dur);

      startTime += dur * 0.92;
    });

    const totalSeconds = startTime - ctx.currentTime;
    setDuration(totalSeconds);

    const startPerf = performance.now();
    const animTick = (now: number) => {
      const elapsed = (now - startPerf) / 1000;
      setCurrentTime(Math.min(elapsed, totalSeconds));
      setProgress(Math.min((elapsed / totalSeconds) * 100, 100));

      if (elapsed < totalSeconds) {
        animFrameRef.current = requestAnimationFrame(animTick);
      }
    };
    animFrameRef.current = requestAnimationFrame(animTick);

    const totalDuration = totalSeconds * 1000;
    timeoutRef.current = setTimeout(() => {
      setIsPlayingAudio(false);
      setProgress(100);
      setCurrentTime(totalSeconds);
      timeoutRef.current = setTimeout(() => {
        setIsPlayerVisible(false);
      }, 450);
    }, totalDuration);
  };

  const handleTogglePlayer = () => {
    if (!activeAudioVoice) return;
    if (audioElRef.current) {
      if (audioElRef.current.paused) {
        audioElRef.current.play().catch(() => {});
        setIsPlayingAudio(true);
      } else {
        audioElRef.current.pause();
        setIsPlayingAudio(false);
      }
    } else {
      if (isPlayingAudio) {
        stopPreview();
      } else {
        playVoicePreview(activeAudioVoice);
      }
    }
  };

  const handleSeekPlayer = (percentage: number) => {
    if (audioElRef.current && audioElRef.current.duration) {
      const target = percentage * audioElRef.current.duration;
      audioElRef.current.currentTime = target;
      setCurrentTime(target);
      setProgress(percentage * 100);
    }
  };

  const handlePlayerVoiceClick = (voice: VoiceItem) => {
    const slug = voice.name.toLowerCase().replace(/\s+/g, '-');
    const targetEl = document.getElementById(`voice-${slug}`) || document.getElementById(`voice-${voice.id}`);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
    handleOpenModal(voice);
  };

  return (
    <>
      {/* Voice Controls Bar: Quick Category Pills & Search Input */}
      <div className="voice-controls-bar">
        <div className="voice-filter-pills" role="tablist" aria-label="Filtro de vozes">
          <button
            type="button"
            className={`filter-pill ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => { playClick(); setActiveFilter('all'); }}
            role="tab"
            aria-selected={activeFilter === 'all'}
          >
            <span>{t.voicesSection.filterAll}</span>
            <span className="pill-count">{filterCounts.all}</span>
          </button>
          <button
            type="button"
            className={`filter-pill ${activeFilter === 'br' ? 'active' : ''}`}
            onClick={() => { playClick(); setActiveFilter('br'); }}
            role="tab"
            aria-selected={activeFilter === 'br'}
          >
            <span>{t.voicesSection.filterBr}</span>
            <span className="pill-count">{filterCounts.br}</span>
          </button>
          <button
            type="button"
            className={`filter-pill ${activeFilter === 'multilingual' ? 'active' : ''}`}
            onClick={() => { playClick(); setActiveFilter('multilingual'); }}
            role="tab"
            aria-selected={activeFilter === 'multilingual'}
          >
            <span>{t.voicesSection.filterMultilingual}</span>
            <span className="pill-count">{filterCounts.multilingual}</span>
          </button>
          <button
            type="button"
            className={`filter-pill ${activeFilter === 'diffsinger' ? 'active' : ''}`}
            onClick={() => { playClick(); setActiveFilter('diffsinger'); }}
            role="tab"
            aria-selected={activeFilter === 'diffsinger'}
          >
            <span>{t.voicesSection.filterDiffSinger}</span>
            <span className="pill-count">{filterCounts.diffsinger}</span>
          </button>
          <button
            type="button"
            className={`filter-pill ${activeFilter === 'utau' ? 'active' : ''}`}
            onClick={() => { playClick(); setActiveFilter('utau'); }}
            role="tab"
            aria-selected={activeFilter === 'utau'}
          >
            <span>{t.voicesSection.filterUtau}</span>
            <span className="pill-count">{filterCounts.utau}</span>
          </button>
          <button
            type="button"
            className={`filter-pill ${activeFilter === 'pioneers' ? 'active' : ''}`}
            onClick={() => { playClick(); setActiveFilter('pioneers'); }}
            role="tab"
            aria-selected={activeFilter === 'pioneers'}
          >
            <span>{t.voicesSection.filterPioneers}</span>
            <span className="pill-count">{filterCounts.pioneers}</span>
          </button>
        </div>

        <div className="voice-search-wrapper">
          <span className="voice-search-icon" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input
            type="text"
            className="voice-search-input"
            placeholder={t.voicesSection.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label={t.voicesSection.searchPlaceholder}
          />
          {searchQuery && (
            <button
              type="button"
              className="voice-search-clear"
              onClick={() => { playClick(); setSearchQuery(''); }}
              aria-label={t.voicesSection.resetFilters}
              title={t.voicesSection.resetFilters}
            >
              <CloseIcon size={13} />
            </button>
          )}
        </div>
      </div>

      {filteredVoices.length === 0 ? (
        <div className="voice-empty-state">
          <div className="empty-icon"><LeafIcon size={32} /></div>
          <p className="empty-msg">{t.voicesSection.noResults}</p>
          <button 
            type="button"
            className="empty-reset-btn"
            onClick={() => { playClick(); setActiveFilter('all'); setSearchQuery(''); }}
          >
            {t.voicesSection.resetFilters}
          </button>
        </div>
      ) : (
        <div className="voice-profiles">
          {filteredVoices.map((voice, idx) => {
            const isThisPlaying = activeAudioVoice?.id === voice.id && isPlayingAudio;

            return (
              <article 
                className="profile-card" 
                key={voice.id || voice.name}
                id={`voice-${voice.id || voice.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <button 
                  className="profile-image-btn" 
                  onClick={() => handleOpenModal(voice)}
                  style={{ '--accent': voice.accent } as React.CSSProperties} 
                  aria-label={`${t.voicesSection.viewDetails}: ${voice.name}`}
                >
                  <span>0{idx + 1}</span>
                  <img src={voice.image} alt={voice.name} loading="lazy" decoding="async" />
                  <div className="profile-image-hover-indicator">
                    <span>{t.voicesSection.viewDetails}</span>
                  </div>
                </button>
                <div className="profile-copy">
                  <p className="profile-meta">{voice.meta}</p>
                  <div className="profile-name-row">
                    <h3>{voice.name}</h3>
                    <button
                      className={`voice-preview-btn ${isThisPlaying ? 'playing' : ''}`}
                      onClick={() => playVoicePreview(voice)}
                      aria-label={isThisPlaying ? `${t.voicesSection.stopAudio} (${voice.name})` : `${t.voicesSection.listenSample} (${voice.name})`}
                      title={isThisPlaying ? t.voicesSection.stopAudio : t.voicesSection.listenSample}
                    >
                      <span className="preview-icon">{isThisPlaying ? <PauseIcon size={11} /> : <PlayIcon size={11} />}</span>
                      <span>{isThisPlaying ? t.voicesSection.playing : t.voicesSection.listenSample}</span>
                      {isThisPlaying && (
                        <span className="mini-equalizer">
                          <i /><i /><i />
                        </span>
                      )}
                    </button>
                  </div>
                  <p>{voice.detail}</p>
                  <div className="tags">
                    {voice.tags.map(tag => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <div className="profile-links">
                    <button 
                      className="profile-detail-trigger"
                      onClick={() => handleOpenModal(voice)}
                    >
                      {t.voicesSection.viewDetails}
                    </button>
                    <a href={`${basePath}/vozes/${voice.id}/`}>Página completa ↗</a>
                    <a href={voice.owner} target="_blank" rel="noreferrer">
                      {t.voicesSection.modal.creatorChannel}: {voice.ownerName}
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Modal / Card Details Overlay */}
      {selectedVoice && (() => {
        const specs = selectedVoice.specs;
        const isModalPlaying = activeAudioVoice?.id === selectedVoice.id && isPlayingAudio;

        return (
          <div 
            className="modal-overlay" 
            onClick={handleCloseModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            data-lenis-prevent="true"
          >
            <div 
              className="modal-card" 
              onClick={(e) => e.stopPropagation()}
              style={{ '--accent': selectedVoice.accent } as React.CSSProperties}
              data-lenis-prevent="true"
            >
              <button 
                className="modal-close-btn" 
                onClick={handleCloseModal}
                aria-label={t.voicesSection.modal.close}
              >
                <CloseIcon size={15} />
              </button>
              
              <div className="modal-grid">
                <div className="modal-image-panel">
                  <img src={selectedVoice.image} alt={selectedVoice.name} />
                </div>
                
                <div className="modal-info-panel" data-lenis-prevent="true">
                  <p className="modal-meta">{selectedVoice.meta}</p>
                  
                  <div className="modal-header-flex">
                    <h2 id="modal-title" className="modal-title">{selectedVoice.name}</h2>
                    <button
                      className={`voice-preview-btn large ${isModalPlaying ? 'playing' : ''}`}
                      onClick={() => playVoicePreview(selectedVoice)}
                    >
                      <span className="preview-icon">{isModalPlaying ? <PauseIcon size={12} /> : <PlayIcon size={12} />}</span>
                      <span>{isModalPlaying ? t.voicesSection.playing : t.voicesSection.listenSample}</span>
                      {isModalPlaying && (
                        <span className="mini-equalizer">
                          <i /><i /><i />
                        </span>
                      )}
                    </button>
                  </div>
                  
                  <div className="modal-divider" />
                  
                  <p className="modal-detail-text">{selectedVoice.detail}</p>
                  
                  {specs && (
                    <div className="modal-specs">
                      <div className="spec-item">
                        <span className="spec-label">{t.voicesSection.modal.species}</span>
                        <span className="spec-val">{specs.species}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">{t.voicesSection.modal.engines}</span>
                        <span className="spec-val">{specs.engines}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">{t.voicesSection.modal.languages}</span>
                        <span className="spec-val">{specs.languages}</span>
                      </div>
                      {specs.range && (
                        <div className="spec-item">
                          <span className="spec-label">{t.voicesSection.modal.range}</span>
                          <span className="spec-val">{specs.range}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="modal-specs" style={{ marginTop: '12px' }}>
                    <div className="spec-item full-width">
                      <span className="spec-label">{t.voicesSection.modal.bio}</span>
                      <span className="spec-val" style={{ lineHeight: '1.6', fontSize: '0.86rem' }}>
                        {specs?.description}
                      </span>
                    </div>
                  </div>

                  <div className="modal-footer-tags">
                    {selectedVoice.tags.map(tag => (
                      <span className="modal-tag" key={tag}>{tag}</span>
                    ))}
                  </div>

                  <div className="modal-actions">
                    {specs?.downloadUrl && (
                      <a 
                        href={specs.downloadUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="modal-action-btn download-btn"
                      >
                        {t.voicesSection.modal.downloadBank} <span>↓</span>
                      </a>
                    )}
                    <a 
                      href={selectedVoice.profile} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="modal-action-btn primary"
                    >
                      {t.voicesSection.modal.officialWiki}
                    </a>
                    <a 
                      href={selectedVoice.owner} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="modal-action-btn secondary"
                    >
                      {t.voicesSection.modal.creatorChannel} ({selectedVoice.ownerName})
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Floating Audio Player (Fixed Bottom Bar) */}
      <FloatingAudioPlayer
        activeVoice={activeAudioVoice}
        isPlaying={isPlayingAudio}
        isVisible={isPlayerVisible}
        currentTime={currentTime}
        duration={duration}
        progress={progress}
        onTogglePlay={handleTogglePlayer}
        onClose={stopPreview}
        onVoiceClick={handlePlayerVoiceClick}
        onSeek={handleSeekPlayer}
      />
    </>
  );
}
