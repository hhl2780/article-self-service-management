# 文章自助管理系统设计文档

## 1. 项目目标

本项目是一个前后端分离的文章自助管理系统，面向通用 Web 管理后台场景。系统提供用户注册、登录、JWT 鉴权、当前用户查询、公开文章浏览，以及登录用户的文章创建、编辑和删除能力。

## 2. 总体架构

```text
Browser
  |
  | HTTP :80
  v
Nginx gateway
  |-- /      -> frontend container
  |-- /api/  -> backend container
                  |
                  v
                MySQL container
```

部署由 Docker Compose 管理，包含 `mysql`、`backend`、`frontend`、`nginx` 四个服务。公网只暴露 Nginx 的 80 端口，后端和 MySQL 只在 Docker 内部网络访问。

## 3. 前端设计

前端使用 React、Vite、TypeScript、React Router、Axios 和 Ant Design。

主要页面:

- `/login`: 用户登录
- `/register`: 用户注册
- `/dashboard`: 登录后的控制台
- `/articles`: 公开文章列表
- `/articles/:id`: 公开文章详情
- `/articles/new`: 新建文章
- `/articles/:id/edit`: 编辑文章

前端通过 `frontend/src/api/request.ts` 统一封装 Axios，`baseURL` 为 `/api`。登录成功后 JWT token 保存在 `localStorage`，key 为 `AI_WEB_TOKEN`。请求拦截器自动携带 `Authorization: Bearer <token>`，响应拦截器在 401 时清除 token 并跳转登录页。

## 4. 后端设计

后端使用 Java 17、Spring Boot 3、Spring Web、Spring Security、Spring Data JPA、JWT 和 MySQL。

核心模块:

- `controller`: REST API 入口
- `service`: 业务逻辑与权限校验
- `repository`: JPA 数据访问
- `entity`: 用户和文章实体
- `dto`: 请求与响应对象
- `config`: 安全、JWT 过滤器、CORS
- `common`: 统一响应和异常处理

统一响应格式:

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

权限规则:

- 匿名可访问登录、注册、文章列表、文章详情、健康检查。
- 登录用户可访问当前用户接口和创建文章。
- 文章作者或 `ADMIN` 可以编辑、删除文章。
- 普通用户不能编辑或删除他人文章。

## 5. 数据模型

`users`:

- `id`: 主键
- `username`: 唯一用户名
- `password`: BCrypt 加密密码
- `nickname`: 昵称
- `role`: 用户角色，默认 `USER`
- `created_at`, `updated_at`: 时间字段

`articles`:

- `id`: 主键
- `title`: 标题
- `content`: 内容
- `author_id`: 作者用户 ID
- `status`: 状态，默认 `PUBLISHED`
- `created_at`, `updated_at`: 时间字段

数据库表由 Spring Data JPA 自动维护。默认管理员在后端启动时检查并创建，密码以 BCrypt 存储。

## 6. 部署设计

部署入口为 `docker-compose.yml`:

- `mysql`: MySQL 8，使用 Docker volume 持久化。
- `backend`: Spring Boot jar，多阶段 Docker 构建。
- `frontend`: React 静态资源，多阶段 Docker 构建后由 Nginx 提供。
- `nginx`: 统一公网入口，代理 `/api/` 到后端，代理 `/` 到前端。

敏感配置通过 `.env` 注入，仓库只提交 `.env.example`。生产部署前必须修改数据库密码、JWT 密钥和管理员密码。

## 7. 安全设计

- 密码使用 BCrypt 加密存储。
- JWT 密钥通过环境变量注入，不写入代码。
- MySQL 不暴露公网端口。
- 后端 8080 不暴露公网端口。
- 仅 Nginx 暴露 80 端口。
- 文章修改和删除有后端作者归属校验。
- `.gitignore` 排除 `.env`、构建产物和依赖目录。
