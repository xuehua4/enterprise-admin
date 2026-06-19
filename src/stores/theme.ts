import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'auto'

export const useThemeStore = defineStore('theme', () => {
  const savedTheme = (localStorage.getItem('theme') as ThemeMode) || 'light'
  const theme = ref<ThemeMode>(savedTheme)
  const isDark = ref(false)

  // Apply theme to document
  function applyTheme() {
    let shouldBeDark = false

    if (theme.value === 'dark') {
      shouldBeDark = true
    } else if (theme.value === 'auto') {
      shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    }

    isDark.value = shouldBeDark

    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.setAttribute('data-theme', 'light')
    }
  }

  function setTheme(newTheme: ThemeMode) {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
    applyTheme()
  }

  function toggleTheme() {
    if (theme.value === 'light') {
      setTheme('dark')
    } else if (theme.value === 'dark') {
      setTheme('light')
    } else {
      setTheme('light')
    }
  }

  // Listen for system theme changes
  if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (theme.value === 'auto') {
        applyTheme()
      }
    })
  }

  // Initialize
  applyTheme()

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme,
    applyTheme
  }
}, {
  /** Pinia 持久化配置：刷新页面后保留主题选择 */
  persist: {
    key: 'enterprise_admin_theme',
    pick: ['theme']
  }
})
