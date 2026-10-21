<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const LINES = [
  { speaker: 'World Gal-Game', text: '「這是一個引擎，不是一款遊戲。每款遊戲都是一個獨立的 pack。」' },
  { speaker: 'World Gal-Game', text: '「人類用 YAML 寫故事；AI 負責遊玩、檢視、編輯，並驗證它。」' },
  { speaker: 'World Gal-Game', text: '「想要新的效果、條件或立繪動畫？寫一個外掛就好，不必動核心。」' },
]

const index = ref(0)
// SSR / no-JS: the first line is fully visible; typing starts after mount.
const shown = ref(LINES[0].text.length)
const line = computed(() => LINES[index.value])
const done = computed(() => shown.value >= line.value.text.length)
const visible = computed(() => line.value.text.slice(0, shown.value))
const ghost = computed(() => line.value.text.slice(shown.value))

let reduced = false
let ready = false
let typeTimer: ReturnType<typeof setInterval> | undefined
let autoTimer: ReturnType<typeof setTimeout> | undefined

function clearTimers() {
  clearInterval(typeTimer)
  clearTimeout(autoTimer)
}
function scheduleAuto() {
  // Auto-advance like the engine's Auto mode; never under reduced motion.
  if (reduced) return
  autoTimer = setTimeout(next, 3200)
}
function startLine() {
  clearTimers()
  const len = line.value.text.length
  if (!ready || reduced) {
    shown.value = len
    return
  }
  shown.value = 0
  let n = 0
  typeTimer = setInterval(() => {
    n += 1
    shown.value = n
    if (n >= len) {
      clearInterval(typeTimer)
      scheduleAuto()
    }
  }, 52)
}
function next() {
  index.value = (index.value + 1) % LINES.length
  startLine()
}
function advance() {
  if (!done.value) {
    clearTimers()
    shown.value = line.value.text.length
    scheduleAuto()
  } else {
    clearTimers()
    next()
  }
}

onMounted(() => {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ready = true
  startLine()
})
onBeforeUnmount(clearTimers)
</script>

<template>
  <div class="dialogue">
    <div class="nameTag">{{ line.speaker }}</div>
    <button
      type="button"
      class="body"
      :aria-label="`${line.speaker}：${line.text}（點擊切換下一句）`"
      @click="advance"
    >
      <span class="text" aria-hidden="true">{{ visible }}<span class="ghost">{{ ghost }}</span></span>
      <svg class="advance" :class="{ on: done }" viewBox="0 0 16 12" width="16" height="12" aria-hidden="true">
        <path d="M1 1h14L8 11z" fill="currentColor" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
/* always dark: it is the game's UI, in either theme */
.dialogue { position: relative; margin-top: 1.5rem; }
.nameTag {
  position: absolute; top: -1.05rem; left: 1.25rem; z-index: 1;
  padding: 0.28rem 1.1rem;
  background: #8b96f0; color: #0e1120;
  font-family: var(--latin); font-weight: 600; font-size: 1rem;
  border-radius: 4px;
}
.body {
  position: relative; display: block; width: 100%; min-height: 8.2rem;
  text-align: left; padding: 2rem 3rem 1.6rem 1.5rem; cursor: pointer;
  color: #e8eaf8; font: inherit;
  background: linear-gradient(180deg, rgba(27, 32, 80, 0.94), rgba(16, 19, 48, 0.96));
  border: 1px solid #5560c8; border-radius: 10px;
  box-shadow: 0 18px 50px -20px rgba(5, 7, 30, 0.7), inset 0 0 0 4px rgba(139, 150, 240, 0.08);
}
.text {
  display: block; font-family: var(--serif);
  font-size: clamp(1.05rem, 2.4vw, 1.4rem); line-height: 1.8; letter-spacing: 0.04em;
}
.ghost { visibility: hidden; }
.advance { position: absolute; right: 1.2rem; bottom: 1rem; color: #f2c879; opacity: 0; }
.advance.on { opacity: 1; animation: bob 1.1s ease-in-out infinite; }
@keyframes bob { 0%, 100% { transform: translateY(0); opacity: 1; } 50% { transform: translateY(4px); opacity: 0.35; } }

@media (max-width: 600px) {
  .body { padding: 1.9rem 2.4rem 1.4rem 1.1rem; min-height: 9.5rem; }
}
@media (prefers-reduced-motion: reduce) {
  .advance.on { animation: none; }
}
</style>
