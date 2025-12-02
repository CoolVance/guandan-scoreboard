# 掼蛋記分板

<div align="center">

[ English ](./README.md) | [ 简体中文 ](./README_zh.md) | [ **繁體中文** ]

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
- **靈活計分**：支持「獨贏」和「結對贏」兩種計分模式，自動匹配隊友。
- **手勢操作**：上下滑動即可快速調整級別和局數。
- **可拖動懸浮菜單**：
  - **智能吸附**：自動吸附屏幕邊緣，並根據屏幕尺寸和方向調整位置，防止遮擋。
  - **鎖定模式**：支持長按解鎖和防誤觸鎖定，比賽過程中防止意外操作。
  - **快捷操作**：快速切換語言、重置級別或重看教程。
- **歷史記錄**：詳細的得分歷史記錄，支持隊伍顏色區分和不同贏法的視覺樣式。
- **交互式教程**：為首次使用的用戶提供引導式教程，快速上手所有功能。
- **多語言支持**：完美支持繁體中文、簡體中文和英語。
- **響應式設計**：專為移動設備（iPhone, Android）優化，同時也完美適配桌面瀏覽器。
- **PWA 就緒**：使用現代 Web 技術構建，提供類原生應用的體驗。

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

### 🤝 參與貢獻

歡迎貢獻代碼！請隨時提交 Pull Request。

1.  Fork 本項目
2.  創建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3.  提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4.  推送到分支 (`git push origin feature/AmazingFeature`)
5.  提交 Pull Request

### 📄 許可證

本項目基於 MIT 許可證分發。詳情請參閱 `LICENSE` 文件。
