# Enterprise Admin

基于 Vue 3 + TypeScript + Element Plus 的企业级管理系统前端模板。

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | 3.5.34 | 前端框架 |
| TypeScript | 6.0.2 | 类型系统 |
| Vite | 8.0.12 | 构建工具 |
| Element Plus | 2.14.0 | UI 组件库 |
| Vue Router | 5.0.7 | 路由管理 |
| Pinia | 3.0.4 | 状态管理 |
| Pinia Persistedstate | 4.7.1 | 状态持久化 |
| Vue I18n | 9.14.5 | 国际化 |
| ECharts | 6.1.0 | 图表库 |
| Vue ECharts | 8.0.1 | ECharts Vue 封装 |
| Axios | 1.16.1 | HTTP 客户端 |
| SCSS | 1.100.0 | CSS 预处理器 |

## 功能特性

- 用户认证与权限管理（Mock 登录 + JWT Token 模拟）
- 仪表盘数据可视化（ECharts 图表）
- 用户管理（增删改查）
- 角色与权限管理
- 菜单管理
- 系统日志
- 系统设置（个人信息、密码修改）
- 国际化支持（中英文）
- 主题切换（浅色/深色）
- 标签页导航（多标签页管理）
- 全局搜索
- 全屏模式
- 用户引导
- 响应式布局
- 状态持久化（Pinia + localStorage）

## 部署方式

### GitHub Pages（CI/CD 自动部署）

项目已配置 GitHub Actions 工作流，推送到 `master` 分支后自动构建并部署到 GitHub Pages。

### Vercel 部署

项目已配置 `vercel.json`，支持 SPA 路由重写和静态资源缓存策略。

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

开发服务器默认运行在 http://localhost:5173

### 构建生产版本

```bash
pnpm build
```

### 预览生产构建

```bash
pnpm preview
```

## 默认账号

- 用户名：`admin`
- 密码：`admin123`

## 项目结构

```
enterprise-admin/
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Pages CI/CD 配置
├── .vscode/
│   └── extensions.json       # VSCode 推荐插件
├── public/                   # 静态资源
│   ├── .nojekyll             # GitHub Pages 禁用 Jekyll
│   └── favicon.svg           # 网站图标
├── src/
│   ├── components/           # 公共组件
│   │   ├── FullscreenToggle.vue   # 全屏切换组件
│   │   ├── GlobalSearch.vue       # 全局搜索组件
│   │   ├── TabBar.vue             # 标签页导航组件
│   │   └── UserGuide.vue          # 用户引导组件
│   ├── directives/           # 自定义指令
│   │   └── permission.ts      # 权限指令（v-permission / v-permission-btn）
│   ├── i18n/                 # 国际化配置
│   │   ├── locales/           # 语言包
│   │   │   ├── en-US.ts       # 英文
│   │   │   └── zh-CN.ts       # 中文
│   │   └── index.ts           # i18n 配置
│   ├── layouts/              # 布局组件
│   │   └── MainLayout.vue     # 主布局（侧边栏 + 顶栏 + 内容区）
│   ├── router/               # 路由配置
│   │   └── index.ts           # 路由定义 + 导航守卫
│   ├── stores/               # Pinia 状态管理
│   │   ├── user.ts            # 用户状态（含持久化）
│   │   ├── permission.ts      # 权限状态
│   │   ├── tabs.ts            # 标签页状态
│   │   ├── theme.ts           # 主题状态
│   │   └── guide.ts           # 引导状态
│   ├── styles/               # 全局样式
│   │   └── index.scss         # 样式入口
│   ├── views/                # 页面视图
│   │   ├── dashboard/index.vue    # 仪表盘
│   │   ├── user/index.vue         # 用户管理
│   │   ├── role/index.vue         # 角色管理
│   │   ├── menu/index.vue         # 菜单管理
│   │   ├── log/index.vue          # 系统日志
│   │   ├── settings/index.vue     # 系统设置
│   │   ├── about/index.vue        # 关于页面
│   │   ├── login/index.vue        # 登录页面
│   │   ├── redirect/index.vue     # 重定向页面
│   │   └── error/404.vue          # 404 页面
│   ├── App.vue              # 根组件
│   └── main.ts              # 应用入口
├── .env                     # 环境变量
├── .gitignore               # Git 忽略配置
├── index.html               # HTML 模板
├── package.json             # 依赖配置
├── vercel.json              # Vercel 部署配置
├── vite.config.ts           # Vite 配置（含代理）
├── tsconfig.json             # TypeScript 主配置
├── tsconfig.app.json         # TypeScript 应用配置
├── tsconfig.node.json        # TypeScript Node 配置
├── README.md                 # 项目说明
└── PROJECT_GUIDE.md          # 详细文档
```

## 详细文档

详见 [PROJECT_GUIDE.md](./PROJECT_GUIDE.md)

## 浏览器支持

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 许可证

MIT License
