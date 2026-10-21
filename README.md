# World Gal-Game Web

World Gal-Game 引擎的官方網站與文件站，使用 **VitePress（Vue 3）** 建置，網址
<https://world-gal-game.夜橘.com/>（punycode：`world-gal-game.xn--essy41b.com`）。
引擎本體在 [treeleaves30760/world-gal-game](https://github.com/treeleaves30760/world-gal-game)。

*English: the public website and docs for the World Gal-Game engine, built with VitePress (Vue 3). The landing page is a set of Vue components in `.vitepress/theme/components/`; the docs are synced from the engine repo at build time.*

## 結構

- `index.md` + `.vitepress/theme/components/*.vue`：首頁（Hero、DialogueBox、Pillars、DevLoop、Packs、Features、Quickstart）
- `.vitepress/theme/`：擴充預設主題，夜靛色 token（亮 / 暗）
- `.vitepress/config.mts`、`sidebar.mts`、`markdown-safety.mts`：設定、側欄、Markdown 安全處理
- `scripts/sync-docs.mjs`：同步引擎文件
- `public/`：`CNAME`、favicon、logo、social card（SVG 與 1200x630 PNG）

## 文件如何同步

引擎 repo 的 `docs/*.md`（加上 `ROADMAP.md`，輸出為 `roadmap.md`）是唯一的內容來源。
`scripts/sync-docs.mjs` 會複製到本 repo 的 `docs/`（已加入 `.gitignore`），並且：

- 把 `README.md` 改名為 `index.md`，成為 `/docs/` 首頁；
- 把指向 docs 之外的相對連結改寫成 GitHub 絕對網址，docs 之間的 `.md` 連結維持相對；
- 側欄在載入設定時讀取 `docs/`：清單中缺少的檔案略過，沒列入的新文件放進「其他 More」，標題取自各文件第一個 `# `。

引擎文件是純 CommonMark，會含有 `<pack>`、`{{ }}` 這類字面文字；`markdown-safety.mts` 會在 Vue 編譯前把非真實 HTML 標籤跳脫、把 `{{` 轉成實體，因此不必改動引擎文件。

`ENGINE_DIR` 預設為 `../World-Gal-Game`，可用環境變數覆寫。

## 本機開發

```bash
npm install
npm run dev        # 先同步文件，再啟動開發伺服器
npm run build      # 輸出到 .vitepress/dist
npm run preview    # 預覽建置結果
ENGINE_DIR=/path/to/World-Gal-Game npm run build
```

`BASE_URL`（預設 `/`）與 `SITE_URL`（預設 `https://world-gal-game.xn--essy41b.com`）可覆寫。

## 部署

`.github/workflows/deploy.yml` 只在下列情況執行：本 repo 推送 `v*` tag、收到 `repository_dispatch`
（type `docs-updated`，可帶 `client_payload.ref` 指定引擎分支或 tag）、手動觸發。

```bash
git tag v0.1.0 && git push --tags      # 在本 repo 發佈
```

在引擎 repo 推 tag 時，由引擎的 workflow 呼叫
`gh api repos/<owner>/World-Gal-Game-Web/dispatches -f event_type=docs-updated` 即可觸發。

一次性設定：Settings → Pages → Source 選「GitHub Actions」，Custom domain 填
`world-gal-game.夜橘.com`（`public/CNAME` 已包含 punycode 網域）。

### 自訂網域與 DNS

在 Cloudflare 新增 CNAME：`world-gal-game` → `treeleaves30760.github.io`，
Proxy 狀態選 **DNS only（灰雲）**，至少等到 GitHub 簽發憑證並勾選 Enforce HTTPS 之後再考慮開橘雲。

## 授權

MIT，見 [LICENSE](LICENSE)。

*English: deploys run only on `v*` tags, `docs-updated` dispatches and manual runs. DNS: Cloudflare CNAME `world-gal-game` to `treeleaves30760.github.io`, DNS only (grey cloud) at least until GitHub issues the certificate.*
