# Cursor AI Agent 开发准则 (Personal Blog Full-Stack)

## 1. 核心架构与分层约束 (Architecture Constraints)
* **前后端分离结构**：严格区分前端 (`/frontend` 或独立仓库) 和后端 (`/backend` 或独立仓库) 代码逻辑，严禁在前端代码中直连数据库，严禁在后端代码中输出 HTML 标签。
* **后端路由与控制器解耦**：Express 应用必须严格遵循 `Routes -> Controllers -> Models/Services` 的分层结构。路由层只负责分发，控制器层处理 Req/Res 和参数校验，数据库交互逻辑必须放在单独的模型/服务层中。
* **前端 UI 纯粹性**：拒绝引入庞大的 UI 组件库（如 Ant Design、MUI）。除了必要的基础无头组件（如 Headless UI 或 Radix UI 的极简底层），所有视觉组件强制基于原生 HTML 标签配合 Tailwind CSS 手写。
* **前端 Markdown 渲染**：文章内容展示必须使用 `react-markdown` 配合 Tailwind 的 `@tailwindcss/typography` 插件（即 `prose` 类）来保证排版规范，严禁手动通过 `dangerouslySetInnerHTML` 解析不可信的 HTML 字符串以防 XSS。

## 2. 数据与接口流转准则 (Data & API Management)
* **统一的 Axios 实例**：前端发起的所有的 API 请求必须经过一个统一封装的 Axios 实例（如 `src/utils/http.ts`）。
* **自动 Token 注入与拦截**：该 Axios 实例必须配置请求拦截器（Request Interceptor），自动从 `localStorage` 读取 JWT Token 并注入到 `Authorization: Bearer <token>` 请求头中。配置响应拦截器（Response Interceptor），全局处理 401 未授权错误并自动跳转到 `/login`。
* **零 any 原则 (TypeScript)**：前后端的交互数据结构必须定义严格的 TS Interface/Type。后端的返回格式必须统一规范，例如 `{ code: 0, message: 'success', data: {...} }`，前端一律基于此结构进行解构。
* **参数化查询 (防 SQL 注入)**：后端使用 `mysql2` 时，所有的 SQL 拼接**绝对禁止**使用字符串模板（`${}`）直接插入变量，强制使用 `execute` 或 `query` 的 `?` 参数化占位符。

## 3. 视觉与 UI 规范 (Visual UI Rules)
* **极客极简视觉基准**：整体调性参考“极客/开发者周刊”风格。全局背景以纯白或极浅灰（`bg-gray-50`）为主，文字以高对比度的深灰/黑（`text-gray-900`）为主。强调色（如按钮、链接悬停）保持克制，使用单一的主题色（如 `blue-600` 或 `indigo-600`）。
* **交互反馈与动效 (Micro-interactions)**：
    * 文章卡片、按钮等所有可交互元素必须具备 Hover 态（如 `hover:-translate-y-1 hover:shadow-md`）和丝滑的过渡动画 (`transition-all duration-300`)。
* **响应式降级**：
    * 列表与布局优先考虑 PC 端浏览体验（如 `max-w-7xl mx-auto flex`），但必须通过 Tailwind 的 md/lg 断点完美适配移动端（移动端转为竖向流式布局，隐藏不必要的侧边栏信息）。

## 4. 特殊安全与业务约束 (Security & Features)
* **密码安全红线**：注册接口存储密码时，强制使用 `bcrypt` 或 `bcryptjs` 进行 Hash 加盐处理，**绝对禁止**明文存储密码。登录比对时使用 `bcrypt.compare`。
* **环境变量保护**：所有的敏感配置（MySQL 账号密码、JWT Secret Key、端口号）必须通过 `dotenv` 从 `.env` 文件读取，代码中强制使用 `process.env.XXX`，严禁硬编码。
* **受保护路由 (Protected Routes)**：前端对于 `/write` 和 `/profile` 等页面，必须通过一个高阶组件（如 `<ProtectedRoute>`）包裹，若检查不到有效的 Auth 状态，则无缝重定向至 `/login`。

## 5. 代码质量与交付规范 (Code Quality)
* 前端全部使用 Functional Components + React Hooks。
* **全局异常处理**：Express 后端必须在挂载所有路由的最后，提供一个全局的 Error Handling Middleware，用于捕获异步/同步抛出的异常，并向前端返回优雅的 500 JSON 报错，而不是让 Node 进程崩溃。
* **关键注释**：在涉及 JWT 签发/校验逻辑、复杂的连表 SQL 查询、以及前端的 Token 拦截器逻辑时，必须保留简明扼要的中文注释，说明意图。