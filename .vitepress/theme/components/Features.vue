<script setup lang="ts">
import LpSection from './LpSection.vue'

const FEATURES = [
  {
    group: '對話演出', en: 'Presentation',
    items: [
      ['Auto / Skip', '自動播放與按住快進，遇到選項一定停'],
      ['NVL 模式', '全螢幕文字頁，與 ADV 對話框並存'],
      ['富文字', '顏色、粗體、大小、停頓、速度、注音與逐字特效'],
      ['角色語音', '逐句語音，缺檔時安靜略過'],
      ['動態立繪', 'breath 呼吸、sprite 逐格、layered 眨眼與嘴型疊層'],
    ],
  },
  {
    group: '回顧與重溫', en: 'Replay',
    items: [
      ['回溯', 'Backspace 退回上一句，與 AI 探索分支共用快照機制'],
      ['對話記錄', '滾輪或 B 鍵回看所有對白'],
      ['場景重溫、CG 鑑賞、音樂室', '解鎖後可隨時重看'],
      ['結局與完成度', '結局收集與完成度統計'],
      ['快速存檔、自動存檔', '多存檔槽，並可精確續讀'],
    ],
  },
  {
    group: '世界與關係', en: 'World',
    items: [
      ['多軸好感度', '每位角色可同時追蹤多個數值，跨門檻自動解鎖內容'],
      ['地圖與時段', '地點、時段切換、NPC 出沒時間表與目的地挑選'],
      ['任務、物品、商店', '送禮依角色喜好計算，資源可自訂'],
      ['成就', '宣告式條件，含隱藏成就'],
      ['篇章', '可選的章節 / 路線結構疊層'],
    ],
  },
  {
    group: '在地化與無障礙', en: 'Reach',
    items: [
      ['執行期多語系', 'pack 自帶語言目錄與每語言字型'],
      ['主題', 'pack 可覆寫整套配色與介面文案'],
      ['減少動態', 'reduce_motion 讓轉場與特效退化為最多 0.12 秒'],
      ['觸控', 'touch_mode 提供手指友善的介面與尺寸'],
    ],
  },
]

const TARGETS = [
  { name: '桌面', en: 'Desktop', body: 'PyInstaller 把引擎與 pack 打成不需安裝 Python 的資料夾。', cmd: 'world-gal-game build <pack>' },
  { name: '網頁', en: 'Web', body: '經 pygbag 編譯成 WASM，在瀏覽器裡執行，存檔寫入 IndexedDB。', cmd: 'uv sync --extra web' },
  { name: 'Steam', en: 'Steam', body: '桌面整合：成就與雲端存檔；沒有 Steam 時優雅降級。', cmd: 'docs/distribution-steam' },
  { name: 'Android / PWA', en: 'Mobile', body: 'Android 為 pygbag APK 或 PWA；iOS 僅 PWA（加到主畫面）。', cmd: 'docs/distribution-mobile' },
]
</script>

<template>
  <LpSection id="features" title="Gal-Game 該有的都有" en="Genre features, built in" alt>
    <div class="grid">
      <div v-for="g in FEATURES" :key="g.group">
        <h3 class="lp-h3">{{ g.group }} <span class="lp-h3-en">{{ g.en }}</span></h3>
        <dl>
          <div v-for="it in g.items" :key="it[0]" class="item">
            <dt>{{ it[0] }}</dt>
            <dd>{{ it[1] }}</dd>
          </div>
        </dl>
      </div>
    </div>

    <h3 class="lp-h3 targetsHead">一份 pack，四種去處 <span class="lp-h3-en">Ship it anywhere</span></h3>
    <ul class="targets">
      <li v-for="t in TARGETS" :key="t.name" class="target">
        <div class="targetName">{{ t.name }} <span class="lp-h3-en">{{ t.en }}</span></div>
        <p>{{ t.body }}</p>
        <code>{{ t.cmd }}</code>
      </li>
    </ul>
  </LpSection>
</template>

<style scoped>
.grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 3rem 4rem; }
dl { margin: 1rem 0 0; }
.item { display: grid; grid-template-columns: 11rem 1fr; gap: 1rem; padding: 0.65rem 0; border-top: 1px solid var(--rule); }
dt { font-weight: 700; }
dd { margin: 0; color: var(--muted); font-size: 0.95rem; line-height: 1.7; }
.targetsHead { margin: 4rem 0 1.25rem; }
.targets { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); border: 1px solid var(--rule); border-radius: 8px; background: var(--surface); }
.target { padding: 1.25rem; border-left: 1px solid var(--rule); min-width: 0; margin: 0; }
.target:first-child { border-left: 0; }
.targetName { font-family: var(--serif); font-weight: 700; font-size: 1.15rem; }
.target p { font-size: 0.93rem; margin: 0.6rem 0 0.9rem; }
.target code { color: var(--accent); font-size: 0.78rem; overflow-wrap: anywhere; }
@media (max-width: 996px) {
  .grid { grid-template-columns: minmax(0, 1fr); }
  .targets { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .target:nth-child(3) { border-left: 0; }
  .target:nth-child(n + 3) { border-top: 1px solid var(--rule); }
}
@media (max-width: 600px) {
  .item { grid-template-columns: 1fr; gap: 0.2rem; }
  .targets { grid-template-columns: minmax(0, 1fr); }
  .target, .target:first-child, .target:nth-child(3) { border-left: 0; }
  .target + .target { border-top: 1px solid var(--rule); }
}
</style>
