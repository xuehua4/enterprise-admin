import { createRouter, createWebHistory } from 'vue-router'

const base = import.meta.env.BASE_URL || '/'

const router = createRouter({
  history: createWebHistory(base),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/index.vue'),
      meta: { title: 'Login', requiresAuth: false }
    },
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      redirect: '/dashboard',
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/dashboard/index.vue'),
          meta: { title: 'Dashboard', icon: 'Odometer', permission: 'dashboard:view' }
        },
        {
          path: 'user',
          name: 'UserManagement',
          component: () => import('@/views/user/index.vue'),
          meta: { title: 'User Management', icon: 'User', permission: 'user:view' }
        },
        {
          path: 'role',
          name: 'RoleManagement',
          component: () => import('@/views/role/index.vue'),
          meta: { title: 'Role Management', icon: 'Postcard', permission: 'role:view' }
        },
        {
          path: 'menu',
          name: 'MenuManagement',
          component: () => import('@/views/menu/index.vue'),
          meta: { title: 'Menu Management', icon: 'Menu', permission: 'menu:view' }
        },
        {
          path: 'log',
          name: 'SystemLog',
          component: () => import('@/views/log/index.vue'),
          meta: { title: 'System Log', icon: 'Document', permission: 'log:view' }
        },
        {
          path: 'settings',
          name: 'Settings',
          component: () => import('@/views/settings/index.vue'),
          meta: { title: 'System Settings', icon: 'Setting', permission: 'settings:view' }
        },
        {
          path: 'about',
          name: 'About',
          component: () => import('@/views/about/index.vue'),
          meta: { title: 'About', icon: 'InfoFilled', permission: 'about:view' }
        },
        {
          path: 'redirect/:path(.*)',
          name: 'Redirect',
          component: () => import('@/views/redirect/index.vue'),
          meta: { hidden: true }
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/error/404.vue'),
      meta: { title: '404' }
    }
  ]
})

/**
 * 全局前置导航守卫
 * - 设置页面标题
 * - 未登录用户重定向到登录页（返回值方式，兼容 Vue Router 4.x+）
 */
router.beforeEach((to) => {
  document.title = `${to.meta.title || 'Management System'} - Enterprise Admin`

  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth !== false && !token) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  return true
})

export default router
