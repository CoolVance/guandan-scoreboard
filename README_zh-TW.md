# 掼蛋記分板

<div align="center">

[ English ](./README_en.md) | [ 简体中文 ](./README.md) | [ **繁體中文** ]

</div>

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-%5E18.0.0-blue)
![TypeScript](https://img.shields.io/badge/typescript-%5E5.0.0-blue)
![Vite](https://img.shields.io/badge/vite-%5E5.0.0-purple)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%5E3.0.0-sky)

一個現代化的、移動端優先的記分板應用，專為掼蛋等紙牌遊戲設計。擁有精美的界面、直觀的手勢操作和全面的比分記錄功能。

---

### ✨ 功能特性

- **多玩家支持**：記錄北、南、東、西四位玩家的得分。
- **靈活計分**：
  - **自動模式**：支持「獨贏」和「結對贏」，自動計算得分與攤派。
  - **自由模式**：支持四位玩家手動填分，具備總和為零的實時校驗與確認機制。
- **高效錄分**：數值輸入框集成 `±1` 步進按鈕，微調分數更快捷。
- **手勢操作**：上下滑動即可快速調整級別和局數。
- **個性化界面**：
  - **沉浸模式**：支持隱藏/顯示頂部級別和局數控件，獲取更純粹的計分視野。
  - **智能懸浮球**：集成鎖定、顯隱、語言等核心入口，支持自動吸附。
  - **鎖定模式**：支持防誤觸鎖定。解鎖需**長按 1 秒**，伴有環繞按鈕的**白色進度圈**動效，防止比賽中誤操作。
  - **快捷操作**：快速切換語言、重置級別或重看教程。
- **物理質感動效**：
  - **彈跳回饋**：頂部級別和局數控件在數值改變時觸發「按下並回彈」的縮放動效，提供明確的操作回饋。
  - **視覺優化**：懸浮按鈕增加白色邊框，提升在各種背景下的辨識度。
- **詳盡文檔**：根目錄提供 `FUNCTIONAL_SPEC.md`，詳盡描述了所有業務邏輯與計分規則，為重構提供參考。
- **歷史記錄**：詳細的得分歷史記錄，支持隊伍顏色區分和不同贏法的視覺樣式。
- **交互式教程**：為首次使用的用戶提供引導式教程，快速上手所有功能。
- **多語言支持**：完美支持繁體中文、簡體中文和英語。
- **響應式設計**：專為移動設備（iPhone, Android）優化，同時也完美適配桌面瀏覽器。
- **離線 PWA 支持**：支持安裝到主螢幕，在無網路環境下仍能正常使用所有核心計分功能。

### 🛠️ 技術棧

- **框架**: [React 18](https://reactjs.org/)
- **構建工具**: [Vite](https://vitejs.dev/)
- **語言**: [TypeScript](https://www.typescriptlang.org/)
- **樣式**: [TailwindCSS](https://tailwindcss.com/)
- **圖標**: [Lucide React](https://lucide.dev/)

### 🚀 快速開始

1.  **克隆倉庫**
    ```bash
    git clone https://github.com/CoolVance/guandan-scoreboard.git
    cd guandan-scoreboard
    ```

2.  **安裝依賴**
    ```bash
    npm install
    ```

3.  **運行開發服務器**
    ```bash
    npm run dev
    ```

4.  **構建生產版本**
    ```bash
    npm run build
    ```

### 🐳 Docker 部署

本項目支持通過 Docker 進行快速部署，特別適合在群暉 NAS 或個人服務器上運行。

1.  **使用 Docker Compose (推薦)**
    在項目根目錄下運行：
    ```bash
    docker-compose up -d --build
    ```
    運行後可通過 `http://localhost:8080` 訪問。

2.  **直接構建鏡像**
    ```bash
    # 構建鏡像
    docker build -t guandan-scoreboard .
    # 運行容器
    docker run -d -p 8080:80 --name guandan-scoreboard guandan-scoreboard
    ```

### 🤝 參與貢獻

歡迎貢獻代碼！請隨時提交 Pull Request。

1.  Fork 本項目
2.  創建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3.  提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4.  推送到分支 (`git push origin feature/AmazingFeature`)
5.  提交 Pull Request

### 📄 許可證

本項目基於 MIT 許可證分發。詳情請參閱 `LICENSE` 文件。
