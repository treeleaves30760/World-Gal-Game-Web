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
- `public/`：favicon、logo、social card（SVG 與 1200x630 PNG）

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

網站部署在 Cloudflare Workers（static assets），設定見 `wrangler.jsonc`，網域
`world-gal-game.夜橘.com`（punycode `world-gal-game.xn--essy41b.com`）由 wrangler
以 custom domain 綁定並自動建立 DNS 紀錄。

本機直接部署（需先 `npx wrangler login`）：

```bash
npm run deploy        # = npm run build && wrangler deploy
```

CI（`.github/workflows/deploy.yml`）只在下列情況執行：本 repo 推送 `v*` tag、
收到 `repository_dispatch`（type `docs-updated`，`client_payload.ref` 指定引擎的
tag）、手動觸發。引擎 repo 推 `v*` tag 時，其 `notify-website.yml` 會自動發送 dispatch。

```bash
git tag v0.1.1 && git push --tags      # 在本 repo 發佈
```

一次性設定：repo secrets 需要 `CLOUDFLARE_ACCOUNT_ID` 與 `CLOUDFLARE_API_TOKEN`
（權限：Account › Workers Scripts: Edit、Zone › Workers Routes: Edit）。

## 授權

MIT，見 [LICENSE](LICENSE)。

*English: deployed to Cloudflare Workers static assets with `wrangler deploy` (`npm run deploy`). CI deploys only on `v*` tags, `docs-updated` dispatches from the engine repo, and manual runs; it needs the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets.*
