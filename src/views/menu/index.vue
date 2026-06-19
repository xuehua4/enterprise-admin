<template>
  <div class="menu-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ $t('menuMgmt.title') }}</span>
          <div>
            <el-button type="primary" :icon="Plus" size="small" @click="handleAdd">
              {{ $t('menuMgmt.addMenu') }}
            </el-button>
          </div>
        </div>
      </template>

      <el-alert :title="$t('menuMgmt.dragTip')" type="info" :closable="false" style="margin-bottom: 16px;" />

      <el-table :data="menuTree" row-key="id" border default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
        <el-table-column prop="name" :label="$t('menuMgmt.menuName')" width="200" />
        <el-table-column prop="icon" :label="$t('menuMgmt.icon')" width="100">
          <template #default="{ row }">
            <el-icon v-if="row.icon">
              <component :is="row.icon" />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" :label="$t('menuMgmt.orderNum')" width="80" />
        <el-table-column prop="path" :label="$t('menuMgmt.path')" />
        <el-table-column prop="component" :label="$t('menuMgmt.component')" width="200" />
        <el-table-column :label="$t('menuMgmt.visible')" width="80">
          <template #default="{ row }">
            <el-tag :type="row.visible ? 'success' : 'info'">
              {{ row.visible ? $t('common.yes') : $t('common.no') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="permission" :label="$t('menuMgmt.permission')" width="150" />
        <el-table-column :label="$t('common.edit')" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">
              {{ $t('menuMgmt.edit') }}
            </el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">
              {{ $t('menuMgmt.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Menu Dialog -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? $t('menuMgmt.edit') : $t('menuMgmt.addMenu')" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item :label="$t('menuMgmt.parentMenu')">
          <el-tree-select v-model="form.parentId" :data="menuTreeSelectData" :props="{ label: 'name' }" node-key="id"
            check-strictly clearable :placeholder="$t('menuMgmt.selectParent')" style="width: 100%" />
        </el-form-item>
        <el-form-item :label="$t('menuMgmt.menuName')">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item :label="$t('menuMgmt.icon')">
          <el-input v-model="form.icon" placeholder="e.g., Odometer, User, Setting" />
        </el-form-item>
        <el-form-item :label="$t('menuMgmt.orderNum')">
          <el-input-number v-model="form.orderNum" :min="0" :max="999" />
        </el-form-item>
        <el-form-item :label="$t('menuMgmt.path')">
          <el-input v-model="form.path" placeholder="e.g., dashboard" />
        </el-form-item>
        <el-form-item :label="$t('menuMgmt.component')">
          <el-input v-model="form.component" placeholder="e.g., views/dashboard/index.vue" />
        </el-form-item>
        <el-form-item :label="$t('menuMgmt.visible')">
          <el-switch v-model="form.visible" />
        </el-form-item>
        <el-form-item :label="$t('menuMgmt.permission')">
          <el-input v-model="form.permission" placeholder="e.g., dashboard:view" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSave">{{ $t('common.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface MenuItem {
  id: string
  parentId: string | null
  name: string
  icon: string
  orderNum: number
  path: string
  component: string
  visible: boolean
  permission: string
  children?: MenuItem[]
}

const dialogVisible = ref(false)
const isEdit = ref(false)
const editId = ref('')

const form = reactive({
  parentId: null as string | null,
  name: '',
  icon: '',
  orderNum: 0,
  path: '',
  component: '',
  visible: true,
  permission: ''
})

// Mock menu data
const menus = ref<MenuItem[]>([
  {
    id: '1',
    parentId: null,
    name: '仪表盘',
    icon: 'Odometer',
    orderNum: 1,
    path: 'dashboard',
    component: 'views/dashboard/index.vue',
    visible: true,
    permission: 'dashboard:view',
    children: []
  },
  {
    id: '2',
    parentId: null,
    name: '用户管理',
    icon: 'User',
    orderNum: 2,
    path: 'user',
    component: 'views/user/index.vue',
    visible: true,
    permission: 'user:view',
    children: []
  },
  {
    id: '3',
    parentId: null,
    name: '角色管理',
    icon: 'Postcard',
    orderNum: 3,
    path: 'role',
    component: 'views/role/index.vue',
    visible: true,
    permission: 'role:view',
    children: []
  },
  {
    id: '4',
    parentId: null,
    name: '菜单管理',
    icon: 'Menu',
    orderNum: 4,
    path: 'menu',
    component: 'views/menu/index.vue',
    visible: true,
    permission: 'menu:view',
    children: []
  },
  {
    id: '5',
    parentId: null,
    name: '系统日志',
    icon: 'Document',
    orderNum: 5,
    path: 'log',
    component: 'views/log/index.vue',
    visible: true,
    permission: 'log:view',
    children: []
  },
  {
    id: '6',
    parentId: null,
    name: '系统设置',
    icon: 'Setting',
    orderNum: 6,
    path: 'settings',
    component: 'views/settings/index.vue',
    visible: true,
    permission: 'settings:view',
    children: []
  },
  {
    id: '7',
    parentId: null,
    name: '关于',
    icon: 'InfoFilled',
    orderNum: 7,
    path: 'about',
    component: 'views/about/index.vue',
    visible: true,
    permission: 'about:view',
    children: []
  }
])

// Build tree structure
const menuTree = computed(() => {
  const buildTree = (parentId: string | null): MenuItem[] => {
    return menus.value
      .filter(m => m.parentId === parentId)
      .map(m => ({
        ...m,
        children: buildTree(m.id)
      }))
      .sort((a, b) => a.orderNum - b.orderNum)
  }
  return buildTree(null)
})

// For tree select
const menuTreeSelectData = computed(() => {
  return [
    { id: '', name: 'Root', children: menuTree.value }
  ]
})

function handleAdd() {
  isEdit.value = false
  editId.value = ''
  form.parentId = null
  form.name = ''
  form.icon = ''
  form.orderNum = menus.value.length + 1
  form.path = ''
  form.component = ''
  form.visible = true
  form.permission = ''
  dialogVisible.value = true
}

function handleEdit(row: MenuItem) {
  isEdit.value = true
  editId.value = row.id
  form.parentId = row.parentId
  form.name = row.name
  form.icon = row.icon
  form.orderNum = row.orderNum
  form.path = row.path
  form.component = row.component
  form.visible = row.visible
  form.permission = row.permission
  dialogVisible.value = true
}

function handleSave() {
  if (!form.name) {
    ElMessage.warning(t('common.tip'))
    return
  }

  if (isEdit.value) {
    const index = menus.value.findIndex(m => m.id === editId.value)
    if (index !== -1) {
      menus.value[index] = {
        ...menus.value[index],
        parentId: form.parentId || null,
        name: form.name,
        icon: form.icon,
        orderNum: form.orderNum,
        path: form.path,
        component: form.component,
        visible: form.visible,
        permission: form.permission
      }
    }
    ElMessage.success(t('common.success'))
  } else {
    menus.value.push({
      id: String(Date.now()),
      parentId: form.parentId || null,
      name: form.name,
      icon: form.icon,
      orderNum: form.orderNum,
      path: form.path,
      component: form.component,
      visible: form.visible,
      permission: form.permission
    })
    ElMessage.success(t('common.success'))
  }
  dialogVisible.value = false
}

function handleDelete(row: MenuItem) {
  ElMessageBox.confirm(
    `${t('menuMgmt.deleteConfirm')} "${row.name}"?`,
    t('common.tip'),
    {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    }
  ).then(() => {
    const index = menus.value.findIndex(m => m.id === row.id)
    if (index !== -1) {
      menus.value.splice(index, 1)
    }
    ElMessage.success(t('common.success'))
  }).catch(() => { })
}
</script>

<style scoped lang="scss">
.menu-page {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
