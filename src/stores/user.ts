import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface UserInfo {
  id: number
  username: string
  name: string
  avatar: string
  roles: string[]
}

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref<UserInfo | null>(null)

  const isLoggedIn = computed(() => !!token.value)
  const username = computed(() => userInfo.value?.username || '')
  const displayName = computed(() => userInfo.value?.name || userInfo.value?.username || '')

  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  function setUserInfo(info: UserInfo) {
    userInfo.value = info
  }

  async function login(username: string, password: string) {
    // Mock login - replace with real API call
    if (username === 'admin' && password === 'admin123') {
      setToken('mock-jwt-token-' + Date.now())
      setUserInfo({
        id: 1,
        username: 'admin',
        name: '系统管理员',
        avatar: '',
        roles: ['admin']
      })
      return { success: true }
    }
    throw new Error('用户名或密码错误')
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    username,
    displayName,
    login,
    logout,
    setToken,
    setUserInfo
  }
}, {
  /** Pinia 持久化配置：刷新页面后保留用户信息 */
  persist: {
    key: 'enterprise_admin_user',
    pick: ['token', 'userInfo']
  }
})
