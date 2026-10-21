import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'
import { markdownSafety } from './markdown-safety.mts'
import { buildSidebar } from './sidebar.mts'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SITE = (process.env.SITE_URL || 'https://world-gal-game.xn--essy41b.com').replace(/\/$/, '')
const BASE = process.env.BASE_URL || '/'
const REPO = 'https://github.com/treeleaves30760/world-gal-game'
const TITLE = 'World Gal-Game'
const DESC = '讓 AI 一起參與製作的 Gal-Game 引擎。人類用 YAML 寫遊戲，AI 以無視窗方式遊玩、檢視、編輯與驗證，外掛擴充引擎。'

export default defineConfig({
  lang: 'zh-Hant',
  title: TITLE,
  description: DESC,
  base: BASE,
  cleanUrls: true,
  lastUpdated: false,
  // README.md is the repo readme, engine/ is the CI checkout of the engine repo
  srcExclude: ['README.md', 'engine/**'],

  sitemap: { hostname: SITE },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${BASE}favicon.svg` }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif+TC:wght@400;600;700&display=swap',
      },
    ],
    ['meta', { name: 'theme-color', content: '#0e1120' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: TITLE }],
    ['meta', { property: 'og:title', content: `${TITLE} - 讓 AI 一起參與製作的 Gal-Game 引擎` }],
    ['meta', { property: 'og:description', content: DESC }],
    ['meta', { property: 'og:image', content: `${SITE}/img/social-card.png` }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: `${SITE}/img/social-card.png` }],
  ],

  vite: { build: { chunkSizeWarningLimit: 1500 } },

  markdown: {
    config: (md) => md.use(markdownSafety),
  },

  themeConfig: {
    logo: '/img/logo.svg',
    siteTitle: 'World Gal-Game',
    nav: [
      { text: '文件', link: '/docs/', activeMatch: '^/docs/(?!ai-developer-guide|plugins|roadmap)' },
      { text: 'AI 開發', link: '/docs/ai-developer-guide' },
      { text: '外掛', link: '/docs/plugins' },
      { text: '路線圖', link: '/docs/roadmap' },
    ],
    sidebar: { '/docs/': buildSidebar(root) },
    socialLinks: [{ icon: 'github', link: REPO }],
    search: {
      provider: 'local',
      options: {
        // The default MiniSearch tokenizer splits on whitespace, so a Chinese
        // phrase becomes one giant term. Index CJK runs as single characters
        // plus bigrams; queries use bigrams combined with AND. Both functions
        // are serialised into the client bundle: keep them self-contained.
        miniSearch: {
          options: {
            tokenize: function (text) {
              const out = []
              const parts = String(text).toLowerCase().match(/[㐀-鿿豈-﫿぀-ヿ]+|[\p{L}\p{N}_]+/gu) || []
              for (const part of parts) {
                if (/^[㐀-鿿豈-﫿぀-ヿ]/.test(part)) {
                  for (let i = 0; i < part.length; i++) {
                    out.push(part[i])
                    if (i + 1 < part.length) out.push(part.slice(i, i + 2))
                  }
                } else {
                  out.push(part)
                }
              }
              return out
            },
          },
          searchOptions: {
            combineWith: 'AND',
            tokenize: function (text) {
              const out = []
              const parts = String(text).toLowerCase().match(/[㐀-鿿豈-﫿぀-ヿ]+|[\p{L}\p{N}_]+/gu) || []
              for (const part of parts) {
                if (/^[㐀-鿿豈-﫿぀-ヿ]/.test(part)) {
                  if (part.length === 1) out.push(part)
                  for (let i = 0; i + 1 < part.length; i++) out.push(part.slice(i, i + 2))
                } else {
                  out.push(part)
                }
              }
              return out
            },
            // Fuzzy matching on two-character CJK terms only adds noise.
            fuzzy: function (term) {
              return /[㐀-鿿豈-﫿぀-ヿ]/.test(term) ? false : 0.2
            },
            prefix: function (term) {
              return !/[㐀-鿿豈-﫿぀-ヿ]/.test(term)
            },
          },
        },
        locales: {
          root: {
            translations: {
              button: { buttonText: '搜尋文件', buttonAriaLabel: '搜尋文件' },
              modal: {
                displayDetails: '顯示詳細',
                resetButtonTitle: '清除',
                backButtonTitle: '關閉',
                noResultsText: '找不到相關結果',
                footer: { selectText: '選擇', navigateText: '切換', closeText: '關閉' },
              },
            },
          },
        },
      },
    },
    outline: { level: [2, 3], label: '本頁內容' },
    editLink: {
      // serialised into the client bundle: must be self-contained (no outer refs)
      pattern: ({ filePath }) => {
        const repo = 'https://github.com/treeleaves30760/world-gal-game/edit/main/'
        const name = filePath.replace(/^docs\//, '')
        if (name === 'index.md') return repo + 'docs/README.md'
        if (name === 'roadmap.md') return repo + 'ROADMAP.md'
        return repo + 'docs/' + name
      },
      text: '在 GitHub 上編輯此頁',
    },
    docFooter: { prev: '上一頁', next: '下一頁' },
    darkModeSwitchLabel: '外觀',
    sidebarMenuLabel: '選單',
    returnToTopLabel: '回到頂端',
    footer: {
      message: 'Released under the MIT License.',
      copyright: `Copyright © ${new Date().getFullYear()} Hsu Po-Hsiang`,
    },
  },
})
