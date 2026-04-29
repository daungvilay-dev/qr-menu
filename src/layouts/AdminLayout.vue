<template>
  <a-layout class="min-h-screen bg-transparent">
    <a-layout-sider
      breakpoint="lg"
      collapsed-width="0"
      class="!bg-navy-950"
      width="250"
    >
      <div class="px-6 py-8 text-white">
        <p class="text-xs uppercase tracking-[0.35em] text-brand-300">QR Menu</p>
        <h2 class="mt-2 font-display text-3xl">Admin</h2>
      </div>
      <a-menu
        theme="dark"
        mode="inline"
        :selected-keys="[selectedKey]"
        :items="menuItems"
        @click="handleMenuClick"
      />
    </a-layout-sider>

    <a-layout class="bg-transparent">
      <a-layout-header class="flex items-center justify-between border-b border-navy-500 bg-navy-800/70 px-4 backdrop-blur md:px-8">
        <div>
          <p class="text-xs uppercase tracking-[0.35em] text-brand-400">Restaurant Workspace</p>
          <h1 class="text-xl font-semibold text-slate-100">{{ pageTitle }}</h1>
        </div>
        <div class="flex items-center gap-3">
          <span class="hidden text-sm text-slate-400 md:inline">{{ authStore.user?.username }}</span>
          <a-button @click="handleLogout">Logout</a-button>
        </div>
      </a-layout-header>

      <a-layout-content class="p-4 md:p-8">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useAuthStore } from '@/store/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const menuItems = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'restaurants', label: 'Restaurants' },
  { key: 'branches', label: 'Branches' },
  { key: 'categories', label: 'Categories' },
  { key: 'menu-items', label: 'Menu Items' },
  { key: 'qr-codes', label: 'QR Codes' },
]

const selectedKey = computed(() => route.name)
const pageTitle = computed(() => menuItems.find((item) => item.key === route.name)?.label || 'Admin')

function handleMenuClick({ key }) {
  router.push({ name: key })
}

function handleLogout() {
  authStore.logout()
  router.push({ name: 'login' })
}
</script>
