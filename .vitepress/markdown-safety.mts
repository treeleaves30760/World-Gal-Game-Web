// Engine docs are plain CommonMark. VitePress compiles Markdown to a Vue
// template, so two kinds of literal text would break the build:
//   1. Bare placeholder tags outside code, e.g. <pack> or <id>  (unknown/unclosed elements)
//   2. Mustache-like text, e.g. {{ x }}                         (Vue interpolation)
// This plugin neutralises both for every page except the hand-written landing
// page (index.md), which legitimately mounts Vue components.
import type MarkdownIt from 'markdown-it'

const HTML_TAGS = new Set(
  (
    'a abbr address area article aside audio b base bdi bdo blockquote body br button canvas caption cite code col ' +
    'colgroup data datalist dd del details dfn dialog div dl dt em embed fieldset figcaption figure footer form h1 h2 ' +
    'h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd label legend li link main map mark menu meta ' +
    'meter nav noscript object ol optgroup option output p picture pre progress q rp rt ruby s samp script search ' +
    'section select slot small source span strong style sub summary sup svg table tbody td template textarea tfoot th ' +
    'thead time title tr track u ul var video wbr center font big tt strike'
  ).split(' '),
)

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function tagName(content: string): string | null {
  const m = /^<\/?([A-Za-z][\w:-]*)/.exec(content)
  return m ? m[1] : null
}

/** true when the raw html token is NOT a real HTML element/comment */
function isFakeTag(content: string): boolean {
  if (/^<!--/.test(content) || /^<[!?]/.test(content)) return false
  const name = tagName(content)
  return name !== null && !HTML_TAGS.has(name.toLowerCase())
}

export function markdownSafety(md: MarkdownIt): void {
  const inline = md.renderer.rules.html_inline
  md.renderer.rules.html_inline = (tokens, idx, options, env, self) => {
    const t = tokens[idx]
    if (env?.relativePath !== 'index.md' && isFakeTag(t.content)) return escapeHtml(t.content)
    return inline ? inline(tokens, idx, options, env, self) : t.content
  }

  const block = md.renderer.rules.html_block
  md.renderer.rules.html_block = (tokens, idx, options, env, self) => {
    const t = tokens[idx]
    if (env?.relativePath !== 'index.md' && isFakeTag(t.content.trimStart())) {
      return `<p>${escapeHtml(t.content.trim())}</p>\n`
    }
    return block ? block(tokens, idx, options, env, self) : t.content
  }

  // Interpolation guard: Vue decodes entities after it scans for mustaches,
  // so an entity-encoded brace is rendered as "{" but never compiled.
  const render = md.render.bind(md)
  md.render = (src: string, env?: any) => {
    const html = render(src, env)
    return env?.relativePath === 'index.md' ? html : html.replace(/\{\{/g, '&#123;&#123;')
  }
}
