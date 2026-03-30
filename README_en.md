# Guandan Scoreboard

<div align="center">

[ **English** ] | [ 简体中文 ](./README.md) | [ 繁體中文 ](./README_zh-TW.md)

</div>

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-%5E18.0.0-blue)
![TypeScript](https://img.shields.io/badge/typescript-%5E5.0.0-blue)
![Vite](https://img.shields.io/badge/vite-%5E5.0.0-purple)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%5E3.0.0-sky)

A modern, mobile-first scoreboard application designed for card games like Guandan. Features a beautiful UI, intuitive gestures, and comprehensive score tracking.

---

### ✨ Features

- **Multi-Player Support**: Tracks scores for North, South, East, and West players.
- **Flexible Scoring**:
  - **Auto Mode**: Supports "Solo Win" and "Team Win" with automatic score distribution.
  - **Free Mode**: Allows manual scoring for all 4 players with real-time sum-to-zero validation.
- **Efficient Input**: Integrated `±1` step buttons for all score inputs for quick adjustments.
- **Gesture Controls**: Swipe up/down to adjust levels and rounds.
- **Customizable UI**:
  - **Immersive Mode**: Toggle visibility of top level and round controls for a cleaner scoring view.
  - **Smart FAB**: Integrated Lock, Toggle, and Language settings with auto-edge snapping.
  - **Lock Mode**: Prevent accidental touches with a smart lock mechanism. Unlocking requires a **1-second long-press**, featuring a circular **progress ring** animation around the button.
  - **Quick Actions**: Switch languages, reset levels, or restart tutorial.
- **Physical Feel Animations**:
  - **Bounce Feedback**: Top level and round controls trigger a "press-and-pop" scaling effect when values change, providing clear operational feedback.
  - **Visual Polishing**: Floating buttons feature a white border for better visibility across different backgrounds.
- **Detailed Documentation**: `FUNCTIONAL_SPEC.md` is available in the root directory, detailing all business logic and scoring rules for refactoring reference.
- **Score History**: Detailed history log with team color coding and distinct styles for different win types.
- **Interactive Tutorial**: Guided tour for first-time users to learn all features quickly.
- **Internationalization**: Full support for English, Simplified Chinese, and Traditional Chinese.
- **Responsive Design**: Optimized for mobile devices (iPhone, Android) and desktop browsers.
- **Offline PWA Support**: Installable on home screens and fully functional without an internet connection for all scoring features.

### 🛠️ Tech Stack

- **Framework**: [React 18](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

### 🚀 Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/CoolVance/guandan-scoreboard.git
    cd guandan-scoreboard
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run development server**
    ```bash
    npm run dev
    ```

4.  **Build for production**
    ```bash
    npm run build
    ```

### 🐳 Docker Deployment

This project supports fast deployment via Docker, ideal for personal servers, NAS, or local networks.

1.  **Fastest Deployment (Docker Hub)**
    Launch the app with a single command without downloading any source code:
    ```bash
    docker run -d -p 8080:80 --name guandan-scoreboard coolvance/guandan-scoreboard:latest
    ```

2.  **Using Docker Compose (Recommended)**
    Download `docker-compose.yml` and run:
    ```bash
    docker-compose up -d
    ```
    *Note: The project is configured to prioritize pulling the remote image. If you are a developer and have modified the code, use `docker-compose up -d --build` to force a local rebuild.*

3.  **Offline Deployment (Using .tar Image)**
    If in an environment without internet, load the `.tar` image provided in the Release first:
    ```bash
    docker load -i guandan-scoreboard-v1.0.tar
    docker-compose up -d
    ```

4.  **NAS (e.g., Synology) Deployment**
    -   **Method A**: Search for `coolvance/guandan-scoreboard` in the "Registry" of Container Manager (formerly Docker) and run it directly.
    -   **Method B**: Import `docker-compose.yml` for a one-click setup. it will automatically pull the latest image from Docker Hub.

### 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

### 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
