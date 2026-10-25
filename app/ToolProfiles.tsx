'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { useSound } from './SoundEffects';
import { ProjectItem } from './i18n/translations';
import {
  WindowsIcon,
  LinuxIcon,
  AppleIcon,
  ExternalLinkIcon,
  DownloadIcon,
  CloseIcon,
} from './Icons';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

interface ToolProfilesProps {
  projects: ProjectItem[];
}

export default function ToolProfiles({ projects }: ToolProfilesProps) {
  const { t, dir } = useLanguage();
  const [selectedTool, setSelectedTool] = useState<ProjectItem | null>(null);
  const { playModalOpen, playModalClose, playClick } = useSound();

  const handleOpenModal = (project: ProjectItem) => {
    playModalOpen();
    setSelectedTool(project);
  };

  const handleCloseModal = () => {
    playModalClose();
    setSelectedTool(null);
  };

  // Keep selectedTool updated if language changes
  useEffect(() => {
    if (selectedTool) {
      const updated = projects.find((p) => p.id === selectedTool.id);
      if (updated) {
        setSelectedTool(updated);
      }
    }
  }, [projects]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedTool) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedTool]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedTool) {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTool]);

  return (
    <>
      <div className="project-cards-grid">
        {projects.map((project) => (
          <article className="project-card" key={project.id || project.name}>
            <div 
              className="project-card-image-wrap"
              onClick={() => handleOpenModal(project)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleOpenModal(project); }}
              aria-label={`${t.toolsSection.viewDetails}: ${project.name}`}
            >
              <img src={project.image} alt={`Interface do ${project.name}`} loading="lazy" decoding="async" />
              <div className="project-card-image-overlay" />
              <span className="project-card-badge">{project.index}</span>
              <span className="project-card-version-badge">{project.version}</span>
              <div className="project-image-hover-indicator">
                <span>{t.toolsSection.viewDetails}</span>
              </div>
            </div>

            <div className="project-card-body">
              <div className="project-card-type-row">
                <p className="project-card-type">{project.type}</p>
                <span className="project-card-status-pill">{project.status}</span>
              </div>

              <h3 className="project-card-title">
                <button 
                  type="button" 
                  className="project-title-btn"
                  onClick={() => handleOpenModal(project)}
                >
                  {project.name}
                </button>
                <a 
                  href={project.href} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="project-github-link"
                  aria-label={`${project.name} no GitHub`}
                  title="GitHub"
                >
                  <ExternalLinkIcon size={16} />
                </a>
              </h3>

              <p className="project-card-description">{project.text}</p>

              <div className="project-card-tags">
                {project.tags.map((tag) => (
                  <span className="project-card-tag" key={tag}>{tag}</span>
                ))}
              </div>

              {/* Quick OS Download & Details Actions */}
              <div className="project-card-footer-actions">
                <button
                  type="button"
                  className="project-details-btn"
                  onClick={() => handleOpenModal(project)}
                >
                  {t.toolsSection.viewDetails}
                </button>
                <a className="project-details-btn" href={`${basePath}/ferramentas/${project.id}/`}>Página completa ↗</a>

                <div className="project-quick-os-badges">
                  {project.downloads?.windows && (
                    <a
                      href={project.downloads.windows}
                      target="_blank"
                      rel="noreferrer"
                      className="os-badge"
                      title="Windows (.exe / .zip)"
                      onClick={playClick}
                    >
                      <WindowsIcon size={12} /> Win
                    </a>
                  )}
                  {project.downloads?.linux && (
                    <a
                      href={project.downloads.linux}
                      target="_blank"
                      rel="noreferrer"
                      className="os-badge"
                      title="Linux (.AppImage / .tar.gz)"
                      onClick={playClick}
                    >
                      <LinuxIcon size={12} /> Linux
                    </a>
                  )}
                  {project.downloads?.mac && (
                    <a
                      href={project.downloads.mac}
                      target="_blank"
                      rel="noreferrer"
                      className="os-badge"
                      title="macOS (.dmg)"
                      onClick={playClick}
                    >
                      <AppleIcon size={12} /> macOS
                    </a>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Tool Details Modal Overlay */}
      {selectedTool && (
        <div
          className="modal-overlay"
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="tool-modal-title"
          data-lenis-prevent="true"
        >
          <div
            className="modal-card tool-modal-card"
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent="true"
          >
            <button
              className="modal-close-btn"
              onClick={handleCloseModal}
              aria-label={t.toolsSection.modal.close}
            >
              <CloseIcon size={15} />
            </button>

            <div className="modal-grid tool-modal-grid">
              <div className="modal-image-panel tool-modal-image-panel">
                <img src={selectedTool.image} alt={`Interface de ${selectedTool.name}`} />
                <div className="tool-image-badge-overlay">
                  <span className="tool-version-pill">{selectedTool.version}</span>
                  <span className="tool-license-pill">{selectedTool.license}</span>
                </div>
              </div>

              <div className="modal-info-panel" data-lenis-prevent="true">
                <div className="tool-modal-header-meta">
                  <span className="tool-modal-index">{selectedTool.index}</span>
                  <p className="modal-meta">{selectedTool.type}</p>
                </div>

                <div className="modal-header-flex">
                  <h2 id="tool-modal-title" className="modal-title">{selectedTool.name}</h2>
                  <span className="tool-status-badge">{selectedTool.status}</span>
                </div>

                <div className="modal-divider" />

                <p className="modal-detail-text">{selectedTool.detail || selectedTool.text}</p>

                {/* Technical Specifications */}
                <div className="modal-specs">
                  <div className="spec-item">
                    <span className="spec-label">{t.toolsSection.modal.version}</span>
                    <span className="spec-val">{selectedTool.version}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">{t.toolsSection.modal.language}</span>
                    <span className="spec-val">{selectedTool.language}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">{t.toolsSection.modal.license}</span>
                    <span className="spec-val">{selectedTool.license}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">{t.toolsSection.modal.status}</span>
                    <span className="spec-val">{selectedTool.status}</span>
                  </div>
                </div>

                {/* Key Features & Innovations */}
                {selectedTool.features && selectedTool.features.length > 0 && (
                  <div className="tool-features-block">
                    <h4 className="tool-features-title">{t.toolsSection.modal.keyFeatures}</h4>
                    <ul className="tool-features-list">
                      {selectedTool.features.map((feat, idx) => (
                        <li key={idx}>
                          <span className="feature-bullet">✶</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tags */}
                <div className="modal-footer-tags">
                  {selectedTool.tags.map((tag) => (
                    <span className="modal-tag" key={tag}>{tag}</span>
                  ))}
                </div>

                {/* Direct Download Actions by Operating System */}
                <div className="tool-downloads-container">
                  <h4 className="tool-downloads-title">{t.toolsSection.modal.downloads}</h4>
                  <div className="tool-downloads-grid">
                    {selectedTool.downloads?.windows && (
                      <a
                        href={selectedTool.downloads.windows}
                        target="_blank"
                        rel="noreferrer"
                        className="tool-os-download-card"
                        onClick={playClick}
                      >
                        <span className="os-icon"><WindowsIcon size={20} /></span>
                        <div className="os-info">
                          <span className="os-name">Windows</span>
                          <span className="os-format">.exe / .zip</span>
                        </div>
                        <span className="os-arrow"><DownloadIcon size={16} /></span>
                      </a>
                    )}

                    {selectedTool.downloads?.linux && (
                      <a
                        href={selectedTool.downloads.linux}
                        target="_blank"
                        rel="noreferrer"
                        className="tool-os-download-card"
                        onClick={playClick}
                      >
                        <span className="os-icon"><LinuxIcon size={20} /></span>
                        <div className="os-info">
                          <span className="os-name">Linux</span>
                          <span className="os-format">.AppImage / .tar.gz</span>
                        </div>
                        <span className="os-arrow"><DownloadIcon size={16} /></span>
                      </a>
                    )}

                    {selectedTool.downloads?.mac && (
                      <a
                        href={selectedTool.downloads.mac}
                        target="_blank"
                        rel="noreferrer"
                        className="tool-os-download-card"
                        onClick={playClick}
                      >
                        <span className="os-icon"><AppleIcon size={20} /></span>
                        <div className="os-info">
                          <span className="os-name">macOS</span>
                          <span className="os-format">.dmg / Universal</span>
                        </div>
                        <span className="os-arrow"><DownloadIcon size={16} /></span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Source code GitHub button */}
                <div className="modal-actions">
                  <a
                    href={selectedTool.href}
                    target="_blank"
                    rel="noreferrer"
                    className="modal-action-btn primary"
                    onClick={playClick}
                  >
                    {t.toolsSection.sourceCodeBtn}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
