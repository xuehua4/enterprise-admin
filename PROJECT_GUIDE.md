# Enterprise Admin - 项目说明文档

## 项目概述

Enterprise Admin 是一个基于 Vue 3 + TypeScript + Element Plus 构建的企业级管理系统前端模板。该项目提供了完整的后台管理界面，包括用户管理、角色权限管理、菜单管理、系统日志等核心功能模块。

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | 3.5.34 | 前端框架 |
| TypeScript | 6.0.2 | 类型系统 |
| Vite | 8.0.12 | 构建工具 |
| Element Plus | 2.14.0 | UI 组件库 |
| Vue Router | 5.0.7 | 路由管理 |
| Pinia | 3.0.4 | 状态管理 |
| Vue I18n | 9.14.5 | 国际化 |
| ECharts | 6.1.0 | 图表库 |
| Axios | 1.16.1 | HTTP 请求 |
| SCSS | 1.100.0 | CSS 预处理器 |

## 项目结构

```
enterprise-admin/
├── public/                 # 静态资源
│   ├── favicon.svg        # 网站图标
│   └── icons.svg          # 图标集合
├── src/
│   ├── api/               # API 接口封装
│   │   ├── request.ts     # Axios 请求封装
│   │   └── user.ts        # 用户相关接口
│   ├── assets/            # 资源文件
│   │   ├── hero.png       # 英雄图片
│   │   ├── vite.svg       # Vite 图标
│   │   └── vue.svg        # Vue 图标
│   ├── components/        # 公共组件
│   │   ├── FullscreenToggle.vue   # 全屏切换组件
│   │   ├── GlobalSearch.vue       # 全局搜索组件
│   │   ├── HelloWorld.vue         # 示例组件
│   │   ├── TabBar.vue             # 标签页组件
│   │   └── UserGuide.vue          # 用户引导组件
│   ├── directives/        # 自定义指令
│   │   └── permission.ts  # 权限指令
│   ├── i18n/              # 国际化配置
│   │   ├── locales/       # 语言包
│   │   │   ├── en-US.ts   # 英文
│   │   │   └── zh-CN.ts   # 中文
│   │   └── index.ts       # i18n 配置
│   ├── layouts/           # 布局组件
│   │   └── MainLayout.vue # 主布局
│   ├── router/            # 路由配置
│   │   └── index.ts       # 路由定义
│   ├── stores/            # Pinia 状态管理
│   │   ├── guide.ts       # 引导状态
│   │   ├── permission.ts  # 权限状态
│   │   ├── tabs.ts        # 标签页状态
│   │   ├── theme.ts       # 主题状态
│   │   └── user.ts        # 用户状态
│   ├── styles/            # 全局样式
│   │   └── index.scss     # 样式入口
│   ├── views/             # 页面视图
│   │   ├── about/         # 关于页面
│   │   ├── dashboard/     # 仪表盘
│   │   ├── error/         # 错误页面
│   │   ├── log/           # 系统日志
│   │   ├── login/         # 登录页面
│   │   ├── menu/          # 菜单管理
│   │   ├── redirect/      # 重定向页面
│   │   ├── role/          # 角色管理
│   │   ├── settings/      # 系统设置
│   │   └── user/          # 用户管理
│   ├── App.vue            # 根组件
│   ├── auto-imports.d.ts  # 自动导入类型
│   ├── components.d.ts    # 组件类型声明
│   ├── env.d.ts           # 环境类型声明
│   └── main.ts            # 应用入口
├── .env                   # 环境变量
├── .gitignore             # Git 忽略配置
├── index.html             # HTML 模板
├── package.json           # 依赖配置
├── pnpm-lock.yaml         # pnpm 锁定文件
├── pnpm-workspace.yaml    # pnpm 工作区配置
├── README.md              # 项目说明
├── tsconfig.app.json      # TypeScript 应用配置
├── tsconfig.json          # TypeScript 主配置
├── tsconfig.node.json     # TypeScript Node 配置
└── vite.config.ts         # Vite 配置
```

## 核心功能模块

### 1. 用户认证
- 登录页面（`/login`）
- JWT Token 认证机制
- 路由守卫权限控制
- 默认账号：admin / admin123

### 2. 仪表盘（Dashboard）
- 数据统计卡片展示
- ECharts 图表（折线图、饼图、柱状图）
- 系统信息展示
- 快速操作入口

### 3. 用户管理
- 用户列表展示
- 新增/编辑/删除用户
- 用户状态管理
- 密码重置功能

### 4. 角色管理
- 角色列表管理
- 权限分配
- 角色增删改查

### 5. 菜单管理
- 菜单配置
- 权限标识设置
- 拖拽排序

### 6. 系统日志
- 操作日志记录
- 日志查询与导出
- 日志清空功能

### 7. 系统设置
- 个人信息修改
- 密码修改
- 主题切换（浅色/深色）
- 语言切换（中文/英文）

## 路由结构

```
/login              # 登录页（无需认证）
/                   # 主布局（需认证）
  ├── /dashboard    # 仪表盘
  ├── /user         # 用户管理
  ├── /role         # 角色管理
  ├── /menu         # 菜单管理
  ├── /log          # 系统日志
  ├── /settings     # 系统设置
  ├── /about        # 关于
  └── /redirect     # 重定向
/*                  # 404 页面
```

## 状态管理（Pinia）

### user.ts - 用户状态
- `token`: 用户认证令牌
- `userInfo`: 用户信息
- `login()`: 登录方法
- `logout()`: 登出方法

### permission.ts - 权限状态
- `permissions`: 权限列表
- `roles`: 角色列表
- `hasPermission()`: 权限检查
- `hasAnyPermission()`: 任意权限检查

### tabs.ts - 标签页状态
- `tabs`: 打开的标签页列表
- `addTab()`: 添加标签页
- `closeTab()`: 关闭标签页

### theme.ts - 主题状态
- `isDark`: 是否暗色主题
- `toggleTheme()`: 切换主题

### guide.ts - 引导状态
- `isGuiding`: 是否正在引导
- `startGuide()`: 开始引导
- `resetGuide()`: 重置引导

## 权限系统

### 权限指令
- `v-permission="'code'"`: 无权限时移除元素
- `v-permission-btn="'code'"`: 无权限时禁用元素

### 权限编码规范
- 菜单权限：`module:view`
- 按钮权限：`module:action`
- 示例：`user:view`, `user:add`, `user:edit`, `user:delete`

## 国际化（i18n）

### 支持语言
- 简体中文（zh-CN）
- 英文（en-US）

### 使用方式
```vue
<template>
  <div>{{ $t('menu.dashboard') }}</div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const title = t('menu.dashboard')
</script>
```

## API 请求封装

### request.ts 功能
- 请求/响应拦截器
- Token 自动注入
- 统一错误处理
- 401 自动跳转登录

### 使用示例
```typescript
import { request } from '@/api/request'

// GET 请求
const data = await request.get('/users')

// POST 请求
const result = await request.post('/users', { name: '张三' })

// PUT 请求
await request.put('/users/1', { name: '李四' })

// DELETE 请求
await request.delete('/users/1')
```

## 开发命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

## 开发服务器配置

- 端口：3000
- 代理配置：
  - `/api` → `http://localhost:8080`

## 自动导入配置

项目配置了 `unplugin-auto-import` 和 `unplugin-vue-components`，支持以下自动导入：

### 自动导入的 API
- Vue: `ref`, `reactive`, `computed`, `watch`, etc.
- Vue Router: `useRoute`, `useRouter`
- Pinia: `defineStore`

### 自动导入的组件
- Element Plus 组件（通过 ElementPlusResolver）

## 样式规范

### SCSS 使用
- 组件样式使用 `<style scoped lang="scss">`
- 全局样式在 `src/styles/index.scss`
- CSS 变量支持主题切换

### 主题变量
```scss
--bg-color          # 背景色
--header-bg         # 头部背景
--text-color        # 文字颜色
--text-color-secondary  # 次要文字颜色
```

## 浏览器兼容性

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 后续扩展建议

1. **后端集成**：接入真实的后端 API，替换 Mock 数据
2. **数据持久化**：使用 IndexedDB 或后端数据库存储
3. **更多图表**：集成更多 ECharts 图表类型
4. **数据导出**：添加 Excel/PDF 导出功能
5. **富文本编辑**：集成富文本编辑器
6. **文件上传**：添加文件上传组件
7. **消息通知**：集成 WebSocket 实时通知
8. **工作流**：添加审批流程功能

## 默认账号

- 用户名：`admin`
- 密码：`admin123`

## 许可证

MIT License
