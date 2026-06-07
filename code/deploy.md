# AI Web Demo 阿里云 ECS 部署文档

## 1. 服务器推荐配置

入门配置:

- CPU: 2 核
- 内存: 2 GB
- 系统盘: 40 GB 或 80 GB
- 系统: Ubuntu 22.04 LTS / Ubuntu 24.04 LTS / Alibaba Cloud Linux
- 公网带宽: 3 Mbps 及以上
- GPU: 不需要

访问量增加后建议:

- CPU: 4 核
- 内存: 8 GB
- 系统盘: 80 GB
- 公网带宽: 5 Mbps 及以上

## 2. 阿里云安全组

需要开放:

```text
22   SSH 登录
80   HTTP 访问
443  HTTPS，可后续开启
```

不要开放:

```text
3306  MySQL
8080  后端服务
```

本项目只通过 Nginx 暴露 80 端口，MySQL 和后端仅在 Docker 内部网络访问。

## 3. 服务器初始化

Ubuntu:

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y git curl vim ufw
sudo apt install -y docker.io docker-compose-plugin
sudo systemctl enable docker
sudo systemctl start docker
docker -v
docker compose version
```

Alibaba Cloud Linux / CentOS 类系统:

```bash
sudo yum install -y git curl vim docker
sudo systemctl enable docker
sudo systemctl start docker
docker -v
```

如果没有 `docker compose` 插件，请按 Docker 官方文档安装 Compose plugin。

如果当前用户不是 root:

```bash
sudo usermod -aG docker $USER
```

然后重新登录服务器。

## 4. 上传项目

推荐目录:

```bash
mkdir -p ~/workspace
cd ~/workspace
```

如果使用 Git:

```bash
git clone <你的项目仓库地址> ai-web-demo
cd ai-web-demo
```

如果使用 scp 上传，请把完整 `ai-web-demo` 目录上传到服务器后进入目录:

```bash
cd ~/workspace/ai-web-demo
```

## 5. 创建环境变量

```bash
cp .env.example .env
vim .env
```

必须修改:

```text
MYSQL_ROOT_PASSWORD
MYSQL_PASSWORD
JWT_SECRET
```

`JWT_SECRET` 至少 32 个字符，建议使用随机长字符串。

## 6. 启动服务

```bash
docker compose up -d --build
```

查看状态:

```bash
docker compose ps
```

查看日志:

```bash
docker compose logs -f
```

访问网站:

```text
http://服务器公网IP
```

健康检查:

```bash
curl http://服务器公网IP/api/health
```

成功返回:

```json
{
  "code": 200,
  "message": "success",
  "data": "ok"
}
```

默认测试账号:

```text
用户名: admin
密码: Admin@123456
```

## 7. 停止服务

```bash
docker compose down
```

## 8. 清理并重建

保留数据库:

```bash
docker compose down
docker compose up -d --build
```

清空数据库并重建:

```bash
docker compose down -v
docker compose up -d --build
```

警告: `docker compose down -v` 会删除 MySQL volume，数据库数据会丢失。

## 9. 排查

查看后端日志:

```bash
docker compose logs -f backend
```

查看 Nginx 日志:

```bash
docker compose logs -f nginx
```

确认只暴露 80:

```bash
docker compose ps
```

`backend` 和 `mysql` 不应绑定公网端口。
