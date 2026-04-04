## 1. 基础配置与常量

- [x] 1.1 在 `public/` 目录下创建 `version.json`，初始版本设为 `2.1.0`。
- [x] 1.2 在 `src/App.tsx` 中定义应用当前版本常量 `APP_VERSION = '2.1.0'`。

## 2. 版本获取与对比逻辑

- [x] 2.1 在 `src/App.tsx` 中实现版本检测函数，使用 `fetch` 获取 `version.json`。
- [x] 2.2 实现版本对比逻辑，结合 `localStorage` 处理“已跳过版本”的逻辑。
- [x] 2.3 在 `useEffect` 挂载时触发一次版本检测，并将结果存储在状态中（`updateStatus`）。

## 3. 国际化词条补充

- [x] 3.1 在 `zh.ts`, `tw.ts`, `en.ts` 中补充更新弹窗相关的翻译（标题、按钮文案、提示信息）。
- [x] 3.2 更新 `tutorialStatusTitle` 和 `tutorialStatusDesc` 词条，解释指示灯含义。

## 4. UI 界面实现

- [x] 4.1 修改 `src/components/Layout/DraggableDrawer.tsx`，在强制刷新按钮上实现右上角状态指示灯（点）。
- [x] 4.2 修改 `src/components/Tutorial/TutorialOverlay.tsx`，支持从 props 接收 `version` 并动态显示。
- [x] 4.3 在 `TutorialOverlay.tsx` 中更新对应的教程步骤说明文案。
- [x] 4.4 在 `src/App.tsx` 中新增 `UpdateModal`（或复用 `ConfirmModal` 逻辑），展示更新选项。

## 5. 验证与收尾

- [x] 5.1 验证“有更新”场景：将 `version.json` 版本调高，确认绿点闪烁且弹窗出现。
- [x] 5.2 验证“下次提醒”与“跳过”逻辑是否符合预期。
- [x] 5.3 验证离线状态下按钮显示黑色点。
- [x] 5.4 验证教程界面显示的版本号与代码常量一致。
