<template>
  <div class="log-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ $t('log.title') }}</span>
          <div>
            <el-button type="warning" :icon="Download" size="small">
              {{ $t('log.export') }}
            </el-button>
            <el-button type="danger" :icon="Delete" size="small" style="margin-left: 8px;">
              {{ $t('log.clearAll') }}
            </el-button>
          </div>
        </div>
      </template>

      <!-- Filters -->
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
          <el-date-picker
            v-model="filter.dateRange"
            type="daterange"
            range-separator="-"
            start-placeholder="Start"
            end-placeholder="End"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">{{ $t('common.search') }}</el-button>
          <el-button :icon="Refresh">{{ $t('common.reset') }}</el-button>
        </el-form-item>
      </el-form>

      <!-- Log Table -->
      <el-table :data="filteredLogs" stripe border style="width: 100%">
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

      <!-- Pagination -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="totalLogs"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Search, Refresh, Download, Delete } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const currentPage = ref(1)
const pageSize = ref(10)

const filter = reactive({
  operator: '',
  operation: '',
  status: '',
  dateRange: null as [Date, Date] | null
})

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
  
  return result.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
})

const totalLogs = computed(() => logs.value.length)

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
