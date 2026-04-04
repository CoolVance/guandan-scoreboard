# Guandan Scoreboard

<div align="center">

[ **English** ] | [ 简体中文 ](README.md) | [ 繁體中文 ](README_zh-TW.md)

</div>

**Make scorekeeping effortless, keep the game pure.** A digital scoreboard designed specifically for the Chinese card game "Guandan". Say goodbye to pen and paper, and focus on the game!

---

### 📱 Live Demo

- **Cloudflare (Recommended - Fast access)**: [**https://guandan-scoreboard.inin.workers.dev/**](https://guandan-scoreboard.inin.workers.dev/)
- **GitHub Pages**: [https://coolvance.github.io/guandan-scoreboard/](https://coolvance.github.io/guandan-scoreboard/)
- **Vercel**: [https://guandan-scoreboard.vercel.app/](https://guandan-scoreboard.vercel.app/)

---

### ✨ Why choose this tool?

- **Mobile-First Design**: Experience a smooth, app-like interface in your mobile browser. Supports "Add to Home Screen" for offline use (PWA).
- **Smart Gestures**: No need to hunt for buttons. Swipe up or down to adjust card levels and rounds, as intuitive as turning a physical wheel.
- **Accidental Touch Protection**: Click the "Lock" icon to prevent mistakes. To unlock, simply press and hold for 1 second with a cool visual progress indicator.
- **Flexible Scoring Modes**:
  - **Automatic Mode**: Just tell the system who won (Solo or Duo), and it calculates the scores for everyone automatically.
  - **Manual Mode**: If you need fine control, input scores for all four players, and the system ensures the total sums to zero.
- **Dynamic Views**: Switch between full screen, top-only, or bottom-only views. Get the perspective you need with a single click.
- **Persistence**: All data is saved locally on your device. Your scores will be right there even if you refresh or close the page.

---

### 🐳 Self-Hosting (Docker / NAS)

Running the scoreboard on your own server, Synology NAS, or local network is incredibly simple:

**1. One-Liner (Docker)**
Run this command in your terminal:
```bash
docker run -d -p 8080:80 --name guandan-scoreboard coolvance/guandan-scoreboard:latest
```
Then access it at `http://your-ip:8080`.

**2. Docker Compose**
Download `docker-compose.yml` and run:
```bash
docker-compose up -d
```

---

### 🛠️ Technical Info (For Developers)

- **Framework**: React 18 + Vite + TypeScript
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Deployment**: Docker, Nginx, Vercel, Cloudflare Pages

Want to dive deeper into the business logic? Check out [FUNCTIONAL_SPEC.md](FUNCTIONAL_SPEC.md).

---

### 🤝 Contribute

Feel free to submit an Issue or a Pull Request.

This project is licensed under the MIT License.
