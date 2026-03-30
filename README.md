# 掼蛋记分板

<div align="center">

[ English ](./README_en.md) | [ **简体中文** ] | [ 繁體中文 ](./README_zh-TW.md)

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
- **灵活计分**：
  - **自动模式**：支持“独赢”和“结对赢”，自动计算得分与摊派。
  - **自由模式**：支持四位玩家手动填分，具备总和为零的实时校验与确认机制。
- **高效录分**：数值输入框集成 `±1` 步进按钮，微调分数更快捷。
- **手势操作**：上下滑动即可快速调整级别和局数。
- **个性化界面**：
  - **沉浸模式**：支持隐藏/显示顶部级别和局数控件，获取更纯粹的计分视野。
  - **智能悬浮球**：集成锁定、显隐、语言等核心入口，支持自动吸附。
  - **锁定模式**：支持防误触锁定。解锁需**长按 1 秒**，伴有环绕按钮的**白色进度圈**动效，防止比赛中误操作。
  - **快捷操作**：快速切换语言、重置级别或重看教程。
  - **物理质感动效**：
  - **弹跳反馈**：顶部级别和局数控件在数值改变时触发“按下并回弹”的缩放动效，提供明确的操作反馈。
  - **视觉优化**：悬浮按钮增加白色边框，提升在各种背景下的辨识度。
  - **详尽文档**：根目录提供 `FUNCTIONAL_SPEC.md`，详尽描述了所有业务逻辑与计分规则，为重构提供参考。
  - **历史记录**：详细的得分历史记录，支持队伍颜色区分和不同赢法的视觉样式。

- **交互式教程**：为首次使用的用户提供引导式教程，快速上手所有功能。
- **多语言支持**：完美支持简体中文、繁体中文和英语。
- **响应式设计**：专为移动设备（iPhone, Android）优化，同时也完美适配桌面浏览器。
- **离线 PWA 支持**：支持安装到主屏幕，在无网络环境下仍能正常使用所有核心计分功能。

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

### 🐳 Docker 部署

本项目支持通过 Docker 进行快速部署，特别适合在个人服务器、NAS 或局域网环境运行。

1.  **最快部署 (Docker Hub)**
    如果您不想下载源码，只需一行命令即可启动：
    ```bash
    docker run -d -p 8080:80 --name guandan-scoreboard coolvance/guandan-scoreboard:latest
    ```

2.  **使用 Docker Compose (推荐)**
    下载 `docker-compose.yml` 文件后运行：
    ```bash
    docker-compose up -d
    ```
    *注：项目已配置为优先拉取远程镜像。如果您是开发者并修改了代码，请使用 `docker-compose up -d --build` 强制重新构建本地镜像。*

3.  **内网离线部署 (使用 .tar 镜像包)**
    如果在无网络环境下，请先导入 Release 中提供的 `.tar` 镜像文件：
    ```bash
    docker load -i guandan-scoreboard-v1.0.tar
    docker-compose up -d
    ```

4.  **NAS (如群晖) 部署建议**
    -   **方式 A**：在 Container Manager (原 Docker) 的“注册表”中搜索 `coolvance/guandan-scoreboard` 并直接下载运行。
    -   **方式 B**：导入 `docker-compose.yml` 后一键启动，它会自动从 Docker Hub 拉取最新镜像。


### 🤝 参与贡献

欢迎贡献代码！请随时提交 Pull Request。

1.  Fork 本项目
2.  创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3.  提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4.  推送到分支 (`git push origin feature/AmazingFeature`)
5.  提交 Pull Request

### 📄 许可证

本项目基于 MIT 许可证分发。详情请参阅 `LICENSE` 文件。
