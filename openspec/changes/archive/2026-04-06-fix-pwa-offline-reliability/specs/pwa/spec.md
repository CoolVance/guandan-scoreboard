## MODIFIED Requirements

### Requirement: 离线优先加载策略
系统 SHALL 确保应用在任何网络状态下（特别是完全离线或服务器不可达）都能从 Service Worker 缓存中瞬时加载，通过优先从缓存提供 `index.html` 及核心资产实现。

#### Scenario: 极端离线（服务器关停）启动应用
- **WHEN** 用户在无网络连接且服务器已停止服务的极端情况下启动 PWA
- **THEN** Service Worker SHALL 立即拦截请求并从本地缓存提供完整的 `index.html`
- **且** 系统 SHALL 确保所有核心静态资源（JS/CSS/SVG）在此时均已就绪并加载成功

### Requirement: 激进的预缓存策略
应用的所有静态入口资产 SHALL 在初次加载时即完成完整缓存，不依赖于二次访问触发缓存。

#### Scenario: 首次安装后的资源完整性
- **WHEN** 用户首次点击 PWA “安装”或首次访问并触发 SW 注册
- **THEN** Service Worker SHALL 在 `install` 阶段并行下载所有声明的 `globPatterns` 资源
- **且** 只有在所有资源均成功缓存后才标志 SW `activated`
