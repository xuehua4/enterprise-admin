# Enterprise Admin - 项目说明文档

## 项目概述

Enterprise Admin 是一个基于 Vue 3 + TypeScript + Element Plus 构建的企业级管理系统前端模板。该项目提供了完整的后台管理界面，包括用户管理、角色权限管理、菜单管理、系统日志等核心功能模块。支持 GitHub Pages 和 Vercel 双平台部署。

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | 3.5.34 | 前端框架 |
| TypeScript | 6.0.2 | 类型系统 |
| Vite | 8.0.12 | 构建工具 |
| Element Plus | 2.14.0 | UI 组件库 |
| @element-plus/icons-vue | 2.3.2 | Element Plus 图标库 |
| Vue Router | 5.0.7 | 路由管理 |
| Pinia | 3.0.4 | 状态管理 |
| pinia-plugin-persistedstate | 4.7.1 | Pinia 状态持久化插件 |
| Vue I18n | 9.14.5 | 国际化 |
| ECharts | 6.1.0 | 图表库 |
| vue-echarts | 8.0.1 | ECharts Vue 组件封装 |
| Axios | 1.16.1 | HTTP 请求 |
| SCSS | 1.100.0 | CSS 预处理器 |
| unplugin-auto-import | 21.0.0 | API 自动导入 |
| unplugin-vue-components | 32.1.0 | 组件自动导入 |

## 项目结构

```
enterprise-admin/
├── .github/                     # GitHub 配置
│   └── workflows/
│       └── deploy.yml           # GitHub Pages CI/CD 工作流
├── .vscode/                     # VSCode 编辑器配置
│   └── extensions.json          # 推荐扩展插件列表
├── public/                      # 静态资源（不经过构建处理）
│   ├── .nojekyll                # GitHub Pages 禁用 Jekyll 处理
│   └── favicon.svg              # 网站图标
├── src/                         # 源代码目录
│   ├── components/              # 公共组件（全局复用）
│   │   ├── FullscreenToggle.vue # 全屏切换按钮组件
│   │   ├── GlobalSearch.vue     # 全局搜索弹窗组件
│   │   ├── TabBar.vue           # 多标签页导航栏组件
│   │   └── UserGuide.vue        # 新手引导（分步提示）组件
│   ├── directives/              # Vue 自定义指令
│   │   └── permission.ts        # 权限控制指令（v-permission / v-permission-btn）
│   ├── i18n/                    # 国际化（i18n）配置
│   │   ├── locales/             # 语言包文件
│   │   │   ├── en-US.ts         # 英文语言包
│   │   │   └── zh-CN.ts         # 中文语言包
│   │   └── index.ts             # i18n 实例创建与配置
│   ├── layouts/                 # 页面布局组件
│   │   └── MainLayout.vue       # 主布局（侧边栏导航 + 顶部工具栏 + 内容区域）
│   ├── router/                  # 路由配置
│   │   └── index.ts             # 路由定义、嵌套路由、导航守卫
│   ├── stores/                  # Pinia 状态管理
│   │   ├── user.ts              # 用户状态（登录/登出/用户信息，含 localStorage 持久化）
│   │   ├── permission.ts        # 权限状态（权限列表、角色列表、权限检查方法）
│   │   ├── tabs.ts              # 标签页状态（已打开的标签页列表管理）
│   │   ├── theme.ts             # 主题状态（浅色/深色模式切换）
│   │   └── guide.ts             # 引导状态（用户引导流程控制）
│   ├── styles/                  # 全局样式
│   │   └── index.scss           # 全局样式入口（CSS 变量、重置样式、通用工具类）
│   ├── views/                   # 页面视图（按功能模块划分）
│   │   ├── dashboard/index.vue  # 仪表盘首页（统计卡片 + ECharts 图表）
│   │   ├── user/index.vue       # 用户管理（CRUD + 状态管理 + 密码重置）
│   │   ├── role/index.vue       # 角色管理（角色 CRUD + 权限分配）
│   │   ├── menu/index.vue       # 菜单管理（菜单树配置 + 权限标识）
│   │   ├── log/index.vue        # 系统日志（操作日志查询 + 导出 + 清空）
│   │   ├── settings/index.vue   # 系统设置（个人信息 / 密码修改 / 主题 / 语言）
│   │   ├── about/index.vue      # 关于页面（项目信息与技术栈展示）
│   │   ├── login/index.vue      # 登录页面（表单验证 + Mock 认证）
│   │   ├── redirect/index.vue   # 内部重定向页面（用于路由刷新）
│   │   └── error/
│   │       └── 404.vue          # 404 未找到页面
│   ├── App.vue                  # Vue 应用根组件
│   ├── main.ts                  # 应用入口（注册插件、全局组件、初始化配置）
│   ├── auto-imports.d.ts        # unplugin-auto-import 自动生成的类型声明
│   ├── components.d.ts          # unplugin-vue-components 自动生成的组件类型声明
│   └── env.d.ts                 # Vite 环境变量类型声明
├── .env                         # 环境变量（API 地址、应用标题、环境标识）
├── .gitignore                   # Git 版本控制忽略规则
├── index.html                   # HTML 入口模板
├── package.json                 # NPM 依赖包配置与脚本命令
├── pnpm-lock.yaml               # pnpm 依赖锁定文件（确保版本一致性）
├── pnpm-workspace.yaml          # pnpm monorepo 工作区配置
├── vercel.json                  # Vercel 平台部署配置（SPA 路由 + 缓存策略 + 安全头）
├── vite.config.ts               # Vite 构建工具配置（别名、代理、自动导入插件）
├── tsconfig.json                # TypeScript 主配置文件（引用其他配置）
├── tsconfig.app.json            # TypeScript 应用代码配置（严格模式、路径映射）
├── tsconfig.node.json           # TypeScript Node.js 配置（Vite 配置文件类型检查）
├── README.md                    # 项目快速入门说明
└── PROJECT_GUIDE.md             # 本文档 - 详细项目说明
```

## 核心功能模块

### 1. 用户认证
- 登录页面（`/login`）- 表单校验 + Mock 登录
- Token 模拟认证机制（localStorage 存储 mock-jwt-token）
- 路由守卫权限控制（未登录自动跳转 `/login`，携带 redirect 参数）
- 用户状态持久化（`pinia-plugin-persistedstate`，刷新页面保留登录态）
- 默认账号：admin / admin123

### 2. 仪表盘（Dashboard）
- 数据统计卡片展示（用户数、角色数、菜单数、日志数等）
- ECharts 图表可视化：
  - 折线图（趋势数据）
  - 饼图（占比分布）
  - 柱状图（对比数据）
- 系统信息展示（Vue/Element Plus/Vite 版本号）
- 快速操作入口

### 3. 用户管理
- 用户列表展示（表格分页、搜索筛选）
- 新增 / 编辑 / 删除用户（对话框表单）
- 用户状态管理（启用 / 禁用切换）
- 密码重置功能

### 4. 角色管理
- 角色列表管理
- 权限分配（勾选权限编码）
- 角色增删改查

### 5. 菜单管理
- 菜单树形结构配置
- 权限标识设置（每个菜单项绑定 permission code）
- 菜单增删改查

### 6. 系统日志
- 操作日志记录列表
- 日志查询与导出
- 日志清空功能

### 7. 系统设置
- 个人信息修改
- 密码修改
- 主题切换（浅色 / 深色模式，CSS 变量驱动）
- 语言切换（中文 / 英文，Vue I18n 实时切换）

### 8. 导航与交互增强
- **标签页导航**：多页面打开时以标签页形式切换，支持关闭当前 / 关闭其他 / 关闭全部
- **全局搜索**：快捷键唤起搜索框，快速定位菜单和功能
- **全屏模式**：一键切换浏览器全屏显示
- **用户引导**：首次访问时的分步操作指引（Driver.js 风格）

## 路由结构

```
/login                          # 登录页（无需认证，meta.requiresAuth: false）
/                               # 主布局 MainLayout（需认证，redirect → /dashboard）
├── /dashboard                  # 仪表盘（permission: dashboard:view）
├── /user                       # 用户管理（permission: user:view）
├── /role                       # 角色管理（permission: role:view）
├── /menu                       # 菜单管理（permission: menu:view）
├── /log                        # 系统日志（permission: log:view）
├── /settings                   # 系统设置（permission: settings:view）
├── /about                      # 关于页面（permission: about:view）
└── /redirect/:path(.*)         # 内部重定向（hidden: true，meta.hidden）
/*                              # 404 通配路由 → views/error/404.vue
```

**路由守卫逻辑**（`router.beforeEach`）：
1. 设置页面标题为 `{页面标题} - Enterprise Admin`
2. 检查 localStorage 中的 token
3. 若目标路由需要认证（`requiresAuth !== false`）且无 token，跳转 `/login?redirect={当前路径}`

## 状态管理（Pinia）

所有 Store 使用 **Composition API 风格**（`defineStore(id, setupFn)`），并配合 `pinia-plugin-persistedstate` 实现状态持久化。

### user.ts - 用户状态
- `token`: 用户认证令牌（存储于 localStorage）
- `userInfo`: 用户信息对象（id, username, name, avatar, roles[]）
- `isLoggedIn`: 计算属性，判断是否已登录
- `username` / `displayName`: 计算属性，快捷获取用户名/显示名
- `login(username, password)`: Mock 登录方法（admin/admin123 验证）
- `logout()`: 登出方法（清除 token 和 userInfo）
- `setToken()` / `setUserInfo()`: 内部 setter 方法
- **持久化配置**: `persist: { key: 'enterprise_admin_user', pick: ['token', 'userInfo'] }`

### permission.ts - 权限状态
- `permissions`: 权限列表
- `roles`: 角色列表
- `hasPermission()`: 检查是否拥有指定权限
- `hasAnyPermission()`: 检查是否拥有任意一个指定权限

### tabs.ts - 标签页状态
- `tabs`: 打开的标签页列表
- `addTab()`: 添加标签页
- `closeTab()`: 关闭标签页
- `closeOtherTabs()`: 关闭其他标签页
- `closeAllTabs()`: 关闭全部标签页

### theme.ts - 主题状态
- `isDark`: 是否暗色主题（布尔值）
- `toggleTheme()`: 切换主题（切换 `<html>` 元素的 `dark` class）

### guide.ts - 引导状态
- `isGuiding`: 是否正在引导
- `startGuide()`: 开始引导流程
- `resetGuide()`: 重置引导状态

## 权限系统

### 权限指令
在 `src/directives/permission.ts` 中注册两个自定义指令：

- `v-permission="'code'"`：无权限时 **移除** DOM 元素（v-if 效果）
- `v-permission-btn="'code'"`：无权限时 **禁用** 元素（设置 disabled 属性）

### 权限编码规范
- 菜单权限：`module:view`（如 `dashboard:view`, `user:view`）
- 按钮权限：`module:action`（如 `user:add`, `user:edit`, `user:delete`）
- 路由 meta 中通过 `permission` 字段声明页面级权限

## 国际化（i18n）

### 支持语言
- 简体中文（zh-CN）- 默认语言
- 英文（en-US）

### 使用方式
```vue
<template>
  <div>{{ $t('menu.dashboard') }}</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const title = t('menu.dashboard')
</script>
```

### 语言切换
通过 `theme.ts` store 中的方法切换，实时更新 `document.documentElement.lang`。

## 开发命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器（端口 5173，自动打开浏览器）
pnpm dev

# 构建生产版本（TypeScript 类型检查 + Vite 构建）
pnpm build

# 预览生产构建结果
pnpm preview
```

## 开发服务器配置

- **端口**：5173
- **自动打开浏览器**：`open: true`
- **API 代理**：
  - `/api` → `http://localhost:8080`（去除 `/api` 前缀后转发）
- **路径别名**：`@` → `./src`
- **环境变量**：支持 `GITHUB_PAGES` 环境变量控制 base path（GitHub Pages 部署时设为 `/enterprise-admin/`）

## 自动导入配置

项目使用 `unplugin-auto-import` 和 `unplugin-vue-components` 插件实现 API 和组件的自动导入：

### 自动导入的 API
- **Vue 核心 API**：`ref`, `reactive`, `computed`, `watch`, `onMounted`, `nextTick` 等
- **Vue Router**：`useRoute`, `useRouter`
- **Pinia**：`defineStore`
- **Element Plus** 相关 API（通过 `ElementPlusResolver`）

### 自动导入的组件
- 所有 **Element Plus 组件**（通过 `ElementPlusResolver` 自动解析）
- 无需手动 `import { ElButton } from 'element-plus'`，直接在模板中使用即可

### 自动生成的类型文件
- `src/auto-imports.d.ts`：自动导入的 API 类型声明
- `src/components.d.ts`：自动导入的组件类型声明

> **注意**：修改自动导入配置后需重启开发服务器以重新生成类型声明文件。

## 样式规范

### SCSS 使用
- 组件内部样式使用 `<style scoped lang="scss">`
- 全局样式统一在 `src/styles/index.scss` 中定义
- CSS 变量（Custom Properties）支持主题切换时动态变更颜色

### 主题变量
```scss
--bg-color                    /* 页面背景色 */
--header-bg                   /* 头部/顶栏背景色 */
--text-color                  /* 主要文字颜色 */
--text-color-secondary        /* 次要文字颜色 */
--sidebar-bg                  /* 侧边栏背景色 */
--border-color                /* 边框颜色 */
/* 更多变量见 src/styles/index.scss */
```

## 部署

### 方式一：GitHub Pages（推荐）

项目内置 GitHub Actions 自动部署工作流（`.github/workflows/deploy.yml`）。

**部署条件：**
1. Fork 或 Clone 本仓库到 GitHub
2. 在仓库 Settings > Pages 中启用 GitHub Pages
3. 选择 Source 为 `GitHub Actions`
4. 推送代码到 `master` 分支，自动触发构建和部署

**工作流详情：**
- 运行环境：ubuntu-latest
- Node.js 版本：22
- 包管理器：pnpm v9
- 构建命令：`pnpm build`（设置 `GITHUB_PAGES=true` 以调整 base path）
- 部署目标：GitHub Pages

### 方式二：Vercel

项目已包含 `vercel.json` 配置文件，支持以下特性：

- **SPA 路由重写**：所有路径回退到 `/index.html`（支持 Vue Router 的 history 模式）
- **静态资源缓存**：`/assets/*` 设置 1 年不可变缓存（`immutable`）
- **安全响应头**：
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`

**Vercel 部署步骤：**
1. 在 https://vercel.com/new 导入本仓库
2. Framework Preset 选 `Vite`
3. Build Command 保持默认 `pnpm build`
4. Output Directory 保持默认 `dist`
5. 点击 Deploy

### 环境变量说明

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `VITE_API_BASE_URL` | API 基础路径 | `/api` |
| `VITE_APP_TITLE` | 应用标题 | `Enterprise Admin` |
| `VITE_APP_ENV` | 当前环境标识 | `development` |
| `GITHUB_PAGES` | GitHub Pages 部署标记（设为任意值即生效） | 未设置 |

## 浏览器兼容性

- Chrome >= 80
- Firefox >= 75
- Safari >= 13
- Edge >= 80

## 后续扩展建议

1. **后端集成**：接入真实的后端 API，替换 Mock 数据（目前登录为 Mock 实现）
2. **API 请求封装**：添加 `src/api/request.ts` 统一 Axios 封装（拦截器、Token 注入、错误处理）
3. **数据持久化**：接入后端数据库存储，或使用 IndexedDB 做本地缓存
4. **更多图表**：集成更多 ECharts 图表类型（地图、散点图、雷达图等）
5. **数据导出**：添加 Excel/PDF 导出功能（如 xlsx / jsPDF 库）
6. **富文本编辑**：集成富文本编辑器（如 TinyMCE / WangEditor）
7. **文件上传**：添加文件上传/下载组件（支持拖拽、断点续传）
8. **消息通知**：集成 WebSocket 实时通知或 Server-Sent Events
9. **工作流引擎**：添加审批流程功能（可视化流程设计器）
10. **RBAC 增强**：细化到按钮级权限的数据权限控制

## 默认账号

- 用户名：`admin`
- 密码：`admin123`

## 许可证

MIT License
