import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

export interface TabItem {
  path: string
  title: string
  name: string
  closable: boolean
  icon?: string
}

export const useTabsStore = defineStore('tabs', () => {
  const tabs = ref<TabItem[]>([])
  const activeTab = ref('')

  const tabCount = computed(() => tabs.value.length)

  function addTab(route: RouteLocationNormalized) {
    const { path, name, meta } = route
    const title = (meta?.title as string) || name as string || path
    const icon = meta?.icon as string

    if (tabs.value.some(t => t.path === path)) {
      activeTab.value = path
      return
    }

    tabs.value.push({
      path,
      title,
      name: name as string,
      closable: path !== '/dashboard',
      icon
    })
    activeTab.value = path
  }

  function removeTab(path: string) {
    const index = tabs.value.findIndex(t => t.path === path)
    if (index === -1) return

    const isActive = tabs.value[index].path === activeTab.value
    tabs.value.splice(index, 1)

    if (isActive && tabs.value.length > 0) {
      const newIndex = Math.min(index, tabs.value.length - 1)
      activeTab.value = tabs.value[newIndex].path
    }

    return activeTab.value
  }

  function removeOtherTabs(path: string) {
    tabs.value = tabs.value.filter(t => t.path === path || t.path === '/dashboard')
    activeTab.value = path
  }

  function removeRightTabs(path: string) {
    const index = tabs.value.findIndex(t => t.path === path)
    if (index !== -1) {
      tabs.value = tabs.value.filter((_, i) => i <= index || tabs.value[i].path === '/dashboard')
    }
  }

  function removeAllTabs() {
    tabs.value = tabs.value.filter(t => t.path === '/dashboard')
    activeTab.value = '/dashboard'
  }

  function updateTabTitle(path: string, title: string) {
    const tab = tabs.value.find(t => t.path === path)
    if (tab) tab.title = title
  }

  return {
    tabs,
    activeTab,
    tabCount,
    addTab,
    removeTab,
    removeOtherTabs,
    removeRightTabs,
    removeAllTabs,
    updateTabTitle
  }
}, {
  persist: {
    key: 'admin-tabs',
    pick: ['tabs', 'activeTab']
  }
})
