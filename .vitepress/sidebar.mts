// Sidebar computed from the synced docs/ folder: hand-authored categories,
// listed-but-missing ids are skipped, unlisted docs go to "其他 More".
import fs from 'node:fs'
import path from 'node:path'
import type { DefaultTheme } from 'vitepress'

const CATEGORIES: { label: string; collapsed: boolean; items: string[] }[] = [
  { label: '入門 Getting Started', collapsed: false, items: ['getting-started', 'tutorial-build-a-game'] },
  {
    label: '製作遊戲 Authoring a Pack',
    collapsed: true,
    items: [
      'pack-format', 'scenes', 'characters', 'locations', 'destination-schedule-map', 'items',
      'quests', 'resources', 'shops', 'achievements', 'affection', 'theme-and-locale',
      'presentation-and-extras', 'cookbook',
    ],
  },
  {
    label: '引擎概念 Engine Concepts',
    collapsed: true,
    items: ['architecture', 'galgame-maturity', 'commercial-quality-benchmark', 'stable-line-identity'],
  },
  { label: '參考 Reference', collapsed: true, items: ['effects-reference', 'conditions-reference'] },
  {
    label: 'AI 原生開發 AI-Native Development',
    collapsed: true,
    items: ['ai-developer-guide', 'ai-native-contract', 'ai-native-world-model', 'headless', 'session-protocol', 'ai-debug'],
  },
  { label: '外掛 Plugins', collapsed: true, items: ['plugins'] },
  {
    label: '發佈 Distribution',
    collapsed: true,
    items: ['distribution', 'distribution-web', 'distribution-steam', 'distribution-mobile', 'art-transparency'],
  },
]

/** First `# ` heading of a doc, with inline markdown stripped. */
function titleOf(dir: string, id: string): string {
  try {
    const text = fs.readFileSync(path.join(dir, `${id}.md`), 'utf8').replace(/^---[\s\S]*?\n---\n/, '')
    let inFence = false
    for (const line of text.split('\n')) {
      if (/^\s*(```|~~~)/.test(line)) inFence = !inFence
      const m = !inFence && /^#\s+(.+?)\s*#*\s*$/.exec(line)
      if (m) {
        return m[1]
          .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
          .replace(/[`*_]/g, '')
          .trim()
      }
    }
  } catch {}
  return id
}

export function buildSidebar(root: string): DefaultTheme.SidebarItem[] {
  const dir = path.join(root, 'docs')
  const present = new Set(
    fs.existsSync(dir)
      ? fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''))
      : [],
  )
  const link = (id: string): DefaultTheme.SidebarItem => ({ text: titleOf(dir, id), link: `/docs/${id}` })

  const used = new Set(['index'])
  const out: DefaultTheme.SidebarItem[] = []
  if (present.has('index')) out.push({ text: '總覽 Overview', link: '/docs/' })

  for (const c of CATEGORIES) {
    const items = c.items.filter((id) => present.has(id))
    items.forEach((id) => used.add(id))
    if (items.length) out.push({ text: c.label, collapsed: c.collapsed, items: items.map(link) })
  }
  const leftovers = [...present].filter((id) => !used.has(id)).sort()
  if (leftovers.length) out.push({ text: '其他 More', collapsed: true, items: leftovers.map(link) })
  return out
}
