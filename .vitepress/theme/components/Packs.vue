<script setup lang="ts">
import { withBase } from 'vitepress'
import LpSection from './LpSection.vue'
import CodeBox from './CodeBox.vue'
import { yaml } from '../highlight'

const SCENE_YAML = `scenes:
  - id: meet_at_square
    title: "初遇"
    location: town_square
    background: assets/backgrounds/town_square.png
    lines:
      - text: |
          佈告欄前有個人正踮著腳，貼著一張手寫的紙。
      - speaker: "路人"
        text: "「可以幫我看看這張上面寫得清楚嗎？」"
        portrait: assets/characters/stranger_normal.png
        expression: smile
    choices:
      - id: friendly
        text: "「下次我請你喝咖啡？」"
        requires:
          - {kind: affection_gte, target: stranger, value: 10}
        effects:
          - {kind: affection, target: stranger, value: 5}
          - {kind: set_flag, target: had_coffee_promise}
        next_scene: coffee_talk`

const lines = SCENE_YAML.split('\n').map((l) => ({ segs: yaml(l) }))
const paths = [
  ['games/<pack>/', '隨引擎發佈的內建 pack，demo_pack 在這裡'],
  ['../<pack>/', '引擎旁邊的兄弟資料夾，適合有自己 git 倉的遊戲'],
  ['~/.world-gal-game/packs/<pack>/', '使用者本機的 pack'],
  ['--pack <path>', '命令列直接指定任意路徑'],
]
</script>

<template>
  <LpSection id="packs" title="引擎不是遊戲" en="The engine is not a game - games are packs">
    <div class="cols">
      <div>
        <p class="lp-lead">
          引擎本身不帶任何遊戲邏輯。一款遊戲就是一個獨立的內容包（pack），
          與引擎分開發佈，從下列任一處載入：
        </p>
        <ul class="paths">
          <li v-for="p in paths" :key="p[0]"><code>{{ p[0] }}</code><span>{{ p[1] }}</span></li>
        </ul>
        <p>
          pack 內的資源路徑一律是 <code>assets/...</code>（相對於 pack），所以整個目錄可以原封不動搬到別的 repo。
          內附的 <code>demo_pack</code> 約 5 至 10 分鐘可玩完，涵蓋對話、任務、商店、物品、好感度與成就。
        </p>
        <p><a :href="withBase('/docs/tutorial-build-a-game')">跟著教學從零做出 demo_pack</a></p>
      </div>
      <CodeBox title="content/scenes/*.yaml" :lines="lines" />
    </div>
  </LpSection>
</template>

<style scoped>
.cols { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 6fr); gap: 3rem; align-items: start; }
.cols > * { min-width: 0; }
.paths { list-style: none; padding: 0; margin: 1.5rem 0; border-top: 1px solid var(--rule); }
.paths li { display: grid; grid-template-columns: minmax(0, 15rem) 1fr; gap: 1rem; padding: 0.7rem 0; border-bottom: 1px solid var(--rule); align-items: baseline; margin: 0; }
.paths li > code { color: var(--accent); overflow-wrap: anywhere; }
.paths li > span { color: var(--muted); font-size: 0.95rem; }
@media (max-width: 996px) { .cols { grid-template-columns: minmax(0, 1fr); gap: 2rem; } }
@media (max-width: 600px) { .paths li { grid-template-columns: 1fr; gap: 0.2rem; } }
</style>
