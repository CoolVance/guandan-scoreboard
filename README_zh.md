# 掼蛋记分板

<div align="center">

[ English ](./README.md) | [ **简体中文** ] | [ 繁體中文 ](./README_zh-TW.md)

</div>

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-%5E18.0.0-blue)
![TypeScript](https://img.shields.io/badge/typescript-%5E5.0.0-blue)
![Vite](https://img.shields.io/badge/vite-%5E5.0.0-purple)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%5E3.0.0-sky)

一个现代化的、移动端优先的记分板应用，专为掼蛋等纸牌游戏设计。拥有精美的界面、直观的手势操作和全面的比分记录功能。

---

### ✨ 功能特性

- **多玩家支持**：记录北、南、东、西四位玩家的得分。
- **灵活计分**：支持“独赢”和“结对赢”两种计分模式，自动匹配队友。
- **手势操作**：上下滑动即可快速调整级别和局数。
- **可拖动悬浮菜单**：
  - **智能吸附**：自动吸附屏幕边缘，并根据屏幕尺寸和方向调整位置，防止遮挡。
  - **锁定模式**：支持长按解锁和防误触锁定，比赛过程中防止意外操作。
  - **快捷操作**：快速切换语言、重置级别或重看教程。
- **历史记录**：详细的得分历史记录，支持队伍颜色区分和不同赢法的视觉样式。
- **交互式教程**：为首次使用的用户提供引导式教程，快速上手所有功能。
- **多语言支持**：完美支持简体中文、繁体中文和英语。
- **响应式设计**：专为移动设备（iPhone, Android）优化，同时也完美适配桌面浏览器。
- **PWA 就绪**：使用现代 Web 技术构建，提供类原生应用的体验。

### 🛠️ 技术栈

- **框架**: [React 18](https://reactjs.org/)
- **构建工具**: [Vite](https://vitejs.dev/)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **样式**: [TailwindCSS](https://tailwindcss.com/)
- **图标**: [Lucide React](https://lucide.dev/)

### 🚀 快速开始

1.  **克隆仓库**
    ```bash
    git clone https://github.com/CoolVance/guandan-scoreboard.git
    cd guandan-scoreboard
    ```

2.  **安装依赖**
    ```bash
    npm install
    ```

3.  **运行开发服务器**
    ```bash
    npm run dev
    ```

4.  **构建生产版本**
    ```bash
    npm run build
    ```

### 🤝 参与贡献

欢迎贡献代码！请随时提交 Pull Request。

1.  Fork 本项目
2.  创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3.  提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4.  推送到分支 (`git push origin feature/AmazingFeature`)
5.  提交 Pull Request

### 📄 许可证

本项目基于 MIT 许可证分发。详情请参阅 `LICENSE` 文件。
