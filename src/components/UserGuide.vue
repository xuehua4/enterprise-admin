<template>
  <div v-if="showGuide" class="guide-overlay">
    <div class="guide-mask" @click="next"></div>
    <div class="guide-tooltip" :style="tooltipStyle">
      <div class="guide-content">
        <h3>{{ currentStep.title }}</h3>
        <p>{{ currentStep.description }}</p>
      </div>
      <div class="guide-footer">
        <span class="guide-progress">{{ currentIndex + 1 }} / {{ steps.length }}</span>
        <div class="guide-actions">
          <el-button size="small" text @click="skip">{{ $t('guide.skip') }}</el-button>
          <el-button size="small" @click="prev" :disabled="currentIndex === 0">{{ $t('guide.prev') }}</el-button>
          <el-button size="small" type="primary" @click="next">
            {{ currentIndex === steps.length - 1 ? $t('guide.finish') : $t('guide.next') }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useGuideStore } from '@/stores/guide'

const guideStore = useGuideStore()
const showGuide = ref(false)
const currentIndex = ref(0)

interface GuideStep {
  selector: string
  title: string
  description: string
}

const steps: GuideStep[] = [
  {
    selector: '.sidebar-menu',
    title: '导航菜单',
    description: '这里是侧边导航栏，可以点击切换不同的功能页面。点击顶部的折叠按钮可以收起菜单。'
  },
  {
    selector: '.search-trigger',
    title: '全局搜索',
    description: '使用 Ctrl+K 快速唤起搜索面板，可以快速跳转到任意页面。'
  },
  {
    selector: '.tab-bar',
    title: '标签页导航',
    description: '标签页会记录你访问过的页面，支持右键菜单、关闭其他、关闭右侧等操作。'
  },
  {
    selector: '.theme-toggle',
    title: '主题切换',
    description: '点击这里可以切换浅色/深色主题，也可以设置为跟随系统自动切换。'
  },
  {
    selector: '.header-right',
    title: '用户菜单',
    description: '在这里可以查看个人信息、切换语言、退出登录等操作。'
  }
]

const currentStep = computed(() => steps[currentIndex.value])

const tooltipStyle = reactive({
  top: '50%',
  left: '50%',
  position: 'fixed' as const
})

function updatePosition() {
  const step = steps[currentIndex.value]
  const el = document.querySelector(step.selector)
  if (el) {
    const rect = el.getBoundingClientRect()
    const tooltipWidth = 400
    tooltipStyle.left = Math.min(rect.left + rect.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - 20) + 'px'
    tooltipStyle.top = Math.min(rect.bottom + 12, window.innerHeight - 200) + 'px'
    // Highlight the element
    el.classList.add('guide-highlight')
  }
}

function next() {
  // Remove highlight from current
  const currentEl = document.querySelector(steps[currentIndex.value].selector)
  currentEl?.classList.remove('guide-highlight')

  if (currentIndex.value < steps.length - 1) {
    currentIndex.value++
    updatePosition()
  } else {
    guideStore.finishGuide()
    showGuide.value = false
  }
}

function prev() {
  if (currentIndex.value > 0) {
    const currentEl = document.querySelector(steps[currentIndex.value].selector)
    currentEl?.classList.remove('guide-highlight')
    currentIndex.value--
    updatePosition()
  }
}

function skip() {
  guideStore.finishGuide()
  showGuide.value = false
}

onMounted(() => {
  if (!guideStore.hasGuided) {
    setTimeout(() => {
      showGuide.value = true
      currentIndex.value = 0
      updatePosition()
    }, 1000)
  }
})
</script>

<style scoped>
.guide-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
}

.guide-mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}

.guide-tooltip {
  position: fixed;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  width: 400px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  z-index: 10001;
}

.guide-content h3 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 12px;
}

.guide-content p {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  margin: 0;
}

.guide-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.guide-progress {
  font-size: 13px;
  color: #909399;
}

.guide-actions {
  display: flex;
  gap: 8px;
}
</style>

<style>
/* Highlight effect for guided elements */
.guide-highlight {
  position: relative;
  z-index: 10002 !important;
  box-shadow: 0 0 0 4px rgba(64, 158, 255, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  pointer-events: none;
}
</style>
