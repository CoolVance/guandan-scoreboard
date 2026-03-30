# 掼蛋記分板

<div align="center">

[ English ](https://github.com/CoolVance/guandan-scoreboard/blob/main/README_en.md) | [ 简体中文 ](https://github.com/CoolVance/guandan-scoreboard/blob/main/README.md) | [ **繁體中文** ]

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

本項目支持通過 Docker 進行快速部署，特別適合在個人伺服器、NAS 或局域網環境運行。

1.  **最快部署 (Docker Hub)**
    如果您不想下載源碼，只需一行命令即可啟動：
    ```bash
    docker run -d -p 8080:80 --name guandan-scoreboard coolvance/guandan-scoreboard:latest
    ```

2.  **本地構建並運行 (推薦開發者使用)**
    如果您修改了代碼並想在本地構建自己的鏡像，請運行：
    ```bash
    # 構建鏡像
    docker build -t guandan-scoreboard:local .

    # 運行容器
    docker run -d -p 8080:80 --name guandan-scoreboard-local guandan-scoreboard:local

    # 導出鏡像包 (用於離線部署)
    docker save guandan-scoreboard:local > guandan-scoreboard-v1.0.3.tar
    ```

3.  **使用 Docker Compose (推薦)**
    下載 `docker-compose.yml` 文件後運行：
    ```bash
    docker-compose up -d
    ```
    *註：項目已配置為優先拉取遠程鏡像。如果您是開發者並修改了代碼，請使用 `docker-compose up -d --build` 強制重新構建本地鏡像。*

3.  **內網離線部署 (使用 .tar 鏡像包)**
    如果在無網路環境下，請先導入 Release 中提供的 `.tar` 鏡像文件：
    ```bash
    docker load -i guandan-scoreboard-v1.0.tar
    docker-compose up -d
    ```

4.  **NAS (如群暉) 部署建議**
    -   **方式 A**：在 Container Manager (原 Docker) 的「註冊表」中搜索 `coolvance/guandan-scoreboard` 並直接下載運行。
    -   **方式 B**：導入 `docker-compose.yml` 後一鍵啟動，它會自動從 Docker Hub 拉取最新鏡像。



### 🤝 參與貢獻

歡迎貢獻代碼！請隨時提交 Pull Request。

1.  Fork 本項目
2.  創建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3.  提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4.  推送到分支 (`git push origin feature/AmazingFeature`)
5.  提交 Pull Request

### 📄 許可證

本項目基於 MIT 許可證分發。詳情請參閱 `LICENSE` 文件。
