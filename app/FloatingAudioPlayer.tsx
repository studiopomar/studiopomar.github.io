'use client';

import React from 'react';
import { VoiceItem } from './i18n/translations';
import { PlayIcon, PauseIcon, CloseIcon } from './Icons';

interface FloatingAudioPlayerProps {
  activeVoice: VoiceItem | null;
  isPlaying: boolean;
  isVisible: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  onTogglePlay: () => void;
  onClose: () => void;
  onVoiceClick?: (voice: VoiceItem) => void;
  onSeek?: (percentage: number) => void;
}

const formatTime = (secs: number) => {
  if (isNaN(secs) || secs < 0) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

export default function FloatingAudioPlayer({
  activeVoice,
  isPlaying,
  isVisible,
  currentTime,
  duration,
  progress,
  onTogglePlay,
  onClose,
  onVoiceClick,
  onSeek,
}: FloatingAudioPlayerProps) {
  const accent = activeVoice?.accent || '#d7ff3f';

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(percentage);
  };

  const handleInfoClick = () => {
    if (activeVoice && onVoiceClick) {
      onVoiceClick(activeVoice);
    }
  };

  return (
    <div
      className={`floating-audio-player ${isVisible ? 'visible' : ''}`}
      style={
        {
          '--player-accent': accent,
          '--player-glow': `${accent}55`,
        } as React.CSSProperties
      }
      role="region"
      aria-label="Tocador de amostra de áudio flutuante"
    >
      {/* Mini Avatar / Thumbnail */}
      <div 
        className="floating-player-avatar" 
        onClick={handleInfoClick}
        title={activeVoice ? `Ver perfil de ${activeVoice.name}` : undefined}
      >
        {activeVoice && (
          <img src={activeVoice.image} alt={activeVoice.name} />
        )}
      </div>

      {/* Voice Information */}
      <div 
        className="floating-player-info" 
        onClick={handleInfoClick}
        title={activeVoice ? `Ver perfil de ${activeVoice.name}` : undefined}
      >
        <div className="floating-player-name-row">
          <p className="floating-player-name">{activeVoice?.name || 'Amostra de Voz'}</p>
          <div className={`floating-player-equalizer ${!isPlaying ? 'paused' : ''}`}>
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
        <p className="floating-player-meta">{activeVoice?.meta || 'Studio Pomar'}</p>
      </div>

      {/* Progress & Time Indicator */}
      <div className="floating-player-progress-wrap">
        <div 
          className="floating-player-progress-bar" 
          onClick={handleProgressBarClick}
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div 
            className="floating-player-progress-fill" 
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} 
          />
        </div>
        <div className="floating-player-time">
          <span>{formatTime(currentTime)}</span>
          <span>{duration > 0 ? formatTime(duration) : '0:00'}</span>
        </div>
      </div>

      {/* Play / Pause Toggle Button */}
      <button
        className="floating-player-btn-play"
        onClick={onTogglePlay}
        aria-label={isPlaying ? 'Pausar áudio' : 'Reproduzir áudio'}
        title={isPlaying ? 'Pausar' : 'Reproduzir'}
      >
        <span>{isPlaying ? <PauseIcon size={14} /> : <PlayIcon size={14} />}</span>
      </button>

      {/* Close Button */}
      <button
        className="floating-player-btn-close"
        onClick={onClose}
        aria-label="Fechar reprodutor"
        title="Fechar reprodutor"
      >
        <CloseIcon size={14} />
      </button>
    </div>
  );
}
