<template>
  <div class="tab-bar">
    <div class="tab-list">
      <el-tag
        v-for="tab in tabsStore.tabs"
        :key="tab.path"
        :closable="tab.closable"
        :effect="tab.path === tabsStore.activeTab ? 'dark' : 'plain'"
        class="tab-item"
        :class="{ active: tab.path === tabsStore.activeTab }"
        @click="goTo(tab.path)"
        @close="closeTab(tab.path)"
        @contextmenu.prevent="showContext($event, tab)"
      >
        <el-icon v-if="tab.icon" class="tab-icon"><component :is="tab.icon" /></el-icon>
        {{ tab.title }}
      </el-tag>
    </div>
    <div class="tab-actions">
      <el-dropdown trigger="click" @command="handleCommand">
        <el-icon class="action-icon" size="18"><ArrowDown /></el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="closeOther">{{ $t('tabs.closeOther') }}</el-dropdown-item>
            <el-dropdown-item command="closeRight">{{ $t('tabs.closeRight') }}</el-dropdown-item>
            <el-dropdown-item command="closeAll">{{ $t('tabs.closeAll') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- Right-click context menu -->
    <div
      v-if="contextMenu.visible"
      class="context-menu"
      :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
    >
      <div class="context-item" @click="refreshTab">{{ $t('tabs.refresh') }}</div>
      <div class="context-item" @click="closeTab(contextMenu.tab?.path!)">{{ $t('tabs.close') }}</div>
      <div class="context-item" @click="closeOther">{{ $t('tabs.closeOther') }}</div>
      <div class="context-item" @click="closeRight">{{ $t('tabs.closeRight') }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTabsStore, type TabItem } from '@/stores/tabs'
import { ArrowDown } from '@element-plus/icons-vue'

const router = useRouter()
const tabsStore = useTabsStore()

const contextMenu = reactive({
  visible: false,
  x: 0,
  y: 0,
  tab: null as TabItem | null
})

function goTo(path: string) {
  tabsStore.activeTab = path
  router.push(path)
}

function closeTab(path: string) {
  const newActive = tabsStore.removeTab(path)
  if (newActive) router.push(newActive)
}

function showContext(e: MouseEvent, tab: TabItem) {
  contextMenu.visible = true
  contextMenu.x = e.clientX
  contextMenu.y = e.clientY
  contextMenu.tab = tab
}

function hideContext() {
  contextMenu.visible = false
}

function refreshTab() {
  router.replace({ path: '/redirect', query: { path: contextMenu.tab?.path } })
  hideContext()
}

function closeOther() {
  if (contextMenu.tab) {
    tabsStore.removeOtherTabs(contextMenu.tab.path)
    router.push(contextMenu.tab.path)
  }
  hideContext()
}

function closeRight() {
  if (contextMenu.tab) {
    tabsStore.removeRightTabs(contextMenu.tab.path)
    router.push(contextMenu.tab.path)
  }
  hideContext()
}

function handleCommand(cmd: string) {
  const active = tabsStore.activeTab
  if (cmd === 'closeOther') tabsStore.removeOtherTabs(active)
  else if (cmd === 'closeRight') tabsStore.removeRightTabs(active)
  else if (cmd === 'closeAll') {
    tabsStore.removeAllTabs()
    router.push('/dashboard')
  }
}

onMounted(() => document.addEventListener('click', hideContext))
onUnmounted(() => document.removeEventListener('click', hideContext))
</script>

<style scoped lang="scss">
/* ==================== 标签栏容器 ==================== */
.tab-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--card-bg, #fff);
  border-bottom: 1px solid var(--border-color, rgba(0, 0, 0, 0.06));
  padding: 6px 12px;
  height: 40px;
  min-height: 40px;
  flex-shrink: 0;

  /* 微妙毛玻璃效果 */
  backdrop-filter: blur(8px) saturate(120%);
  -webkit-backdrop-filter: blur(8px) saturate(120%);
}

/* ==================== 标签列表区域 ==================== */
.tab-list {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  flex: 1;
  padding-right: 8px;

  /* 隐藏滚动条 */
  &::-webkit-scrollbar {
    height: 0;
  }
}

/* 单个标签项（现代化药丸设计） */
.tab-item {
  cursor: pointer;
  flex-shrink: 0;
  font-size: 12px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  border-radius: 8px;
  padding: 5px 10px;
  position: relative;
  overflow: hidden;

  .tab-icon {
    margin-right: 4px;
    font-size: 13px;
  }

  &:hover:not(.active) {
    background: rgba(99, 102, 241, 0.06);
    color: var(--text-color, #303133);
  }

  &.active {
    color: #fff;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
    font-weight: 500;

    /* 激活态微光动画 */
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 50%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.15),
        transparent
      );
      animation: tab-shimmer 3s infinite;
    }
  }
}

@keyframes tab-shimmer {
  0% { left: -100%; }
  20% { left: 100%; }
  100% { left: 100%; }
}

/* ==================== 操作按钮区 ==================== */
.tab-actions {
  flex-shrink: 0;
}

.action-icon {
  cursor: pointer;
  color: var(--text-color-secondary, #909399);
  padding: 5px;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    color: #6366f1;
    background: rgba(99, 102, 241, 0.08);
  }
}

/* ==================== 右键菜单（现代化） ==================== */
.context-menu {
  position: fixed;
  z-index: 9999;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.5) inset;
  padding: 6px;
  min-width: 150px;
  animation: context-enter 0.15s ease-out;
}

@keyframes context-enter {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-4px);
  }
}

.context-item {
  padding: 9px 14px;
  font-size: 13px;
  cursor: pointer;
  color: #444;
  border-radius: 6px;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: rgba(99, 102, 241, 0.08);
    color: #6366f1;
  }

  &::before {
    content: '';
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.4;
  }
}
</style>
