# AI Web Demo

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

默认管理员由后端启动时自动创建，密码使用 BCrypt 加密保存。

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

# 文章自助管理系统开源部署说明

本文档说明如何使用开源压缩包部署项目，并解释项目目录结构、文件用途和关键配置。

## 一、部署方式

推荐在 Linux 服务器上使用 `tar.gz` 压缩包部署。

### 1. 上传压缩包到服务器

Windows PowerShell 示例：

```powershell
scp .\ai-web-demo-opensource.tar.gz user@服务器IP:/home/user/
```

### 2. 登录服务器

```bash
ssh user@服务器IP
```

### 3. 解压项目

使用 `tar.gz`：

```bash
cd /home/user
tar -xzf ai-web-demo-opensource.tar.gz
cd ai-web-demo-opensource
```

如果使用 ZIP：

```bash
unzip ai-web-demo-opensource.zip
cd ai-web-demo-opensource
```

### 4. 安装 Docker 和 Compose

Ubuntu：

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-plugin
sudo systemctl enable docker
sudo systemctl start docker
docker -v
docker compose version
```

CentOS / Alibaba Cloud Linux：

```bash
sudo yum install -y docker
sudo systemctl enable docker
sudo systemctl start docker
docker -v
```

如果 `docker compose version` 不存在，需要额外安装 Docker Compose 插件。

### 5. 配置环境变量

```bash
cp .env.example .env
vim .env
```

至少修改这些值：

```text
MYSQL_ROOT_PASSWORD
MYSQL_PASSWORD
JWT_SECRET
APP_ADMIN_PASSWORD
```

说明：

- `JWT_SECRET` 至少 32 个字符。
- 真实密码只写入 `.env`。
- 不要把 `.env` 提交到 Git 仓库。

### 6. 启动服务

```bash
docker compose up -d --build
```

### 7. 查看状态

```bash
docker compose ps
```

正常应看到以下容器：

```text
ai-web-mysql
ai-web-backend
ai-web-frontend
ai-web-nginx
```

### 8. 测试接口

```bash
curl http://127.0.0.1/api/health
```

预期返回：

```json
{"code":200,"message":"success","data":"ok"}
```

公网访问：

```text
http://服务器公网IP
```

阿里云安全组需要开放：

```text
22  SSH
80  HTTP
```

不要开放：

```text
3306
8080
```

## 二、常用运维命令

查看所有服务日志：

```bash
docker compose logs -f
```

只查看后端日志：

```bash
docker compose logs -f backend
```

只查看 Nginx 日志：

```bash
docker compose logs -f nginx
```

查看容器状态：

```bash
docker compose ps
```

停止服务：

```bash
docker compose down
```

重建服务，保留数据库：

```bash
docker compose down
docker compose up -d --build
```

清空数据库并重建：

```bash
docker compose down -v
docker compose up -d --build
```

注意：`docker compose down -v` 会删除 MySQL 数据库 volume，数据会丢失。

## 三、文件树和用途

```text
ai-web-demo-opensource/
├── backend/                  Spring Boot 后端项目
│   ├── Dockerfile            后端 Docker 镜像构建文件
│   ├── pom.xml               Maven 依赖和构建配置
│   └── src/main/
│       ├── java/com/example/aiweb/
│       │   ├── AiWebApplication.java          后端启动入口；初始化默认管理员
│       │   ├── common/                        通用响应和异常处理
│       │   ├── config/                        Spring Security、JWT、CORS 配置
│       │   ├── controller/                    REST API 控制器
│       │   ├── dto/                           请求和响应数据对象
│       │   ├── entity/                        JPA 数据库实体
│       │   ├── repository/                    数据库访问接口
│       │   ├── service/                       业务逻辑和权限校验
│       │   └── util/                          JWT 工具类
│       └── resources/
│           ├── application.yml                后端配置；读取环境变量
│           └── db/init.sql                    数据库初始化说明
│
├── frontend/                 React 前端项目
│   ├── Dockerfile            前端 Docker 镜像构建文件
│   ├── index.html            Vite HTML 入口
│   ├── nginx.conf            前端容器内 Nginx 静态资源配置
│   ├── package.json          前端依赖和构建脚本
│   ├── tsconfig.json         TypeScript 配置
│   ├── vite.config.ts        Vite 配置，本地开发代理 /api
│   └── src/
│       ├── main.tsx          React 挂载入口
│       ├── App.tsx           应用根组件
│       ├── api/              Axios 请求封装和接口文件
│       ├── components/       公共布局和路由保护组件
│       ├── pages/            登录、注册、文章、控制台页面
│       ├── router/           React Router 路由配置
│       ├── store/            token 存取逻辑
│       └── styles/           全局样式
│
├── nginx/
│   └── nginx.conf            总入口 Nginx 配置；代理前端和 /api
│
├── .env.example              环境变量示例，不包含真实密钥
├── .gitignore                Git 忽略规则，排除 .env 和构建产物
├── docker-compose.yml        一键部署配置，管理 MySQL、后端、前端、Nginx
├── README.md                 项目介绍、启动方式、常见问题
├── deploy.md                 服务器部署文档
├── DESIGN.md                 架构和设计文档
└── LICENSE                   MIT 开源协议
```

## 四、关键文件说明

### `docker-compose.yml`

管理 4 个服务：

```text
mysql      数据库
backend    Spring Boot API
frontend   React 静态页面
nginx      公网入口
```

只有 `nginx` 暴露 `80` 端口，后端 `8080` 和 MySQL `3306` 不暴露公网。

### `.env.example`

环境变量模板。部署时复制成 `.env`：

```bash
cp .env.example .env
```

真实密码只写入 `.env`，不要提交到 Git。

### `nginx/nginx.conf`

公网入口配置：

```text
/       -> frontend:80
/api/   -> backend:8080/api/
```

### `backend/src/main/resources/application.yml`

后端配置文件。数据库地址、JWT 密钥、默认管理员账号都通过环境变量读取。

### `frontend/src/api/request.ts`

前端统一请求封装：

- `baseURL = /api`
- 自动携带 JWT token
- 401 自动清除 token 并跳转登录页

### `backend/src/main/java/com/example/aiweb/service/ArticleService.java`

文章业务逻辑和权限校验：

- 普通用户只能编辑或删除自己的文章。
- `ADMIN` 可以管理所有文章。

## 五、开源前检查

发布到 GitHub 前建议只提交：

```text
ai-web-demo-opensource/
```

不要提交：

```text
.env
upload-and-deploy.ps1
SSH 私钥
服务器 IP
真实数据库密码
真实 JWT_SECRET
```

开源包应只包含 `.env.example`，不包含真实环境配置。
