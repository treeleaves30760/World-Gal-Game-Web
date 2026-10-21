// @ts-check
// World Gal-Game website: landing page (src/pages) + docs synced from the
// engine repo (scripts/sync-docs.mjs -> docs/). Sidebar: sidebars.js.

const {themes: prismThemes} = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'World Gal-Game',
  tagline: '讓 AI 一起參與製作的 Gal-Game 引擎',
  favicon: 'img/favicon.svg',

  url: process.env.SITE_URL || 'https://treeleaves30760.github.io',
  baseUrl: process.env.BASE_URL || '/World-Gal-Game-Web/',
  trailingSlash: false,

  organizationName: 'treeleaves30760',
  projectName: 'World-Gal-Game-Web',

  // docs/ is synced from the engine repo (scripts/sync-docs.mjs), which also
  // rewrites links that point outside docs to absolute GitHub URLs.
  onBrokenLinks: 'warn',

  i18n: {defaultLocale: 'zh-Hant', locales: ['zh-Hant']},

  headTags: [
    {tagName: 'link', attributes: {rel: 'preconnect', href: 'https://fonts.googleapis.com'}},
    {tagName: 'link', attributes: {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous'}},
  ],
  stylesheets: [
    'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif+TC:wght@400;600;700&display=swap',
  ],

  // Docs are plain CommonMark (literal `{}` / `<>`), not MDX.
  markdown: {
    format: 'detect',
    hooks: {onBrokenMarkdownLinks: 'warn'},
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: 'docs',
          routeBasePath: '/docs',
          sidebarPath: require.resolve('./sidebars.js'),
          // docs/ is a synced copy: send "edit this page" to the engine repo.
          editUrl: ({docPath}) =>
            docPath === 'roadmap.md'
              ? 'https://github.com/treeleaves30760/world-gal-game/edit/main/ROADMAP.md'
              : `https://github.com/treeleaves30760/world-gal-game/edit/main/docs/${docPath}`,
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/social-card.svg',
      colorMode: {defaultMode: 'dark', respectPrefersColorScheme: true},
      navbar: {
        title: 'World Gal-Game',
        logo: {alt: 'World Gal-Game', src: 'img/logo.svg', width: 28, height: 28},
        items: [
          {type: 'docSidebar', sidebarId: 'docsSidebar', position: 'left', label: '文件'},
          {to: '/docs/ai-developer-guide', label: 'AI 開發', position: 'left'},
          {to: '/docs/plugins', label: '外掛', position: 'left'},
          {href: 'https://github.com/treeleaves30760/world-gal-game', label: 'GitHub', position: 'right'},
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '文件',
            items: [
              {label: '開始使用', to: '/docs/getting-started'},
              {label: 'AI 開發指南', to: '/docs/ai-developer-guide'},
              {label: '外掛', to: '/docs/plugins'},
            ],
          },
          {
            title: '專案',
            items: [
              {label: 'GitHub', href: 'https://github.com/treeleaves30760/world-gal-game'},
              {label: 'Issues', href: 'https://github.com/treeleaves30760/world-gal-game/issues'},
              {label: 'MIT License', href: 'https://github.com/treeleaves30760/world-gal-game/blob/main/LICENSE'},
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Hsu Po-Hsiang. MIT License.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['python', 'bash', 'yaml', 'json'],
      },
    }),
};

module.exports = config;
