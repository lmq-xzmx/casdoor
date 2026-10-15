# Casdoor 生产环境部署

## 前置条件

1. 已配置 NAS Registry（参考 `DOCKER_REGISTRY.md`）
2. PostgreSQL 和 Redis 已部署并可访问
3. 已构建并推送镜像到 NAS

## 部署步骤

### 1. 构建并推送镜像

```bash
# 在开发机执行
cd /Users/xzmx/Downloads/my-project/casdoor

# 构建镜像
docker build -t casdoor:v1.0 .

# 打标签
docker tag casdoor:v1.0 100.108.142.49:5000/casdoor:v1.0

# 推送（关闭 VPN）
docker push 100.108.142.49:5000/casdoor:v1.0
```

### 2. 在生产服务器部署

```bash
# 拉取镜像
docker pull 100.108.142.49:5000/casdoor:v1.0

# 复制部署文件
cp -r deploy/production /opt/casdoor-production

# 配置环境变量
cd /opt/casdoor-production
cp .env.example .env
vim .env  # 填写实际密码

# 启动服务
docker compose up -d
```

### 3. 验证部署

```bash
# 检查容器状态
docker compose ps

# 检查日志
docker compose logs -f

# 访问验证
curl http://localhost:3011/api/get-account
```

## 生产环境配置说明

| 配置项 | 开发环境 | 生产环境 | 说明 |
|--------|---------|---------|------|
| runmode | dev | prod | 生产模式关闭调试 |
| httpport | 5012 | 3012 | 生产端口 |
| staticBaseUrl | "" | "" | 空表示使用本地静态文件 |
| socks5Proxy | 127.0.0.1:10808 | - | 生产环境移除代理 |

## 端口映射

- 开发环境: 5011 → 5012
- 生产环境: 3011 → 3012

## 数据迁移

如果需要从开发环境迁移数据到生产环境：

```bash
# 1. 导出开发环境数据
docker exec geo-monitor-postgres pg_dump -U postgres casdoor > casdoor_backup.sql

# 2. 导入生产环境
docker exec -i production-postgres psql -U postgres casdoor < casdoor_backup.sql
```

## 后续接入

生产环境 Casdoor 就绪后，其他服务（WeKnora、GEO-Knowledge 等）可通过以下地址对接：

- Casdoor API: `http://casdoor:3012`（Docker 网络内）
- Casdoor UI: `http://<服务器IP>:3011`
