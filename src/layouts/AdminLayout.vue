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
import { computed, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useAuthStore } from '@/store/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

function groupLabel(text, classes) {
  return h('span', { class: classes }, text)
}

function itemLabel(text, dotClass) {
  return h('span', { class: 'flex items-center gap-3' }, [
    h('span', { class: `h-2.5 w-2.5 rounded-full ${dotClass}` }),
    h('span', null, text),
  ])
}

function menuItem(key, text, dotClass) {
  return {
    key,
    label: itemLabel(text, dotClass),
    title: text,
  }
}

const allMenuItems = [
  {
    type: 'group',
    label: groupLabel('Overview', 'text-[11px] font-semibold uppercase tracking-[0.32em] text-sky-300'),
    children: [menuItem('dashboard', 'Dashboard', 'bg-sky-400')],
  },
  {
    type: 'group',
    label: groupLabel('System', 'text-[11px] font-semibold uppercase tracking-[0.32em] text-amber-300'),
    children: [
      menuItem('roles', 'Roles', 'bg-amber-400'),
      menuItem('users', 'Users', 'bg-amber-500'),
    ],
  },
  {
    type: 'group',
    label: groupLabel('Workspace', 'text-[11px] font-semibold uppercase tracking-[0.32em] text-emerald-300'),
    children: [
      menuItem('restaurants', 'Restaurants', 'bg-emerald-400'),
      menuItem('branches', 'Branches', 'bg-green-400'),
    ],
  },
  {
    type: 'group',
    label: groupLabel('Catalog', 'text-[11px] font-semibold uppercase tracking-[0.32em] text-fuchsia-300'),
    children: [
      menuItem('categories', 'Categories', 'bg-fuchsia-400'),
      menuItem('menu-items', 'Menu Items', 'bg-pink-400'),
    ],
  },
  {
    type: 'group',
    label: groupLabel('Operations', 'text-[11px] font-semibold uppercase tracking-[0.32em] text-cyan-300'),
    children: [menuItem('qr-codes', 'QR Codes', 'bg-cyan-400')],
  },
]

const menuItems = computed(() =>
  allMenuItems.filter((group) => {
    return group.children?.some((item) => {
      if (item.key === 'roles') return authStore.isSuperAdmin
      if (item.key === 'users') return authStore.isSuperAdmin || authStore.isRestaurantOwner
      return true
    })
  })
)

const selectedKey = computed(() => route.name)
const pageTitle = computed(() => {
  for (const group of allMenuItems) {
    const match = group.children?.find((item) => item.key === route.name)
    if (match) return match.title
  }

  return 'Admin'
})

function handleMenuClick({ key }) {
  router.push({ name: key })
}

function handleLogout() {
  authStore.logout()
  router.push({ name: 'login' })
}
</script>
