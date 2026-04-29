<template>
  <div class="space-y-6">
    <section class="overflow-hidden rounded-[32px] border border-white/10 bg-navy-700/80 shadow-card">
      <div class="bg-navy-950 px-6 py-8 text-white">
        <p class="text-xs uppercase tracking-[0.35em] text-brand-300">QR Menu</p>
        <div class="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 class="font-display text-4xl">{{ restaurantName }}</h1>
            <p class="mt-2 text-sm text-slate-400">
              {{ branchMeta }}
            </p>
          </div>
          <div class="rounded-2xl bg-white/10 px-4 py-3 text-sm text-slate-300 font-mono">
            <p>Table: {{ menuStore.publicMenu?.qrcode?.tableNumber || 'Walk-in' }}</p>
            <p>Scan count: {{ menuStore.publicMenu?.qrcode?.scanCount || 0 }}</p>
          </div>
        </div>
      </div>
    </section>

    <AppLoading v-if="menuStore.publicLoading" />

    <a-alert
      v-else-if="menuStore.publicError"
      type="error"
      show-icon
      :message="menuStore.publicError"
      description="The QR code could not be loaded. Check the UUID or try again later."
    />

    <AppEmptyState
      v-else-if="!menuStore.publicCategories.length"
      title="No menu available"
      description="This QR code does not currently expose any active categories or menu items."
    />

    <template v-else>
      <section class="sticky top-4 z-10 overflow-x-auto rounded-[24px] border border-navy-500/50 bg-navy-800/85 p-3 shadow-card backdrop-blur">
        <div class="flex gap-2">
          <button
            v-for="category in menuStore.publicCategories"
            :key="category.id"
            type="button"
            class="whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition"
            :class="activeCategoryId === category.id ? 'bg-brand-500 text-white' : 'bg-navy-600 text-slate-300 hover:bg-navy-500'"
            @click="scrollToCategory(category.id)"
          >
            {{ category.name }}
          </button>
        </div>
      </section>

      <section class="space-y-8">
        <article
          v-for="category in menuStore.publicCategories"
          :id="sectionId(category.id)"
          :key="category.id"
          class="space-y-4"
        >
          <div class="flex items-end justify-between gap-4">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.35em] text-brand-400">Category</p>
              <h2 class="section-title">{{ category.name }}</h2>
            </div>
            <p class="text-sm text-slate-500">{{ category.menus?.length || 0 }} items</p>
          </div>

          <p v-if="category.description" class="max-w-3xl text-sm text-slate-400">
            {{ category.description }}
          </p>

          <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <MenuCard
              v-for="item in category.menus"
              :key="item.id"
              :item="item"
              @select="menuStore.openItem"
            />
          </div>
        </article>
      </section>
    </template>

    <ItemDetail
      :open="Boolean(menuStore.selectedItem)"
      :item="menuStore.selectedItem"
      :selected-variant-id="menuStore.selectedVariantId"
      :selected-addon-ids="menuStore.selectedAddonIds"
      :total="menuStore.currentTotal"
      @close="menuStore.closeItem"
      @select-variant="menuStore.selectVariant"
      @toggle-addon="menuStore.toggleAddon"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import MenuCard from '@/components/menu/MenuCard.vue'
import AppEmptyState from '@/components/ui/AppEmptyState.vue'
import AppLoading from '@/components/ui/AppLoading.vue'
import ItemDetail from './ItemDetail.vue'
import { useMenuStore } from '@/store/menu'

const route = useRoute()
const menuStore = useMenuStore()
const activeCategoryId = ref(null)

const restaurantName = computed(() => menuStore.publicMenu?.restaurant?.name || 'Restaurant menu')
const branchMeta = computed(() => {
  const branch = menuStore.publicMenu?.branch
  if (!branch) return 'Browse the current menu available for this QR code.'

  return [branch.name, branch.address].filter(Boolean).join(' • ')
})

function sectionId(categoryId) {
  return `category-${categoryId}`
}

function scrollToCategory(categoryId) {
  activeCategoryId.value = categoryId
  document.getElementById(sectionId(categoryId))?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

function syncActiveCategory() {
  const firstVisible = menuStore.publicCategories.find((category) => {
    const element = document.getElementById(sectionId(category.id))
    if (!element) return false
    const rect = element.getBoundingClientRect()
    return rect.top <= 160 && rect.bottom >= 160
  })

  if (firstVisible) {
    activeCategoryId.value = firstVisible.id
  }
}

onMounted(async () => {
  try {
    await menuStore.fetchPublicMenu(route.params.uuid)
  } catch {
    // The store already captures the visible error state for the page.
  }
  activeCategoryId.value = menuStore.publicCategories[0]?.id || null
  window.addEventListener('scroll', syncActiveCategory, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', syncActiveCategory)
})
</script>
