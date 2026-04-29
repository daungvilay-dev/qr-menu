<template>
  <a-config-provider :locale="loLocale" :theme="themeConfig">
    <router-view />
  </a-config-provider>
</template>

<script setup>
import loLocale from '@/locales/antd-lo_LA'

const themeConfig = {
  token: {
    colorPrimary: '#dc2626',
    colorInfo: '#dc2626',
    colorSuccess: '#16a34a',
    colorWarning: '#ea580c',
    colorError: '#dc2626',
    borderRadius: 16,
    fontFamily: '"Noto Sans Lao","Phetsarath OT","Lao UI",ui-sans-serif,system-ui,sans-serif',
  },
}
</script>
