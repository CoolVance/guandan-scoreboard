# 掼蛋记分板 (Guandan Scoreboard)

<div align="center">

[ English ](README_en.md) | [ **简体中文** ] | [ 繁體中文 ](README_zh-TW.md)

</div>

**让记分变得轻松，让比赛更纯粹。** 这是一个专门为“掼蛋”扑克游戏设计的数字记分工具。告别纸笔，专注于每一局的博弈！

---

### 📱 立即使用 (Live Demo)

- **Cloudflare (推荐 - 极速访问)**: [**https://guandan-scoreboard.inin.workers.dev/**](https://guandan-scoreboard.inin.workers.dev/)
- **GitHub Pages**: [https://coolvance.github.io/guandan-scoreboard/](https://coolvance.github.io/guandan-scoreboard/)
- **Vercel**: [https://guandan-scoreboard.vercel.app/](https://guandan-scoreboard.vercel.app/)

---

### ✨ 为什么选择这个工具？

- **专为移动端设计**：在手机浏览器上体验如原生 App 般流畅，支持“添加到主屏幕”离线使用 (PWA)。
- **聪明的手势操作**：不用到处找按钮，上下滑动即可调整级别和局数，直观得像拨动物理轮盘。
- **贴心的防误触锁定**：点击“锁”图标进入锁定状态。想要解锁？只需长按 1 秒，会有炫酷的进度圈提醒你，再也不怕手滑点错。
- **灵活的计分模式**：
  - **自动模式**：只需告诉系统谁赢了（独赢或结对赢），它会自动帮你算好所有人的分数。
  - **自由模式**：如果你想手动微调，支持四人填分，系统会自动帮你校验总和是否平衡。
- **视角随心换**：支持全屏、仅顶部或仅底部显示。无论你喜欢看全景还是只关心当前比分，一键即达。
- **数据不丢失**：所有数据都保存在你的手机本地，刷新或关闭页面后再打开，之前的分数还在。

---

### 🐳 玩家自建 (Self-Hosting / NAS)

如果你想在自己的服务器、群晖 NAS 或局域网内运行，我们提供了极其简单的部署方式：

**1. 最简单：使用 Docker 一键运行**
只需在终端执行一行命令：
```bash
docker run -d -p 8080:80 --name guandan-scoreboard coolvance/guandan-scoreboard:latest
```
然后在浏览器访问 `http://你的IP:8080` 即可。

**2. 使用 Docker Compose**
下载 `docker-compose.yml` 后运行：
```bash
docker-compose up -d
```

---

### 🛠️ 技术细节 (For Developers)

- **框架**: React 18 + Vite + TypeScript
- **样式**: TailwindCSS
- **图标**: Lucide React
- **部署**: 支持 Docker, Nginx, Vercel, Cloudflare Pages

想要深入了解业务逻辑和计分规则？请查看 [FUNCTIONAL_SPEC.md](FUNCTIONAL_SPEC.md)。

---

### 🤝 参与项目

欢迎提交问题 (Issue) 或合并请求 (Pull Request)。

本项目采用 MIT 许可证。
