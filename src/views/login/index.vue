<template>
  <div class="login-page">
    <!-- Animated background -->
    <div class="login-bg">
      <div class="bg-shape shape-1"></div>
      <div class="bg-shape shape-2"></div>
      <div class="bg-shape shape-3"></div>
    </div>

    <!-- Language switcher -->
    <div class="lang-switcher">
      <el-dropdown @command="handleLangChange">
        <el-button circle size="small" class="lang-btn">
          {{ locale === 'zh-CN' ? '中' : 'EN' }}
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="zh-CN">🇨🇳 简体中文</el-dropdown-item>
            <el-dropdown-item command="en-US">🇺🇸 English</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- Login card -->
    <div class="login-card">
      <div class="login-card-inner">
        <!-- Header -->
        <div class="login-header">
          <div class="logo">
            <div class="logo-icon">
              <el-icon :size="36"><Monitor /></el-icon>
            </div>
          </div>
          <h1 class="title">{{ $t('login.title') }}</h1>
          <p class="subtitle">{{ $t('login.subtitle') }}</p>
        </div>

        <!-- Form -->
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          class="login-form"
          size="large"
          @keyup.enter="handleLogin"
        >
          <el-form-item prop="username">
            <el-input
              v-model="form.username"
              :placeholder="$t('login.username')"
              :prefix-icon="User"
              class="custom-input"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              :placeholder="$t('login.password')"
              show-password
              :prefix-icon="Lock"
              class="custom-input"
            />
          </el-form-item>
          <el-form-item>
            <div class="form-options">
              <el-checkbox v-model="rememberMe">{{ $t('login.rememberMe') }}</el-checkbox>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              class="login-btn"
              :loading="loading"
              @click="handleLogin"
            >
              {{ $t('login.loginBtn') }}
            </el-button>
          </el-form-item>
        </el-form>

        <!-- Footer -->
        <div class="login-footer">
          <p>{{ $t('login.tip') }}</p>
        </div>
      </div>
    </div>

    <!-- Version info -->
    <div class="version-info">
      Enterprise Admin System v1.0.0
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, type FormInstance } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { User, Lock, Monitor } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { t, locale } = useI18n()

const formRef = ref<FormInstance>()
const loading = ref(false)
const rememberMe = ref(false)

const form = reactive({
  username: 'admin',
  password: 'admin123'
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

function handleLangChange(lang: string) {
  locale.value = lang
  localStorage.setItem('lang', lang)
}

async function handleLogin() {
  if (!formRef.value) return
  await formRef.value.validate()
  
  loading.value = true
  try {
    await userStore.login(form.username, form.password)
    ElMessage.success(t('login.loginSuccess'))
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  } catch (err: any) {
    ElMessage.error(err.message || t('login.loginFailed'))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login-page {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  overflow: hidden;
}

/* Animated background shapes */
.login-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.bg-shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.08;
  animation: float 20s infinite ease-in-out;
}

.shape-1 {
  width: 600px;
  height: 600px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  top: -200px;
  right: -100px;
  animation-delay: 0s;
}

.shape-2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #f093fb, #f5576c);
  bottom: -100px;
  left: -100px;
  animation-delay: -7s;
}

.shape-3 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -14s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(30px, -30px) scale(1.05);
  }
  50% {
    transform: translate(-20px, 20px) scale(0.95);
  }
  75% {
    transform: translate(15px, 15px) scale(1.02);
  }
}

/* Language switcher */
.lang-switcher {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100;
}

.lang-btn {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
  color: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(10px);
  font-weight: 600;
  font-size: 13px;

  &:hover {
    background: rgba(255, 255, 255, 0.2) !important;
    border-color: rgba(255, 255, 255, 0.3) !important;
    color: #fff !important;
  }
}

/* Login card */
.login-card {
  position: relative;
  z-index: 10;
  width: 440px;
  max-width: 90vw;
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-card-inner {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 48px 40px;
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* Header */
.login-header {
  text-align: center;
  margin-bottom: 36px;
}

.logo {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.logo-icon {
  width: 72px;
  height: 72px;
  border-radius: 18px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
  animation: pulse 3s infinite ease-in-out;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
  }
  50% {
    box-shadow: 0 10px 40px rgba(102, 126, 234, 0.6);
  }
}

.title {
  font-size: 26px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

/* Form */
.login-form {
  :deep(.el-form-item) {
    margin-bottom: 20px;
  }

  :deep(.el-input__wrapper) {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    box-shadow: none;
    transition: all 0.3s ease;
    padding: 0 16px;

    &:hover {
      border-color: rgba(255, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.08);
    }

    &.is-focus {
      border-color: #667eea;
      background: rgba(102, 126, 234, 0.08);
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
    }
  }

  :deep(.el-input__inner) {
    color: #fff;
    caret-color: #667eea;

    &::placeholder {
      color: rgba(255, 255, 255, 0.35);
    }
  }

  :deep(.el-input__prefix-inner) {
    color: rgba(255, 255, 255, 0.4);
  }
}

.form-options {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  :deep(.el-checkbox) {
    .el-checkbox__label {
      color: rgba(255, 255, 255, 0.5);
      font-size: 13px;
    }

    .el-checkbox__inner {
      background: rgba(255, 255, 255, 0.06);
      border-color: rgba(255, 255, 255, 0.2);
    }

    &.is-checked .el-checkbox__inner {
      background: #667eea;
      border-color: #667eea;
    }
  }
}

.login-btn {
  width: 100%;
  height: 48px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &::after {
    display: none;
  }
}

/* Footer */
.login-footer {
  text-align: center;
  margin-top: 24px;

  p {
    color: rgba(255, 255, 255, 0.3);
    font-size: 13px;
    margin: 0;
  }
}

/* Version info */
.version-info {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.2);
  font-size: 12px;
  z-index: 10;
}

/* Responsive */
@media (max-width: 480px) {
  .login-card-inner {
    padding: 36px 24px;
    border-radius: 16px;
  }

  .title {
    font-size: 22px;
  }

  .logo-icon {
    width: 60px;
    height: 60px;
    border-radius: 14px;

    .el-icon {
      font-size: 28px;
    }
  }
}
</style>
