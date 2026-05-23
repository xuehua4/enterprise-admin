<template>
  <el-container class="main-layout">
    <el-aside :width="isCollapsed ? '64px' : '240px'" class="aside">
      <div class="logo">
        <el-icon size="24"><Monitor /></el-icon>
        <span v-show="!isCollapsed" class="logo-text">Enterprise Admin</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapsed"
        :router="true"
        class="sidebar-menu"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <el-menu-item
          v-for="route in menuRoutes"
          :key="route.path"
          :index="'/' + route.path"
        >
          <el-icon><component :is="route.meta?.icon || 'Document'" /></el-icon>
          <template #title>{{ $t(`menu.${getMenuKey(route.path)}`) || route.meta?.title }}</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-icon
            class="collapse-btn"
            size="20"
            @click="isCollapsed = !isCollapsed"
          >
            <Fold v-if="!isCollapsed" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">{{ $t('header.home') }}</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentRouteTitle">{{ currentRouteTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <!-- Theme Toggle -->
          <el-tooltip :content="themeStore.isDark ? 'Light Mode' : 'Dark Mode'">
            <el-icon class="header-icon" size="20" @click="themeStore.toggleTheme">
              <Sunny v-if="themeStore.isDark" />
              <Moon v-else />
            </el-icon>
          </el-tooltip>

          <!-- Language Switch -->
          <el-dropdown trigger="click" @command="handleLanguageChange">
            <el-icon class="header-icon" size="20">
              <Guide />
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="zh-CN" :class="{ 'is-active': currentLocale === 'zh-CN' }">
                  简体中文
                </el-dropdown-item>
                <el-dropdown-item command="en-US" :class="{ 'is-active': currentLocale === 'en-US' }">
                  English
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <!-- User Dropdown -->
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-icon><User /></el-icon>
              <span>{{ userStore.displayName }}</span>
              <el-icon><ArrowDown /></el-icon>
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

      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'
import { setLocale, type Locale } from '@/i18n'
import {
  Monitor, Fold, Expand, User, ArrowDown, Sunny, Moon, Guide
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const themeStore = useThemeStore()
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
</script>

<style scoped lang="scss">
.main-layout {
  height: 100vh;
}

.aside {
  background-color: #304156;
  transition: width 0.3s;
  overflow: hidden;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid #3d4a5c;
}

.logo-text {
  white-space: nowrap;
}

.sidebar-menu {
  border-right: none;
  height: calc(100% - 60px);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--header-bg, #fff);
  border-bottom: 1px solid var(--header-border, #e6e6e6);
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.collapse-btn {
  cursor: pointer;
  color: var(--text-color-secondary, #606266);
  &:hover { color: #409EFF; }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  cursor: pointer;
  color: var(--text-color-secondary, #606266);
  &:hover { color: #409EFF; }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: var(--text-color-secondary, #606266);
  &:hover { color: #409EFF; }
}

.main-content {
  background-color: var(--bg-color, #f0f2f5);
  min-height: 0;
  overflow-y: auto;
}

:deep(.el-dropdown-menu__item.is-active) {
  color: #409EFF;
  background-color: #ecf5ff;
}
</style>
