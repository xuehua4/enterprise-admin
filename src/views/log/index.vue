<template>
  <div class="log-page">
    <el-card>
      <!-- 卡片头部：标题 + 操作按钮 -->
      <template #header>
        <div class="card-header">
          <span>{{ $t('log.title') }}</span>
          <div>
            <el-button type="warning" :icon="Download" size="small" @click="handleExport">
              {{ $t('log.export') }}
            </el-button>
            <el-button type="danger" :icon="Delete" size="small" style="margin-left: 8px;" @click="handleClearAll">
              {{ $t('log.clearAll') }}
            </el-button>
          </div>
        </div>
      </template>

      <!-- 筛选表单 -->
      <el-form :inline="true" class="search-form">
        <el-form-item :label="$t('log.operator')">
          <el-input v-model="filter.operator" :placeholder="$t('log.operator')" clearable />
        </el-form-item>
        <el-form-item :label="$t('log.operation')">
          <el-select v-model="filter.operation" :placeholder="$t('log.operation')" clearable style="width: 120px">
            <el-option :label="$t('log.login')" value="login" />
            <el-option :label="$t('log.logout')" value="logout" />
            <el-option :label="$t('log.create')" value="create" />
            <el-option :label="$t('log.update')" value="update" />
            <el-option :label="$t('log.delete')" value="delete" />
            <el-option :label="$t('log.query')" value="query" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('log.status')">
          <el-select v-model="filter.status" :placeholder="$t('log.status')" clearable style="width: 120px">
            <el-option :label="$t('log.success')" value="success" />
            <el-option :label="$t('log.failed')" value="failed" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('log.time')">
          <el-date-picker v-model="filter.dateRange" type="daterange" :range-separator="$t('common.to') || '-'"
            :start-placeholder="$t('log.startDate')" :end-placeholder="$t('log.endDate')" style="width: 240px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">{{ $t('common.search') }}</el-button>
          <el-button :icon="Refresh" @click="handleReset">{{ $t('common.reset') }}</el-button>
        </el-form-item>
      </el-form>

      <!-- 日志数据表格 -->
      <el-table :data="pagedLogs" stripe border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="operator" :label="$t('log.operator')" width="120" />
        <el-table-column :label="$t('log.operation')" width="100">
          <template #default="{ row }">
            <el-tag :type="getOperationType(row.operation)" size="small">
              {{ getOperationLabel(row.operation) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="module" :label="$t('log.module')" width="120" />
        <el-table-column prop="detail" :label="$t('log.detail')" />
        <el-table-column prop="ip" :label="$t('log.ip')" width="140" />
        <el-table-column :label="$t('log.status')" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'success' ? 'success' : 'danger'" size="small">
              {{ row.status === 'success' ? $t('log.success') : $t('log.failed') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="time" :label="$t('log.time')" width="180" />
      </el-table>

      <!-- 分页器 -->
      <div class="pagination-wrapper">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
          :total="filteredLogs.length" layout="total, sizes, prev, pager, next, jumper" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
/**
 * 系统日志页面
 * 功能：日志列表展示、多条件筛选、分页、导出（模拟）、清空（带确认）
 */
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Download, Delete } from '@element-plus/icons-vue'

const { t } = useI18n()

// ==================== 分页相关 ====================
const currentPage = ref(1)
const pageSize = ref(10)

// ==================== 筛选条件 ====================
const filter = reactive({
  operator: '',
  operation: '',
  status: '',
  dateRange: null as [Date, Date] | null
})

// ==================== 日志数据类型定义 ====================
interface LogEntry {
  id: number
  operator: string
  operation: string
  module: string
  detail: string
  ip: string
  status: 'success' | 'failed'
  time: string
}

// ==================== Mock 日志数据 ====================
const logs = ref<LogEntry[]>([
  { id: 1, operator: 'admin', operation: 'login', module: 'Auth', detail: '用户 admin 登录系统', ip: '192.168.1.100', status: 'success', time: '2026-05-23 15:30:00' },
  { id: 2, operator: 'admin', operation: 'query', module: 'User', detail: '查询用户列表', ip: '192.168.1.100', status: 'success', time: '2026-05-23 15:25:00' },
  { id: 3, operator: 'admin', operation: 'create', module: 'User', detail: '新增用户 zhangsan', ip: '192.168.1.100', status: 'success', time: '2026-05-23 15:20:00' },
  { id: 4, operator: 'admin', operation: 'update', module: 'Role', detail: '更新角色权限配置', ip: '192.168.1.100', status: 'success', time: '2026-05-23 15:15:00' },
  { id: 5, operator: 'zhangsan', operation: 'login', module: 'Auth', detail: '用户 zhangsan 登录失败：密码错误', ip: '192.168.1.101', status: 'failed', time: '2026-05-23 15:10:00' },
  { id: 6, operator: 'admin', operation: 'delete', module: 'User', detail: '删除用户 wangwu', ip: '192.168.1.100', status: 'success', time: '2026-05-23 15:05:00' },
  { id: 7, operator: 'admin', operation: 'query', module: 'Log', detail: '查询系统日志', ip: '192.168.1.100', status: 'success', time: '2026-05-23 15:00:00' },
  { id: 8, operator: 'lisi', operation: 'login', module: 'Auth', detail: '用户 lisi 登录系统', ip: '192.168.1.102', status: 'success', time: '2026-05-23 14:55:00' },
  { id: 9, operator: 'admin', operation: 'update', module: 'Settings', detail: '更新系统配置', ip: '192.168.1.100', status: 'success', time: '2026-05-23 14:50:00' },
  { id: 10, operator: 'admin', operation: 'create', module: 'Menu', detail: '新增菜单项：系统日志', ip: '192.168.1.100', status: 'success', time: '2026-05-23 14:45:00' },
  { id: 11, operator: 'lisi', operation: 'query', module: 'User', detail: '查询用户列表', ip: '192.168.1.102', status: 'success', time: '2026-05-23 14:40:00' },
  { id: 12, operator: 'admin', operation: 'delete', module: 'Menu', detail: '删除菜单项 test', ip: '192.168.1.100', status: 'failed', time: '2026-05-23 14:35:00' }
])

// ==================== 计算属性：过滤 + 分页 ====================
/** 根据筛选条件过滤日志 */
const filteredLogs = computed(() => {
  let result = [...logs.value]

  if (filter.operator) {
    result = result.filter(log => log.operator.toLowerCase().includes(filter.operator.toLowerCase()))
  }
  if (filter.operation) {
    result = result.filter(log => log.operation === filter.operation)
  }
  if (filter.status) {
    result = result.filter(log => log.status === filter.status)
  }
  // 日期范围筛选
  if (filter.dateRange && filter.dateRange.length === 2) {
    const [startDate, endDate] = filter.dateRange
    const start = new Date(startDate).setHours(0, 0, 0, 0)
    const end = new Date(endDate).setHours(23, 59, 59, 999)
    result = result.filter(log => {
      const logTime = new Date(log.time).getTime()
      return logTime >= start && logTime <= end
    })
  }

  return result
})

/** 当前页显示的分页日志 */
const pagedLogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredLogs.value.slice(start, start + pageSize.value)
})

// ==================== 辅助方法 ====================
/** 获取操作类型的标签样式 */
function getOperationType(operation: string): 'success' | 'warning' | 'danger' | 'info' {
  const types: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    login: 'success',
    logout: 'info',
    create: 'success',
    update: 'warning',
    delete: 'danger',
    query: 'info'
  }
  return types[operation] || 'info'
}

/** 获取操作类型的国际化标签文本 */
function getOperationLabel(operation: string): string {
  const labels: Record<string, string> = {
    login: t('log.login'),
    logout: t('log.logout'),
    create: t('log.create'),
    update: t('log.update'),
    delete: t('log.delete'),
    query: t('log.query')
  }
  return labels[operation] || operation
}

// ==================== 操作方法 ====================
/** 执行搜索（重置到第一页） */
function handleSearch() {
  currentPage.value = 1
}

/** 重置所有筛选条件 */
function handleReset() {
  filter.operator = ''
  filter.operation = ''
  filter.status = ''
  filter.dateRange = null
  currentPage.value = 1
}

/** 导出日志（模拟下载CSV） */
function handleExport() {
  const exportData = filteredLogs.value.length > 0 ? filteredLogs.value : logs.value

  // 构造CSV内容
  const headers = ['ID', t('log.operator'), t('log.operation'), t('log.module'), t('log.detail'), t('log.ip'), t('log.status'), t('log.time')]
  const rows = exportData.map(log => [
    log.id, log.operator, log.operation, log.module, log.detail, log.ip, log.status, log.time
  ])
  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n')

  // 触发下载
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `system_logs_${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(link.href)

  ElMessage.success(`已导出 ${exportData.length} 条日志`)
}

/** 清空所有日志（带二次确认） */
function handleClearAll() {
  ElMessageBox.confirm(
    t('log.clearConfirm') || '确定要清空所有日志吗？此操作不可恢复！',
    t('common.tip'),
    {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning',
      confirmButtonClass: 'el-button--danger'
    }
  ).then(() => {
    logs.value = []
    ElMessage.success(t('log.clearSuccess') || '日志已全部清空')
  }).catch(() => { })
}
</script>

<style scoped lang="scss">
.log-page {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .search-form {
    margin-bottom: 20px;
  }

  .pagination-wrapper {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
