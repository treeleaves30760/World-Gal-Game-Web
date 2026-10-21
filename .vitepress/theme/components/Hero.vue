<script setup lang="ts">
import { withBase } from 'vitepress'
import DialogueBox from './DialogueBox.vue'

const GITHUB = 'https://github.com/treeleaves30760/world-gal-game'

// Deterministic star field (no Math.random: SSR and client must match).
const stars = Array.from({ length: 46 }, (_, i) => ({
  x: (i * 53.7 + (i % 7) * 11) % 100,
  y: (i * 29.3 + (i % 5) * 7) % 88,
  r: 2 + ((i * 7) % 5) * 0.6,
  d: (i % 9) * 0.7,
}))

const choices = [
  { main: '開始使用', sub: 'Getting started', href: withBase('/docs/getting-started') },
  { main: 'AI 開發指南', sub: 'AI developer guide', href: withBase('/docs/ai-developer-guide') },
  { main: 'GitHub', sub: 'Source, issues', href: GITHUB },
]
</script>

<template>
  <header class="hero">
    <div class="stars" aria-hidden="true">
      <span
        v-for="(s, i) in stars"
        :key="i"
        class="star"
        :style="{ left: s.x + '%', top: s.y + '%', width: s.r + 'px', height: s.r + 'px', animationDelay: s.d + 's' }"
      />
    </div>
    <div class="moon" aria-hidden="true" />
    <div class="inner">
      <p class="kicker">MIT 授權 · 開源 · pygame + YAML</p>
      <h1 class="title">World Gal-Game</h1>
      <p class="pitch">讓 AI 一起參與製作的 Gal-Game 引擎</p>
      <p class="pitchEn">The Gal-Game engine where AI is a first-class developer.</p>

      <nav class="choices" aria-label="開始">
        <a v-for="c in choices" :key="c.main" class="choice" :href="c.href">
          <span class="mark" aria-hidden="true" />
          <span class="main">{{ c.main }}</span>
          <span class="sub">{{ c.sub }}</span>
        </a>
      </nav>

      <DialogueBox />
    </div>
  </header>
</template>

<style scoped>
.hero {
  position: relative; isolation: isolate; overflow: hidden;
  padding: 4.5rem 1rem 3.5rem;
  background: linear-gradient(180deg, var(--hero-top) 0%, var(--hero-bottom) 100%);
}
.stars { position: absolute; inset: 0; z-index: -1; }
.star { position: absolute; border-radius: 50%; background: var(--star); opacity: 0.55; animation: twinkle 5s ease-in-out infinite; }
@keyframes twinkle { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.8; } }

.moon {
  position: absolute; z-index: -1; top: 3rem; right: max(6vw, 1rem);
  width: clamp(5rem, 11vw, 9rem); aspect-ratio: 1; border-radius: 50%;
  background: var(--moon);
  box-shadow: 0 0 80px 10px color-mix(in srgb, var(--moon) 45%, transparent);
  -webkit-mask: radial-gradient(circle at 70% 30%, transparent 0 56%, #000 57%);
          mask: radial-gradient(circle at 70% 30%, transparent 0 56%, #000 57%);
  opacity: 0.9;
}

.inner { max-width: 1040px; margin: 0 auto; }
.kicker { margin: 0 0 1.25rem; font-size: 0.9rem; color: var(--muted); letter-spacing: 0.04em; }
.title {
  margin: 0; font-family: var(--latin); font-variation-settings: 'opsz' 144; font-weight: 600;
  font-size: clamp(2.9rem, 9.5vw, 7rem); line-height: 0.98; letter-spacing: -0.025em; color: var(--ink);
}
.pitch {
  text-wrap: balance; margin: 1.4rem 0 0.35rem; font-family: var(--serif); font-weight: 600;
  font-size: clamp(1.35rem, 3.4vw, 2.1rem); line-height: 1.35;
}
.pitchEn { margin: 0; font-family: var(--latin); font-style: italic; color: var(--muted); font-size: clamp(1rem, 2vw, 1.2rem); }

/* choices = the CTAs, drawn as a visual-novel choice menu */
.choices { display: grid; gap: 0.6rem; margin: 2.25rem 0 2.5rem; max-width: 30rem; }
.choice {
  display: grid; grid-template-columns: 1.1rem 1fr auto; align-items: baseline; column-gap: 0.9rem;
  padding: 0.8rem 1.1rem;
  border: 1px solid color-mix(in srgb, var(--accent) 55%, transparent); border-radius: 6px;
  background: color-mix(in srgb, var(--surface) 72%, transparent);
  -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px);
  color: var(--ink); text-decoration: none;
  transition: background 0.18s, border-color 0.18s, transform 0.18s;
}
.choice:hover, .choice:focus-visible {
  background: var(--accent); border-color: var(--accent); color: #fff; text-decoration: none; transform: translateX(4px);
}
.dark .choice:hover, .dark .choice:focus-visible { color: #0e1120; }
.mark {
  width: 0; height: 0; align-self: center;
  border-left: 8px solid var(--lantern); border-top: 5px solid transparent; border-bottom: 5px solid transparent;
}
.choice:hover .mark, .choice:focus-visible .mark { border-left-color: currentColor; }
.main { font-family: var(--serif); font-weight: 700; font-size: 1.1rem; }
.sub { font-size: 0.82rem; opacity: 0.75; }

@media (max-width: 600px) {
  .hero { padding: 3rem 1rem 2.5rem; }
  .moon { top: 1.2rem; right: 1rem; }
  .choices { max-width: none; }
  .sub { display: none; }
  .choice { grid-template-columns: 1.1rem 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .star { animation: none; }
  .choice { transition: none; }
  .choice:hover, .choice:focus-visible { transform: none; }
}
</style>
