<template>
  <div>
    <AppPageHeader
      eyebrow="Overview"
      title="Restaurant dashboard"
      description="Quick access to the three admin surfaces shipped in the first version of the QR menu frontend."
    />

    <div class="grid gap-4 md:grid-cols-3">
      <div v-for="card in cards" :key="card.title" class="rounded-[28px] border border-stone-200 bg-white/80 p-6 shadow-card">
        <p class="text-xs font-semibold uppercase tracking-[0.35em] text-brand-700">{{ card.eyebrow }}</p>
        <h2 class="mt-3 text-xl font-semibold text-stone-900">{{ card.title }}</h2>
        <p class="mt-2 text-sm text-stone-600">{{ card.description }}</p>
        <router-link :to="card.to" class="mt-5 inline-flex font-semibold text-brand-700">
          Open
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import AppPageHeader from '@/components/common/AppPageHeader.vue'

const cards = [
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
</script>
