# 掼蛋記分板 (Guandan Scoreboard)

<div align="center">

[ English ](README_en.md) | [ 简体中文 ](README.md) | [ **繁體中文** ]

</div>

**讓記分變得輕鬆，讓比賽更純粹。** 這是一個專門為“掼蛋”撲克遊戲設計的數字記分工具。告別紙筆，專注於每一局的博弈！

---

### 📱 立即使用 (Live Demo)

- **Cloudflare (推薦 - 極速訪問)**: [**https://guandan-scoreboard.inin.workers.dev/**](https://guandan-scoreboard.inin.workers.dev/)
- **GitHub Pages**: [https://coolvance.github.io/guandan-scoreboard/](https://coolvance.github.io/guandan-scoreboard/)
- **Vercel**: [https://guandan-scoreboard.vercel.app/](https://guandan-scoreboard.vercel.app/)

---

### ✨ 為什麼選擇這個工具？

- **專為移動端設計**：在手機瀏覽器上體驗如原生 App 般流暢，支持“添加到主螢幕”離線使用 (PWA)。
- **聰明的手勢操作**：不用到處找按鈕，上下滑動即可調整級別和局數，直觀得像撥動物理輪盤。
- **貼心的防誤觸鎖定**：點擊“鎖”圖標進入鎖定狀態。想要解鎖？只需長按 1 秒，會有炫酷的進度圈提醒你，再也不怕手滑點錯。
- **靈活的計分模式**：
  - **自動模式**：只需告訴系統誰贏了（獨贏或結對贏），它會自動幫你算好所有人的分數。
  - **自由模式**：如果你想手動微調，支持四人填分，系統會自動幫你校驗總和是否平衡。
- **視角隨心換**：支持全屏、僅頂部或僅底部顯示。無論你喜歡看全景還是只關心當前比分，一鍵即達。
- **數據不丟失**：所有數據都保存在你的手機本地，刷新或關閉頁面後再打開，之前的分數還在。

---

### 🐳 玩家自建 (Self-Hosting / NAS)

如果你想在自己的服務器、群暉 NAS 或局域網內運行，我們提供了極其簡單的部署方式：

**1. 最簡單：使用 Docker 一鍵運行**
只需在終端執行一行命令：
```bash
docker run -d -p 8080:80 --name guandan-scoreboard coolvance/guandan-scoreboard:latest
```
然後在瀏覽器訪問 `http://你的IP:8080` 即可。

**2. 使用 Docker Compose**
下載 `docker-compose.yml` 後運行：
```bash
docker-compose up -d
```

---

### 🛠️ 技術細節 (For Developers)

- **框架**: React 18 + Vite + TypeScript
- **樣式**: TailwindCSS
- **圖標**: Lucide React
- **部署**: 支持 Docker, Nginx, Vercel, Cloudflare Pages

想要深入了解業務邏輯和計分規則？請查看 [FUNCTIONAL_SPEC.md](FUNCTIONAL_SPEC.md)。

---

### 🤝 參與項目

歡迎提交問題 (Issue) 或合併請求 (Pull Request)。

本項目採用 MIT 許可證。
