## 1. PWA 优化

- [x] 1.1 更新 `vite.config.ts`，将根路径策略改为 `StaleWhileRevalidate` 并扩大回退白名单。

## 2. 版本号同步

- [x] 2.1 更新 `src/components/Tutorial/TutorialOverlay.tsx` 中的硬编码版本号为 `v2.1.0`。

## 3. 国际化支持

- [x] 3.1 在 `zh.ts`, `tw.ts`, `en.ts` 中更新访问模式相关的 Key（`localMode`, `cloudMode`, `forceRefresh`, `confirmForceRefresh`）。

## 4. UI 实现

- [x] 4.1 更新 `src/components/Layout/DraggableDrawer.tsx`，实现环境检测并显示访问模式按钮。
- [x] 4.2 实现点击按钮后的强制刷新逻辑（`window.location.reload()`）及确认弹窗。

## 5. 验证

- [x] 5.1 验证 PWA 离线功能（模拟离线并重启应用）。
- [x] 5.2 验证教程中的版本号显示。
- [x] 5.3 验证不同域名下的环境检测是否准确。
- [x] 5.4 验证确认后的页面强制刷新功能。
