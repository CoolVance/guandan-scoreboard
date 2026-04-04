## 变更原因

用户报告了 iOS 端 PWA 在离线状态下杀掉进程再启动会出现白屏的严重问题。此外，教程中的版本号已过时，且需要在菜单中增加一个“访问模式”按钮，用于显示当前是“本地运行”还是“云端运行”，并支持点击后强制刷新当前页面以解决缓存滞后问题。

## 变更内容

- **修复 PWA 离线白屏**：更新 `vite.config.ts`，优化 Service Worker 缓存策略（改用 `StaleWhileRevalidate`）并放宽路径回退规则，确保 iOS 端离线加载的稳定性。
- **同步教程版本号**：将 `src/components/Tutorial/TutorialOverlay.tsx` 中的版本号更新为 `v2.1.0`。
- **新增访问模式按钮**：
  - 在 `DraggableDrawer` 菜单中新增一个按钮。
  - 根据当前 `hostname` 动态显示“本地模式”或“云端模式”。
  - 点击按钮后，弹出确认框并执行**强制刷新当前页面**（`window.location.reload()`）。

## 核心能力

### 新增能力
- `access-mode`: 环境检测系统，识别当前运行环境并提供强制刷新入口。

### 修改能力
- `ui`: 在 `DraggableDrawer` 组件中集成新的访问模式显示逻辑。
- `pwa`: 优化 PWA 配置，提升移动端离线可靠性。

## 影响范围

- `vite.config.ts`: PWA 插件配置。
- `src/components/Tutorial/TutorialOverlay.tsx`: 版本号字符串。
- `src/components/Layout/DraggableDrawer.tsx`: 新增模式检测按钮及刷新逻辑。
- `src/i18n/`: 新增“本地模式”、“云端模式”、“强制刷新”等翻译词条。
