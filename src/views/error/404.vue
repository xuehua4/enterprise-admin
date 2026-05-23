<template>
  <div class="error-page">
    <div class="error-content">
      <h1 class="error-code">404</h1>
      <p class="error-message">{{ $t('common.noData') }}</p>
      <el-button type="primary" @click="$router.push('/')">{{ $t('common.back') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.error-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-color, #f0f2f5);
}

.error-content {
  text-align: center;
}

.error-code {
  font-size: 120px;
  font-weight: bold;
  color: #409EFF;
  margin: 0;
  line-height: 1;
}

.error-message {
  font-size: 18px;
  color: var(--text-color-secondary, #909399);
  margin: 20px 0 30px;
}
</style>
