# Enterprise Admin

基于 Vue 3 + TypeScript + Element Plus 的企业级管理系统前端模板。

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全的 JavaScript 超集
- **Vite** - 下一代前端构建工具
- **Element Plus** - 基于 Vue 3 的组件库
- **Vue Router** - Vue.js 官方路由管理器
- **Pinia** - Vue.js 状态管理方案
- **Vue I18n** - 国际化插件
- **ECharts** - 开源可视化库
- **Axios** - HTTP 客户端
- **SCSS** - CSS 预处理器

## 功能特性

- 用户认证与权限管理
- 仪表盘数据可视化
- 用户管理（增删改查）
- 角色与权限管理
- 菜单管理
- 系统日志
- 国际化支持（中英文）
- 主题切换（浅色/深色）
- 响应式布局

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

开发服务器默认运行在 http://localhost:3000

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
src/
├── api/           # API 接口封装
├── assets/        # 静态资源
├── components/    # 公共组件
├── directives/    # 自定义指令
├── i18n/          # 国际化配置
├── layouts/       # 布局组件
├── router/        # 路由配置
├── stores/        # Pinia 状态管理
├── styles/        # 全局样式
├── views/         # 页面视图
├── App.vue        # 根组件
└── main.ts        # 应用入口
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
