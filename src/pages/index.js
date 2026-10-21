import React, {useCallback, useEffect, useRef, useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {Highlight, themes} from 'prism-react-renderer';
import styles from './index.module.css';

const GITHUB = 'https://github.com/treeleaves30760/world-gal-game';

/* ------------------------------------------------------------------ */
/* Hero: a visual-novel dialogue box that types out the pitch           */
/* ------------------------------------------------------------------ */

const LINES = [
  {speaker: 'World Gal-Game', text: '「這是一個引擎，不是一款遊戲。每款遊戲都是一個獨立的 pack。」'},
  {speaker: 'World Gal-Game', text: '「人類用 YAML 寫故事；AI 負責遊玩、檢視、編輯，並驗證它。」'},
  {speaker: 'World Gal-Game', text: '「想要新的效果、條件或立繪動畫？寫一個外掛就好，不必動核心。」'},
];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return reduced;
}

function DialogueBox() {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(LINES[0].text.length);
  const [ready, setReady] = useState(false);
  const line = LINES[index];
  const done = shown >= line.text.length;
  const timer = useRef(null);

  useEffect(() => setReady(true), []);

  // Typewriter: reveal one glyph at a time (skipped under reduced motion).
  useEffect(() => {
    if (!ready) return undefined;
    if (reduced) {
      setShown(line.text.length);
      return undefined;
    }
    setShown(0);
    let n = 0;
    timer.current = setInterval(() => {
      n += 1;
      setShown(n);
      if (n >= line.text.length) clearInterval(timer.current);
    }, 52);
    return () => clearInterval(timer.current);
  }, [index, ready, reduced, line.text]);

  // Auto-advance, like the engine's Auto mode (not under reduced motion).
  useEffect(() => {
    if (!ready || reduced || !done) return undefined;
    const t = setTimeout(() => setIndex((i) => (i + 1) % LINES.length), 3200);
    return () => clearTimeout(t);
  }, [done, ready, reduced, index]);

  const advance = useCallback(() => {
    if (!done) {
      clearInterval(timer.current);
      setShown(line.text.length);
    } else {
      setIndex((i) => (i + 1) % LINES.length);
    }
  }, [done, line.text]);

  return (
    <div className={styles.dialogue}>
      <div className={styles.nameTag}>{line.speaker}</div>
      <button
        type="button"
        className={styles.dialogueBody}
        onClick={advance}
        aria-label={`${line.speaker}：${line.text}（點擊切換下一句）`}>
        <span aria-hidden="true" className={styles.dialogueText}>
          {line.text.slice(0, shown)}
          <span className={styles.ghost}>{line.text.slice(shown)}</span>
        </span>
        <svg
          className={`${styles.advance} ${done ? styles.advanceOn : ''}`}
          viewBox="0 0 16 12"
          width="16"
          height="12"
          aria-hidden="true">
          <path d="M1 1h14L8 11z" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
}

function Stars() {
  // Deterministic star field (no Math.random: SSR and client must match).
  const stars = [];
  for (let i = 0; i < 46; i += 1) {
    stars.push({
      x: (i * 53.7 + (i % 7) * 11) % 100,
      y: (i * 29.3 + (i % 5) * 7) % 88,
      r: 2 + ((i * 7) % 5) * 0.6,
      d: (i % 9) * 0.7,
    });
  }
  return (
    <div className={styles.stars} aria-hidden="true">
      {stars.map((s, i) => (
        <span
          key={i}
          className={styles.star}
          style={{left: `${s.x}%`, top: `${s.y}%`, width: s.r, height: s.r, animationDelay: `${s.d}s`}}
        />
      ))}
    </div>
  );
}

function Hero() {
  return (
    <header className={styles.hero}>
      <Stars />
      <div className={styles.moon} aria-hidden="true" />
      <div className={styles.heroInner}>
        <p className={styles.kicker}>MIT 授權 · 開源 · pygame + YAML</p>
        <h1 className={styles.title}>World Gal-Game</h1>
        <p className={styles.pitch}>讓 AI 一起參與製作的 Gal-Game 引擎</p>
        <p className={styles.pitchEn}>The Gal-Game engine where AI is a first-class developer.</p>

        <nav className={styles.choices} aria-label="開始">
          <Link className={styles.choice} to="/docs/getting-started">
            <span className={styles.choiceMark} aria-hidden="true" />
            <span className={styles.choiceMain}>開始使用</span>
            <span className={styles.choiceSub}>Getting started</span>
          </Link>
          <Link className={styles.choice} to="/docs/ai-developer-guide">
            <span className={styles.choiceMark} aria-hidden="true" />
            <span className={styles.choiceMain}>AI 開發指南</span>
            <span className={styles.choiceSub}>AI developer guide</span>
          </Link>
          <Link className={styles.choice} href={GITHUB}>
            <span className={styles.choiceMark} aria-hidden="true" />
            <span className={styles.choiceMain}>GitHub</span>
            <span className={styles.choiceSub}>Source, issues</span>
          </Link>
        </nav>

        <DialogueBox />
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Small building blocks                                                */
/* ------------------------------------------------------------------ */

function Section({id, title, en, children, tone}) {
  return (
    <section id={id} className={`${styles.section} ${tone === 'alt' ? styles.sectionAlt : ''}`}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <h2 className={styles.h2}>{title}</h2>
          <p className={styles.h2En}>{en}</p>
        </div>
        {children}
      </div>
    </section>
  );
}

function CodeBox({title, lang, code, children}) {
  return (
    <figure className={styles.code}>
      {title && <figcaption className={styles.codeTitle}>{title}</figcaption>}
      {children ? (
        <pre className={styles.pre}>
          <code>{children}</code>
        </pre>
      ) : lang === 'bash' ? (
        <pre className={styles.pre}>
          <code>
            {code.split('\n').map((l, i) => (
              <ShellLine key={i} line={l} />
            ))}
          </code>
        </pre>
      ) : (
        <Highlight theme={themes.nightOwl} code={code} language={lang}>
          {({tokens, getLineProps, getTokenProps}) => (
            <pre className={styles.pre}>
              <code>
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({line})} style={undefined}>
                    {line.map((token, k) => (
                      <span key={k} {...getTokenProps({token})} />
                    ))}
                  </div>
                ))}
              </code>
            </pre>
          )}
        </Highlight>
      )}
    </figure>
  );
}

function ShellLine({line}) {
  const hash = line.indexOf(' #');
  const cmd = hash >= 0 ? line.slice(0, hash) : line;
  const comment = hash >= 0 ? line.slice(hash) : '';
  if (line.trim().startsWith('#')) return <div className={styles.tCom}>{line}</div>;
  return (
    <div>
      {cmd}
      {comment && <span className={styles.tCom}>{comment}</span>}
    </div>
  );
}

/* tiny JSON colouriser for the NDJSON exchange */
function Json({text}) {
  const parts = text.split(/("(?:[^"\\]|\\.)*"\s*:?|\btrue\b|\bfalse\b|\bnull\b|-?\d+(?:\.\d+)?)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (i % 2 === 0) return p;
        if (/^".*"\s*:$/.test(p)) return <span key={i} className={styles.jKey}>{p}</span>;
        if (p.startsWith('"')) return <span key={i} className={styles.jStr}>{p}</span>;
        return <span key={i} className={styles.jNum}>{p}</span>;
      })}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Pillars                                                              */
/* ------------------------------------------------------------------ */

const DECORATORS = [
  '@effect', '@condition', '@hook', '@inspect_field', '@widget',
  '@scene', '@brain', '@dialogue_op', '@portrait_backend', '@ambient_backend',
];

function Pillars() {
  return (
    <Section id="pillars" title="三條支柱" en="Three pillars">
      <div className={styles.pillars}>
        <article className={styles.pillar}>
          <div className={styles.pillarLetter} aria-hidden="true">A</div>
          <h3 className={styles.h3}>人類用 YAML 寫遊戲</h3>
          <p className={styles.sub}>Humans author packs</p>
          <p>
            角色、場景、地點、物品、好感度與成就全是宣告式 YAML；99% 的遊戲開發不必碰一行 Python。
            一行指令產生 pack 骨架，再用 <code>validate</code> 與 effect / condition 參考查驗。
          </p>
          <Link to="/docs/pack-format">pack 格式</Link>
        </article>
        <article className={styles.pillar}>
          <div className={styles.pillarLetter} aria-hidden="true">B</div>
          <h3 className={styles.h3}>AI 開發遊戲</h3>
          <p className={styles.sub}>AI develops games</p>
          <p>
            無視窗遊玩、檢視 pack 結構、結構化編輯、自我驗證。常駐的 NDJSON session 載入一次、串流多個操作；
            另有世界模型：變數宣告、資料流分析、目標導向 planner 與覆蓋率追蹤。
          </p>
          <Link to="/docs/ai-native-contract">AI-Coding-Native 契約</Link>
        </article>
        <article className={styles.pillar}>
          <div className={styles.pillarLetter} aria-hidden="true">C</div>
          <h3 className={styles.h3}>外掛擴充引擎</h3>
          <p className={styles.sub}>Plugins extend the engine</p>
          <p>
            新主題（恐怖、戀愛、養成）走外掛，不改核心。十種裝飾器註冊擴充點，
            失敗的 handler 會被隔離，不會拖垮引擎。
          </p>
          <ul className={styles.chips} aria-label="十種外掛擴充點">
            {DECORATORS.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <Link to="/docs/plugins">寫一個外掛</Link>
        </article>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* AI dev loop                                                          */
/* ------------------------------------------------------------------ */

const STAGES = [
  {
    name: '理解',
    en: 'Understand',
    cmds: ['brief', 'card --symbol <id>', 'impact --symbol <id>', 'inspect-pack --dataflow'],
    note: '最省 token 的定向：場景鄰接、結局可達性、變數、缺口，再縮放到單一符號。',
  },
  {
    name: '編輯',
    en: 'Edit',
    cmds: ['edit.add_scene', 'edit.add_choice', 'edit.update_line', 'begin / commit / rollback'],
    note: '在常駐 session 內保留註解地改 YAML，回應同時附上 diff 與 impact 差異。',
  },
  {
    name: '驗證',
    en: 'Verify',
    cmds: ['self-check', 'smoke', 'contract', 'production-check'],
    note: '七階段自檢、通關腳本、敘事契約，到 fail-closed 的來源釋出前檢查。',
  },
];

function Loop() {
  return (
    <Section id="loop" title="AI 開發迴圈" en="Understand, edit, verify - in one warm process" tone="alt">
      <ol className={styles.stages}>
        {STAGES.map((s, i) => (
          <li key={s.name} className={styles.stage}>
            <div className={styles.stageHead}>
              <span className={styles.stageName}>{s.name}</span>
              <span className={styles.stageEn}>{s.en}</span>
            </div>
            <p className={styles.stageNote}>{s.note}</p>
            <ul className={styles.cmds}>
              {s.cmds.map((c) => (
                <li key={c}>
                  <code>{c}</code>
                </li>
              ))}
            </ul>
            {i < STAGES.length - 1 && (
              <svg className={styles.stageArrow} viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                <path d="M3 12h16M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </li>
        ))}
      </ol>

      <div className={styles.loopCols}>
        <div>
          <h3 className={styles.h3}>一個回合：編輯之後立刻知道後果</h3>
          <p>
            <code>edit.*</code> 操作回傳 YAML diff，以及這次編輯對世界模型造成的 <code>impact</code>
            ：新的死路、到不了的結局、用了卻未宣告的 flag。不必另跑 <code>self-check</code>，也不必重啟程序。
          </p>
          <p>
            批次加上 <code>"atomic": true</code> 時，狀態與編輯要嘛全部生效、要嘛全部捨棄。
            snapshot / restore 讓 AI 能探索分支再退回，玩家的回溯（Backspace）用的是同一套機制。
          </p>
          <p>
            <Link to="/docs/session-protocol">NDJSON session 協定</Link>
            {' · '}
            <Link to="/docs/ai-native-world-model">AI 原生世界模型</Link>
          </p>
        </div>
        <CodeBox title="world-gal-game session --pack demo_pack">
          <div className={styles.tCom}># 一行一個 JSON；回應帶 seq 與 ok</div>
          <div>
            <span className={styles.tReq}>{'→ '}</span>
            <Json text={'{"op":"edit.add_scene","scene":{"id":"lake_night","title":"…","lines":[…]}}'} />
          </div>
          <div>
            <span className={styles.tRes}>{'← '}</span>
            <Json text={'{"ok":true,"seq":1,"result":{"op":"edit.add_scene","ok":true,"changed":true,'} />
          </div>
          <div className={styles.indent}>
            <Json text={'"impact":{"clean":false,"scenes_added":["lake_night"],'} />
          </div>
          <div className={styles.indent}>
            <Json text={'"regressions":[{"kind":"orphan_scenes","items":["lake_night"]}]}}}'} />
          </div>
          <div className={styles.tCom}># 把新場景接進劇情，再 reload 就能實際遊玩</div>
          <div>
            <span className={styles.tReq}>{'→ '}</span>
            <Json text={'{"op":"edit.add_choice","scene_id":"…","choice":{…}}'} />
          </div>
          <div>
            <span className={styles.tReq}>{'→ '}</span>
            <Json text={'{"op":"__reload__"}'} />
          </div>
        </CodeBox>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Packs                                                                */
/* ------------------------------------------------------------------ */

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
        next_scene: coffee_talk`;

function Packs() {
  return (
    <Section id="packs" title="引擎不是遊戲" en="The engine is not a game - games are packs">
      <div className={styles.packCols}>
        <div>
          <p className={styles.lead}>
            引擎本身不帶任何遊戲邏輯。一款遊戲就是一個獨立的內容包（pack），
            與引擎分開發佈，從下列任一處載入：
          </p>
          <ul className={styles.paths}>
            <li><code>games/&lt;pack&gt;/</code><span>隨引擎發佈的內建 pack，<code>demo_pack</code> 在這裡</span></li>
            <li><code>../&lt;pack&gt;/</code><span>引擎旁邊的兄弟資料夾，適合有自己 git 倉的遊戲</span></li>
            <li><code>~/.world-gal-game/packs/&lt;pack&gt;/</code><span>使用者本機的 pack</span></li>
            <li><code>--pack &lt;path&gt;</code><span>命令列直接指定任意路徑</span></li>
          </ul>
          <p>
            pack 內的資源路徑一律是 <code>assets/...</code>（相對於 pack），所以整個目錄可以原封不動搬到別的 repo。
            內附的 <code>demo_pack</code> 約 5 至 10 分鐘可玩完，涵蓋對話、任務、商店、物品、好感度與成就。
          </p>
          <p><Link to="/docs/tutorial-build-a-game">跟著教學從零做出 demo_pack</Link></p>
        </div>
        <CodeBox title="content/scenes/*.yaml" lang="yaml" code={SCENE_YAML} />
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Features + distribution                                              */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    group: '對話演出',
    en: 'Presentation',
    items: [
      ['Auto / Skip', '自動播放與按住快進，遇到選項一定停'],
      ['NVL 模式', '全螢幕文字頁，與 ADV 對話框並存'],
      ['富文字', '顏色、粗體、大小、停頓、速度、注音與逐字特效'],
      ['角色語音', '逐句語音，缺檔時安靜略過'],
      ['動態立繪', 'breath 呼吸、sprite 逐格、layered 眨眼與嘴型疊層'],
    ],
  },
  {
    group: '回顧與重溫',
    en: 'Replay',
    items: [
      ['回溯', 'Backspace 退回上一句，與 AI 探索分支共用快照機制'],
      ['對話記錄', '滾輪或 B 鍵回看所有對白'],
      ['場景重溫、CG 鑑賞、音樂室', '解鎖後可隨時重看'],
      ['結局與完成度', '結局收集與完成度統計'],
      ['快速存檔、自動存檔', '多存檔槽，並可精確續讀'],
    ],
  },
  {
    group: '世界與關係',
    en: 'World',
    items: [
      ['多軸好感度', '每位角色可同時追蹤多個數值，跨門檻自動解鎖內容'],
      ['地圖與時段', '地點、時段切換、NPC 出沒時間表與目的地挑選'],
      ['任務、物品、商店', '送禮依角色喜好計算，資源可自訂'],
      ['成就', '宣告式條件，含隱藏成就'],
      ['篇章', '可選的章節 / 路線結構疊層'],
    ],
  },
  {
    group: '在地化與無障礙',
    en: 'Reach',
    items: [
      ['執行期多語系', 'pack 自帶語言目錄與每語言字型'],
      ['主題', 'pack 可覆寫整套配色與介面文案'],
      ['減少動態', 'reduce_motion 讓轉場與特效退化為最多 0.12 秒'],
      ['觸控', 'touch_mode 提供手指友善的介面與尺寸'],
    ],
  },
];

const TARGETS = [
  {name: '桌面', en: 'Desktop', body: 'PyInstaller 把引擎與 pack 打成不需安裝 Python 的資料夾。', cmd: 'world-gal-game build <pack>'},
  {name: '網頁', en: 'Web', body: '經 pygbag 編譯成 WASM，在瀏覽器裡執行，存檔寫入 IndexedDB。', cmd: 'uv sync --extra web'},
  {name: 'Steam', en: 'Steam', body: '桌面整合：成就與雲端存檔；沒有 Steam 時優雅降級。', cmd: 'docs/distribution-steam'},
  {name: 'Android / PWA', en: 'Mobile', body: 'Android 為 pygbag APK 或 PWA；iOS 僅 PWA（加到主畫面）。', cmd: 'docs/distribution-mobile'},
];

function Features() {
  return (
    <Section id="features" title="Gal-Game 該有的都有" en="Genre features, built in" tone="alt">
      <div className={styles.featureGrid}>
        {FEATURES.map((g) => (
          <div key={g.group} className={styles.featureGroup}>
            <h3 className={styles.h3}>
              {g.group} <span className={styles.h3En}>{g.en}</span>
            </h3>
            <dl>
              {g.items.map(([k, v]) => (
                <div key={k} className={styles.featureItem}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      <h3 className={`${styles.h3} ${styles.targetsHead}`}>
        一份 pack，四種去處 <span className={styles.h3En}>Ship it anywhere</span>
      </h3>
      <ul className={styles.targets}>
        {TARGETS.map((t) => (
          <li key={t.name} className={styles.target}>
            <div className={styles.targetName}>
              {t.name} <span className={styles.h3En}>{t.en}</span>
            </div>
            <p>{t.body}</p>
            <code>{t.cmd}</code>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Quickstart + closing                                                 */
/* ------------------------------------------------------------------ */

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
uv run world-gal-game brief games/my_game`;

function Quickstart() {
  const logo = useBaseUrl('/img/logo.svg');
  return (
    <Section id="quickstart" title="三分鐘上手" en="Quickstart">
      <div className={styles.quickCols}>
        <div>
          <p className={styles.lead}>需要 Python 3.10 以上與 uv。從原始碼安裝後，就能跑 demo、產生自己的 pack。</p>
          <ul className={styles.nextLinks}>
            <li><Link to="/docs/getting-started">入門：安裝與第一個 pack</Link></li>
            <li><Link to="/docs/tutorial-build-a-game">教學：從零做出一款遊戲</Link></li>
            <li><Link to="/docs/ai-developer-guide">AI 開發指南：讓 agent 上手</Link></li>
            <li><Link to="/docs/distribution">發佈：桌面、網頁、Steam、行動裝置</Link></li>
          </ul>
          <img className={styles.markImg} src={logo} alt="" width="56" height="56" />
        </div>
        <CodeBox title="shell" lang="bash" code={QUICKSTART} />
      </div>
    </Section>
  );
}

export default function Home() {
  return (
    <Layout
      title="World Gal-Game"
      description="讓 AI 一起參與製作的 Gal-Game 引擎。人類用 YAML 寫遊戲，AI 以無視窗方式遊玩、檢視、編輯與驗證，外掛擴充引擎。">
      <div className={styles.page}>
        <Hero />
        <main>
          <Pillars />
          <Loop />
          <Packs />
          <Features />
          <Quickstart />
        </main>
      </div>
    </Layout>
  );
}
