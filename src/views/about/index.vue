<template>
  <div class="about-page">
    <el-row :gutter="20">
      <el-col :xs="24" :lg="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <el-icon size="24" color="#409EFF">
                <InfoFilled />
              </el-icon>
              <span style="margin-left: 8px;">{{ $t('about.title') }}</span>
            </div>
          </template>

          <div class="about-content">
            <div class="logo-section">
              <div class="logo-icon">
                <el-icon size="64" color="#409EFF">
                  <Monitor />
                </el-icon>
              </div>
              <h1 class="app-name">Enterprise Admin</h1>
              <p class="version">{{ $t('about.version') }}: v1.0.0</p>
              <p class="description">{{ $t('about.description') }}</p>
            </div>

            <el-divider />

            <h3>{{ $t('about.techStack') }}</h3>
            <el-descriptions :column="1" border size="small" style="margin-top: 16px;">
              <el-descriptions-item label="Vue">3.5.x - Progressive JavaScript Framework</el-descriptions-item>
              <el-descriptions-item label="TypeScript">~6.0 - Type Safety</el-descriptions-item>
              <el-descriptions-item label="Element Plus">2.14.x - UI Component Library</el-descriptions-item>
              <el-descriptions-item label="Pinia">3.0.x - State Management</el-descriptions-item>
              <el-descriptions-item label="Vue Router">5.0.x - Official Router</el-descriptions-item>
              <el-descriptions-item label="ECharts">6.1.x - Data Visualization</el-descriptions-item>
              <el-descriptions-item label="Vite">8.0.x - Next Generation Build Tool</el-descriptions-item>
              <el-descriptions-item label="Vue I18n">12.0.x - Internationalization</el-descriptions-item>
            </el-descriptions>

            <el-divider />

            <h3>{{ $t('about.features') }}</h3>
            <el-row :gutter="16" style="margin-top: 16px;">
              <el-col :xs="24" :sm="12">
                <el-card shadow="hover" class="feature-card">
                  <el-icon size="24" color="#409EFF">
                    <Monitor />
                  </el-icon>
                  <p>{{ $t('about.feature1') }}</p>
                </el-card>
              </el-col>
              <el-col :xs="24" :sm="12">
                <el-card shadow="hover" class="feature-card">
                  <el-icon size="24" color="#67C23A">
                    <Document />
                  </el-icon>
                  <p>{{ $t('about.feature2') }}</p>
                </el-card>
              </el-col>
              <el-col :xs="24" :sm="12">
                <el-card shadow="hover" class="feature-card">
                  <el-icon size="24" color="#E6A23C">
                    <Grid />
                  </el-icon>
                  <p>{{ $t('about.feature3') }}</p>
                </el-card>
              </el-col>
              <el-col :xs="24" :sm="12">
                <el-card shadow="hover" class="feature-card">
                  <el-icon size="24" color="#F56C6C">
                    <Files />
                  </el-icon>
                  <p>{{ $t('about.feature4') }}</p>
                </el-card>
              </el-col>
              <el-col :xs="24" :sm="12">
                <el-card shadow="hover" class="feature-card">
                  <el-icon size="24" color="#909399">
                    <Connection />
                  </el-icon>
                  <p>{{ $t('about.feature5') }}</p>
                </el-card>
              </el-col>
              <el-col :xs="24" :sm="12">
                <el-card shadow="hover" class="feature-card">
                  <el-icon size="24" color="#409EFF">
                    <TrendCharts />
                  </el-icon>
                  <p>{{ $t('about.feature6') }}</p>
                </el-card>
              </el-col>
              <el-col :xs="24" :sm="12">
                <el-card shadow="hover" class="feature-card">
                  <el-icon size="24" color="#67C23A">
                    <Guide />
                  </el-icon>
                  <p>{{ $t('about.feature7') }}</p>
                </el-card>
              </el-col>
              <el-col :xs="24" :sm="12">
                <el-card shadow="hover" class="feature-card">
                  <el-icon size="24" color="#303133">
                    <Moon />
                  </el-icon>
                  <p>{{ $t('about.feature8') }}</p>
                </el-card>
              </el-col>
              <el-col :xs="24" :sm="12">
                <el-card shadow="hover" class="feature-card">
                  <el-icon size="24" color="#E6A23C">
                    <Lock />
                  </el-icon>
                  <p>{{ $t('about.feature9') }}</p>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="8">
        <el-card header="System Status">
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item label="Environment">Development</el-descriptions-item>
            <el-descriptions-item label="Node Version">v24.x</el-descriptions-item>
            <el-descriptions-item label="Build Time">{{ buildTime }}</el-descriptions-item>
            <el-descriptions-item label="Status">
              <el-tag type="success" size="small">Running</el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card header="Quick Links" style="margin-top: 20px;">
          <div class="quick-links">
            <el-button type="primary" :icon="Document" @click="openLink('https://vuejs.org')" block>
              Vue.js Docs
            </el-button>
            <el-button type="success" :icon="Document" @click="openLink('https://element-plus.org')" block>
              Element Plus Docs
            </el-button>
            <el-button type="warning" :icon="Document" @click="openLink('https://pinia.vuejs.org')" block>
              Pinia Docs
            </el-button>
            <el-button type="info" :icon="Document" @click="openLink('https://echarts.apache.org')" block>
              ECharts Docs
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  InfoFilled, Monitor, Document, Grid, Files,
  Connection, TrendCharts, Moon, Lock, Guide
} from '@element-plus/icons-vue'

const buildTime = computed(() => {
  return new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
})

function openLink(url: string) {
  window.open(url, '_blank')
}
</script>

<style scoped lang="scss">
.about-page {
  .card-header {
    display: flex;
    align-items: center;
  }

  .about-content {
    .logo-section {
      text-align: center;
      padding: 24px 0;
    }

    .logo-icon {
      width: 100px;
      height: 100px;
      margin: 0 auto 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 20px;
    }

    .app-name {
      font-size: 28px;
      color: #303133;
      margin: 0 0 8px;
    }

    .version {
      color: #909399;
      margin: 0 0 16px;
    }

    .description {
      color: #606266;
      line-height: 1.6;
      max-width: 500px;
      margin: 0 auto;
    }

    h3 {
      color: #303133;
      margin-bottom: 0;
    }
  }

  .feature-card {
    text-align: center;
    padding: 16px;
    margin-bottom: 16px;

    p {
      margin: 12px 0 0;
      color: #606266;
      font-size: 14px;
    }
  }

  .quick-links {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}
</style>
