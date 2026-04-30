<template>
  <div class="space-y-3">
    <div
      class="flex min-h-[220px] items-center justify-center overflow-hidden rounded-[24px] border border-dashed border-navy-500/50 bg-navy-800/60 p-4"
    >
      <img
        v-if="previewUrl"
        :src="previewUrl"
        :alt="alt"
        class="max-h-[240px] w-auto rounded-[18px] object-contain"
      />
      <div v-else class="text-center text-sm text-slate-400">
        <p class="font-semibold text-slate-200">{{ emptyTitle }}</p>
        <p class="mt-1">{{ emptyDescription }}</p>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <input
        :id="inputId"
        class="hidden"
        type="file"
        :accept="accept"
        @change="handleFileChange"
      />
      <label
        :for="inputId"
        class="inline-flex cursor-pointer items-center rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-brand-400"
      >
        {{ buttonLabel }}
      </label>
      <button
        v-if="hasPreview"
        type="button"
        class="rounded-full border border-navy-500 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-navy-400 hover:text-white"
        @click="$emit('clear')"
      >
        Remove
      </button>
      <span v-if="fileName" class="text-sm text-slate-400">{{ fileName }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  accept: {
    type: String,
    default: 'image/*',
  },
  alt: {
    type: String,
    default: 'Selected image preview',
  },
  buttonLabel: {
    type: String,
    default: 'Choose image',
  },
  emptyTitle: {
    type: String,
    default: 'No image selected',
  },
  emptyDescription: {
    type: String,
    default: 'Pick an image to upload and preview before saving.',
  },
  fileName: {
    type: String,
    default: '',
  },
  hasPreview: {
    type: Boolean,
    default: false,
  },
  inputId: {
    type: String,
    required: true,
  },
  previewUrl: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['change', 'clear'])

function handleFileChange(event) {
  const file = event.target.files?.[0] || null
  emit('change', file)
  event.target.value = ''
}
</script>
