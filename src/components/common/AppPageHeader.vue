<template>
  <div class="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
    <div>
      <p v-if="eyebrow" class="text-xs font-semibold uppercase tracking-[0.3em] text-brand-400">
        {{ eyebrow }}
      </p>
      <h1 class="section-title">{{ title }}</h1>
      <p v-if="description" class="mt-1 max-w-2xl text-sm text-slate-400">
        {{ description }}
      </p>
    </div>
    <div class="flex flex-wrap gap-2">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  eyebrow: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
})
</script>
