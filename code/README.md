# 文章自助管理系统

一个可 Docker Compose 一键部署的通用 Web 管理系统示例。第一版实现用户注册、登录、JWT 鉴权、当前用户查询、文章管理 CRUD、React 前端页面、Spring Boot REST API、MySQL 持久化和 Nginx 反向代理。

## 技术栈

- Frontend: React, Vite, TypeScript, React Router, Axios, Ant Design
- Backend: Java 17, Spring Boot 3, Spring Web, Spring Security, Spring Data JPA, JWT
- Database: MySQL 8
- Deployment: Docker, Docker Compose, Nginx

## 功能

- 用户注册与登录
- JWT token 自动携带与 401 自动跳转登录
- 当前用户信息查询
- 公开文章列表与详情
- 登录后新增、编辑、删除文章
- Docker Compose 管理 MySQL、backend、frontend、nginx

## 默认测试账号

- 用户名: `admin`
- 密码: `Admin@123456`

默认管理员由后端启动时自动创建，密码使用 BCrypt 加密保存。生产部署前请在 `.env` 中修改 `APP_ADMIN_PASSWORD`。

## 本地开发

启动 MySQL:

```bash
cp .env.example .env
docker compose up -d mysql
```

启动后端:

```bash
cd backend
mvn spring-boot:run
```

启动前端:

```bash
cd frontend
npm install
npm run dev
```

访问:

- 前端: http://localhost:5173
- 后端健康检查: http://localhost:8080/api/health

## Docker 部署

复制环境变量文件并修改真实密码:

```bash
cp .env.example .env
```

编辑 `.env`，至少修改:

- `MYSQL_ROOT_PASSWORD`
- `MYSQL_PASSWORD`
- `JWT_SECRET`
- `APP_ADMIN_PASSWORD`

启动:

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

停止:

```bash
docker compose down
```

访问:

```text
http://服务器公网IP
```

健康检查:

```bash
curl http://服务器公网IP/api/health
```

## 阿里云 ECS 部署

1. 安全组开放 `22` 和 `80`，不要开放 `3306` 和 `8080`。
2. 安装 Docker 和 Compose 插件。
3. 上传或拉取本项目到服务器。
4. 执行:

```bash
cp .env.example .env
docker compose up -d --build
docker compose ps
docker compose logs -f
```

更完整步骤见 `deploy.md`。

## 目录结构

```text
ai-web-demo/
  frontend/      React + Vite 前端
  backend/       Spring Boot 后端
  nginx/         总入口 Nginx 配置
  docker-compose.yml
  .env.example
  README.md
  deploy.md
```

## 常见问题

- 登录失败: 确认默认密码是 `Admin@123456`，并查看 `docker compose logs -f backend`。
- 健康检查失败: 确认 `ai-web-backend` 已启动，MySQL healthcheck 已通过。
- 页面刷新 404: 前端容器内 Nginx 已配置 history fallback，如仍失败请重建前端镜像。
- 端口冲突: 确认服务器没有已有服务占用 80 端口。
