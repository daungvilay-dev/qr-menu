<template>
  <button
    type="button"
    class="group flex w-full flex-col overflow-hidden rounded-[28px] border border-stone-200 bg-white text-left shadow-card transition hover:-translate-y-1 hover:shadow-xl"
    @click="$emit('select', item)"
  >
    <div class="aspect-[4/3] overflow-hidden bg-stone-100">
      <img
        v-if="item.img"
        :src="item.img"
        :alt="item.name"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <div v-else class="flex h-full items-center justify-center bg-gradient-to-br from-brand-100 to-stone-100 text-brand-800">
        <span class="font-display text-2xl">{{ item.name?.charAt(0) }}</span>
      </div>
    </div>
    <div class="flex flex-1 flex-col gap-3 p-4">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h3 class="text-base font-semibold text-stone-900">{{ item.name }}</h3>
          <p class="mt-1 line-clamp-2 text-sm text-stone-600">
            {{ item.description || 'Freshly prepared and ready to customize.' }}
          </p>
        </div>
        <span class="price-chip shrink-0">
          {{ formatCurrency(item.price, item.currency) }}
        </span>
      </div>
      <div class="mt-auto flex flex-wrap gap-2 text-xs text-stone-500">
        <span v-if="item.isVeg" class="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">Veg</span>
        <span v-if="item.spicyLevel" class="rounded-full bg-rose-50 px-2.5 py-1 text-rose-700">
          Spicy {{ item.spicyLevel }}/3
        </span>
        <span
          v-if="item.variants?.length"
          class="rounded-full bg-stone-100 px-2.5 py-1 text-stone-700"
        >
          {{ item.variants.length }} variants
        </span>
      </div>
    </div>
  </button>
</template>

<script setup>
import { formatCurrency } from '@/utils/currency'

defineProps({
  item: {
    type: Object,
    required: true,
  },
})

defineEmits(['select'])
</script>
