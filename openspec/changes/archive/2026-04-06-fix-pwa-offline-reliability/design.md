## Context

当前 PWA 在离线时偶发性无法打开（特别是在服务器宕机的情况下），经分析可能是因为：
1. `index.html` 的缓存策略（`StaleWhileRevalidate`）在某些浏览器环境下对“完全无法连接服务器”的处理不够鲁棒。
2. 预缓存（Pre-caching）可能未完全覆盖所有必要资产。
3. 用户缺乏关于应用是否已“离线就绪”的视觉反馈，导致在未缓存完成时就尝试离线使用。

## Goals / Non-Goals

**Goals:**
- 实现“瞬时加载”：即使服务器宕机，应用也能从本地缓存秒开。
- 提供明确的“离线就绪”视觉反馈。
- 优化 Service Worker 注册和预缓存逻辑，确保安装即完整。

**Non-Goals:**
- 实现跨设备的数据同步（保持现有的 LocalStorage 方案）。
- 提供 Electron/Desktop 原生包（仍保持 PWA 形态）。

## Decisions

### 1. 缓存策略从 `StaleWhileRevalidate` 转向更激进的 `CacheFirst` (针对静态资产)
- **决策**：对带有哈希值的 JS/CSS 资源使用 `CacheFirst`；对 `index.html` 使用 `NetworkFirst` 但设置更短的超时时间，并强制回退到本地缓存。
- **理由**：静态资产在构建后是不可变的，`CacheFirst` 最快。`index.html` 需要能检测更新，但在断网时必须立即回退到缓存，不能让浏览器抛出错误。

### 2. 引入 `workbox-window` 监控缓存状态
- **决策**：在 `useNetwork.ts` 中引入 `isOfflineReady` 状态，监听 Service Worker 的 `activated` 且 `waiting` 为空的情况。
- **理由**：现有的 `navigator.onLine` 只能告诉我们网络是否连接，无法告诉我们“应用包是否已完整下载到本地”。

### 3. UI 状态灯语义化升级
- **决策**：在 `DraggableDrawer` 中扩展状态点逻辑。
  - **绿色 (Ready)**：已缓存最新版，离线绝对安全。
  - **黄色 (Preparing)**：在线，但离线包正在下载或 SW 未就绪。
  - **灰色/黑色**：离线且未检测到有效缓存。
- **理由**：通过颜色直接向用户传达“确定性”，消除对离线可用性的焦虑。

## Risks / Trade-offs

- **[风险]** 过于激进的缓存可能导致用户错过紧急更新 ➔ **缓解**：保留现有的 `PWAUpdatePrompt` 手动刷新逻辑，并在侧边栏提供“手动检查更新”按钮。
- **[风险]** `CacheFirst` 可能导致脏缓存问题 ➔ **缓解**：Vite 产物带有唯一哈希，Workbox 会自动清理旧版本的 `globPatterns`。

## Open Questions

- 是否需要为中国用户增加“加速访问”提示？（当前用户可能由于网络环境无法首次访问服务器导致无法安装 PWA）。
