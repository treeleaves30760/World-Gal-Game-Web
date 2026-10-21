<script setup lang="ts">
import { withBase } from 'vitepress'
import LpSection from './LpSection.vue'

const DECORATORS = [
  '@effect', '@condition', '@hook', '@inspect_field', '@widget',
  '@scene', '@brain', '@dialogue_op', '@portrait_backend', '@ambient_backend',
]
</script>

<template>
  <LpSection id="pillars" title="三條支柱" en="Three pillars">
    <div class="pillars">
      <article class="pillar">
        <div class="letter" aria-hidden="true">A</div>
        <h3 class="lp-h3">人類用 YAML 寫遊戲</h3>
        <p class="sub">Humans author packs</p>
        <p>
          角色、場景、地點、物品、好感度與成就全是宣告式 YAML；99% 的遊戲開發不必碰一行 Python。
          一行指令產生 pack 骨架，再用 <code>validate</code> 與 effect / condition 參考查驗。
        </p>
        <a :href="withBase('/docs/pack-format')">pack 格式</a>
      </article>
      <article class="pillar">
        <div class="letter" aria-hidden="true">B</div>
        <h3 class="lp-h3">AI 開發遊戲</h3>
        <p class="sub">AI develops games</p>
        <p>
          無視窗遊玩、檢視 pack 結構、結構化編輯、自我驗證。常駐的 NDJSON session 載入一次、串流多個操作；
          另有世界模型：變數宣告、資料流分析、目標導向 planner 與覆蓋率追蹤。
        </p>
        <a :href="withBase('/docs/ai-native-contract')">AI-Coding-Native 契約</a>
      </article>
      <article class="pillar">
        <div class="letter" aria-hidden="true">C</div>
        <h3 class="lp-h3">外掛擴充引擎</h3>
        <p class="sub">Plugins extend the engine</p>
        <p>
          新主題（恐怖、戀愛、養成）走外掛，不改核心。十種裝飾器註冊擴充點，
          失敗的 handler 會被隔離，不會拖垮引擎。
        </p>
        <ul class="chips" aria-label="十種外掛擴充點">
          <li v-for="d in DECORATORS" :key="d">{{ d }}</li>
        </ul>
        <a :href="withBase('/docs/plugins')">寫一個外掛</a>
      </article>
    </div>
  </LpSection>
</template>

<style scoped>
.pillars { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; }
.pillar { padding: 0 2rem; border-left: 1px solid var(--rule); min-width: 0; }
.pillar:first-child { padding-left: 0; border-left: 0; }
.pillar:last-child { padding-right: 0; }
.letter {
  font-family: var(--latin); font-size: 5.5rem; line-height: 1; font-weight: 400; font-style: italic;
  color: var(--accent); opacity: 0.85; margin-bottom: 0.6rem;
}
.sub { margin: 0.2rem 0 1rem; font-family: var(--latin); font-style: italic; color: var(--muted); }
.chips { list-style: none; display: flex; flex-wrap: wrap; gap: 0.4rem; padding: 0; margin: 1rem 0; }
.chips li {
  font-family: var(--mono); font-size: 0.78rem; padding: 0.18rem 0.55rem;
  border: 1px solid var(--rule); border-radius: 4px; background: var(--surface); margin: 0;
}
@media (max-width: 996px) {
  .pillars { grid-template-columns: 1fr; gap: 3rem; }
  .pillar, .pillar:first-child, .pillar:last-child { padding: 1.5rem 0 0; border-left: 0; border-top: 1px solid var(--rule); }
}
</style>
