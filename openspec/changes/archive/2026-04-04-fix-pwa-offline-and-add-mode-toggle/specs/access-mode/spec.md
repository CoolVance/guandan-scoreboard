# 能力：访问模式检测

## 描述
检测并显示托管环境，为用户提供强制从服务器刷新当前页面的入口。

## 新增需求

### 需求：自动环境检测
应用 SHALL 自动检测当前的托管环境。

#### 场景：在本地网络或 IP 上运行
- **当** `window.location.hostname` 是 IP 地址或 `localhost` 时
- **那么** 应用 SHALL 被识别为“本地模式”（或对应的翻译）。

#### 场景：在 Cloudflare 域名上运行
- **当** `window.location.hostname` 包含 `inin.workers.dev` 时
- **那么** 应用 SHALL 被识别为“云端模式”（或对应的翻译）。

### 需求：强制刷新应用
应用 SHALL 提供强制从服务器重新加载的入口。

#### 场景：用户点击“强制刷新”
- **当** 用户点击访问模式按钮并确认时
- **那么** 应用 SHALL 执行 `window.location.reload()`。
