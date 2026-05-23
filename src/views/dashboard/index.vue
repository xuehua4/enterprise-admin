<template>
  <div class="dashboard">
    <!-- Stats Cards -->
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

    <!-- Charts Row -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :xs="24" :lg="16">
        <el-card header="访问趋势（近7天）">
          <v-chart :option="lineChartOption" autoresize style="height: 300px" />
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="8">
        <el-card header="流量来源">
          <v-chart :option="pieChartOption" autoresize style="height: 300px" />
        </el-card>
      </el-col>
    </el-row>

    <!-- Bottom Row -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :xs="24" :lg="12">
        <el-card header="访问量柱状图">
          <v-chart :option="barChartOption" autoresize style="height: 300px" />
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12">
        <el-card header="系统信息">
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item label="系统版本">v1.0.0</el-descriptions-item>
            <el-descriptions-item label="Vue 版本">3.5.x</el-descriptions-item>
            <el-descriptions-item label="UI 框架">Element Plus 2.14</el-descriptions-item>
            <el-descriptions-item label="构建工具">Vite 8.0</el-descriptions-item>
            <el-descriptions-item label="图表库">ECharts 6.1</el-descriptions-item>
            <el-descriptions-item label="状态管理">Pinia 3.0</el-descriptions-item>
          </el-descriptions>
          <div class="quick-actions" style="margin-top: 20px">
            <el-button type="primary" :icon="User" @click="$router.push('/user')">用户管理</el-button>
            <el-button type="success" :icon="Setting" @click="$router.push('/settings')">系统设置</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, PieChart, BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { User, Setting, UserFilled, Document, ChatDotRound, TrendCharts } from '@element-plus/icons-vue'

// Register ECharts modules
use([
  CanvasRenderer,
  LineChart,
  PieChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

const router = useRouter()

// Stats cards data
const statCards = ref([
  { title: '用户总数', value: '1,284', icon: UserFilled, color: '#409EFF' },
  { title: '今日访问', value: '856', icon: TrendCharts, color: '#67C23A' },
  { title: '文档数量', value: '320', icon: Document, color: '#E6A23C' },
  { title: '消息通知', value: '18', icon: ChatDotRound, color: '#F56C6C' }
])

// Line chart - visits trend
const lineChartOption = ref({
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['访问量', '用户数'],
    bottom: 0
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '15%',
    top: '10%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '访问量',
      type: 'line',
      smooth: true,
      areaStyle: { opacity: 0.3 },
      data: [820, 932, 901, 1134, 1290, 1330, 1520],
      itemStyle: { color: '#409EFF' }
    },
    {
      name: '用户数',
      type: 'line',
      smooth: true,
      areaStyle: { opacity: 0.3 },
      data: [120, 182, 191, 234, 290, 330, 410],
      itemStyle: { color: '#67C23A' }
    }
  ]
})

// Pie chart - traffic source
const pieChartOption = ref({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'horizontal',
    bottom: 0
  },
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: true,
        formatter: '{b}: {d}%'
      },
      data: [
        { value: 1048, name: '直接访问', itemStyle: { color: '#409EFF' } },
        { value: 735, name: '搜索引擎', itemStyle: { color: '#67C23A' } },
        { value: 580, name: '邮件营销', itemStyle: { color: '#E6A23C' } },
        { value: 484, name: '社交平台', itemStyle: { color: '#F56C6C' } },
        { value: 300, name: '外部链接', itemStyle: { color: '#909399' } }
      ]
    }
  ]
})

// Bar chart - page views
const barChartOption = ref({
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '10%',
    top: '10%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['首页', '仪表盘', '用户管理', '系统设置', '登录页', '404页']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      type: 'bar',
      barWidth: '50%',
      data: [
        { value: 1520, itemStyle: { color: '#409EFF' } },
        { value: 1290, itemStyle: { color: '#67C23A' } },
        { value: 980, itemStyle: { color: '#E6A23C' } },
        { value: 750, itemStyle: { color: '#F56C6C' } },
        { value: 680, itemStyle: { color: '#909399' } },
        { value: 120, itemStyle: { color: '#C0C4CC' } }
      ]
    }
  ]
})
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

.quick-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
