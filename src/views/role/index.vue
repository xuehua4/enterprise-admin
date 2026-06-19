<template>
  <div class="role-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ $t('role.title') }}</span>
          <el-button type="primary" :icon="Plus" size="small" @click="handleAdd">
            {{ $t('role.addRole') }}
          </el-button>
        </div>
      </template>

      <el-table :data="permissionStore.roles" stripe border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" :label="$t('role.roleName')" width="150" />
        <el-table-column prop="code" :label="$t('role.roleCode')" width="120" />
        <el-table-column prop="description" :label="$t('role.description')" />
        <el-table-column :label="$t('role.permissions')" width="200">
          <template #default="{ row }">
            <el-tag v-for="perm in row.permissions.slice(0, 3)" :key="perm" size="small" type="info"
              style="margin-right: 4px; margin-bottom: 4px;">
              {{ perm }}
            </el-tag>
            <el-tag v-if="row.permissions.length > 3" size="small">
              +{{ row.permissions.length - 3 }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" :label="$t('role.createdAt')" width="180" />
        <el-table-column :label="$t('common.edit')" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">
              {{ $t('role.edit') }}
            </el-button>
            <el-button type="warning" link size="small" @click="handleAssignPermission(row)">
              {{ $t('role.assignPermission') }}
            </el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">
              {{ $t('role.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Role Dialog -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? $t('role.edit') : $t('role.addRole')" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item :label="$t('role.roleName')">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item :label="$t('role.roleCode')">
          <el-input v-model="form.code" :disabled="isEdit" />
        </el-form-item>
        <el-form-item :label="$t('role.description')">
          <el-input v-model="form.description" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSave">{{ $t('common.confirm') }}</el-button>
      </template>
    </el-dialog>

    <!-- Permission Dialog -->
    <el-dialog v-model="permDialogVisible" :title="$t('role.assignPermission')" width="600px">
      <el-tree ref="permTreeRef" :data="permTreeData" show-checkbox node-key="code"
        :default-checked-keys="selectedRole?.permissions || []" :props="{ label: 'name', children: 'children' }" />
      <template #footer>
        <el-button @click="permDialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSavePermission">{{ $t('common.save') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox, type TreeInstance } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { usePermissionStore, type Role } from '@/stores/permission'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const permissionStore = usePermissionStore()

const dialogVisible = ref(false)
const permDialogVisible = ref(false)
const isEdit = ref(false)
const editId = ref('')
const selectedRole = ref<Role | null>(null)
const permTreeRef = ref<TreeInstance>()

const form = reactive({
  name: '',
  code: '',
  description: ''
})

// Build permission tree
const permTreeData = computed(() => {
  const menus = permissionStore.permissions
    .filter(p => p.type === 'menu')
    .map(p => ({
      ...p,
      children: permissionStore.permissions.filter(
        child => child.parentId === p.id && child.type === 'button'
      )
    }))
  return menus
})

function handleAdd() {
  isEdit.value = false
  editId.value = ''
  form.name = ''
  form.code = ''
  form.description = ''
  dialogVisible.value = true
}

function handleEdit(row: Role) {
  isEdit.value = true
  editId.value = row.id
  form.name = row.name
  form.code = row.code
  form.description = row.description
  dialogVisible.value = true
}

function handleSave() {
  if (!form.name || !form.code) {
    ElMessage.warning(t('common.tip'))
    return
  }

  if (isEdit.value) {
    permissionStore.updateRole(editId.value, {
      name: form.name,
      description: form.description
    })
    ElMessage.success(t('common.success'))
  } else {
    permissionStore.addRole({
      name: form.name,
      code: form.code,
      description: form.description,
      permissions: []
    })
    ElMessage.success(t('common.success'))
  }
  dialogVisible.value = false
}

function handleDelete(row: Role) {
  ElMessageBox.confirm(
    `确定要删除角色 "${row.name}" 吗？`,
    t('common.tip'),
    {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    }
  ).then(() => {
    permissionStore.deleteRole(row.id)
    ElMessage.success(t('common.success'))
  }).catch(() => { })
}

function handleAssignPermission(row: Role) {
  selectedRole.value = row
  permDialogVisible.value = true
}

function handleSavePermission() {
  if (selectedRole.value && permTreeRef.value) {
    const checkedKeys = permTreeRef.value.getCheckedKeys()
    const halfCheckedKeys = permTreeRef.value.getHalfCheckedKeys()
    const allPermissions = [...checkedKeys, ...halfCheckedKeys] as string[]

    permissionStore.updateRole(selectedRole.value.id, {
      permissions: allPermissions
    })
    ElMessage.success(t('common.success'))
    permDialogVisible.value = false
  }
}
</script>

<style scoped lang="scss">
.role-page {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
