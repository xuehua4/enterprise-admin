<template>
  <div class="global-search">
    <!-- 搜索触发器（现代化输入框样式） -->
    <div class="search-trigger" @click="visible = true">
      <el-icon size="16" class="trigger-icon">
        <Search />
      </el-icon>
      <span class="search-placeholder">{{ $t('search.placeholder') }}</span>
      <div class="shortcut-keys">
        <kbd>Ctrl</kbd><kbd>K</kbd>
      </div>
    </div>

    <!-- 命令面板（现代化全屏覆盖设计） - 使用Teleport传送到body避免父容器裁剪 -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="visible" class="command-palette-overlay" @click.self="visible = false">
          <div class="command-palette" :class="{ 'animate-in': visible }">
            <!-- 搜索输入区 -->
            <div class="palette-header">
              <el-icon size="20" class="palette-search-icon">
                <Search />
              </el-icon>
              <input ref="inputRef" v-model="keyword" type="text" class="palette-input"
                :placeholder="$t('search.inputPlaceholder')" @input="onSearch" @keydown.up.prevent="navigate(-1)"
                @keydown.down.prevent="navigate(1)" @keydown.enter.prevent="selectActive"
                @keydown.escape="visible = false" />
              <button class="palette-esc" @click="visible = false">
                <kbd>ESC</kbd>
              </button>
            </div>

            <!-- 搜索结果列表 -->
            <div class="palette-results">
              <!-- 分组标题（有搜索词时显示结果数量） -->
              <div v-if="keyword.trim()" class="results-group">
                <div class="group-label">
                  {{ filteredResults.length }} 个结果
                </div>
                <div v-for="(item, index) in filteredResults" :key="item.path" class="result-item"
                  :class="{ active: index === activeIndex }" @click="goTo(item)" @mouseenter="activeIndex = index">
                  <div class="result-icon-wrapper">
                    <el-icon :size="18">
                      <component :is="item.icon || 'Document'" />
                    </el-icon>
                  </div>
                  <div class="result-info">
                    <div class="result-title">{{ item.title }}</div>
                    <div class="result-path">{{ item.path }}</div>
                  </div>
                  <div class="result-action">
                    <el-icon :size="14">
                      <DArrowRight />
                    </el-icon>
                  </div>
                </div>
                <div v-if="filteredResults.length === 0" class="empty-state">
                  <el-icon :size="32" color="#c0c4cc">
                    <Search />
                  </el-icon>
                  <p>{{ $t('search.noResults') }}</p>
                </div>
              </div>

              <!-- 默认状态：显示所有可导航页面 -->
              <div v-else class="results-group">
                <div class="group-label">快速导航</div>
                <div v-for="(item, index) in allRoutes" :key="item.path" class="result-item"
                  :class="{ active: index === activeIndex }" @click="goTo(item)" @mouseenter="activeIndex = index">
                  <div class="result-icon-wrapper">
                    <el-icon :size="18">
                      <component :is="item.icon || 'Document'" />
                    </el-icon>
                  </div>
                  <div class="result-info">
                    <div class="result-title">{{ item.title }}</div>
                    <div class="result-desc">{{ item.keywords[0] }}</div>
                  </div>
                  <div class="result-shortcut">
                    <kbd>↵</kbd>
                  </div>
                </div>
              </div>
            </div>

            <!-- 底部提示栏 -->
            <div class="palette-footer">
              <div class="footer-hints">
                <span class="hint"><kbd>↑↓</kbd> 导航</span>
                <span class="hint"><kbd>↵</kbd> 选择</span>
                <span class="hint"><kbd>esc</kbd> 关闭</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
/**
 * 全局搜索组件（GlobalSearch）
 * 基于21st.dev AI Prompt Box / Command Palette组件提示词优化
 * 功能：Ctrl+K唤起命令面板，支持键盘导航、快速跳转页面
 */
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Search, DArrowRight } from '@element-plus/icons-vue'

const router = useRouter()

const visible = ref(false)
const keyword = ref('')
const activeIndex = ref(0)
const inputRef = ref<HTMLInputElement>()

/** 搜索项接口 */
interface SearchItem {
  /** 路由路径 */
  path: string
  /** 显示标题 */
  title: string
  /** 图标名称（Element Plus图标） */
  icon?: string
  /** 搜索关键词（支持中英文） */
  keywords: string[]
}

/** 所有可搜索的路由列表 */
const allRoutes: SearchItem[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'Odometer', keywords: ['仪表盘', '首页', 'dashboard'] },
  { path: '/user', title: 'User Management', icon: 'User', keywords: ['用户管理', 'user', 'users'] },
  { path: '/role', title: 'Role Management', icon: 'Postcard', keywords: ['角色管理', 'role', 'roles'] },
  { path: '/menu', title: 'Menu Management', icon: 'Menu', keywords: ['菜单管理', 'menu', 'menus'] },
  { path: '/log', title: 'System Log', icon: 'Document', keywords: ['系统日志', 'log', 'logs'] },
  { path: '/settings', title: 'Settings', icon: 'Setting', keywords: ['系统设置', '设置', 'settings'] },
  { path: '/about', title: 'About', icon: 'InfoFilled', keywords: ['关于', 'about'] },
]

/** 过滤后的结果列表 */
const filteredResults = computed(() => {
  if (!keyword.value.trim()) return allRoutes
  const kw = keyword.value.toLowerCase()
  return allRoutes.filter(item =>
    item.title.toLowerCase().includes(kw) ||
    item.path.toLowerCase().includes(kw) ||
    item.keywords.some(k => k.toLowerCase().includes(kw))
  )
})

/** 搜索输入时重置选中索引 */
function onSearch() {
  activeIndex.value = 0
}

/** 键盘上下导航 */
function navigate(dir: number) {
  const list = keyword.value.trim() ? filteredResults.value : allRoutes
  const len = list.length
  if (len === 0) return
  activeIndex.value = (activeIndex.value + dir + len) % len
}

/** 回车选择当前项 */
function selectActive() {
  const list = keyword.value.trim() ? filteredResults.value : allRoutes
  const item = list[activeIndex.value]
  if (item) goTo(item)
}

/** 跳转到目标页面 */
function goTo(item: SearchItem) {
  router.push(item.path)
  visible.value = false
  keyword.value = ''
}

/** 打开面板时自动聚焦输入框 */
watch(visible, (val) => {
  if (val) {
    nextTick(() => inputRef.value?.focus())
    activeIndex.value = 0
    keyword.value = ''
  }
})

// 全局快捷键：Ctrl+K / Cmd+K 打开搜索
function handleKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    visible.value = !visible.value
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleKeydown)
}
</script>

<style scoped lang="scss">
/* ==================== 搜索触发器（现代化输入框） ==================== */
.search-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border: 1px solid var(--border-color, #dcdfe6);
  border-radius: 10px;
  cursor: pointer;
  color: var(--text-color-secondary, #909399);
  font-size: 13px;
  transition: all 0.25s ease;
  background: var(--bg-color, #fff);

  &:hover {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    color: var(--text-color, #303133);
  }
}

.trigger-icon {
  color: #9ca3af;
}

.shortcut-keys {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: auto;

  kbd {
    font-family: inherit;
    font-size: 10px;
    padding: 2px 5px;
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    color: #6b7280;
    font-weight: 500;
    line-height: 1;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.05);
  }
}

/* ==================== 命令面板遮罩层 ==================== */
.command-palette-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15vh;
}

/* 命令面板主体 */
.command-palette {
  width: 600px;
  max-width: 92vw;
  max-height: 70vh;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-radius: 16px;
  box-shadow:
    0 25px 60px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &.animate-in {
    animation: palette-enter 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
}

@keyframes palette-enter {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-20px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 暗色模式适配 */
:global(html.dark) .command-palette-overlay,
:global(.dark) .command-palette-overlay {
  background: rgba(0, 0, 0, 0.6);
}

:global(html.dark) .command-palette,
:global(.dark) .command-palette {
  background: rgba(30, 30, 45, 0.95);
  box-shadow:
    0 25px 60px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.05);
}

/* ==================== 面板头部（搜索输入区） ==================== */
.palette-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);

  :global(html.dark) &,
  :global(.dark) & {
    border-bottom-color: rgba(255, 255, 255, 0.06);
  }
}

.palette-search-icon {
  color: #9ca3af;
  flex-shrink: 0;
}

.palette-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  color: var(--text-color, #1a1a2e);
  background: transparent;
  font-family: inherit;

  &::placeholder {
    color: #9ca3af;
  }
}

.palette-esc {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 10px;
  flex-shrink: 0;

  kbd {
    font-family: inherit;
    font-size: 11px;
    padding: 3px 7px;
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    border-radius: 5px;
    color: #6b7280;
    font-weight: 500;
    line-height: 1;
  }

  &:hover kbd {
    background: #e5e7eb;
  }
}

/* ==================== 结果列表区域 ==================== */
.palette-results {
  overflow-y: auto;
  flex: 1;
  padding: 8px 0;

  /* 自定义滚动条 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 3px;
  }
}

.results-group {
  padding: 4px 10px;
}

.group-label {
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  padding: 8px 12px 6px;
}

/* 单个结果项 */
.result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
  margin-bottom: 2px;

  &:hover {
    background: rgba(99, 102, 241, 0.06);
  }

  &.active {
    background: rgba(99, 102, 241, 0.1);

    .result-icon-wrapper {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff;
    }

    .result-title {
      color: #6366f1;
      font-weight: 600;
    }

    .result-action {
      opacity: 1;
      color: #6366f1;
    }

    .result-shortcut kbd {
      background: #6366f1;
      color: #fff;
      border-color: #6366f1;
    }
  }
}

.result-icon-wrapper {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.result-info {
  flex: 1;
  min-width: 0;
}

.result-title {
  font-size: 14px;
  color: var(--text-color, #303133);
  font-weight: 500;
  transition: all 0.15s ease;
}

.result-path,
.result-desc {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 2px;
}

.result-action {
  opacity: 0;
  color: #6366f1;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.result-shortcut {
  flex-shrink: 0;

  kbd {
    font-family: inherit;
    font-size: 11px;
    padding: 3px 7px;
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    border-radius: 5px;
    color: #9ca3af;
    font-weight: 500;
    line-height: 1;
    transition: all 0.15s ease;
  }
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #c0c4cc;

  p {
    margin-top: 12px;
    font-size: 14px;
  }
}

/* ==================== 底部提示栏 ==================== */
.palette-footer {
  padding: 12px 18px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);

  :global(html.dark) &,
  :global(.dark) & {
    border-top-color: rgba(255, 255, 255, 0.06);
  }
}

.footer-hints {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.hint {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #9ca3af;

  kbd {
    font-family: inherit;
    font-size: 10px;
    padding: 2px 5px;
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    color: #6b7280;
    min-width: 20px;
    text-align: center;
  }
}

/* ==================== 过渡动画 ==================== */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .command-palette {
  transform: scale(0.96) translateY(-10px);
}
</style>
