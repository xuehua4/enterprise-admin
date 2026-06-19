<template>
  <el-container class="main-layout">
    <el-aside :width="isCollapsed ? '64px' : '240px'" class="aside">
      <div class="logo">
        <el-icon size="24">
          <Monitor />
        </el-icon>
        <span v-show="!isCollapsed" class="logo-text">Enterprise Admin</span>
      </div>
      <el-menu :default-active="activeMenu" :collapse="isCollapsed" :router="true" class="sidebar-menu"
        :background-color="themeStore.isDark ? '#1f1f1f' : '#304156'"
        :text-color="themeStore.isDark ? '#a3a6ad' : '#bfcbd9'" active-text-color="#409EFF">
        <el-menu-item v-for="route in menuRoutes" :key="route.path" :index="'/' + route.path">
          <el-icon>
            <component :is="route.meta?.icon || 'Document'" />
          </el-icon>
          <template #title>{{ $t(`menu.${getMenuKey(route.path)}`) || route.meta?.title }}</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="isCollapsed = !isCollapsed">
            <Fold v-if="!isCollapsed" />
            <Expand v-else />
          </el-icon>

          <!-- Breadcrumb -->
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">{{ $t('header.home') }}</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentRouteTitle">{{ currentRouteTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <!-- Global Search -->
          <GlobalSearch />

          <!-- Theme Toggle -->
          <el-tooltip :content="themeStore.isDark ? $t('settings.lightTheme') : $t('settings.darkTheme')">
            <el-icon class="header-icon theme-toggle" @click="themeStore.toggleTheme">
              <Sunny v-if="themeStore.isDark" />
              <Moon v-else />
            </el-icon>
          </el-tooltip>

          <!-- Fullscreen -->
          <FullscreenToggle />

          <!-- Language Switch -->
          <el-dropdown trigger="click" @command="handleLanguageChange">
            <el-icon class="header-icon">
              <Guide />
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="zh-CN" :class="{ 'is-active': currentLocale === 'zh-CN' }">
                  🇨🇳 简体中文
                </el-dropdown-item>
                <el-dropdown-item command="en-US" :class="{ 'is-active': currentLocale === 'en-US' }">
                  🇺🇸 English
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <!-- User Guide -->
          <el-tooltip content="User Guide">
            <el-icon class="header-icon" @click="startGuide">
              <QuestionFilled />
            </el-icon>
          </el-tooltip>

          <!-- User Dropdown -->
          <el-dropdown @command="handleCommand">
            <span class="user-info user-dropdown">
              <el-icon>
                <User />
              </el-icon>
              <span>{{ userStore.displayName }}</span>
              <el-icon>
                <ArrowDown />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">{{ $t('header.profile') }}</el-dropdown-item>
                <el-dropdown-item command="logout" divided>{{ $t('header.logout') }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- Tab Bar -->
      <TabBar />

      <el-main class="main-content">
        <router-view v-slot="{ Component, route }">
          <keep-alive :include="cachedViews">
            <component :is="Component" :key="route.path" />
          </keep-alive>
        </router-view>
      </el-main>
    </el-container>

    <!-- User Guide -->
    <UserGuide ref="userGuideRef" />
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'
import { useTabsStore } from '@/stores/tabs'
import { useGuideStore } from '@/stores/guide'
import { setLocale, type Locale } from '@/i18n'
import TabBar from '@/components/TabBar.vue'
import GlobalSearch from '@/components/GlobalSearch.vue'
import FullscreenToggle from '@/components/FullscreenToggle.vue'
import UserGuide from '@/components/UserGuide.vue'
import {
  Monitor, Fold, Expand, User, ArrowDown, Sunny, Moon, Guide, QuestionFilled
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const themeStore = useThemeStore()
const tabsStore = useTabsStore()
const guideStore = useGuideStore()
/** 用户引导组件引用（用于外部调用 startGuide） */
const userGuideRef = ref<InstanceType<typeof UserGuide>>()
const { locale, t } = useI18n()

const isCollapsed = ref(false)

const currentLocale = computed(() => locale.value)

const menuRoutes = computed(() => {
  const indexRoute = router.getRoutes().find(r => r.path === '/')
  return indexRoute?.children?.filter(r => !r.meta?.hidden) || []
})

const activeMenu = computed(() => route.path)

const currentRouteTitle = computed(() => {
  const menuKey = getMenuKey(route.path.replace('/', ''))
  return t(`menu.${menuKey}`) || (route.meta?.title as string) || ''
})

// Cached views for keep-alive
const cachedViews = computed(() => {
  return tabsStore.tabs.map(tab => tab.name).filter(Boolean)
})

// Watch route changes to add tabs
watch(
  () => route.path,
  () => {
    if (route.meta?.hidden) return
    tabsStore.addTab(route)
  },
  { immediate: true }
)

// Map route paths to i18n menu keys
function getMenuKey(path: string): string {
  const keyMap: Record<string, string> = {
    'dashboard': 'dashboard',
    'user': 'userManagement',
    'role': 'roleManagement',
    'menu': 'menuManagement',
    'log': 'systemLog',
    'settings': 'systemSettings',
    'about': 'about'
  }
  return keyMap[path] || ''
}

function handleLanguageChange(lang: Locale) {
  setLocale(lang)
}

function handleCommand(command: string) {
  if (command === 'logout') {
    userStore.logout()
    router.push('/login')
  } else if (command === 'profile') {
    router.push('/settings')
  }
}

function startGuide() {
  guideStore.resetGuide()
  guideStore.startGuide()
  // 通过组件ref直接调用startGuide方法，无需reload页面
  userGuideRef.value?.startGuide()
}
</script>

<style scoped lang="scss">
/* ==================== 主容器 ==================== */
.main-layout {
  height: 100vh;
}

/* ==================== 侧边栏（现代化深色渐变设计） ==================== */
.aside {
  background: linear-gradient(180deg, #1e1b4b 0%, #1a1832 50%, #16142a 100%);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  position: relative;

  /* 装饰光效 */
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -30%;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  /* 暗色模式适配 */
  :global(html.dark) &,
  :global(.dark) & {
    background: linear-gradient(180deg, #0f0f17 0%, #0a0a10 100%);

    &::after {
      background: radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%);
    }
  }
}

/* ==================== Logo 区域（渐变文字） ==================== */
.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  letter-spacing: -0.3px;
}

.logo-text {
  white-space: nowrap;
  background: linear-gradient(135deg, #fff 0%, #c7d2fe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ==================== 侧边菜单（现代化交互） ==================== */
.sidebar-menu {
  border-right: none;
  height: calc(100% - 60px);
  padding: 8px;

  :deep(.el-menu-item) {
    margin-bottom: 4px;
    border-radius: 10px;
    height: 44px;
    line-height: 44px;
    transition: all 0.25s ease;

    &:hover {
      background: rgba(99, 102, 241, 0.12) !important;
      color: #a5b4fc !important;
    }

    &.is-active {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.15)) !important;
      color: #fff !important;
      font-weight: 600;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 20px;
        background: linear-gradient(180deg, #6366f1, #8b5cf6);
        border-radius: 0 3px 3px 0;
      }
    }
  }
}

/* ==================== 头部导航栏（毛玻璃效果） ==================== */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.05);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.collapse-btn {
  cursor: pointer;
  color: var(--text-color-secondary, #606266);
  transition: all 0.2s ease;
  padding: 10px;
  border-radius: 10px;
  font-size: 45px;

  &:hover {
    color: #6366f1;
    background: rgba(99, 102, 241, 0.08);
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.header-icon {
  cursor: pointer;
  color: var(--text-color-secondary, #606266);
  transition: all 0.2s ease;
  padding: 10px;
  border-radius: 10px;
  font-size: 45px;

  /* 强制内部图标跟随父级大小 */
  :deep(.el-icon) {
    font-size: inherit;
  }

  &:hover {
    color: #6366f1;
    background: rgba(99, 102, 241, 0.08);
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: var(--text-color-secondary, #606266);
  padding: 6px 10px;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-size: 13px;
  font-weight: 500;

  &:hover {
    color: #6366f1;
    background: rgba(99, 102, 241, 0.08);
  }
}

/* ==================== 主内容区（点阵背景） ==================== */
.main-content {
  background-color: #f8fafc;
  min-height: 0;
  overflow-y: auto;
  padding: 20px;

  /* 微妙点阵纹理 */
  background-image:
    radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.03) 1px, transparent 0);
  background-size: 24px 24px;
}

/* ==================== 下拉菜单激活态 ==================== */
:deep(.el-dropdown-menu__item.is-active) {
  color: #6366f1;
  background: rgba(99, 102, 241, 0.08);
  font-weight: 500;
}
</style>
