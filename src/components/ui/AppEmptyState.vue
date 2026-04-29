<template>
  <div class="rounded-3xl border border-dashed border-navy-500 bg-navy-700/50 p-10 text-center shadow-card">
    <h3 class="text-lg font-semibold text-slate-100">{{ title }}</h3>
    <p class="mt-2 text-sm text-slate-400">{{ description }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Nothing here yet',
  },
  description: {
    type: String,
    default: 'Once data is available it will appear here.',
  },
})
</script>
