<template>
  <div>
    <AppPageHeader
      eyebrow="Overview"
      title="Restaurant dashboard"
      description="Quick access to the three admin surfaces shipped in the first version of the QR menu frontend."
    />

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div v-for="card in cards" :key="card.title" class="rounded-[28px] border border-navy-500/50 bg-navy-700/50 p-6 shadow-card backdrop-blur">
        <p class="text-xs font-semibold uppercase tracking-[0.35em] text-brand-400">{{ card.eyebrow }}</p>
        <h2 class="mt-3 text-xl font-semibold text-slate-100">{{ card.title }}</h2>
        <p class="mt-2 text-sm text-slate-400">{{ card.description }}</p>
        <router-link :to="card.to" class="mt-5 inline-flex font-semibold text-brand-400 hover:text-brand-300">
          Open
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

import AppPageHeader from '@/components/common/AppPageHeader.vue'
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()

const allCards = [
  {
    eyebrow: 'System',
    title: 'Roles',
    description: 'Create and maintain system roles used by staff and restaurant accounts.',
    to: { name: 'roles' },
  },
  {
    eyebrow: 'System',
    title: 'Users',
    description: 'Manage users, assign roles, and prepare accounts for restaurant ownership.',
    to: { name: 'users' },
  },
  {
    eyebrow: 'Workspace',
    title: 'Restaurants',
    description: 'Manage restaurant records, owner assignments, contact details, and active status.',
    to: { name: 'restaurants' },
  },
  {
    eyebrow: 'Workspace',
    title: 'Branches',
    description: 'Manage branch records used by QR codes and branch-specific menu targeting.',
    to: { name: 'branches' },
  },
  {
    eyebrow: 'Catalog',
    title: 'Categories',
    description: 'Organize the menu into sections and control ordering for the customer view.',
    to: { name: 'categories' },
  },
  {
    eyebrow: 'Catalog',
    title: 'Menu Items',
    description: 'Manage dishes, prices, variants, addons, and item-addon relationships.',
    to: { name: 'menu-items' },
  },
  {
    eyebrow: 'Operations',
    title: 'QR Codes',
    description: 'Create QR codes tied to branch and table context for scan-to-menu access.',
    to: { name: 'qr-codes' },
  },
]

const cards = computed(() =>
  allCards.filter((card) => {
    if (card.to.name === 'roles') return authStore.isSuperAdmin
    if (card.to.name === 'users') return authStore.isSuperAdmin || authStore.isRestaurantOwner
    return true
  })
)
</script>
