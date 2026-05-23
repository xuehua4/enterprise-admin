import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGuideStore = defineStore('guide', () => {
  const hasGuided = ref(false)
  const isGuideActive = ref(false)

  function startGuide() {
    isGuideActive.value = true
  }

  function finishGuide() {
    hasGuided.value = true
    isGuideActive.value = false
  }

  function resetGuide() {
    hasGuided.value = false
  }

  return { hasGuided, isGuideActive, startGuide, finishGuide, resetGuide }
}, {
  persist: {
    key: 'admin-guide',
    pick: ['hasGuided']
  }
})
