# 能力：PWA 可靠性

## 描述
确保应用在离线环境下可访问且功能正常，特别针对移动端浏览器（iOS/Android）的行为进行优化。

## 新增需求

### 需求：Service Worker 离线加载
系统 SHALL 确保即使在没有网络连接的情况下，也能从 Service Worker 缓存中完整加载应用。

#### 场景：离线状态下重启应用
- **当** 用户在离线时杀掉应用并重启
- **那么** Service Worker SHALL 提供缓存的 `index.html` 及相关资源
- **且** 应用 SHALL 不显示白屏或“无网络”浏览器错误

### 需求：Stale-While-Revalidate 策略
应用的主要入口 SHALL 使用 `StaleWhileRevalidate` 缓存策略。

#### 场景：在网络不稳定的情况下加载应用
- **当** 用户在连接较差时打开应用
- **那么** Service Worker SHALL 立即提供缓存版本
- **且** 在后台尝试更新缓存以供下次访问使用
