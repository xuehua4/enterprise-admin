import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import ElementPlus from 'element-plus'
import {
  ArrowDown, ArrowLeft, ArrowRight, ChatDotRound, Check, CloseBold,
  Connection, DArrowRight, Delete, Document, Download, Expand, Files, Fold,
  FullScreen, Grid, Guide, InfoFilled, Lock, Menu, Monitor, Moon, Odometer,
  Plus, Postcard, QuestionFilled, Refresh, Search, Setting, Sunny, Tickets,
  TrendCharts, User, UserFilled
} from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import type { Component } from 'vue'

import App from './App.vue'
import router from './router'
import { i18n } from './i18n'
import { setupPermissionDirectives } from './directives/permission'
import '@/styles/index.scss'

/** 项目实际使用的 Element Plus 图标列表（按需注册，减少包体积） */
const usedIcons: Record<string, Component> = {
  ArrowDown, ArrowLeft, ArrowRight, ChatDotRound, Check, CloseBold,
  Connection, DArrowRight, Delete, Document, Download, Expand, Files, Fold,
  FullScreen, Grid, Guide, InfoFilled, Lock, Menu, Monitor, Moon, Odometer,
  Plus, Postcard, QuestionFilled, Refresh, Search, Setting, Sunny, Tickets,
  TrendCharts, User, UserFilled
}

const app = createApp(App)

// Register used Element Plus icons globally
for (const [key, component] of Object.entries(usedIcons)) {
  app.component(key, component)
}

// Setup Pinia with persistence
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

// Setup Router
app.use(router)

// Setup i18n
app.use(i18n)

// Setup Element Plus
app.use(ElementPlus)

// Setup permission directives
setupPermissionDirectives(app)

app.mount('#app')
