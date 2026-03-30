# 构建阶段 - 显式指定使用构建主机的原生平台 (BUILDPLATFORM)，避免在模拟器中运行 npm install
FROM --platform=$BUILDPLATFORM node:20-alpine AS build-stage

WORKDIR /app

# 复制依赖文件并安装，利用 Docker 缓存加速构建
COPY package*.json ./
RUN npm install

# 复制所有源代码并构建项目
COPY . .
RUN npm run build

# 运行阶段
FROM nginx:stable-alpine AS production-stage

# 添加镜像元数据
LABEL org.opencontainers.image.source="https://github.com/CoolVance/guandan-scoreboard"
LABEL org.opencontainers.image.description="掼蛋记分板 - 现代化移动端优先计分工具"
LABEL org.opencontainers.image.licenses="MIT"

# 将构建好的静态文件复制到 Nginx 目录
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 复制自定义 Nginx 配置（处理 React 路由、gzip 等）
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
