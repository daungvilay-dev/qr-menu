<template>
  <a-modal
    :open="open"
    :footer="null"
    :width="640"
    centered
    @cancel="$emit('close')"
  >
    <template v-if="item">
      <div class="space-y-6">
        <div class="overflow-hidden rounded-[28px] bg-stone-100">
          <img v-if="item.img" :src="item.img" :alt="item.name" class="h-72 w-full object-cover" />
          <div v-else class="flex h-72 items-center justify-center bg-gradient-to-br from-brand-100 to-stone-100 text-brand-800">
            <span class="font-display text-5xl">{{ item.name?.charAt(0) }}</span>
          </div>
        </div>

        <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 class="font-display text-3xl text-stone-900">{{ item.name }}</h2>
            <p class="mt-2 text-sm text-stone-600">
              {{ item.description || 'Choose your preferred options below.' }}
            </p>
          </div>
          <span class="price-chip">
            {{ formatCurrency(item.price, item.currency) }}
          </span>
        </div>

        <div v-if="activeVariants.length" class="rounded-[24px] border border-stone-200 bg-stone-50 p-5">
          <h3 class="text-lg font-semibold text-stone-900">Choose a variant</h3>
          <a-radio-group
            class="mt-4 flex w-full flex-col gap-3"
            :value="selectedVariantId"
            @update:value="(value) => $emit('select-variant', value)"
          >
            <label
              v-for="variant in activeVariants"
              :key="variant.id"
              class="flex items-center justify-between rounded-2xl border border-stone-200 bg-white px-4 py-3"
            >
              <div class="flex items-center gap-3">
                <a-radio :value="variant.id" />
                <span class="font-medium text-stone-900">{{ variant.name }}</span>
              </div>
              <span class="text-sm font-semibold text-brand-700">
                {{ formatCurrency(variant.priceDeltaCents, item.currency) }}
              </span>
            </label>
          </a-radio-group>
        </div>

        <div v-if="item.addons?.length" class="rounded-[24px] border border-stone-200 bg-stone-50 p-5">
          <h3 class="text-lg font-semibold text-stone-900">Add extras</h3>
          <div class="mt-4 space-y-3">
            <label
              v-for="addon in item.addons"
              :key="addon.id"
              class="flex items-center justify-between rounded-2xl border border-stone-200 bg-white px-4 py-3"
            >
              <div class="flex items-center gap-3">
                <a-checkbox
                  :checked="selectedAddonIds.includes(addon.id)"
                  @change="(event) => $emit('toggle-addon', addon.id, event.target.checked)"
                />
                <span class="font-medium text-stone-900">{{ addon.name }}</span>
              </div>
              <span class="text-sm font-semibold text-brand-700">
                {{ formatCurrency(addon.price, addon.currency) }}
              </span>
            </label>
          </div>
        </div>

        <div class="flex items-center justify-between rounded-[24px] bg-stone-950 px-5 py-4 text-white">
          <div>
            <p class="text-xs uppercase tracking-[0.3em] text-brand-200">Live total</p>
            <p class="text-sm text-stone-300">Base price + variant delta + addons</p>
          </div>
          <span class="font-display text-3xl">{{ formatCurrency(total, item.currency) }}</span>
        </div>
      </div>
    </template>
  </a-modal>
</template>

<script setup>
import { computed } from 'vue'

import { formatCurrency } from '@/utils/currency'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  item: {
    type: Object,
    default: null,
  },
  selectedVariantId: {
    type: Number,
    default: null,
  },
  selectedAddonIds: {
    type: Array,
    default: () => [],
  },
  total: {
    type: Number,
    default: 0,
  },
})

defineEmits(['close', 'select-variant', 'toggle-addon'])

const activeVariants = computed(() => props.item?.variants?.filter((variant) => variant.isActive !== false) || [])
</script>
