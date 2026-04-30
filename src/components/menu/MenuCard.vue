<template>
  <button
    type="button"
    class="group flex w-full flex-col overflow-hidden rounded-[28px] border border-navy-500 bg-navy-700 text-left shadow-card transition hover:-translate-y-1 hover:shadow-xl hover:border-brand-500/40"
    @click="$emit('select', item)"
  >
    <div class="aspect-[4/3] overflow-hidden bg-navy-600">
      <img
        v-if="item.img"
        :src="buildAssetUrl(item.img)"
        :alt="item.name"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <div v-else class="flex h-full items-center justify-center bg-gradient-to-br from-navy-600 to-navy-700 text-brand-400">
        <span class="font-display text-2xl">{{ item.name?.charAt(0) }}</span>
      </div>
    </div>
    <div class="flex flex-1 flex-col gap-3 p-4">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h3 class="text-base font-semibold text-slate-100">{{ item.name }}</h3>
          <p class="mt-1 line-clamp-2 text-sm text-slate-400">
            {{ item.description || 'Freshly prepared and ready to customize.' }}
          </p>
        </div>
        <span class="price-chip shrink-0">
          {{ formatCurrency(item.price, item.currency) }}
        </span>
      </div>
      <div class="mt-auto flex flex-wrap gap-2 text-xs text-slate-500">
        <span v-if="item.isVeg" class="rounded-full bg-emerald-500/20 px-2.5 py-1 text-emerald-400">Veg</span>
        <span v-if="item.spicyLevel" class="rounded-full bg-rose-500/20 px-2.5 py-1 text-rose-400">
          Spicy {{ item.spicyLevel }}/3
        </span>
        <span
          v-if="item.variants?.length"
          class="rounded-full bg-slate-700 px-2.5 py-1 text-slate-300"
        >
          {{ item.variants.length }} variants
        </span>
      </div>
    </div>
  </button>
</template>

<script setup>
import { buildAssetUrl } from '@/services/api'
import { formatCurrency } from '@/utils/currency'

defineProps({
  item: {
    type: Object,
    required: true,
  },
})

defineEmits(['select'])
</script>
