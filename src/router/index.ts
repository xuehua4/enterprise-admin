import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
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

// Navigation guard
router.beforeEach((to, _from, next) => {
  document.title = `${to.meta.title || 'Management System'} - Enterprise Admin`
  
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth !== false && !token) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
