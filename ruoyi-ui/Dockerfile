# 设置代理（如果需要）
ARG HTTP_PROXY=http://172.28.243.137:7890
ARG HTTPS_PROXY=http://172.28.243.137:7890

# 使用 Node.js 18 构建前端项目
FROM node:18-alpine AS builder

# 设置代理环境变量
ARG HTTP_PROXY
ARG HTTPS_PROXY
ENV HTTP_PROXY=${HTTP_PROXY}
ENV HTTPS_PROXY=${HTTPS_PROXY}

# 设置工作目录
WORKDIR /app

# 配置 npm 使用代理
RUN npm config set proxy $HTTP_PROXY && npm config set https-proxy $HTTPS_PROXY

# 复制 package.json 和 package-lock.json 以便利用 Docker 的缓存机制
COPY ruoyi-ui/package.json /app/
COPY ruoyi-ui/package-lock.json /app/

# 安装最新版本的 npm 和项目依赖
RUN npm install -g npm@latest && npm install

# 复制前端源码
COPY ruoyi-ui /app

# 构建前端项目
RUN npm run build:prod

# 第二阶段：使用 Nginx 运行前端项目
FROM nginx:alpine

# 复制构建后的前端静态文件到 Nginx 的默认目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制自定义 Nginx 配置文件
COPY ./ruoyi-ui/nginx.conf /etc/nginx/conf.d/default.conf



# 暴露端口
EXPOSE 80

# 启动 Nginx 服务器
CMD ["nginx", "-g", "daemon off;"]
