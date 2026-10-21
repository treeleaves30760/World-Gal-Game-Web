// Tiny colorisers for the landing page's code panes (no runtime dependency).
export type Seg = { t: string; c?: 'com' | 'key' | 'str' | 'num' | 'req' | 'res' }

/** JSON (NDJSON lines): keys, strings, numbers/literals. */
export function json(text: string): Seg[] {
  return text
    .split(/("(?:[^"\\]|\\.)*"\s*:?|\btrue\b|\bfalse\b|\bnull\b|-?\d+(?:\.\d+)?)/g)
    .filter((p) => p !== '')
    .map((p) => {
      if (/^".*"\s*:$/.test(p)) return { t: p, c: 'key' as const }
      if (p.startsWith('"')) return { t: p, c: 'str' as const }
      if (/^(true|false|null|-?\d)/.test(p)) return { t: p, c: 'num' as const }
      return { t: p }
    })
}

/** One YAML line: comments, keys (also inside {flow: maps}), strings, numbers. */
export function yaml(line: string): Seg[] {
  const hash = line.search(/(^|\s)#/)
  const body = hash >= 0 ? line.slice(0, hash) : line
  const out: Seg[] = []
  const re = /("(?:[^"\\]|\\.)*")|([A-Za-z_][\w-]*)(?=:(?:\s|$))|(\b\d+\b)/g
  let last = 0
  for (let m = re.exec(body); m; m = re.exec(body)) {
    if (m.index > last) out.push({ t: body.slice(last, m.index) })
    out.push({ t: m[0], c: m[1] ? 'str' : m[2] ? 'key' : 'num' })
    last = m.index + m[0].length
  }
  if (last < body.length) out.push({ t: body.slice(last) })
  if (hash >= 0) out.push({ t: line.slice(hash), c: 'com' })
  return out
}

/** One shell line: whole-line comments and trailing " # ..." comments. */
export function shell(line: string): Seg[] {
  if (line.trim().startsWith('#')) return [{ t: line, c: 'com' }]
  const i = line.indexOf(' #')
  return i >= 0 ? [{ t: line.slice(0, i) }, { t: line.slice(i), c: 'com' }] : [{ t: line }]
}
