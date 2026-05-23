import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Permission {
  id: string
  name: string
  code: string
  type: 'menu' | 'button' | 'api'
  parentId?: string
}

export interface Role {
  id: string
  name: string
  code: string
  description: string
  permissions: string[]
  createdAt: string
}

// Mock permissions
const mockPermissions: Permission[] = [
  { id: '1', name: '仪表盘', code: 'dashboard:view', type: 'menu' },
  { id: '2', name: '用户管理', code: 'user:view', type: 'menu' },
  { id: '3', name: '用户新增', code: 'user:add', type: 'button', parentId: '2' },
  { id: '4', name: '用户编辑', code: 'user:edit', type: 'button', parentId: '2' },
  { id: '5', name: '用户删除', code: 'user:delete', type: 'button', parentId: '2' },
  { id: '6', name: '角色管理', code: 'role:view', type: 'menu' },
  { id: '7', name: '角色新增', code: 'role:add', type: 'button', parentId: '6' },
  { id: '8', name: '角色编辑', code: 'role:edit', type: 'button', parentId: '6' },
  { id: '9', name: '角色删除', code: 'role:delete', type: 'button', parentId: '6' },
  { id: '10', name: '菜单管理', code: 'menu:view', type: 'menu' },
  { id: '11', name: '菜单新增', code: 'menu:add', type: 'button', parentId: '10' },
  { id: '12', name: '菜单编辑', code: 'menu:edit', type: 'button', parentId: '10' },
  { id: '13', name: '菜单删除', code: 'menu:delete', type: 'button', parentId: '10' },
  { id: '14', name: '系统设置', code: 'settings:view', type: 'menu' },
  { id: '15', name: '系统日志', code: 'log:view', type: 'menu' },
  { id: '16', name: '日志导出', code: 'log:export', type: 'button', parentId: '15' },
  { id: '17', name: '关于页面', code: 'about:view', type: 'menu' }
]

// Mock roles
const mockRoles: Role[] = [
  {
    id: '1',
    name: '超级管理员',
    code: 'admin',
    description: '拥有所有权限',
    permissions: mockPermissions.map(p => p.code),
    createdAt: '2026-01-01 00:00:00'
  },
  {
    id: '2',
    name: '普通用户',
    code: 'user',
    description: '仅有查看权限',
    permissions: ['dashboard:view', 'settings:view', 'about:view'],
    createdAt: '2026-02-01 00:00:00'
  },
  {
    id: '3',
    name: '编辑员',
    code: 'editor',
    description: '可编辑内容',
    permissions: ['dashboard:view', 'user:view', 'settings:view', 'about:view'],
    createdAt: '2026-03-01 00:00:00'
  }
]

export const usePermissionStore = defineStore('permission', () => {
  const permissions = ref<Permission[]>(mockPermissions)
  const roles = ref<Role[]>(mockRoles)
  const currentRoleCodes = ref<string[]>(['admin'])

  const allPermissionCodes = computed(() => permissions.value.map(p => p.code))
  
  const currentPermissions = computed(() => {
    const rolePermissions = roles.value
      .filter(r => currentRoleCodes.value.includes(r.code))
      .flatMap(r => r.permissions)
    return [...new Set(rolePermissions)]
  })

  function hasPermission(permissionCode: string): boolean {
    // Super admin has all permissions
    if (currentRoleCodes.value.includes('admin')) return true
    return currentPermissions.value.includes(permissionCode)
  }

  function hasAnyPermission(permissionCodes: string[]): boolean {
    return permissionCodes.some(code => hasPermission(code))
  }

  function setCurrentRoles(roleCodes: string[]) {
    currentRoleCodes.value = roleCodes
  }

  function addRole(role: Omit<Role, 'id' | 'createdAt'>) {
    const newRole: Role = {
      ...role,
      id: String(Date.now()),
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
    }
    roles.value.push(newRole)
  }

  function updateRole(id: string, updates: Partial<Role>) {
    const index = roles.value.findIndex(r => r.id === id)
    if (index !== -1) {
      roles.value[index] = { ...roles.value[index], ...updates }
    }
  }

  function deleteRole(id: string) {
    const index = roles.value.findIndex(r => r.id === id)
    if (index !== -1) {
      roles.value.splice(index, 1)
    }
  }

  function addPermission(permission: Omit<Permission, 'id'>) {
    const newPermission: Permission = {
      ...permission,
      id: String(Date.now())
    }
    permissions.value.push(newPermission)
  }

  return {
    permissions,
    roles,
    currentRoleCodes,
    allPermissionCodes,
    currentPermissions,
    hasPermission,
    hasAnyPermission,
    setCurrentRoles,
    addRole,
    updateRole,
    deleteRole,
    addPermission
  }
})
