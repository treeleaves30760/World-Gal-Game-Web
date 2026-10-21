#!/usr/bin/env node
// Sync the engine repo's docs into ./docs (a gitignored, generated copy).
//
//   ENGINE_DIR   engine checkout (default: ../World-Gal-Game)
//
// - copies <ENGINE_DIR>/docs/*.md and ROADMAP.md (as roadmap.md)
// - injects `slug: /` into README.md so it becomes the /docs landing
// - rewrites relative links that leave the synced set to absolute GitHub URLs
//   so the build has no broken links.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const engine = path.resolve(root, process.env.ENGINE_DIR || '../World-Gal-Game');
const GITHUB = 'https://github.com/treeleaves30760/world-gal-game/blob/main/';
const outDir = path.join(root, 'docs');
const srcDocs = path.join(engine, 'docs');

if (!fs.existsSync(srcDocs)) {
  console.error(`[sync-docs] engine docs not found: ${srcDocs}\n` +
    '           set ENGINE_DIR to a checkout of treeleaves30760/world-gal-game');
  process.exit(1);
}

const docNames = fs.readdirSync(srcDocs).filter((f) => f.endsWith('.md'));
const synced = new Set(docNames.map((f) => f.toLowerCase()));
const hasRoadmap = fs.existsSync(path.join(engine, 'ROADMAP.md'));

/** Map a relative link target (found in a file at `fromDir`) to its final form. */
function mapTarget(target, fromDir) {
  if (!target || /^([a-z][a-z0-9+.-]*:|#|\/|\{)/i.test(target)) return target;
  const m = target.match(/^([^#?]*)([#?].*)?$/);
  const rel = m[1];
  const tail = m[2] || '';
  if (!rel) return target;
  const abs = path.resolve(fromDir, rel);
  const relToEngine = path.relative(engine, abs);
  if (relToEngine.startsWith('..')) return target; // outside the engine: leave
  const posix = relToEngine.split(path.sep).join('/');
  const inDocs = posix.startsWith('docs/') && !posix.slice(5).includes('/');
  if (inDocs && posix.endsWith('.md') && synced.has(path.basename(posix).toLowerCase())) {
    return path.basename(posix) + tail;
  }
  if (posix === 'ROADMAP.md' && hasRoadmap) return 'roadmap.md' + tail;
  return GITHUB + posix + tail;
}

function rewrite(text, fromDir) {
  let inFence = false;
  return text
    .split('\n')
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        inFence = !inFence;
        return line;
      }
      if (inFence) return line;
      // inline links / images: ](target) or ](target "title")
      line = line.replace(/\]\(\s*<?([^)\s>]+)>?((?:\s+"[^"]*")?)\s*\)/g, (_, t, title) =>
        `](${mapTarget(t, fromDir)}${title})`);
      // reference definitions: [id]: target
      line = line.replace(/^(\s*\[[^\]]+\]:\s*)(\S+)/, (_, a, t) => a + mapTarget(t, fromDir));
      return line;
    })
    .join('\n');
}

function withFrontMatter(text, extra) {
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (fm) {
    const keep = Object.keys(extra).filter((k) => !new RegExp(`^${k}:`, 'm').test(fm[1]));
    if (!keep.length) return text;
    const add = keep.map((k) => `${k}: ${extra[k]}`).join('\n');
    return `---\n${fm[1]}\n${add}\n---\n` + text.slice(fm[0].length);
  }
  const add = Object.entries(extra).map(([k, v]) => `${k}: ${v}`).join('\n');
  return `---\n${add}\n---\n\n${text}`;
}

fs.rmSync(outDir, {recursive: true, force: true});
fs.mkdirSync(outDir, {recursive: true});

for (const name of docNames) {
  let text = rewrite(fs.readFileSync(path.join(srcDocs, name), 'utf8'), srcDocs);
  if (name === 'README.md') text = withFrontMatter(text, {slug: '/', title: '"文件總覽"', sidebar_label: '"總覽 Overview"'});
  fs.writeFileSync(path.join(outDir, name), text);
}
if (hasRoadmap) {
  let text = rewrite(fs.readFileSync(path.join(engine, 'ROADMAP.md'), 'utf8'), engine);
  text = withFrontMatter(text, {sidebar_label: '"路線圖 Roadmap"'});
  fs.writeFileSync(path.join(outDir, 'roadmap.md'), text);
}
console.log(`[sync-docs] ${docNames.length} docs${hasRoadmap ? ' + roadmap' : ''} <- ${engine}`);
