// @ts-check
// Hand-authored categories, computed at load time against the synced docs/
// folder: listed-but-missing ids are skipped, and any synced doc that no
// category lists is appended to an automatic "其他 More" category.
const fs = require('node:fs');
const path = require('node:path');

const docsDir = path.join(__dirname, 'docs');
const present = new Set(
  fs.existsSync(docsDir)
    ? fs.readdirSync(docsDir).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''))
    : [],
);

const categories = [
  {label: '入門 Getting Started', collapsed: false, items: ['getting-started', 'tutorial-build-a-game']},
  {
    label: '製作遊戲 Authoring a Pack',
    items: [
      'pack-format', 'scenes', 'characters', 'locations', 'destination-schedule-map', 'items',
      'quests', 'resources', 'shops', 'achievements', 'affection', 'theme-and-locale',
      'presentation-and-extras', 'cookbook',
    ],
  },
  {
    label: '引擎概念 Engine Concepts',
    items: ['architecture', 'galgame-maturity', 'commercial-quality-benchmark', 'stable-line-identity'],
  },
  {label: '參考 Reference', items: ['effects-reference', 'conditions-reference']},
  {
    label: 'AI 原生開發 AI-Native Development',
    items: ['ai-developer-guide', 'ai-native-contract', 'ai-native-world-model', 'headless', 'session-protocol', 'ai-debug'],
  },
  {label: '外掛 Plugins', items: ['plugins']},
  {
    label: '發佈 Distribution',
    items: ['distribution', 'distribution-web', 'distribution-steam', 'distribution-mobile', 'art-transparency'],
  },
];

const used = new Set(['README']);
const built = [];
for (const c of categories) {
  const items = c.items.filter((id) => present.has(id));
  items.forEach((id) => used.add(id));
  if (items.length) built.push({type: 'category', label: c.label, collapsed: c.collapsed ?? true, items});
}
const leftovers = [...present].filter((id) => !used.has(id)).sort();
if (leftovers.length) built.push({type: 'category', label: '其他 More', collapsed: true, items: leftovers});

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
module.exports = {
  docsSidebar: [...(present.has('README') ? ['README'] : []), ...built],
};
