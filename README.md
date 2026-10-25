<div align="center">

<img src="public/studio-pomar-icon-4096.png" alt="Studio POMAR Logo" width="120" height="120" />

# Studio POMAR
### *Vozes que criam raízes · Síntese Vocal Livre & Comunitária*

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Site-d7ff3f?style=flat-square&logo=github&logoColor=171815)](https://studiopomar.github.io/)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

<br />

[Leia em português](#sobre-o-studio-pomar)

<br />

</div>

---

## Sobre o Studio POMAR

O **Studio POMAR** é um coletivo brasileiro dedicado à criação, preservação e difusão de bancos de voz (*voicebanks*) e ferramentas livres para **UTAU**, **OpenUTAU**, **DiffSinger** e tecnologias de síntese vocal.

Nascido da convicção de que a tecnologia de voz não deve ser um recurso distante, fechado ou descartável, cultivamos projetos com suporte de longo prazo (**LTS**), prezando pela autonomia dos artistas, documentação transparente e respeito ao processo artesanal de afinação.

---

## Vozes Integrantes

| Voz | Geração / Origem | Motores Suportados | Idiomas |
| :--- | :--- | :--- | :--- |
| **VIICTOR** *(FIIKTUR)* | 4ª Geração · desde 2013 | UTAU, OpenUTAU, DiffSinger, NiaoNiao, DeepVocal, NNSVS, Kamafeu, Cadencii | Português, Japonês, Inglês, Árabe (+30 idiomas) |
| **YOHJI** | 2ª Geração · desde 2010 | UTAU, OpenUTAU, DiffSinger | Português, Japonês, Espanhol |
| **EDDIE** | 4ª Geração · desde 2012 | UTAU, OpenUTAU, SVV | Português Brasileiro (Pioneiro), Japonês |
| **MIZUKI** *(観月)* | 7ª Geração · desde 2015 | UTAU, OpenUTAU, DiffSinger | Português, Japonês, Inglês |
| **LLANE CROW** | Internacional · Rússia | UTAU, OpenUTAU, DiffSinger, Neural Synth | Russo, Inglês, Japonês |
| **KODAMA KITO** | 18ª Geração · desde 2026 | UTAU, OpenUTAU | Português, Japonês, Inglês |
| **APOLLYO XII** | 17ª Geração · desde 2025 | UTAU, OpenUTAU | Japonês (CV e CVVC Bipitch) |

Veja as [páginas completas das vozes](https://studiopomar.github.io/#vozes) ou acesse diretamente [VIICTOR](https://studiopomar.github.io/vozes/viictor/), [YOHJI](https://studiopomar.github.io/vozes/yohji/), [EDDIE](https://studiopomar.github.io/vozes/eddie/), [MIZUKI](https://studiopomar.github.io/vozes/mizuki/), [LLANE CROW](https://studiopomar.github.io/vozes/llane-crow/), [KODAMA KITO](https://studiopomar.github.io/vozes/kodama-kito/) e [APOLLYO XII](https://studiopomar.github.io/vozes/apollyo/).

---

## Ferramentas em Destaque

- **[KAMAFEU](https://github.com/studiopomar/kamafeu)**: Sintetizador concatenativo multifaixa e piano roll em Rust, com processamento DSP nativo de alta fidelidade e controle de afinação artesanal.
- **[COPAÍBA NEO](https://github.com/studiopomar/Copaiba-NEO)**: Nova geração de editores de `oto.ini` multiplataforma em Rust com gravação de áudio embutida, seleção múltipla e plugins inteligentes de consistência.
- **[COPAÍBA LEXIKON LTS](https://github.com/studiopomar/Copaiba-Lexicon-LTS)**: Editor de `oto.ini` estável em Python com análise detalhada de forma de onda, mini-mapa, presets customizáveis e processamento em lote.

Consulte as [páginas das ferramentas e downloads](https://studiopomar.github.io/#ferramentas): [KAMAFEU](https://studiopomar.github.io/ferramentas/kamafeu/), [COPAÍBA NEO](https://studiopomar.github.io/ferramentas/copaiba-neo/) e [COPAIBA LEXIKON LTS](https://studiopomar.github.io/ferramentas/copaiba-lexicon/).

O site também oferece o guia [BRAPA de fonética para português brasileiro](https://studiopomar.github.io/brapa/) e o manifesto [O Ritmo da Terra](https://studiopomar.github.io/o-ritmo-da-terra/).

---

## Internacionalização (i18n)

O site conta com suporte completo a 5 idiomas, com chaveamento instantâneo, persistência em `localStorage` e suporte nativo à direção de leitura **RTL (Right-to-Left)**:
- **Português (BR)**
- **English (US)**
- **العربية (AR)** *(com alinhamento RTL nativo)*
- **Русский (RU)**
- **日本語 (JA)**

---

## Desenvolvimento Local

Para rodar o projeto localmente em seu ambiente de desenvolvimento:

```bash
# 1. Clonar o repositório
git clone https://github.com/studiopomar/studiopomar.github.io.git
cd studiopomar.github.io

# 2. Instalar as dependências (pnpm recomendado)
pnpm install
# ou: npm install

# 3. Iniciar o servidor de desenvolvimento
pnpm dev
# ou: npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para visualizar.

### Build de Produção e Exportação Estática
```bash
pnpm build
```
O build estático pronto para publicação será gerado na pasta `out/`.

---

## Estrutura do Projeto

```text
studiopomar.github.io/
├── app/
│   ├── brapa/                   # Guia BRAPA e metadados próprios da página
│   ├── ferramentas/[slug]/      # Páginas estáticas de ferramentas
│   ├── i18n/
│   │   └── translations.ts      # Dicionário de conteúdo multilíngue (PT, EN, AR, RU, JA)
│   ├── o-ritmo-da-terra/        # Página dedicada do Manifesto
│   ├── vozes/[slug]/            # Páginas estáticas de voicebanks
│   ├── BackToTop.tsx            # Botão flutuante de retorno ao topo
│   ├── LanguageContext.tsx      # Context Provider de idiomas e direção (LTR/RTL)
│   ├── LanguageSelector.tsx     # Dropdown estilizado no topo com microinterações
│   ├── OrchardBackground.tsx    # Animação ambiente procedural "Brisa do Pomar"
│   ├── SmoothScroll.tsx         # Rolagem suave integrada (Lenis)
│   ├── SoundEffects.tsx         # Síntese Web Audio API de efeitos sonoros e ambientais
│   ├── VoiceProfiles.tsx        # Fichas detalhadas, modais técnicos e reprodutor de áudio
│   ├── VoiceStack.tsx           # Carrossel infinito 3D no Hero
│   ├── globals.css              # Sistema visual e regras de responsividade/RTL
│   ├── layout.tsx               # Root layout com metadata, OpenGraph e JSON-LD
│   └── page.tsx                 # Página principal
├── public/                      # Imagens, samples de áudio e ícones
│   ├── robots.txt               # Regras de rastreamento e endereço do sitemap
│   └── sitemap.xml              # URLs canônicas das páginas públicas
└── .github/workflows/pages.yml  # Pipeline de CI/CD para deploy no GitHub Pages
```

As páginas de vozes, ferramentas, BRAPA e manifesto são exportadas como HTML estático com títulos e descrições próprios. O sitemap lista a home, essas páginas e os URLs canônicos para rastreamento.

---

## Manifesto: O Ritmo da Terra

1. **Raízes & Brasilidade**: Ferramentas e bancos desenhados para as nuances da nossa língua, conectados abertamente à cena global.
2. **Código Livre & Autonomia**: O software pertence à comunidade que o utiliza.
3. **Estabilidade de Longo Prazo (LTS)**: Confiabilidade para que sua música nunca seja interrompida por quebras de compatibilidade.
4. **Artesanato Vocal**: O valor do toque humano e da calibração minuciosa de cada fonema.
5. **Cultivo Comunitário**: O pomar floresce quando cultivado coletivamente.

---

## Comunidade & Contato

- **GitHub**: [studiopomar](https://github.com/studiopomar)
- **Discord**: [Comunidade Studio POMAR](https://discord.gg/UrygVFXTtQ)
- **E-mail**: [studiopomar@proton.me](mailto:studiopomar@proton.me)

---

## Licença e Créditos

- **Código-fonte**: Distribuído sob a licença [MIT](LICENSE).
- **Artes e Personagens**: As ilustrações e direitos de imagem dos personagens pertencem aos seus respectivos criadores e ilustradores (consulte os links oficiais nas fichas individuais no site).
