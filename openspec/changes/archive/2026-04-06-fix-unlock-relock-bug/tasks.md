## 1. 核心逻辑实现 (useSecurity.ts)

- [x] 1.1 在 `useSecurity` 钩子中添加 `lastToggleTime` 的 `useRef` 状态。
- [x] 1.2 在 `setIsLocked` 被调用时，检查当前时间与 `lastToggleTime.current` 的差值是否大于 500ms。
- [x] 1.3 如果差值足够，则更新锁定状态并同步更新 `lastToggleTime.current`。
- [x] 1.4 确保所有触发 `setIsLocked(false)` 的入口（如长按结束）都受此冷却时间保护。

## 2. UI 事件优化 (DraggableDrawer.tsx)

- [x] 2.1 检查锁定按钮的点击处理函数，确保其不会在长按解锁过程中被错误触发。
- [x] 2.2 在 `handleModeClick` 或其他与锁定相关的按钮回调中，增加对 `isLocked` 状态切换后的冷却期判断。
- [x] 2.3 验证 `touchend` 事件是否通过 `preventDefault()` 正确处理，以防止合成 `click` 冒泡。

## 3. 验证与回归测试

- [x] 3.1 编写单元测试，模拟在 100ms 内连续触发两次 `setIsLocked` 的情况，验证状态是否保持正确。
- [x] 3.2 在真机或 Chrome 模拟器中，通过快速点击/长按组合操作，验证解锁后不会瞬间回弹。
- [x] 3.3 检查触感反馈是否在正确的时间点触发，不应受冷却时间影响。
