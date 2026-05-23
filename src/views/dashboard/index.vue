<template>
  <div class="dashboard">
    <!-- Stats Cards -->
    <el-row :gutter="20" class="stat-cards">
      <el-col :xs="24" :sm="12" :lg="6" v-for="card in statCards" :key="card.titleKey">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-card-content">
            <div class="stat-info">
              <div class="stat-value">{{ card.value }}</div>
              <div class="stat-title">{{ $t(`dashboard.${card.titleKey}`) }}</div>
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
        <el-card :header="$t('dashboard.visitTrend')">
          <v-chart :option="lineChartOption" autoresize style="height: 300px" />
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="8">
        <el-card :header="$t('dashboard.trafficSource')">
          <v-chart :option="pieChartOption" autoresize style="height: 300px" />
        </el-card>
      </el-col>
    </el-row>

    <!-- Bottom Row -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :xs="24" :lg="12">
        <el-card :header="$t('dashboard.pageViews')">
          <v-chart :option="barChartOption" autoresize style="height: 300px" />
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12">
        <el-card :header="$t('dashboard.systemInfo')">
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item :label="$t('dashboard.version')">v1.0.0</el-descriptions-item>
            <el-descriptions-item :label="$t('dashboard.vueVersion')">3.5.x</el-descriptions-item>
            <el-descriptions-item :label="$t('dashboard.uiFramework')">Element Plus 2.14</el-descriptions-item>
            <el-descriptions-item :label="$t('dashboard.buildTool')">Vite 8.0</el-descriptions-item>
            <el-descriptions-item :label="$t('dashboard.chartLib')">ECharts 6.1</el-descriptions-item>
            <el-descriptions-item :label="$t('dashboard.stateManagement')">Pinia 3.0</el-descriptions-item>
          </el-descriptions>
          <div class="quick-actions" style="margin-top: 20px">
            <el-button type="primary" :icon="User" @click="$router.push('/user')">{{ $t('menu.userManagement') }}</el-button>
            <el-button type="success" :icon="Setting" @click="$router.push('/settings')">{{ $t('menu.systemSettings') }}</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
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

const { t } = useI18n()

// Stats cards data
const statCards = ref([
  { titleKey: 'userTotal', value: '1,284', icon: UserFilled, color: '#409EFF' },
  { titleKey: 'todayVisits', value: '856', icon: TrendCharts, color: '#67C23A' },
  { titleKey: 'documentCount', value: '320', icon: Document, color: '#E6A23C' },
  { titleKey: 'messageNotify', value: '18', icon: ChatDotRound, color: '#F56C6C' }
])

// Line chart - visits trend
const lineChartOption = computed(() => ({
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: [t('dashboard.visits'), t('dashboard.users')],
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
      name: t('dashboard.visits'),
      type: 'line',
      smooth: true,
      areaStyle: { opacity: 0.3 },
      data: [820, 932, 901, 1134, 1290, 1330, 1520],
      itemStyle: { color: '#409EFF' }
    },
    {
      name: t('dashboard.users'),
      type: 'line',
      smooth: true,
      areaStyle: { opacity: 0.3 },
      data: [120, 182, 191, 234, 290, 330, 410],
      itemStyle: { color: '#67C23A' }
    }
  ]
}))

// Pie chart - traffic source
const pieChartOption = computed(() => ({
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
        { value: 1048, name: t('dashboard.directAccess'), itemStyle: { color: '#409EFF' } },
        { value: 735, name: t('dashboard.searchEngine'), itemStyle: { color: '#67C23A' } },
        { value: 580, name: t('dashboard.emailMarketing'), itemStyle: { color: '#E6A23C' } },
        { value: 484, name: t('dashboard.socialPlatform'), itemStyle: { color: '#F56C6C' } },
        { value: 300, name: t('dashboard.externalLink'), itemStyle: { color: '#909399' } }
      ]
    }
  ]
}))

// Bar chart - page views
const barChartOption = computed(() => ({
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
    data: [
      t('dashboard.homePage'),
      t('dashboard.dashboardPage'),
      t('dashboard.userPage'),
      t('dashboard.settingsPage'),
      t('dashboard.loginPage'),
      t('dashboard.notFoundPage')
    ]
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
}))
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
    color: var(--text-color, #303133);
  }

  .stat-title {
    font-size: 14px;
    color: var(--text-color-secondary, #909399);
    margin-top: 4px;
  }
}

.quick-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
