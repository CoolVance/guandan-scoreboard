## 1. PWA 配置与策略优化

- [x] 1.1 修改 `vite.config.ts` 中的 `VitePWA` 配置，对 `index.html` 使用 `NetworkFirst` 并设置超时，对静态资产使用 `CacheFirst`。
- [x] 1.2 确保 `globPatterns` 包含所有关键资产（包括 `version.json` 和图标）。
- [x] 1.3 启用 `workbox.skipWaiting` 和 `workbox.clientsClaim` 以确保 SW 快速接管。

## 2. 状态检测逻辑实现

- [x] 2.1 更新 `src/hooks/useNetwork.ts`，增加 `isOfflineReady` 状态检测逻辑。
- [x] 2.2 监听 Service Worker 的 `statechange` 事件，在 `activated` 时标记为就绪。

## 3. UI 与国际化更新

- [x] 3.1 在 `src/i18n` (zh, en, tw) 中添加离线就绪相关的翻译文本。
- [x] 3.2 更新 `src/components/Layout/DraggableDrawer.tsx` 中的状态灯逻辑，反映离线就绪状态。
- [x] 3.3 在状态按钮点击反馈中加入详细的离线可用性提示。

## 4. 验证与测试

- [x] 4.1 运行 `npm run build` 并本地预览，验证 Service Worker 成功注册并完成预缓存。
- [x] 4.2 模拟服务器停止服务（或断开网络），验证应用是否能正常打开并进入计分页面。
- [x] 4.3 验证离线状态下状态灯变为黑色且功能不受影响。
