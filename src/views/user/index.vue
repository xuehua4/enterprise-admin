<template>
  <div class="user-page">
    <el-card>
      <!-- 卡片头部：标题 + 新增按钮 -->
      <template #header>
        <div class="card-header">
          <span>{{ $t('user.title') }}</span>
          <el-button type="primary" :icon="Plus" size="small" @click="handleAdd">
            {{ $t('user.addUser') }}
          </el-button>
        </div>
      </template>

      <!-- 搜索表单 -->
      <el-form :inline="true" class="search-form">
        <el-form-item :label="$t('user.keyword')">
          <el-input v-model="searchKeyword" :placeholder="$t('user.keywordPlaceholder')" clearable />
        </el-form-item>
        <el-form-item :label="$t('user.status')">
          <el-select v-model="searchStatus" :placeholder="$t('user.allStatus')" clearable style="width: 120px">
            <el-option :label="$t('user.active')" value="active" />
            <el-option :label="$t('user.disabled')" value="disabled" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">{{ $t('common.search') }}</el-button>
          <el-button :icon="Refresh" @click="handleReset">{{ $t('common.reset') }}</el-button>
        </el-form-item>
      </el-form>

      <!-- 用户数据表格 -->
      <el-table :data="filteredTableData" stripe border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" :label="$t('user.username')" width="120" />
        <el-table-column prop="name" :label="$t('user.name')" width="120" />
        <el-table-column prop="email" :label="$t('user.email')" />
        <el-table-column prop="phone" :label="$t('settings.phone')" width="130" />
        <el-table-column :label="$t('user.role')" width="100">
          <template #default="{ row }">
            <el-tag :type="getRoleType(row.role)">{{ getRoleLabel(row.role) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.status')" width="150">
          <template #default="{ row }">
            <el-switch v-model="row.status" active-value="active" inactive-value="disabled"
              :active-text="$t('user.active')" :inactive-text="$t('user.disabled')"
              @change="(val: string | number | boolean) => handleStatusChange(row, String(val))" />
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" :label="$t('user.createdAt')" width="180" />
        <el-table-column :label="$t('common.edit')" width="220" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">{{ $t('user.edit') }}</el-button>
            <el-button type="warning" link size="small" @click="handleResetPassword(row)">{{ $t('user.resetPassword')
            }}</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">{{ $t('user.delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <div class="pagination-wrapper">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
          :total="filteredTotal" layout="total, sizes, prev, pager, next, jumper" />
      </div>
    </el-card>

    <!-- 新增/编辑用户对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? $t('user.edit') : $t('user.addUser')" width="550px"
      :close-on-click-modal="false">
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="90px">
        <el-form-item :label="$t('user.username')" prop="username">
          <el-input v-model="form.username" :placeholder="$t('user.username')" :disabled="isEdit" />
        </el-form-item>
        <el-form-item :label="$t('user.name')" prop="name">
          <el-input v-model="form.name" :placeholder="$t('user.name')" />
        </el-form-item>
        <el-form-item :label="$t('user.email')" prop="email">
          <el-input v-model="form.email" placeholder="example@enterprise.com" />
        </el-form-item>
        <el-form-item :label="$t('settings.phone')" prop="phone">
          <el-input v-model="form.phone" placeholder="13800138000" />
        </el-form-item>
        <el-form-item v-if="!isEdit" :label="$t('login.password')" prop="password">
          <el-input v-model="form.password" type="password" show-password placeholder="******" />
        </el-form-item>
        <el-form-item :label="$t('user.role')" prop="role">
          <el-select v-model="form.role" :placeholder="$t('user.role')" style="width: 100%">
            <el-option label="Admin" value="admin" />
            <el-option :label="$t('user.editor')" value="editor" />
            <el-option :label="$t('user.user')" value="user" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">{{ $t('common.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
/**
 * 用户管理页面 - 完整CRUD功能实现
 * 包含：用户列表展示、搜索筛选、新增、编辑、删除、状态切换、密码重置
 */
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus, Search, Refresh } from '@element-plus/icons-vue'

const { t } = useI18n()

// ==================== 搜索相关 ====================
const searchKeyword = ref('')
const searchStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

// ==================== 对话框相关 ====================
const dialogVisible = ref(false)
const isEdit = ref(false)
const editId = ref<number | null>(null)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()

/** 表单数据 */
const form = reactive({
  username: '',
  name: '',
  email: '',
  phone: '',
  password: '',
  role: 'user'
})

/** 表单校验规则 */
const formRules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度为3-20个字符', trigger: 'blur' }
  ],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20个字符', trigger: 'blur' }
  ]
})

// ==================== Mock数据 ====================
interface UserItem {
  id: number
  username: string
  name: string
  email: string
  phone: string
  role: string
  status: 'active' | 'disabled'
  createdAt: string
}

/** 用户列表数据（模拟数据库） */
const tableData = ref<UserItem[]>([
  { id: 1, username: 'admin', name: '系统管理员', email: 'admin@enterprise.com', phone: '13800138000', role: 'admin', status: 'active', createdAt: '2026-01-01 00:00:00' },
  { id: 2, username: 'zhangsan', name: '张三', email: 'zhangsan@enterprise.com', phone: '13900139000', role: 'user', status: 'active', createdAt: '2026-02-15 10:30:00' },
  { id: 3, username: 'lisi', name: '李四', email: 'lisi@enterprise.com', phone: '13700137000', role: 'user', status: 'active', createdAt: '2026-03-20 14:20:00' },
  { id: 4, username: 'wangwu', name: '王五', email: 'wangwu@enterprise.com', phone: '13600136000', role: 'editor', status: 'disabled', createdAt: '2026-04-10 09:15:00' },
  { id: 5, username: 'zhaoliu', name: '赵六', email: 'zhaoliu@enterprise.com', phone: '13500135000', role: 'user', status: 'active', createdAt: '2026-05-01 16:45:00' }
])

let nextId = 6 // 自增ID计数器

// ==================== 计算属性：搜索过滤 + 分页 ====================
/** 过滤后的数据 */
const filteredData = computed(() => {
  let result = [...tableData.value]
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(
      u => u.username.toLowerCase().includes(keyword) ||
        u.name.toLowerCase().includes(keyword) ||
        u.email.toLowerCase().includes(keyword)
    )
  }
  if (searchStatus.value) {
    result = result.filter(u => u.status === searchStatus.value)
  }
  return result
})

/** 过滤后总数 */
const filteredTotal = computed(() => filteredData.value.length)

/** 当前页显示的数据（分页切片） */
const filteredTableData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredData.value.slice(start, start + pageSize.value)
})

// ==================== 辅助方法 ====================
/** 获取角色显示标签 */
function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    admin: t('user.admin'),
    user: t('user.user'),
    editor: t('user.editor')
  }
  return labels[role] || role
}

/** 获取角色标签类型 */
function getRoleType(role: string): 'success' | 'warning' | 'danger' | 'info' {
  const types: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    admin: 'danger',
    user: 'info',
    editor: 'warning'
  }
  return types[role] || 'info'
}

/** 重置表单 */
function resetForm() {
  form.username = ''
  form.name = ''
  form.email = ''
  form.phone = ''
  form.password = ''
  form.role = 'user'
  formRef.value?.resetFields()
}

// ==================== 搜索操作 ====================
/** 执行搜索 */
function handleSearch() {
  currentPage.value = 1 // 搜索时重置到第一页
}

/** 重置搜索条件 */
function handleReset() {
  searchKeyword.value = ''
  searchStatus.value = ''
  currentPage.value = 1
}

// ==================== CRUD 操作 ====================
/** 打开新增对话框 */
function handleAdd() {
  isEdit.value = false
  editId.value = null
  resetForm()
  dialogVisible.value = true
}

/** 打开编辑对话框 */
function handleEdit(row: UserItem) {
  isEdit.value = true
  editId.value = row.id
  form.username = row.username
  form.name = row.name
  form.email = row.email
  form.phone = row.phone
  form.password = ''
  form.role = row.role
  dialogVisible.value = true
}

/** 提交表单（新增或编辑） */
async function handleSubmit() {
  if (!formRef.value) return
  await formRef.value.validate()

  submitLoading.value = true
  try {
    if (isEdit.value && editId.value !== null) {
      // 编辑模式：更新现有记录
      const index = tableData.value.findIndex(u => u.id === editId.value)
      if (index !== -1) {
        tableData.value[index] = {
          ...tableData.value[index],
          name: form.name,
          email: form.email,
          phone: form.phone,
          role: form.role
        }
      }
      ElMessage.success(t('common.success'))
    } else {
      // 新增模式：添加新记录
      tableData.value.push({
        id: nextId++,
        username: form.username,
        name: form.name,
        email: form.email,
        phone: form.phone,
        role: form.role,
        status: 'active',
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
      })
      ElMessage.success(t('common.success'))
    }
    dialogVisible.value = false
  } finally {
    submitLoading.value = false
  }
}

/** 删除用户 */
function handleDelete(row: UserItem) {
  ElMessageBox.confirm(
    `${t('common.delete')} "${row.name}"?`,
    t('common.tip'),
    {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    }
  ).then(() => {
    const index = tableData.value.findIndex(u => u.id === row.id)
    if (index !== -1) {
      tableData.value.splice(index, 1)
    }
    ElMessage.success(t('common.success'))
  }).catch(() => { })
}

/** 切换用户状态 */
function handleStatusChange(row: UserItem, val: string) {
  const statusText = val === 'active' ? t('user.active') : t('user.disabled')
  ElMessage.success(`"${row.name}" 状态已更改为 ${statusText}`)
}

/** 重置用户密码 */
function handleResetPassword(row: UserItem) {
  ElMessageBox.confirm(
    `确定要重置用户 "${row.name}" 的密码吗？重置后密码为：123456`,
    t('user.resetPassword'),
    {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success(`用户 "${row.name}" 的密码已重置为 123456`)
  }).catch(() => { })
}
</script>

<style scoped lang="scss">
.user-page {
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
