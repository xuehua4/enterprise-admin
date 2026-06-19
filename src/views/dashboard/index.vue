<template>
  <div class="dashboard">
    <!-- ==================== 统计卡片区域（现代化渐变设计） ==================== -->
    <el-row :gutter="20" class="stat-cards">
      <el-col :xs="24" :sm="12" :lg="6" v-for="(card, index) in statCards" :key="card.titleKey">
        <div class="stat-card" :class="`stat-card-${index}`" @mouseenter="card.hovered = true"
          @mouseleave="card.hovered = false">
          <!-- 卡片背景装饰 -->
          <div class="stat-card-bg">
            <div class="bg-circle circle-1"></div>
            <div class="bg-circle circle-2"></div>
          </div>
          <!-- 卡片内容 -->
          <div class="stat-card-content">
            <div class="stat-info">
              <div class="stat-label">{{ $t(`dashboard.${card.titleKey}`) }}</div>
              <div class="stat-value">{{ card.value }}</div>
              <!-- 趋势指示器 -->
              <div class="stat-trend" :class="card.trend > 0 ? 'trend-up' : 'trend-down'">
                <span class="trend-icon">{{ card.trend > 0 ? '↑' : '↓' }}</span>
                <span>{{ Math.abs(card.trend) }}%</span>
                <span class="trend-text">vs 上周</span>
              </div>
            </div>
            <div class="stat-icon-wrapper" :style="{ '--accent-color': card.color }">
              <el-icon :size="32">
                <component :is="card.icon" />
              </el-icon>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- ==================== 图表区域（增强视觉设计） ==================== -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :xs="24" :lg="16">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="chart-header">
              <span class="chart-title">{{ $t('dashboard.visitTrend') }}</span>
              <div class="chart-actions">
                <el-radio-group v-model="chartPeriod" size="small">
                  <el-radio-button value="week">周</el-radio-button>
                  <el-radio-button value="month">月</el-radio-button>
                  <el-radio-button value="year">年</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </template>
          <v-chart :option="lineChartOption" autoresize style="height: 320px" />
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="8">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="chart-header">
              <span class="chart-title">{{ $t('dashboard.trafficSource') }}</span>
            </div>
          </template>
          <v-chart :option="pieChartOption" autoresize style="height: 320px" />
        </el-card>
      </el-col>
    </el-row>

    <!-- ==================== 底部区域 ==================== -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :xs="24" :lg="12">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="chart-header">
              <span class="chart-title">{{ $t('dashboard.pageViews') }}</span>
            </div>
          </template>
          <v-chart :option="barChartOption" autoresize style="height: 300px" />
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12">
        <el-card shadow="hover" class="chart-card system-info-card">
          <template #header>
            <div class="chart-header">
              <span class="chart-title">{{ $t('dashboard.systemInfo') }}</span>
            </div>
          </template>
          <el-descriptions :column="1" border size="small" class="system-desc">
            <el-descriptions-item :label="$t('dashboard.version')">
              <span class="desc-value">v1.0.0</span>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('dashboard.vueVersion')">
              <span class="desc-value">3.5.x</span>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('dashboard.uiFramework')">
              <el-tag size="small" type="primary">Element Plus 2.14</el-tag>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('dashboard.buildTool')">
              <span class="desc-value">Vite 8.0</span>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('dashboard.chartLib')">
              <span class="desc-value">ECharts 6.1</span>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('dashboard.stateManagement')">
              <el-tag size="small" type="success">Pinia 3.0</el-tag>
            </el-descriptions-item>
          </el-descriptions>
          <div class="quick-actions">
            <el-button type="primary" :icon="User" round @click="$router.push('/user')">
              {{ $t('menu.userManagement') }}
            </el-button>
            <el-button type="success" :icon="Setting" round @click="$router.push('/settings')">
              {{ $t('menu.systemSettings') }}
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, markRaw } from 'vue'
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

// 图表时间周期选择
const chartPeriod = ref('week')

/**
 * 统计卡片数据（含趋势数据和悬浮状态）
 * 基于21st.dev Dashboard组件提示词优化：渐变背景、趋势指示器、悬浮交互
 */
interface StatCardData {
  /** i18n标题键 */
  titleKey: string
  /** 显示数值 */
  value: string
  /** 图标组件 */
  icon: any
  /** 主题色 */
  color: string
  /** 趋势百分比（正数=上升，负数=下降） */
  trend: number
  /** 悬浮状态（用于动画） */
  hovered: boolean
}

/** 统计卡片列表（图标用 markRaw 避免不必要的响应式开销） */
const statCards = ref<StatCardData[]>([
  { titleKey: 'userTotal', value: '1,284', icon: markRaw(UserFilled), color: '#6366f1', trend: 12.5, hovered: false },
  { titleKey: 'todayVisits', value: '856', icon: markRaw(TrendCharts), color: '#22c55e', trend: 8.2, hovered: false },
  { titleKey: 'documentCount', value: '320', icon: markRaw(Document), color: '#f59e0b', trend: -3.1, hovered: false },
  { titleKey: 'messageNotify', value: '18', icon: markRaw(ChatDotRound), color: '#ef4444', trend: 24.3, hovered: false }
])

// ==================== 图表数据：根据周期切换 ====================
/** 各周期的图表数据 */
const chartDataMap: Record<string, { xAxis: string[]; visits: number[]; users: number[] }> = {
  week: {
    xAxis: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    visits: [820, 932, 901, 1134, 1290, 1330, 1520],
    users: [120, 182, 191, 234, 290, 330, 410]
  },
  month: {
    xAxis: ['第1周', '第2周', '第3周', '第4周'],
    visits: [4200, 5100, 4800, 5600],
    users: [800, 950, 900, 1100]
  },
  year: {
    xAxis: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    visits: [12500, 13200, 14100, 13800, 15200, 16800, 15500, 16200, 17100, 16500, 17800, 18500],
    users: [2100, 2300, 2500, 2400, 2600, 2800, 2700, 2900, 3100, 3000, 3200, 3400]
  }
}

// Line chart - visits trend
const lineChartOption = computed(() => {
  const data = chartDataMap[chartPeriod.value] || chartDataMap.week
  return {
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
      data: data.xAxis
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
        data: data.visits,
        itemStyle: { color: '#409EFF' }
      },
      {
        name: t('dashboard.users'),
        type: 'line',
        smooth: true,
        areaStyle: { opacity: 0.3 },
        data: data.users,
        itemStyle: { color: '#67C23A' }
      }
    ]
  }
})

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
/* ==================== 基础布局 ==================== */
.dashboard {
  padding: 4px;
}

.stat-cards {
  margin-bottom: 0;
}

/* ==================== 现代化统计卡片（21st.dev风格） ==================== */
.stat-card {
  position: relative;
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);

    .stat-icon-wrapper {
      transform: scale(1.1) rotate(5deg);
    }

    .bg-circle {
      transform: scale(1.5);
      opacity: 0.15;
    }
  }
}

/* 卡片渐变主题色（每张卡片独特配色） */
.stat-card-0 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;

  .stat-trend-up {
    color: #a5f3fc;
  }

  .stat-trend-down {
    color: #fca5a5;
  }
}

.stat-card-1 {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: #fff;

  .stat-trend-up {
    color: #a5f3fc;
  }

  .stat-trend-down {
    color: #fca5a5;
  }
}

.stat-card-2 {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: #fff;

  .stat-trend-up {
    color: #a5f3fc;
  }

  .stat-trend-down {
    color: #fca5a5;
  }
}

.stat-card-3 {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: #fff;

  .stat-trend-up {
    color: #a5f3fc;
  }

  .stat-trend-down {
    color: #fca5a5;
  }
}

/* 背景装饰圆 */
.stat-card-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  transition: all 0.6s ease;
}

.circle-1 {
  width: 120px;
  height: 120px;
  top: -30px;
  right: -20px;
}

.circle-2 {
  width: 80px;
  height: 80px;
  bottom: -20px;
  left: 20px;
}

/* 卡片内容 */
.stat-card-content {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  z-index: 1;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-label {
  font-size: 13px;
  opacity: 0.85;
  font-weight: 500;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.stat-value {
  font-size: 36px;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -1px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}

/* 趋势指示器 */
.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  margin-top: 4px;
  padding: 3px 8px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  width: fit-content;
  backdrop-filter: blur(4px);
}

.trend-icon {
  font-size: 11px;
}

.trend-text {
  opacity: 0.7;
  font-weight: 400;
}

/* 图标容器（悬浮动画） */
.stat-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-color);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);

  :deep(.el-icon) {
    color: #fff;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }
}

/* ==================== 图表卡片增强样式 ==================== */
.chart-card {
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color, #e6e6e6);

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }

  :deep(.el-card__header) {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-color, #f0f0f0);
  }

  :deep(.el-card__body) {
    padding: 16px 20px;
  }
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-color, #303133);
}

.chart-actions {
  :deep(.el-radio-group) {
    .el-radio-button__inner {
      padding: 6px 12px;
      font-size: 12px;
    }
  }
}

/* 系统信息卡片特殊样式 */
.system-info-card {
  .quick-actions {
    display: flex;
    gap: 12px;
    margin-top: 20px;
    flex-wrap: wrap;
  }
}

.system-desc {
  :deep(.el-descriptions__label) {
    font-weight: 500;
    color: var(--text-color-secondary, #606266);
    width: 120px;
  }

  :deep(.el-descriptions__content) {
    min-width: 0;
  }
}

.desc-value {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 13px;
  color: var(--text-color, #303133);
  font-weight: 500;
}

/* ==================== 暗色模式适配 ==================== */
:global(html.dark) .dashboard,
:global(.dark) .dashboard {
  .chart-card {
    background: var(--card-bg, #1d1d1f);
    border-color: rgba(255, 255, 255, 0.06);
  }

  .chart-title {
    color: #e0e0e0;
  }

  .desc-value {
    color: #e0e0e0;
  }

  .system-desc {
    :deep(.el-descriptions__label) {
      color: #909399;
    }
  }
}
</style>
