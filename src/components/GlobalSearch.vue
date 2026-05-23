<template>
  <div class="global-search">
    <div class="search-trigger" @click="visible = true">
      <el-icon size="18"><Search /></el-icon>
      <span class="search-placeholder">{{ $t('search.placeholder') }}</span>
      <el-tag size="small" class="shortcut">Ctrl+K</el-tag>
    </div>

    <el-dialog
      v-model="visible"
      :title="$t('search.title')"
      width="560px"
      :close-on-click-modal="true"
      class="search-dialog"
      @open="onOpen"
      @close="onClose"
    >
      <el-input
        ref="inputRef"
        v-model="keyword"
        :placeholder="$t('search.inputPlaceholder')"
        size="large"
        clearable
        :prefix-icon="Search"
        @input="onSearch"
        @keydown.up.prevent="navigate(-1)"
        @keydown.down.prevent="navigate(1)"
        @keydown.enter.prevent="selectActive"
      />

      <div class="search-results">
        <div
          v-for="(item, index) in filteredResults"
          :key="item.path"
          class="search-item"
          :class="{ active: index === activeIndex }"
          @click="goTo(item)"
          @mouseenter="activeIndex = index"
        >
          <el-icon class="item-icon"><component :is="item.icon || 'Document'" /></el-icon>
          <div class="item-info">
            <div class="item-title">{{ item.title }}</div>
            <div class="item-path">{{ item.path }}</div>
          </div>
          <el-icon v-if="index === activeIndex" class="enter-icon"><DArrowRight /></el-icon>
        </div>
        <el-empty v-if="keyword && filteredResults.length === 0" :description="$t('search.noResults')" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Search, DArrowRight } from '@element-plus/icons-vue'

const router = useRouter()

const visible = ref(false)
const keyword = ref('')
const activeIndex = ref(0)
const inputRef = ref()

interface SearchItem {
  path: string
  title: string
  icon?: string
  keywords: string[]
}

const allRoutes: SearchItem[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'Odometer', keywords: ['仪表盘', '首页', 'dashboard'] },
  { path: '/user', title: 'User Management', icon: 'User', keywords: ['用户管理', 'user', 'users'] },
  { path: '/role', title: 'Role Management', icon: 'Postcard', keywords: ['角色管理', 'role', 'roles'] },
  { path: '/menu', title: 'Menu Management', icon: 'Menu', keywords: ['菜单管理', 'menu', 'menus'] },
  { path: '/log', title: 'System Log', icon: 'Document', keywords: ['系统日志', 'log', 'logs'] },
  { path: '/settings', title: 'Settings', icon: 'Setting', keywords: ['系统设置', '设置', 'settings'] },
  { path: '/about', title: 'About', icon: 'InfoFilled', keywords: ['关于', 'about'] },
]

const filteredResults = computed(() => {
  if (!keyword.value.trim()) return allRoutes
  const kw = keyword.value.toLowerCase()
  return allRoutes.filter(item =>
    item.title.toLowerCase().includes(kw) ||
    item.path.toLowerCase().includes(kw) ||
    item.keywords.some(k => k.toLowerCase().includes(kw))
  )
})

function onSearch() {
  activeIndex.value = 0
}

function navigate(dir: number) {
  const len = filteredResults.value.length
  if (len === 0) return
  activeIndex.value = (activeIndex.value + dir + len) % len
}

function selectActive() {
  const item = filteredResults.value[activeIndex.value]
  if (item) goTo(item)
}

function goTo(item: SearchItem) {
  router.push(item.path)
  visible.value = false
  keyword.value = ''
}

function onOpen() {
  nextTick(() => inputRef.value?.focus())
}

function onClose() {
  keyword.value = ''
  activeIndex.value = 0
}

// Global keyboard shortcut
function handleKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    visible.value = true
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleKeydown)
}
</script>

<style scoped lang="scss">
.search-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: 1px solid var(--border-color, #dcdfe6);
  border-radius: 6px;
  cursor: pointer;
  color: var(--text-color-secondary, #909399);
  font-size: 13px;
  transition: all 0.2s;

  &:hover {
    border-color: #409EFF;
    color: #409EFF;
  }
}

.search-placeholder {
  min-width: 80px;
}

.shortcut {
  font-size: 10px;
  margin-left: auto;
}

.search-results {
  margin-top: 16px;
  max-height: 360px;
  overflow-y: auto;
}

.search-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;

  &.active,
  &:hover {
    background: #f5f7fa;
  }

  &.active {
    background: #ecf5ff;
  }
}

.item-icon {
  font-size: 20px;
  color: #909399;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: 14px;
  color: #303133;
}

.item-path {
  font-size: 12px;
  color: #c0c4cc;
  margin-top: 2px;
}

.enter-icon {
  color: #409EFF;
}

:deep(.search-dialog) {
  .el-dialog__body {
    padding-top: 10px;
  }
}
</style>
