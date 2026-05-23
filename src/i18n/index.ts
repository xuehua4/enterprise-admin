import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN'
import enUS from './locales/en-US'

export type Locale = 'zh-CN' | 'en-US'

const messages = {
  'zh-CN': zhCN,
  'en-US': enUS
}

// Get saved locale from localStorage or default to zh-CN
const savedLocale = (localStorage.getItem('locale') as Locale) || 'zh-CN'

export const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: savedLocale,
  fallbackLocale: 'zh-CN',
  messages
})

export function setLocale(locale: Locale) {
  i18n.global.locale.value = locale
  localStorage.setItem('locale', locale)
  document.documentElement.setAttribute('lang', locale)
}

export function getLocale(): Locale {
  return i18n.global.locale.value as Locale
}

export default i18n
