<template>
  <a-config-provider :locale="loLocale" :theme="themeConfig">
    <router-view />
  </a-config-provider>
</template>

<script setup>
import { theme } from 'ant-design-vue'
import loLocale from '@/locales/antd-lo_LA'

const themeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#f59e0b',
    colorInfo: '#8b5cf6',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    borderRadius: 16,
    colorBgContainer: '#111827',
    colorBgElevated: '#1a2234',
    colorBgLayout: '#0a0f1e',
    colorBorder: '#1e293b',
    colorText: '#f1f5f9',
    colorTextSecondary: '#94a3b8',
    fontFamily: '"Noto Sans Lao","Phetsarath OT","Lao UI",ui-sans-serif,system-ui,sans-serif',
  },
}
</script>
