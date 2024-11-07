# 使用代理设置
ARG HTTP_PROXY=http://127.0.0.1:7890
ARG HTTPS_PROXY=http://127.0.0.1:7890

# 第一阶段：使用 Maven 构建项目
FROM maven:3.8.6-jdk-11 AS builder

# 设置代理环境变量
ARG HTTP_PROXY
ARG HTTPS_PROXY
ENV HTTP_PROXY=${HTTP_PROXY}
ENV HTTPS_PROXY=${HTTPS_PROXY}

# 设置工作目录
WORKDIR /app

# 复制项目的所有文件到构建环境中
COPY . /app

# 配置 Maven 使用代理，构建项目，跳过测试
RUN mvn clean install -DskipTests

# 第二阶段：使用精简的 JRE 镜像运行应用程序
FROM openjdk:11-jre-slim

# 安装必要的字体库
RUN apt-get update && apt-get install -y \
    libfreetype6 \
    fontconfig \
    libx11-6 \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# 设置工作目录
WORKDIR /app

# 从构建阶段复制生成的 ruoyi-admin.jar
COPY --from=builder /app/ruoyi-admin/target/ruoyi-admin.jar /app/ruoyi-admin.jar

# 暴露端口
EXPOSE 8080

# 设置运行命令
ENTRYPOINT ["java", "-jar", "/app/ruoyi-admin.jar"]
