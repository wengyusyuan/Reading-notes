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

### 觸發條件

- push 到 `main`
- 手動執行 (`workflow_dispatch`)

### 部署目標

- GitHub Pages

### 一次性設定

1. 到 GitHub Repository -> `Settings` -> `Pages`
2. Source 選擇 `GitHub Actions`

### 必要 Secret

請到 `Settings` -> `Secrets and variables` -> `Actions` 新增：

- `GEMINI_API_KEY`

Workflow 在 build 階段會注入：

- `VITE_BASE_PATH=/Reading-notes/`
- `GEMINI_API_KEY=${{ secrets.GEMINI_API_KEY }}`

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
