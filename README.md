# World Gal-Game Web

World Gal-Game 引擎的官方網站與文件站（Docusaurus 3）。
引擎本體在 [treeleaves30760/world-gal-game](https://github.com/treeleaves30760/world-gal-game)。

*English: the public website and documentation site for the World Gal-Game engine. The landing page lives in `src/pages/`; the docs are synced from the engine repo at build time.*

## 文件如何同步

引擎 repo 的 `docs/*.md`（加上 `ROADMAP.md`，輸出為 `roadmap`）是唯一的內容來源。
`scripts/sync-docs.mjs` 會把它們複製到本 repo 的 `docs/`（已加入 `.gitignore`，不進版控），並且：

- 把 `docs/README.md` 注入 `slug: /`，成為 `/docs` 首頁；
- 把指向 docs 之外的相對連結（`../ROADMAP.md`、`../world_gal_game/...` 等）改寫成 GitHub 絕對網址；
- `sidebars.js` 在載入時讀取 `docs/`：清單中缺少的 id 會略過，沒列入的新文件自動放進「其他 More」。

`ENGINE_DIR` 預設為 `../World-Gal-Game`，可用環境變數覆寫。

*English: `npm run sync-docs` copies the engine docs into `docs/` (git-ignored) and rewrites out-of-docs links to absolute GitHub URLs. Set `ENGINE_DIR` to point at a checkout.*

## 本機開發

```bash
npm install
npm start          # 先同步文件，再啟動開發伺服器
npm run build      # 輸出到 build/
npm run serve      # 預覽 build/
# 指定引擎位置：
ENGINE_DIR=/path/to/World-Gal-Game npm run build
```

`SITE_URL` 與 `BASE_URL` 可覆寫網址（預設 `https://treeleaves30760.github.io` 與 `/World-Gal-Game-Web/`）。

## 部署

`.github/workflows/deploy.yml` 會在 push 到 `main`、手動觸發、每日排程，以及收到
`repository_dispatch`（type `docs-updated`）時執行：checkout 本 repo 與引擎 repo（到 `engine/`）、
`ENGINE_DIR=engine npm run build`，再發佈到 GitHub Pages。

一次性設定：repo 的 Settings → Pages → Source 選「GitHub Actions」。
若要讓引擎 repo 的文件更新立即觸發，在引擎 repo 的 workflow 內呼叫：

```bash
gh api repos/<owner>/World-Gal-Game-Web/dispatches -f event_type=docs-updated
```

## 授權

MIT，見 [LICENSE](LICENSE)。
