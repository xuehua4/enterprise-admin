<template>
  <div class="dashboard">
    <el-row :gutter="20" class="stat-cards">
      <el-col :xs="24" :sm="12" :lg="6" v-for="card in statCards" :key="card.title">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-card-content">
            <div class="stat-info">
              <div class="stat-value">{{ card.value }}</div>
              <div class="stat-title">{{ card.title }}</div>
            </div>
            <el-icon :size="48" :style="{ color: card.color }">
              <component :is="card.icon" />
            </el-icon>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :xs="24" :lg="16">
        <el-card header="访问趋势（近7天）">
          <div class="chart-placeholder">
            <el-icon size="48"><TrendCharts /></el-icon>
            <p>图表区域 - 接入 ECharts / Chart.js</p>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="8">
        <el-card header="快捷操作" style="margin-top: 20px">
          <div class="quick-actions">
            <el-button type="primary" :icon="User" @click="$router.push('/user')">用户管理</el-button>
            <el-button type="success" :icon="Setting" @click="$router.push('/settings')">系统设置</el-button>
          </div>
        </el-card>

        <el-card header="系统信息" style="margin-top: 20px">
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item label="系统版本">v1.0.0</el-descriptions-item>
            <el-descriptions-item label="Vue 版本">3.5.x</el-descriptions-item>
            <el-descriptions-item label="UI 框架">Element Plus 2.14</el-descriptions-item>
            <el-descriptions-item label="构建工具">Vite 8.0</el-descriptions-item>
            <el-descriptions-item label="运行时间">24h</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { User, Setting, TrendCharts, UserFilled, Document, ChatDotRound } from '@element-plus/icons-vue'

const statCards = ref([
  { title: '用户总数', value: '1,284', icon: UserFilled, color: '#409EFF' },
  { title: '今日访问', value: '856', icon: TrendCharts, color: '#67C23A' },
  { title: '文档数量', value: '320', icon: Document, color: '#E6A23C' },
  { title: '消息通知', value: '18', icon: ChatDotRound, color: '#F56C6C' }
])
</script>

<style scoped lang="scss">
.dashboard {
  padding: 4px;
}

.stat-cards {
  margin-bottom: 0;
}

.stat-card {
  .stat-card-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .stat-value {
    font-size: 28px;
    font-weight: bold;
    color: #303133;
  }

  .stat-title {
    font-size: 14px;
    color: #909399;
    margin-top: 4px;
  }
}

.chart-placeholder {
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
}

.quick-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
