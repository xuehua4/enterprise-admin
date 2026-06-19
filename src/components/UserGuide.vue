<template>
  <!-- 用户引导遮罩层 -->
  <Teleport to="body">
    <Transition name="guide-fade">
      <div v-if="showGuide" class="guide-overlay">
        <!-- 半透明遮罩：点击跳过当前步骤 -->
        <div class="guide-mask" @click="nextStep" />

        <!-- 高亮目标元素的聚光灯效果 -->
        <div v-if="highlightStyle" class="guide-spotlight" :style="highlightStyle" />

        <!-- 引导提示气泡 -->
        <div class="guide-tooltip" :class="tooltipDirection" :style="tooltipStyle">
          <!-- 步骤标题 + 描述 -->
          <div class="guide-content">
            <h3>{{ currentStep.title }}</h3>
            <p>{{ currentStep.description }}</p>
          </div>

          <!-- 底部操作栏：进度 + 按钮 -->
          <div class="guide-footer">
            <span class="guide-progress">{{ currentIndex + 1 }} / {{ steps.length }}</span>
            <div class="guide-actions">
              <el-button size="small" text @click="skipGuide">{{ $t('guide.skip') }}</el-button>
              <el-button size="small" :disabled="currentIndex === 0" @click="prevStep">
                {{ $t('guide.prev') }}
              </el-button>
              <el-button size="small" type="primary" @click="nextStep">
                {{ currentIndex === steps.length - 1 ? $t('guide.finish') : $t('guide.next') }}
              </el-button>
            </div>
          </div>

          <!-- 小箭头指示器 -->
          <div class="guide-arrow" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * 用户引导组件（UserGuide）
 * 功能：首次访问时的功能引导，支持多步骤、高亮目标元素、自动定位气泡位置
 */
import { ref, computed, reactive, watch, nextTick } from 'vue'
import { useGuideStore } from '@/stores/guide'
import { Grid, Search, Tickets, Sunny, User } from '@element-plus/icons-vue'

const guideStore = useGuideStore()
const showGuide = ref(false)
const currentIndex = ref(0)

// ==================== 引导步骤定义 ====================
interface GuideStep {
  /** 目标元素的 CSS 选择器 */
  selector: string
  /** 步骤标题 */
  title: string
  /** 步骤描述文字 */
  description: string
  /** 步骤图标（可选） */
  icon?: any
}

/** 引导步骤列表（含图标，增强视觉识别） */
const steps: GuideStep[] = [
  {
    selector: '.sidebar-menu',
    title: '导航菜单',
    description: '这里是侧边导航栏，可以点击切换不同的功能页面。点击顶部的折叠按钮可以收起菜单。',
    icon: Grid
  },
  {
    selector: '.header-right',
    title: '全局搜索',
    description: '使用 Ctrl+K 快速唤起搜索面板，可以快速搜索并跳转到任意页面。',
    icon: Search
  },
  {
    selector: '.tab-bar',
    title: '标签页导航',
    description: '标签页会记录你最近访问过的页面，支持右键关闭其他/右侧标签页等操作。',
    icon: Tickets
  },
  {
    selector: '.theme-toggle',
    title: '主题切换',
    description: '点击这里可以在浅色主题 / 深色主题之间切换，也可以设置为跟随系统自动切换。',
    icon: Sunny
  },
  {
    selector: '.user-dropdown',
    title: '用户菜单',
    description: '在这里可以查看个人信息、修改密码、切换语言、退出登录等操作。',
    icon: User
  }
]

// ==================== 当前步骤计算属性 ====================
const currentStep = computed(() => steps[currentIndex.value] || steps[0])

// ==================== 样式状态（响应式） ====================
/** 提示框位置样式 */
const tooltipStyle = reactive<Record<string, string>>({
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)'
})

/** 高亮区域样式（聚光灯效果） */
const highlightStyle = reactive<Record<string, string>>({})

/** 气泡箭头方向（用于调整箭头位置） */
const tooltipDirection = ref('bottom')

// ==================== 定位核心逻辑 ====================

/**
 * 计算引导提示框的位置和方向
 * 策略：优先在目标元素下方显示；空间不足则改为上方/左侧/右侧
 */
function updatePosition() {
  const step = steps[currentIndex.value]
  if (!step) return

  const el = document.querySelector(step.selector) as HTMLElement | null

  // 如果找不到目标元素，使用居中兜底方案
  if (!el) {
    tooltipStyle.top = '50%'
    tooltipStyle.left = '50%'
    tooltipStyle.transform = 'translate(-50%, -50%)'
    highlightStyle.display = 'none'
    tooltipDirection.value = 'bottom'
    return
  }

  const rect = el.getBoundingClientRect()
  const tooltipW = 380 // 气泡宽度
  const tooltipH = 160 // 气泡预估高度
  const gap = 12       // 气泡与目标的间距
  const padding = 20   // 距离视口边缘的最小安全距离

  // --- 高亮目标元素（聚光灯效果） ---
  highlightStyle.display = 'block'
  highlightStyle.top = `${rect.top - 4}px`
  highlightStyle.left = `${rect.left - 4}px`
  highlightStyle.width = `${rect.width + 8}px`
  highlightStyle.height = `${rect.height + 8}px`

  // --- 判断最佳展示方向 ---
  const spaceBelow = window.innerHeight - rect.bottom - gap
  const spaceAbove = rect.top - gap
  const spaceRight = window.innerWidth - rect.right - gap
  const spaceLeft = rect.left - gap

  let top = 0
  let left = 0
  let direction = 'bottom'

  if (spaceBelow >= tooltipH) {
    // 优先放在下方
    direction = 'bottom'
    top = rect.bottom + gap
    left = Math.max(padding, Math.min(rect.left + rect.width / 2 - tooltipW / 2, window.innerWidth - tooltipW - padding))
  } else if (spaceAbove >= tooltipH) {
    // 放在上方
    direction = 'top'
    top = rect.top - tooltipH - gap
    left = Math.max(padding, Math.min(rect.left + rect.width / 2 - tooltipW / 2, window.innerWidth - tooltipW - padding))
  } else if (spaceRight >= tooltipW) {
    // 放在右侧
    direction = 'right'
    top = Math.max(padding, Math.min(rect.top, window.innerHeight - tooltipH - padding))
    left = rect.right + gap
  } else if (spaceLeft >= tooltipW) {
    // 放在左侧
    direction = 'left'
    top = Math.max(padding, Math.min(rect.top, window.innerHeight - tooltipH - padding))
    left = rect.left - tooltipW - gap
  } else {
    // 兜底：居中覆盖
    direction = 'bottom'
    top = window.innerHeight / 2 - tooltipH / 2
    left = window.innerWidth / 2 - tooltipW / 2
  }

  tooltipStyle.top = `${top}px`
  tooltipStyle.left = `${left}px`
  tooltipStyle.transform = 'none'
  tooltipDirection.value = direction
}

// ==================== 步骤控制 ====================

/** 清除当前高亮 */
function clearHighlight() {
  const step = steps[currentIndex.value]
  if (step) {
    const el = document.querySelector(step.selector)
    el?.classList.remove('guide-highlight')
  }
}

/** 下一步 */
function nextStep() {
  clearHighlight()

  if (currentIndex.value < steps.length - 1) {
    currentIndex.value++
    nextTick(updatePosition)
  } else {
    finishGuide()
  }
}

/** 上一步 */
function prevStep() {
  clearHighlight()
  if (currentIndex.value > 0) {
    currentIndex.value--
    nextTick(updatePosition)
  }
}

/** 跳过引导 */
function skipGuide() {
  finishGuide()
}

/** 完成引导 */
function finishGuide() {
  showGuide.value = false
  guideStore.finishGuide()
}

// ==================== 外部调用接口 ====================

/**
 * 启动引导（供父组件 MainLayout 调用）
 */
function startGuide() {
  currentIndex.value = 0
  showGuide.value = true
  nextTick(updatePosition)
}

/** 暴露给父组件的方法 */
defineExpose({ startGuide })

// ==================== 自动启动（仅首次访问） ====================
watch(showGuide, (val) => {
  if (val) {
    // 防止背景滚动
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
/* ==================== 遮罩层（增强版） ==================== */
.guide-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
}

.guide-mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  cursor: pointer;
}

/* ==================== 聚光灯高亮区域（增强动画） ==================== */
.guide-spotlight {
  position: fixed;
  z-index: 10001;
  border-radius: 12px;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  border: 2px solid rgba(99, 102, 241, 0.6);
}

/* 聚光灯脉冲效果 */
.spotlight-pulse {
  position: absolute;
  inset: -4px;
  border-radius: 14px;
  animation: spotlight-pulse 2s infinite ease-in-out;
}

@keyframes spotlight-pulse {

  0%,
  100% {
    box-shadow: inset 0 0 0 2px rgba(99, 102, 241, 0.3);
  }

  50% {
    box-shadow: inset 0 0 0 4px rgba(99, 102, 241, 0.6);
  }
}

/* ==================== 引导提示气泡（现代化毛玻璃设计） ==================== */
.guide-tooltip {
  position: fixed;
  z-index: 10002;
  width: 400px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: 20px;
  padding: 0;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  /* 入场动画 */
  &.animate-in {
    animation: tooltip-enter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
}

@keyframes tooltip-enter {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(10px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 暗色模式适配 */
:global(.dark) .guide-tooltip,
:global(html.dark) .guide-tooltip {
  background: rgba(30, 30, 45, 0.92);
  color: #e0e0e0;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.05);
}

/* ==================== 进度条（顶部） ==================== */
.guide-progress-bar {
  position: relative;
  height: 4px;
  background: rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

:global(.dark) .guide-progress-bar,
:global(html.dark) .guide-progress-bar {
  background: rgba(255, 255, 255, 0.08);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  border-radius: 0 2px 2px 0;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.step-counter {
  position: absolute;
  right: 16px;
  top: 8px;
  font-size: 11px;
  font-weight: 600;
  color: #6366f1;
  letter-spacing: 0.5px;
}

/* ==================== 内容区（含图标） ==================== */
.guide-content {
  padding: 24px 24px 16px;
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.guide-icon-wrapper {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.guide-content h3 {
  font-size: 17px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 8px;
  letter-spacing: -0.3px;
}

:global(.dark) .guide-content h3,
:global(html.dark) .guide-content h3 {
  color: #f0f0f5;
}

.guide-content p {
  font-size: 14px;
  color: #555;
  line-height: 1.65;
  margin: 0;
}

:global(.dark) .guide-content p,
:global(html.dark) .guide-content p {
  color: #a0a0b0;
}

/* ==================== 底部操作栏 ==================== */
.guide-footer {
  padding: 16px 24px 20px;
}

.guide-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 现代化按钮样式 */
.guide-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 18px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  outline: none;
  white-space: nowrap;
}

.guide-btn-text {
  background: transparent;
  color: #888;
  margin-right: auto;

  &:hover {
    color: #333;
  }
}

.guide-btn-secondary {
  background: rgba(0, 0, 0, 0.06);
  color: #444;

  &:hover:not(:disabled) {
    background: rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.guide-btn-primary {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #fff;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
}

/* 暗色模式按钮适配 */
:global(.dark) .guide-btn-text,
:global(html.dark) .guide-btn-text {
  &:hover {
    color: #ccc;
  }
}

:global(.dark) .guide-btn-secondary,
:global(html.dark) .guide-btn-secondary {
  background: rgba(255, 255, 255, 0.08);
  color: #bbb;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.14);
  }
}

/* ==================== 箭头指示器（现代化） ==================== */
.guide-arrow {
  position: absolute;
  width: 16px;
  height: 16px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  transform: rotate(45deg);
  box-shadow: 4px -4px 10px rgba(0, 0, 0, 0.08);
}

:global(.dark) .guide-arrow,
:global(html.dark) .guide-arrow {
  background: rgba(30, 30, 45, 0.92);
}

/* 箭头在不同方向的定位 */
.guide-tooltip.bottom .guide-arrow {
  top: -8px;
  left: 32px;
}

.guide-tooltip.top .guide-arrow {
  bottom: -8px;
  left: 32px;
  box-shadow: -4px 4px 10px rgba(0, 0, 0, 0.08);
}

.guide-tooltip.right .guide-arrow {
  left: -8px;
  top: 28px;
  box-shadow: -4px 4px 10px rgba(0, 0, 0, 0.08);
}

.guide-tooltip.left .guide-arrow {
  right: -8px;
  top: 28px;
  box-shadow: 4px -4px 10px rgba(0, 0, 0, 0.08);
}

/* ==================== 过渡动画（优化） ==================== */
.guide-fade-enter-active,
.guide-fade-leave-active {
  transition: opacity 0.3s ease;
}

.guide-fade-enter-from,
.guide-fade-leave-to {
  opacity: 0;
}
</style>
