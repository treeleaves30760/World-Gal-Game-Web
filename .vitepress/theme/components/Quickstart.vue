<script setup lang="ts">
import { withBase } from 'vitepress'
import LpSection from './LpSection.vue'
import CodeBox from './CodeBox.vue'
import { shell } from '../highlight'

const GITHUB = 'https://github.com/treeleaves30760/world-gal-game'
const QUICKSTART = `git clone ${GITHUB}.git
cd world-gal-game
uv venv && uv pip install -e .

uv run python main.py                 # 跑內附的 demo_pack
uv run python main.py --list-packs

# 產生自己的 pack，然後跑起來
uv run python tools/scaffold_pack.py --pack my_game --title "我的遊戲"
uv run python main.py --pack my_game

# 讓 AI（或你）檢查它
uv run world-gal-game self-check games/my_game
uv run world-gal-game brief games/my_game`
const lines = QUICKSTART.split('\n').map((l) => ({ segs: shell(l) }))
const logo = withBase('/img/logo.svg')
const links = [
  ['/docs/getting-started', '入門：安裝與第一個 pack'],
  ['/docs/tutorial-build-a-game', '教學：從零做出一款遊戲'],
  ['/docs/ai-developer-guide', 'AI 開發指南：讓 agent 上手'],
  ['/docs/distribution', '發佈：桌面、網頁、Steam、行動裝置'],
]
</script>

<template>
  <LpSection id="quickstart" title="三分鐘上手" en="Quickstart">
    <div class="cols">
      <div>
        <p class="lp-lead">需要 Python 3.10 以上與 uv。從原始碼安裝後，就能跑 demo、產生自己的 pack。</p>
        <ul class="next">
          <li v-for="l in links" :key="l[0]"><a :href="withBase(l[0])">{{ l[1] }}</a></li>
        </ul>
        <img class="mark" :src="logo" alt="" width="56" height="56" />
      </div>
      <CodeBox title="shell" :lines="lines" />
    </div>
  </LpSection>
</template>

<style scoped>
.cols { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 6fr); gap: 3rem; align-items: start; }
.cols > * { min-width: 0; }
.next { padding-left: 1.2rem; line-height: 2; }
.mark { margin-top: 1.5rem; opacity: 0.9; }
@media (max-width: 996px) { .cols { grid-template-columns: minmax(0, 1fr); gap: 2rem; } }
</style>
