<template>
  <div class="settings-page">
    <el-row :gutter="20">
      <el-col :xs="24" :lg="12">
        <el-card :header="$t('settings.profile')">
          <el-form :model="profile" label-width="80px">
            <el-form-item :label="$t('settings.username')">
              <el-input v-model="profile.username" disabled />
            </el-form-item>
            <el-form-item :label="$t('user.name')">
              <el-input v-model="profile.name" />
            </el-form-item>
            <el-form-item :label="$t('settings.email')">
              <el-input v-model="profile.email" />
            </el-form-item>
            <el-form-item :label="$t('settings.phone')">
              <el-input v-model="profile.phone" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary">{{ $t('common.save') }}</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="12">
        <el-card :header="$t('settings.changePassword')" style="margin-top: 20px">
          <el-form :model="passwordForm" label-width="100px">
            <el-form-item :label="$t('settings.currentPassword')">
              <el-input v-model="passwordForm.current" type="password" show-password />
            </el-form-item>
            <el-form-item :label="$t('settings.newPassword')">
              <el-input v-model="passwordForm.new" type="password" show-password />
            </el-form-item>
            <el-form-item :label="$t('settings.confirmPassword')">
              <el-input v-model="passwordForm.confirm" type="password" show-password />
            </el-form-item>
            <el-form-item>
              <el-button type="primary">{{ $t('settings.changePassword') }}</el-button>
            </el-form-item>
          </el-form>
        </el-card>

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
              <el-switch v-model="notifications" />
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useThemeStore, type ThemeMode } from '@/stores/theme'
import { setLocale, type Locale } from '@/i18n'
import { ElMessage } from 'element-plus'

const { locale, t } = useI18n()
const themeStore = useThemeStore()

const profile = reactive({
  username: 'admin',
  name: '系统管理员',
  email: 'admin@enterprise.com',
  phone: '13800138000'
})

const passwordForm = reactive({
  current: '',
  new: '',
  confirm: ''
})

const currentTheme = ref<ThemeMode>(themeStore.theme)
const currentLocale = ref<Locale>(locale.value as Locale)
const notifications = ref(true)

function handleThemeChange(val: string | number | boolean | undefined) {
  themeStore.setTheme(val as ThemeMode)
}

function handleLocaleChange(lang: Locale) {
  setLocale(lang)
  ElMessage.success(t('common.success'))
}
</script>

<style scoped lang="scss">
.settings-page {
  padding: 4px;
}
</style>
