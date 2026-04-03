# 个人博客系统 V1.0 - 技术架构设计 (TECH_DESIGN)

## 1. 架构概述 (Architecture Overview)
本项目采用标准的**前后端分离 (Client-Server)** 架构。
* **前端 (Client)**：负责页面路由、UI 渲染、状态管理以及与用户的交互。通过 HTTP 请求调用后端 RESTful API。
* **后端 (Server)**：作为纯粹的 API 供给方，负责业务逻辑处理、数据校验、权限拦截以及与 MySQL 数据库的持久化交互。

## 2. 技术栈选型 (Technology Stack)

### 2.1 前端技术栈 (Frontend)
* **核心框架**：React 18 + TypeScript + Vite
* **路由管理**：React Router v6
* **全局状态**：React Context (专属 `AuthContext` 用于管理登录状态)
* **网络请求**：Axios (统一封装，支持拦截器)
* **CSS 方案**：Tailwind CSS (响应式设计，拒绝重量级 UI 库)
* **核心功能包**：
    * `react-markdown` & `@tailwindcss/typography`：用于渲染 Markdown 文章体。
    * `lucide-react`：统一的 SVG 图标库。
    * `date-fns`：轻量级日期格式化工具。

### 2.2 后端技术栈 (Backend)
* **核心框架**：Node.js + Express
* **数据库**：MySQL 8.0+ (字符集 `utf8mb4`)
* **数据库驱动**：`mysql2` (强制使用 Promise API 和参数化查询)
* **安全与认证**：
    * `jsonwebtoken`：签发与验证 JWT Token。
    * `bcryptjs`：密码单向哈希加密（Salt Rounds 建议设置为 10）。
    * `cors`：处理跨域资源共享。
* **环境变量**：`dotenv`

## 3. 目录结构规范 (Directory Structure)
项目根目录分为 `/frontend` 和 `/backend` 两个独立的工作区。

### 3.1 前端目录结构 (`/frontend`)
```text
frontend/
├── public/               # 静态资源 (favicon 等)
├── src/
│   ├── assets/           # 本地图片/公共样式
│   ├── components/       # 全局复用组件 (Header, Sidebar, Button 等)
│   ├── context/          # 状态管理 (AuthContext.tsx)
│   ├── hooks/            # 自定义 Hooks (useDebounce 等)
│   ├── pages/            # 路由页面 (Home, PostDetail, Write, Profile, Login)
│   ├── router/           # 路由配置与 ProtectedRoute 鉴权组件
│   ├── types/            # TypeScript 类型定义 (user.ts, post.ts, api.ts)
│   ├── utils/            # 工具函数 (http.ts, format.js)
│   ├── App.tsx           # 根组件
│   └── main.tsx          # 入口文件
├── .env                  # 前端环境变量 (VITE_API_BASE_URL)
├── tailwind.config.js    # Tailwind 配置
└── vite.config.ts        # Vite 配置
```