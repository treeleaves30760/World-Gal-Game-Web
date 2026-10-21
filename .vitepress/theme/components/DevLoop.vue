<script setup lang="ts">
import { withBase } from 'vitepress'
import LpSection from './LpSection.vue'
import CodeBox from './CodeBox.vue'
import { json, type Seg } from '../highlight'

const STAGES = [
  {
    name: '理解', en: 'Understand',
    cmds: ['brief', 'card --symbol <id>', 'impact --symbol <id>', 'inspect-pack --dataflow'],
    note: '最省 token 的定向：場景鄰接、結局可達性、變數、缺口，再縮放到單一符號。',
  },
  {
    name: '編輯', en: 'Edit',
    cmds: ['edit.add_scene', 'edit.add_choice', 'edit.update_line', 'begin / commit / rollback'],
    note: '在常駐 session 內保留註解地改 YAML，回應同時附上 diff 與 impact 差異。',
  },
  {
    name: '驗證', en: 'Verify',
    cmds: ['self-check', 'smoke', 'contract', 'production-check'],
    note: '七階段自檢、通關腳本、敘事契約，到 fail-closed 的來源釋出前檢查。',
  },
]

const com = (t: string): Seg[] => [{ t, c: 'com' }]
const req = (j: string): Seg[] => [{ t: '→ ', c: 'req' }, ...json(j)]
const res = (j: string): Seg[] => [{ t: '← ', c: 'res' }, ...json(j)]

const session = [
  { segs: com('# 一行一個 JSON；回應帶 seq 與 ok') },
  { segs: req('{"op":"edit.add_scene","scene":{"id":"lake_night","title":"…","lines":[…]}}') },
  { segs: res('{"ok":true,"seq":1,"result":{"op":"edit.add_scene","ok":true,"changed":true,') },
  { segs: json('"impact":{"clean":false,"scenes_added":["lake_night"],'), indent: true },
  { segs: json('"regressions":[{"kind":"orphan_scenes","items":["lake_night"]}]}}}'), indent: true },
  { segs: com('# 把新場景接進劇情，再 reload 就能實際遊玩') },
  { segs: req('{"op":"edit.add_choice","scene_id":"…","choice":{…}}') },
  { segs: req('{"op":"__reload__"}') },
]
</script>

<template>
  <LpSection id="loop" title="AI 開發迴圈" en="Understand, edit, verify - in one warm process" alt>
    <ol class="stages">
      <li v-for="(s, i) in STAGES" :key="s.name" class="stage">
        <div class="stageHead">
          <span class="stageName">{{ s.name }}</span>
          <span class="stageEn">{{ s.en }}</span>
        </div>
        <p class="stageNote">{{ s.note }}</p>
        <ul class="cmds">
          <li v-for="c in s.cmds" :key="c"><code>{{ c }}</code></li>
        </ul>
        <svg v-if="i < STAGES.length - 1" class="arrow" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
          <path d="M3 12h16M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </li>
    </ol>

    <div class="cols">
      <div>
        <h3 class="lp-h3">一個回合：編輯之後立刻知道後果</h3>
        <p>
          <code>edit.*</code> 操作回傳 YAML diff，以及這次編輯對世界模型造成的 <code>impact</code>
          ：新的死路、到不了的結局、用了卻未宣告的 flag。不必另跑 <code>self-check</code>，也不必重啟程序。
        </p>
        <p>
          批次加上 <code>"atomic": true</code> 時，狀態與編輯要嘛全部生效、要嘛全部捨棄。
          snapshot / restore 讓 AI 能探索分支再退回，玩家的回溯（Backspace）用的是同一套機制。
        </p>
        <p>
          <a :href="withBase('/docs/session-protocol')">NDJSON session 協定</a>
          &middot;
          <a :href="withBase('/docs/ai-native-world-model')">AI 原生世界模型</a>
        </p>
      </div>
      <CodeBox title="world-gal-game session --pack demo_pack" :lines="session" />
    </div>
  </LpSection>
</template>

<style scoped>
.stages { list-style: none; padding: 0; margin: 0 0 3.5rem; display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5rem; }
.stage { position: relative; border-top: 2px solid var(--accent); padding-top: 1rem; margin: 0; }
.stageHead { display: flex; align-items: baseline; gap: 0.75rem; }
.stageName { font-family: var(--serif); font-weight: 700; font-size: 1.6rem; }
.stageEn { font-family: var(--latin); font-style: italic; color: var(--muted); }
.stageNote { margin: 0.5rem 0 1rem; }
.cmds { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 0.35rem; }
.cmds li { margin: 0; }
.cmds code {
  display: inline-block; padding: 0.15rem 0.5rem; border-radius: 4px;
  background: var(--surface); border: 1px solid var(--rule); font-size: 0.82rem;
}
.arrow { position: absolute; top: -13px; right: -2rem; color: var(--lantern); background: var(--bg-alt); }
.cols { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 6fr); gap: 3rem; align-items: start; }
.cols > * { min-width: 0; }
@media (max-width: 996px) {
  .stages { grid-template-columns: 1fr; gap: 2rem; }
  .arrow { display: none; }
  .cols { grid-template-columns: minmax(0, 1fr); gap: 2rem; }
}
</style>
