<template>
  <el-tooltip :content="isFullscreen ? $t('header.exitFullscreen') : $t('header.fullscreen')">
    <el-icon class="fullscreen-icon" size="20" @click="toggle">
      <FullScreen v-if="!isFullscreen" />
      <CloseBold v-else />
    </el-icon>
  </el-tooltip>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { FullScreen, CloseBold } from '@element-plus/icons-vue'

const isFullscreen = ref(false)

function toggle() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isFullscreen.value) {
    isFullscreen.value = false
  }
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
.fullscreen-icon {
  cursor: pointer;
  color: var(--text-color-secondary, #606266);
  transition: color 0.2s;
}
.fullscreen-icon:hover {
  color: #409EFF;
}
</style>
