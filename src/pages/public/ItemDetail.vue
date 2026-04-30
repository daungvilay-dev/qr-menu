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
        <div class="overflow-hidden rounded-[28px] bg-navy-600">
          <img v-if="item.img" :src="buildAssetUrl(item.img)" :alt="item.name" class="h-72 w-full object-cover" />
          <div v-else class="flex h-72 items-center justify-center bg-gradient-to-br from-navy-600 to-navy-700 text-brand-400">
            <span class="font-display text-5xl">{{ item.name?.charAt(0) }}</span>
          </div>
        </div>

        <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 class="font-display text-3xl text-slate-100">{{ item.name }}</h2>
            <p class="mt-2 text-sm text-slate-400">
              {{ item.description || 'Choose your preferred options below.' }}
            </p>
          </div>
          <span class="price-chip">
            {{ formatCurrency(item.price, item.currency) }}
          </span>
        </div>

        <div v-if="activeVariants.length" class="rounded-[24px] border border-navy-500/50 bg-navy-700/50 p-5">
          <h3 class="text-lg font-semibold text-slate-100">Choose a variant</h3>
          <a-radio-group
            class="mt-4 flex w-full flex-col gap-3"
            :value="selectedVariantId"
            @update:value="(value) => $emit('select-variant', value)"
          >
            <label
              v-for="variant in activeVariants"
              :key="variant.id"
              class="flex items-center justify-between rounded-2xl border border-navy-500/50 bg-navy-600 px-4 py-3"
            >
              <div class="flex items-center gap-3">
                <a-radio :value="variant.id" />
                <span class="font-medium text-slate-200">{{ variant.name }}</span>
              </div>
              <span class="font-mono text-sm font-semibold text-brand-400">
                {{ formatCurrency(variant.priceDeltaCents, item.currency) }}
              </span>
            </label>
          </a-radio-group>
        </div>

        <div v-if="item.addons?.length" class="rounded-[24px] border border-navy-500/50 bg-navy-700/50 p-5">
          <h3 class="text-lg font-semibold text-slate-100">Add extras</h3>
          <div class="mt-4 space-y-3">
            <label
              v-for="addon in item.addons"
              :key="addon.id"
              class="flex items-center justify-between rounded-2xl border border-navy-500/50 bg-navy-600 px-4 py-3"
            >
              <div class="flex items-center gap-3">
                <a-checkbox
                  :checked="selectedAddonIds.includes(addon.id)"
                  @change="(event) => $emit('toggle-addon', addon.id, event.target.checked)"
                />
                <span class="font-medium text-slate-200">{{ addon.name }}</span>
              </div>
              <span class="font-mono text-sm font-semibold text-brand-400">
                {{ formatCurrency(addon.price, addon.currency) }}
              </span>
            </label>
          </div>
        </div>

        <div class="flex items-center justify-between rounded-[24px] bg-navy-950 px-5 py-4 text-white">
          <div>
            <p class="text-xs uppercase tracking-[0.3em] text-brand-300">Live total</p>
            <p class="text-sm text-slate-400">Base price + variant delta + addons</p>
          </div>
          <span class="font-mono text-3xl font-semibold text-brand-400">{{ formatCurrency(total, item.currency) }}</span>
        </div>
      </div>
    </template>
  </a-modal>
</template>

<script setup>
import { computed } from 'vue'

import { buildAssetUrl } from '@/services/api'
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
