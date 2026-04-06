## Why

修复一个反复出现的回归缺陷：在 PWA 或移动端触摸环境下，长按解锁操作在松手瞬间会错误地触发再次锁定。此举旨在提升交互的可靠性，并确保核心安全锁定逻辑在不同设备和网络抖动下表现一致。

## What Changes

- **修复**: 修正 `useSecurity` 或相关组件中的事件冒泡/冲突，防止解锁后的 `touchend` 或 `click` 事件意外触发重新锁定。
- **增强**: 引入“解锁冷却期”或状态过渡保护，防止在极短时间内发生状态回转。
- **稳定性**: 增加针对锁定/解锁状态转换的单元测试或集成测试，防止未来再次出现类似回归。

## Capabilities

### New Capabilities
- `lock-state-protection`: 专门定义锁定与解锁状态转换过程中的保护机制，包括防抖、冷却时间和事件拦截规则。

### Modified Capabilities
- `ui`: 更新关于锁定按钮交互反馈的要求，确保状态切换在视觉和交互逻辑上是原子的。

## Impact

- `src/hooks/useSecurity.ts`: 核心锁定逻辑所在地。
- `src/components/Layout/DraggableDrawer.tsx`: 解锁按钮及交互实现。
- `src/utils/haptics.ts`: 可能影响触感反馈的触发时机。
