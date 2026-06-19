<template>
  <div class="settings-page">
    <el-row :gutter="20">
      <!-- 左侧：个人信息 -->
      <el-col :xs="24" :lg="12">
        <el-card :header="$t('settings.profile')">
          <el-form ref="profileFormRef" :model="profile" :rules="profileRules" label-width="80px">
            <el-form-item :label="$t('settings.username')">
              <el-input v-model="profile.username" disabled />
            </el-form-item>
            <el-form-item :label="$t('user.name')" prop="name">
              <el-input v-model="profile.name" :placeholder="$t('user.name')" />
            </el-form-item>
            <el-form-item :label="$t('settings.email')" prop="email">
              <el-input v-model="profile.email" placeholder="example@enterprise.com" />
            </el-form-item>
            <el-form-item :label="$t('settings.phone')" prop="phone">
              <el-input v-model="profile.phone" placeholder="13800138000" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="profileSaving" @click="handleSaveProfile">
                {{ $t('common.save') }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <!-- 右侧：修改密码 + 系统偏好 -->
      <el-col :xs="24" :lg="12">
        <!-- 修改密码卡片 -->
        <el-card :header="$t('settings.changePassword')">
          <el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" label-width="100px">
            <el-form-item :label="$t('settings.currentPassword')" prop="current">
              <el-input v-model="passwordForm.current" type="password" show-password
                :placeholder="$t('settings.currentPassword')" />
            </el-form-item>
            <el-form-item :label="$t('settings.newPassword')" prop="new">
              <el-input v-model="passwordForm.new" type="password" show-password
                :placeholder="$t('settings.newPassword')" />
            </el-form-item>
            <el-form-item :label="$t('settings.confirmPassword')" prop="confirm">
              <el-input v-model="passwordForm.confirm" type="password" show-password
                :placeholder="$t('settings.confirmPassword')" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="passwordChanging" @click="handleChangePassword">
                {{ $t('settings.changePassword') }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 系统偏好卡片 -->
        <el-card :header="$t('settings.preferences')" style="margin-top: 20px">
          <el-form :label-width="100">
            <el-form-item :label="$t('settings.theme')">
              <el-radio-group v-model="currentTheme" @change="handleThemeChange">
                <el-radio value="light">{{ $t('settings.lightTheme') }}</el-radio>
                <el-radio value="dark">{{ $t('settings.darkTheme') }}</el-radio>
                <el-radio value="auto">{{ $t('settings.autoTheme') }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('settings.language')">
              <el-select v-model="currentLocale" @change="handleLocaleChange" style="width: 200px">
                <el-option label="简体中文" value="zh-CN" />
                <el-option label="English" value="en-US" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('settings.notifications')">
              <el-switch v-model="notifications" active-text="开" inactive-text="关" @change="handleNotificationChange" />
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
/**
 * 系统设置页面
 * 功能：个人信息编辑（含表单验证）、修改密码（含校验）、主题切换、语言切换、通知开关
 */
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useThemeStore, type ThemeMode } from '@/stores/theme'
import { setLocale, type Locale } from '@/i18n'

const { locale, t } = useI18n()
const themeStore = useThemeStore()

// ==================== 个人信息相关 ====================
const profileFormRef = ref<FormInstance>()
const profileSaving = ref(false)

/** 个人信息表单数据 */
const profile = reactive({
  username: 'admin',
  name: '系统管理员',
  email: 'admin@enterprise.com',
  phone: '13800138000'
})

/** 个人信息表单校验规则 */
const profileRules = reactive<FormRules>({
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ]
})

/** 保存个人信息 */
async function handleSaveProfile() {
  if (!profileFormRef.value) return
  await profileFormRef.value.validate()

  profileSaving.value = true
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success(t('common.success'))
  } finally {
    profileSaving.value = false
  }
}

// ==================== 修改密码相关 ====================
const passwordFormRef = ref<FormInstance>()
const passwordChanging = ref(false)

/** 修改密码表单数据 */
const passwordForm = reactive({
  current: '',
  new: '',
  confirm: ''
})

/** 自定义确认密码校验器：两次密码必须一致 */
const confirmValidator = (_rule: any, value: string, callback: Function) => {
  if (value !== passwordForm.new) {
    callback(new Error(t('settings.passwordMismatch')))
  } else {
    callback()
  }
}

/** 修改密码表单校验规则 */
const passwordRules = reactive<FormRules>({
  current: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  new: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20个字符', trigger: 'blur' }
  ],
  confirm: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: confirmValidator, trigger: 'blur' }
  ]
})

/** 提交修改密码 */
async function handleChangePassword() {
  if (!passwordFormRef.value) return
  await passwordFormRef.value.validate()

  // 校验当前密码是否正确（Mock：当前密码为 admin123）
  if (passwordForm.current !== 'admin123') {
    ElMessage.error('当前密码错误')
    return
  }

  passwordChanging.value = true
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 600))
    ElMessage.success(t('settings.passwordChanged'))
    // 清空表单
    passwordForm.current = ''
    passwordForm.new = ''
    passwordForm.confirm = ''
    passwordFormRef.value?.resetFields()
  } finally {
    passwordChanging.value = false
  }
}

// ==================== 系统偏好相关 ====================
const currentTheme = ref<ThemeMode>(themeStore.theme)
const currentLocale = ref<Locale>(locale.value as Locale)
const notifications = ref(true)

/** 切换主题 */
function handleThemeChange(val: string | number | boolean | undefined) {
  themeStore.setTheme(val as ThemeMode)
}

/** 切换语言 */
function handleLocaleChange(lang: Locale) {
  setLocale(lang)
  ElMessage.success(t('common.success'))
}

/** 切换通知开关 */
function handleNotificationChange(val: string | number | boolean) {
  ElMessage.success(val ? '已开启通知' : '已关闭通知')
}
</script>

<style scoped lang="scss">
.settings-page {
  padding: 4px;
}
</style>
