# 个人博客系统数据库设计

数据库要求：使用 MySQL，字符集统一使用 utf8mb4（支持 Emoji）。

## 1. 用户表 (users)
- id: 主键，自增
- username: 用户名，唯一，不可为空
- email: 邮箱，唯一，不可为空
- password: 密码（需预留足够长度存储 bcrypt 加密后的哈希值，建议 VARCHAR(255)）
- avatar: 头像 URL，可为空
- created_at: 创建时间，默认当前时间
- updated_at: 更新时间，按当前时间自动更新

## 2. 类别表 (categories)
- id: 主键，自增
- name: 分类名称，唯一，不可为空
- description: 分类描述，可为空
- created_at: 创建时间，默认当前时间

## 3. 文章表 (posts)
- id: 主键，自增
- title: 标题，不可为空
- content: 内容（需支持长文本 Markdown，建议 LONGTEXT）
- cover: 封面图 URL，可为空
- category_id: 分类 ID，外键关联 categories 表
- tags: 标签，使用 JSON 格式存储
- author_id: 作者 ID，外键关联 users 表
- views: 浏览次数，整型，默认为 0
- status: 文章状态（比如：'published' 已发布, 'draft' 草稿），默认 'published'
- created_at: 创建时间，默认当前时间
- updated_at: 更新时间，按当前时间自动更新