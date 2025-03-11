# 第一步：构建 React 项目
FROM node:18 AS build

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 或 yarn.lock
COPY package*.json ./

# 安装项目依赖
# 设置日志级别，切换为国内镜像，并显示安装进度
RUN npm config set registry https://registry.npmmirror.com && npm install --progress=true --legacy-peer-deps

# 复制其余的项目文件
COPY . .

# 构建 React 项目
RUN npm run build --progress=true

# 第二步：使用 nginx 部署构建好的静态文件
FROM nginx:alpine

# 复制自定义的 Nginx 配置文件
COPY nginx.conf /etc/nginx/nginx.conf

# 复制构建好的文件到 nginx 的默认目录
COPY --from=build /app/build /usr/share/nginx/html

# 暴露 nginx 的端口 80
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]