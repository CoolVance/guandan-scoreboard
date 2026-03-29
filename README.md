# Guandan Scoreboard

<div align="center">

[ **English** ] | [ 简体中文 ](./README_zh.md) | [ 繁體中文 ](./README_zh-TW.md)

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
- **Flexible Scoring**: Supports both "Solo Win" and "Team Win" scoring modes with auto-partner assignment.
- **Gesture Controls**: Swipe up/down to adjust levels and rounds.
- **Draggable Floating Menu**:
  - **Smart Positioning**: Snaps to screen edges and adjusts visibility based on screen size/orientation.
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
- **PWA Ready**: Built with modern web technologies for a native-app-like experience.

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

### 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

### 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
