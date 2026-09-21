'use client';

import React, { useState, useMemo } from 'react';
import { SoundToggle, useSound } from '../SoundEffects';
import LanguageSelector from '../LanguageSelector';
import ThemeSelector from '../ThemeSelector';
import { useLanguage } from '../LanguageContext';
import {
  VowelIcon,
  ConsonantsIcon,
  FlashIcon,
  LightbulbIcon,
  CopyIcon,
  CheckIcon,
  CloseIcon,
  DownloadIcon,
  ExternalLinkIcon,
} from '../Icons';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export interface BrapaPhoneme {
  symbol: string;
  xSampa: string;
  category: 'vowel' | 'semivowel' | 'consonant';
  type: string;
  exampleWord: string;
  examplePhonetic: string;
  notes?: string;
  regional?: string;
}

const BRAPA_PHONEMES: BrapaPhoneme[] = [
  // Vogais (23)
  { symbol: 'a', xSampa: 'a', category: 'vowel', type: 'Vogal anterior aberta não arredondada', exampleWord: 'Amigo', examplePhonetic: '[a m i g u]', notes: 'Vogal oral padrão' },
  { symbol: 'ao', xSampa: 'A', category: 'vowel', type: 'Vogal posterior aberta não arredondada', exampleWord: 'Pórta / Pedestal', examplePhonetic: '(4)[p ao x t a] / (9)[p e d e s t ao w]', notes: 'Vogal aberta posterior', regional: 'Regional (4 & 9)' },
  { symbol: 'ah', xSampa: 'V', category: 'vowel', type: 'Vogal posterior semiaberta não arredondada', exampleWord: 'Saudade', examplePhonetic: '[s ah w d a dj i]', notes: 'Ditongo com /w/' },
  { symbol: 'ahn', xSampa: 'V~', category: 'vowel', type: '/V/ Nasal', exampleWord: 'Mão', examplePhonetic: '[m ahn w]', notes: 'Ditongo nasal com /w/ e /j/' },
  { symbol: 'ax', xSampa: '6', category: 'vowel', type: 'Xuá aberta', exampleWord: 'Câmera', examplePhonetic: '[k ax m e r a]', notes: 'Vogal central quase aberta' },
  { symbol: 'an', xSampa: '6~', category: 'vowel', type: '/6/ Nasal', exampleWord: 'Amante', examplePhonetic: '[a m an ch i]', notes: 'Vogal central nasal' },
  { symbol: 'e', xSampa: 'e', category: 'vowel', type: 'Vogal anterior semifechada não arredondada', exampleWord: 'Exausto', examplePhonetic: '[e z a w s t u]', notes: 'Vogal anterior fechada oral' },
  { symbol: 'en', xSampa: 'e~', category: 'vowel', type: '/e/ Nasal', exampleWord: 'Tempo', examplePhonetic: '[t en p u]', notes: 'Vogal anterior fechada nasal' },
  { symbol: 'eh', xSampa: 'E', category: 'vowel', type: 'Vogal frontal semiaberta não arredondada', exampleWord: 'Até', examplePhonetic: '[a t eh]', notes: 'Vogal anterior aberta oral' },
  { symbol: 'ehn', xSampa: 'E~', category: 'vowel', type: '/E/ Nasal', exampleWord: 'Sento', examplePhonetic: '[s ehn t u]', notes: 'Situacional' },
  { symbol: 'ae', xSampa: '{', category: 'vowel', type: 'Vogal anterior quase aberta não arredondada', exampleWord: 'Pedra', examplePhonetic: '[p ae d r a]', notes: 'Variante aberta' },
  { symbol: 'aen', xSampa: '{~', category: 'vowel', type: '/{/ Nasal', exampleWord: 'Penha', examplePhonetic: '[p aen nh a]', notes: 'Nasalização aberta', regional: 'Regional (13 & 3)' },
  { symbol: 'i', xSampa: 'i', category: 'vowel', type: 'Vogal anterior fechada não arredondada', exampleWord: 'Figo', examplePhonetic: '[f i g u]', notes: 'Vogal alta anterior' },
  { symbol: 'in', xSampa: 'i~', category: 'vowel', type: '/i/ Nasal', exampleWord: 'Simples', examplePhonetic: '[s in p l i s]', notes: 'Vogal alta nasal' },
  { symbol: 'i0', xSampa: 'I', category: 'vowel', type: 'Vogal anterior fechada lassa não arredondada', exampleWord: 'Neném', examplePhonetic: '[n i0 n en y]', notes: 'Redução/neutralização de /e/ átono' },
  { symbol: 'o', xSampa: 'o', category: 'vowel', type: 'Vogal semifechada posterior arredondada', exampleWord: 'Hospital', examplePhonetic: '[o s p i t a w]', notes: 'Vogal média posterior fechada' },
  { symbol: 'on', xSampa: 'o~', category: 'vowel', type: '/o/ Nasal', exampleWord: 'Som', examplePhonetic: '[s on]', notes: 'Vogal média posterior nasal' },
  { symbol: 'oh', xSampa: 'O', category: 'vowel', type: 'Vogal posterior semiaberta arredondada', exampleWord: 'Pó', examplePhonetic: '[p oh]', notes: 'Vogal média posterior aberta' },
  { symbol: 'ohn', xSampa: 'O~', category: 'vowel', type: '/O/ Nasal', exampleWord: 'Põe', examplePhonetic: '[p ohn y]', notes: 'Vogal média aberta nasal' },
  { symbol: 'u', xSampa: 'u', category: 'vowel', type: 'Vogal posterior fechada arredondada', exampleWord: 'Sul', examplePhonetic: '[s u w]', notes: 'Vogal alta posterior arredondada' },
  { symbol: 'un', xSampa: 'u~', category: 'vowel', type: '/u/ Nasal', exampleWord: 'Mundo', examplePhonetic: '[m un d u]', notes: 'Vogal alta posterior nasal' },
  { symbol: 'u0', xSampa: 'U', category: 'vowel', type: 'Vogal posterior fechada lassa arredondada', exampleWord: 'Solto', examplePhonetic: '[s o w t u0]', notes: 'Redução e neutralização de /u, o, O/ átonos' },
  { symbol: 'rh', xSampa: '@`', category: 'vowel', type: 'Vogal roticizada (R-colored)', exampleWord: 'Carne', examplePhonetic: '[k a rh n i]', notes: 'Vocalização retroflexa caipira', regional: 'Regional (1 & 10)' },

  // Semivogais (2)
  { symbol: 'y', xSampa: 'j', category: 'semivowel', type: 'Aproximante palatal', exampleWord: 'Pai / Yatch', examplePhonetic: '[p a y] / [y a ch]', notes: 'Semivogal anterior' },
  { symbol: 'w', xSampa: 'w', category: 'semivowel', type: 'Aproximante labiovelar', exampleWord: 'Meu / Wav', examplePhonetic: '[m e w] / [w a v]', notes: 'Semivogal posterior labial' },

  // Consoantes (29)
  { symbol: 'b', xSampa: 'b', category: 'consonant', type: 'Oclusiva bilabial sonora', exampleWord: 'Bolo', examplePhonetic: '[b o l u]' },
  { symbol: 'bv', xSampa: 'B', category: 'consonant', type: 'Fricativa bilabial sonora', exampleWord: 'Cabo', examplePhonetic: '[k a bv u]', notes: 'Alofone de /b/ em fronteiras' },
  { symbol: 'ch', xSampa: 'tS', category: 'consonant', type: 'Africada pós-alveolar surda', exampleWord: 'Tchau', examplePhonetic: '[ch a w]' },
  { symbol: 'd', xSampa: 'd', category: 'consonant', type: 'Oclusiva alveolar sonora', exampleWord: 'Dor', examplePhonetic: '[d o h]' },
  { symbol: 'dj', xSampa: 'dZ', category: 'consonant', type: 'Africada pós-alveolar sonora', exampleWord: 'Dizer', examplePhonetic: '[dj i z e h]' },
  { symbol: 'f', xSampa: 'f', category: 'consonant', type: 'Fricativa labiodental surda', exampleWord: 'Fada', examplePhonetic: '[f a d ax]' },
  { symbol: 'g', xSampa: 'g', category: 'consonant', type: 'Oclusiva velar sonora', exampleWord: 'Gato', examplePhonetic: '[g a t u]' },
  { symbol: 'gv', xSampa: 'G', category: 'consonant', type: 'Fricativa velar sonora', exampleWord: 'Agora', examplePhonetic: '[a gv o r a]', notes: 'Alofone de /g/' },
  { symbol: 'h', xSampa: 'h', category: 'consonant', type: 'Fricativa glotal surda', exampleWord: 'Carro', examplePhonetic: '[k a h u]' },
  { symbol: 'hr', xSampa: 'R', category: 'consonant', type: 'Fricativa uvular sonora', exampleWord: 'Ranço', examplePhonetic: '[hr a n s u]', regional: 'Regional (4 & 11)' },
  { symbol: 'j', xSampa: 'Z', category: 'consonant', type: 'Fricativa palatoalveolar sonora', exampleWord: 'Já', examplePhonetic: '[j a]' },
  { symbol: 'k', xSampa: 'k', category: 'consonant', type: 'Oclusiva velar surda', exampleWord: 'Cor', examplePhonetic: '[k o h]' },
  { symbol: 'l', xSampa: 'l', category: 'consonant', type: 'Lateral aproximante alveolar', exampleWord: 'Lágrima', examplePhonetic: '[l a g r i m a]' },
  { symbol: 'lh', xSampa: 'L', category: 'consonant', type: 'Lateral palatal', exampleWord: 'Palhaço', examplePhonetic: '[p a lh a s u0]' },
  { symbol: 'l0', xSampa: '5', category: 'consonant', type: 'Aproximante lateral velarizado', exampleWord: 'Livro', examplePhonetic: '[l0 i v r u]' },
  { symbol: 'm', xSampa: 'm', category: 'consonant', type: 'Nasal bilabial', exampleWord: 'Mês', examplePhonetic: '[m e s]' },
  { symbol: 'n', xSampa: 'n', category: 'consonant', type: 'Nasal alveolar', exampleWord: 'Navio', examplePhonetic: '[n a v i w]' },
  { symbol: 'ng', xSampa: 'N', category: 'consonant', type: 'Nasal velar', exampleWord: 'Manga', examplePhonetic: '[m an ng a]', notes: 'Alofone de /n/ antes de /g/ e /k/' },
  { symbol: 'nh', xSampa: 'J', category: 'consonant', type: 'Nasal palatal', exampleWord: 'Sonho', examplePhonetic: '[s o nh u]' },
  { symbol: 'p', xSampa: 'p', category: 'consonant', type: 'Oclusiva bilabial surda', exampleWord: 'Pipoca', examplePhonetic: '[p i p o k a]' },
  { symbol: 'r', xSampa: '4', category: 'consonant', type: 'Vibrante alveolar simples (Tepe)', exampleWord: 'Pará', examplePhonetic: '[p a r a]' },
  { symbol: 'rr', xSampa: 'r', category: 'consonant', type: 'Vibrante alveolar múltipla', exampleWord: 'Rato', examplePhonetic: '[rr a t u]' },
  { symbol: 'rw', xSampa: 'r\\', category: 'consonant', type: 'Aproximante retroflexa', exampleWord: 'Amor', examplePhonetic: '[a m o rw]', regional: 'Centro-Sul' },
  { symbol: 's', xSampa: 's', category: 'consonant', type: 'Fricativa alveolar surda', exampleWord: 'Sorte', examplePhonetic: '[s oh x ch i]' },
  { symbol: 'sh', xSampa: 'S', category: 'consonant', type: 'Fricativa palatoalveolar surda', exampleWord: 'Chão', examplePhonetic: '[sh an w]' },
  { symbol: 't', xSampa: 't', category: 'consonant', type: 'Oclusiva alveolar surda', exampleWord: 'Torta', examplePhonetic: '[t oh rh t a]' },
  { symbol: 'v', xSampa: 'v', category: 'consonant', type: 'Fricativa labiodental sonora', exampleWord: 'Vaso', examplePhonetic: '[v a z u0]' },
  { symbol: 'x', xSampa: 'x', category: 'consonant', type: 'Fricativa velar surda (Chiado)', exampleWord: 'Partir', examplePhonetic: '[p a x ch i x]', regional: 'Regional (4 - RJ)' },
  { symbol: 'z', xSampa: 'z', category: 'consonant', type: 'Fricativa alveolar sonora', exampleWord: 'Zebra', examplePhonetic: '[z e b r ax]' },
];

export default function BrapaFullPage() {
  const { t, dir } = useLanguage();
  const { playClick, playCopy } = useSound();

  const [activeTab, setActiveTab] = useState<'all' | 'vowels' | 'semivowels' | 'consonants' | 'rules'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSymbol, setCopiedSymbol] = useState<string | null>(null);

  const handleCopy = (symbol: string) => {
    if (playCopy) playCopy();
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(symbol).catch(() => {
        try {
          const textArea = document.createElement('textarea');
          textArea.value = symbol;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        } catch {}
      });
    } else {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = symbol;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch {}
    }
    setCopiedSymbol(symbol);
    setTimeout(() => setCopiedSymbol(null), 2000);
  };

  const filteredPhonemes = useMemo(() => {
    return BRAPA_PHONEMES.filter((item) => {
      // Tab category filter
      if (activeTab === 'vowels' && item.category !== 'vowel') return false;
      if (activeTab === 'semivowels' && item.category !== 'semivowel') return false;
      if (activeTab === 'consonants' && item.category !== 'consonant') return false;

      // Text search
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        item.symbol.toLowerCase().includes(q) ||
        item.xSampa.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q) ||
        item.exampleWord.toLowerCase().includes(q) ||
        item.examplePhonetic.toLowerCase().includes(q) ||
        (item.notes && item.notes.toLowerCase().includes(q)) ||
        (item.regional && item.regional.toLowerCase().includes(q))
      );
    });
  }, [activeTab, searchQuery]);

  const counts = useMemo(() => {
    return {
      all: BRAPA_PHONEMES.length,
      vowels: BRAPA_PHONEMES.filter((p) => p.category === 'vowel').length,
      semivowels: BRAPA_PHONEMES.filter((p) => p.category === 'semivowel').length,
      consonants: BRAPA_PHONEMES.filter((p) => p.category === 'consonant').length,
    };
  }, []);

  return (
    <main className="brapa-page">
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
            <a href={`${basePath}/brapa/`} style={{ textDecoration: 'underline', textUnderlineOffset: '5px' }}>{t.nav.phonetics}</a>
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

      <article className="shell brapa-hero-section">
        <a href={`${basePath}/`} className="manifesto-back-btn">
          ← {t.nav.home}
        </a>

        <div className="brapa-page-header">
          <div className="brapa-badge-row">
            <span className="brapa-tag">PADRÃO FONÉTICO OFICIAL</span>
            <span className="brapa-version-tag">Team-BRAPA</span>
          </div>

          <h1 className="brapa-main-title">
            BRAPA: <em>Cartela Fonética Completa</em>
          </h1>

          <p className="brapa-main-intro">
            O <strong>BRAPA (Brazilian Phonetic Alphabet)</strong> é o alfabeto fonético aberto criado especialmente para sintetizadores de voz e canto (UTAU, DiffSinger, NNSVS, OpenUtau) com foco total nos fonemas naturais e sotaques regionais do Português Brasileiro.
          </p>

          <div className="brapa-header-actions">
            <a 
              href="https://github.com/Team-BRAPA/BRAPA" 
              target="_blank" 
              rel="noreferrer" 
              className="button button-dark"
            >
              <ExternalLinkIcon size={14} />
              <span>Repositório Oficial no GitHub</span>
            </a>
            <a 
              href="https://raw.githubusercontent.com/Team-BRAPA/BRAPA/main/SPREADSHEETS/BRAPA.xlsx" 
              target="_blank" 
              rel="noreferrer" 
              className="button button-ghost"
              download
            >
              <DownloadIcon size={14} />
              <span>Baixar Planilha (XLSX)</span>
            </a>
            <a 
              href="https://raw.githubusercontent.com/Team-BRAPA/BRAPA/main/SPREADSHEETS/BRAPA.ods" 
              target="_blank" 
              rel="noreferrer" 
              className="button button-ghost"
              download
            >
              <DownloadIcon size={14} />
              <span>Baixar Planilha (ODS)</span>
            </a>
          </div>
        </div>

        {/* Navigation Tabs & Live Search Bar */}
        <div className="brapa-controls-container">
          <div className="brapa-tab-buttons" role="tablist">
            <button
              type="button"
              className={`brapa-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => { playClick(); setActiveTab('all'); }}
            >
              <span>Todos os Fonemas</span>
              <span className="brapa-count-badge">{counts.all}</span>
            </button>
            <button
              type="button"
              className={`brapa-tab-btn ${activeTab === 'vowels' ? 'active' : ''}`}
              onClick={() => { playClick(); setActiveTab('vowels'); }}
            >
              <VowelIcon size={14} />
              <span>Vogais</span>
              <span className="brapa-count-badge">{counts.vowels}</span>
            </button>
            <button
              type="button"
              className={`brapa-tab-btn ${activeTab === 'semivowels' ? 'active' : ''}`}
              onClick={() => { playClick(); setActiveTab('semivowels'); }}
            >
              <FlashIcon size={14} />
              <span>Semivogais</span>
              <span className="brapa-count-badge">{counts.semivowels}</span>
            </button>
            <button
              type="button"
              className={`brapa-tab-btn ${activeTab === 'consonants' ? 'active' : ''}`}
              onClick={() => { playClick(); setActiveTab('consonants'); }}
            >
              <ConsonantsIcon size={14} />
              <span>Consoantes</span>
              <span className="brapa-count-badge">{counts.consonants}</span>
            </button>
            <button
              type="button"
              className={`brapa-tab-btn ${activeTab === 'rules' ? 'active' : ''}`}
              onClick={() => { playClick(); setActiveTab('rules'); }}
            >
              <LightbulbIcon size={14} />
              <span>Regras & Dicas</span>
            </button>
          </div>

          {activeTab !== 'rules' && (
            <div className="brapa-search-box">
              <input
                type="text"
                placeholder="Buscar por símbolo, som X-SAMPA, palavra ou descrição..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Buscar fonema no BRAPA"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="brapa-search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Limpar busca"
                >
                  <CloseIcon size={14} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Content Area */}
        {activeTab === 'rules' ? (
          <div className="brapa-rules-view">
            <div className="brapa-rule-card">
              <span className="rule-badge">Sintaxe Fundamental</span>
              <h3>Estrutura de Transições e Conexões</h3>
              <div className="brapa-rules-grid">
                <div className="brapa-rule-item">
                  <code>- V</code>
                  <div>
                    <strong>Ataque de Início de Frase</strong>
                    <p>Exemplo: <code>- a, - e, - in</code>. Transição suave do silêncio para a vogal.</p>
                  </div>
                </div>
                <div className="brapa-rule-item">
                  <code>C V</code>
                  <div>
                    <strong>Consoante + Vogal (Sílaba Principal)</strong>
                    <p>Exemplo: <code>k a, tS i, b o</code>. A sílaba cantada sustentada.</p>
                  </div>
                </div>
                <div className="brapa-rule-item">
                  <code>V C</code>
                  <div>
                    <strong>Transição Vogal + Consoante</strong>
                    <p>Exemplo: <code>a k, e m, o s</code>. Ligação natural entre notas no UTAU/DiffSinger.</p>
                  </div>
                </div>
                <div className="brapa-rule-item">
                  <code>V -</code>
                  <div>
                    <strong>Finalização de Frase / Fade</strong>
                    <p>Exemplo: <code>a -, e -, on -</code>. Liberação natural com respiração/fade no final.</p>
                  </div>
                </div>
                <div className="brapa-rule-item">
                  <code>C -</code>
                  <div>
                    <strong>Finalização em Consoante / Plosiva</strong>
                    <p>Exemplo: <code>s -, x -, k -</code>. Fechamento de consoante em final de palavra.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="brapa-rule-card" style={{ marginTop: '32px' }}>
              <span className="rule-badge">Padrão Fonético</span>
              <h3>Convenções e Sotaques Regionais</h3>
              <p style={{ color: 'var(--text-muted, #5c5e55)', lineHeight: 1.7, marginTop: '8px' }}>
                O BRAPA foi projetado sobre a base do Arpabet para garantir compatibilidade com sintetizadores e modelos de IA que não aceitam caracteres Unicode ou diacríticos complexos no nome dos arquivos e no oto.ini.
              </p>
              <div className="brapa-dialects-note">
                <strong>Sotaques e Alofones:</strong>
                <ul>
                  <li><code>x</code>: Fricativa velar surda (Chiado carioca / fluminense em final de sílaba, como em <em>partir</em> <code>[p a x ch i x]</code>).</li>
                  <li><code>rh</code> ou <code>rw</code>: R retroflexo caipira / Centro-Sul (como em <em>carne</em> <code>[k a rh n i]</code>).</li>
                  <li><code>bv</code> e <code>gv</code>: Fricativas alofones encontradas nas regiões de fronteira.</li>
                  <li><code>i0</code> e <code>u0</code>: Neutralizações átonas de final de palavra (ex: <em>neném</em> <code>[n i0 n en y]</code>, <em>solto</em> <code>[s o w t u0]</code>).</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="brapa-table-wrapper">
            <table className="brapa-table">
              <thead>
                <tr>
                  <th>BRAPA</th>
                  <th>X-SAMPA</th>
                  <th>Classificação / Descrição</th>
                  <th>Exemplo de Palavra</th>
                  <th>Transcrição Fonética</th>
                  <th>Observações / Regionalismo</th>
                  <th style={{ textAlign: 'center' }}>Copiar</th>
                </tr>
              </thead>
              <tbody>
                {filteredPhonemes.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                      Nenhum fonema encontrado para a busca &quot;{searchQuery}&quot;.
                    </td>
                  </tr>
                ) : (
                  filteredPhonemes.map((p) => {
                    const isCopied = copiedSymbol === p.symbol;
                    return (
                      <tr key={p.symbol}>
                        <td>
                          <button
                            type="button"
                            className="brapa-symbol-pill"
                            onClick={() => handleCopy(p.symbol)}
                            title={`Clique para copiar ${p.symbol}`}
                          >
                            <strong>{p.symbol}</strong>
                          </button>
                        </td>
                        <td>
                          <code className="x-sampa-code">/{p.xSampa}/</code>
                        </td>
                        <td>
                          <span className="brapa-type-text">{p.type}</span>
                        </td>
                        <td>
                          <strong>{p.exampleWord}</strong>
                        </td>
                        <td>
                          <code className="brapa-phonetic-code">{p.examplePhonetic}</code>
                        </td>
                        <td>
                          {p.regional ? (
                            <span className="brapa-regional-pill">{p.regional}</span>
                          ) : (
                            <span className="brapa-notes-text">{p.notes || '—'}</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            type="button"
                            className={`brapa-copy-action-btn ${isCopied ? 'copied' : ''}`}
                            onClick={() => handleCopy(p.symbol)}
                            aria-label={`Copiar ${p.symbol}`}
                            title={`Copiar símbolo ${p.symbol}`}
                          >
                            {isCopied ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
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
              <a href={`${basePath}/o-ritmo-da-terra/`}>{t.nav.manifesto}</a>
              <a href={`${basePath}/brapa/`}>{t.nav.phonetics}</a>
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
