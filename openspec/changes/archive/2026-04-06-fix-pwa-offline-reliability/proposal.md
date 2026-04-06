## Why

当前 PWA 在服务器停止服务或网络完全断开时，无法稳健地从缓存加载应用，导致用户看到浏览器错误页面或白屏。这违背了“掼蛋计分板”作为一个工具类应用应具备的随时随地（包括完全离线）可用的核心承诺。

## What Changes

- **PWA 策略调整**：将核心资源（JS, CSS, index.html）的缓存策略从 `StaleWhileRevalidate` 优化为更激进的离线优先方案（如 `CacheFirst` 或优化后的 `NetworkFirst` 带有可靠回退），确保即便服务器宕机也能秒开。
- **离线就绪指示器**：在 UI（如抽屉菜单）中增加“离线就绪”状态显示，让用户明确知道应用已经完整缓存。
- **配置优化**：检查并修复 `vite.config.ts` 中的 `base` 路径及 `manifest` 配置，确保在所有托管环境下（GitHub Pages, Vercel, Docker）路径一致。
- **引导优化**：如果检测到是 PWA 环境且已离线，通过 Toast 或指示器告知用户。

## Capabilities

### New Capabilities
- `offline-status`: 在 UI 中显示当前的离线可用状态和应用版本信息，增强用户信心。

### Modified Capabilities
- `pwa`: 调整 PWA 的 Service Worker 策略，从“后台更新”改为“极致离线可靠性”。
- `ui`: 在侧边栏/抽屉中集成离线状态展示。

## Impact

- `vite.config.ts`: Workbox 配置修改。
- `src/components/Layout/DraggableDrawer.tsx`: 增加状态指示器。
- `src/hooks/useNetwork.ts`: 增强离线检测逻辑。
