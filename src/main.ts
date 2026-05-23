import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import { i18n } from './i18n'
import { setupPermissionDirectives } from './directives/permission'
import '@/styles/index.scss'

const app = createApp(App)

// Register Element Plus icons globally
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// Setup Pinia
app.use(createPinia())

// Setup Router
app.use(router)

// Setup i18n
app.use(i18n)

// Setup Element Plus
app.use(ElementPlus)

// Setup permission directives
setupPermissionDirectives(app)

app.mount('#app')
