# Reading Notes

這是一個以 React + Vite + Firebase 建置的閱讀紀錄系統，支援 Google 登入、借閱紀錄管理與 Gemini 分類。

## 技術棧

- React 19
- Vite 6
- TypeScript
- Firebase (Auth + Firestore)
- Gemini API (`@google/genai`)

## 本機開發

### 1. 前置需求

- Node.js 20+
- npm 10+

### 2. 安裝依賴

```bash
npm install
```

### 3. 設定環境變數

可參考 [.env.example](.env.example)：

```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

### 4. 啟動開發環境

```bash
npm run dev
```

預設會啟動在 `http://localhost:3000`。

## 建置與檢查

```bash
npm run check
```

此指令會依序執行：

- `npm run lint` (`tsc --noEmit`)
- `npm run build` (Vite production build)

## GitHub Actions 自動部署

已新增 workflow：`.github/workflows/deploy.yml`
安全檢查 workflow：`.github/workflows/security.yml`

### 觸發條件

- push 到 `main`
- 手動執行 (`workflow_dispatch`)

### 部署目標

- GitHub Pages

### 一次性設定

1. 到 GitHub Repository -> `Settings` -> `Pages`
2. Source 選擇 `GitHub Actions`

### 必要 Secret

- `VITE_BASE_PATH=/Reading-notes/`

> GitHub Pages 為前端靜態託管，任何打包進前端的金鑰都會被公開。
> 因此部署流程**不會**注入 `GEMINI_API_KEY`，避免洩漏你的私密金鑰。

## 公開免費部署（安全模式）

此專案目前採用以下安全策略：

- 前端部署到 GitHub Pages（免費）
- 不在 CI/CD 或前端 bundle 放置私密 API key
- 使用者若要啟用 AI 自動補全，需自行在瀏覽器輸入自己的 Gemini Key（只存在該瀏覽器 localStorage）
- Firestore 由 Firebase Auth + Firestore Rules 控制資料擁有者存取

## 安全強化項目

- 新增 Dependabot：`.github/dependabot.yml`
- 新增安全掃描：`.github/workflows/security.yml`
	- CodeQL (JavaScript/TypeScript)
	- npm audit（高風險以上）
- 新增安全政策文件：`SECURITY.md`
- `index.html` 加入 CSP / referrer policy / nosniff

## 本次 package.json 調整紀錄

- `clean` 改為跨平台：`rimraf dist`
- 新增 `check` script：`npm run lint && npm run build`
- 將 build tool 依賴移至 `devDependencies`
- 新增 `rimraf`

## .gitignore 設計說明

已加入常見忽略規則，避免推送不必要檔案與敏感資訊：

- 依賴與產物：`node_modules/`, `dist/`, `build/`, `coverage/`
- 快取：`.vite/`, `*.tsbuildinfo`
- 日誌：`*.log`, `npm-debug.log*` 等
- 環境變數與隱私：`.env`, `.env.*`（保留 `.env.example`）
- Firebase 本機狀態：`.firebase/`, `firebase-debug.log`
- 編輯器暫存：`.idea/`, `.vscode/*`（保留共享設定）
