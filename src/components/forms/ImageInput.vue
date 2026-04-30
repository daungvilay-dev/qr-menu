<template>
  <div class="space-y-3">
    <div
      class="relative flex min-h-[220px] items-center justify-center overflow-hidden rounded-[24px] border border-dashed bg-navy-800/60 p-4 transition-colors"
      :class="isDragOver ? 'border-brand-500 bg-navy-700/80' : 'border-navy-500/50'"
      @dragenter="onDragEnter"
      @dragleave="onDragLeave"
      @dragover.prevent
      @drop.prevent="onDrop"
    >
      <img
        v-if="previewSrc && !previewFailed"
        :src="previewSrc"
        :alt="alt"
        class="max-h-[240px] w-auto rounded-[18px] object-contain"
        @error="previewFailed = true"
      />
      <div v-else class="select-none text-center text-sm">
        <p class="font-semibold text-slate-300">No image selected</p>
        <p class="mt-1 text-xs text-slate-500">
          Choose a file, drag and drop, paste (Ctrl+V&nbsp;/&nbsp;⌘V), or enter a URL below.
        </p>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <input
        :id="uid"
        ref="fileInputEl"
        class="hidden"
        type="file"
        accept="image/*"
        @change="handleFileChange"
      />
      <label
        :for="uid"
        class="inline-flex cursor-pointer items-center rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-brand-400"
      >
        Choose file
      </label>
      <button
        v-if="hasSomething"
        type="button"
        class="rounded-full border border-navy-500 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-navy-400 hover:text-white"
        @click="clear"
      >
        Remove
      </button>
      <span v-if="selectedFile" class="max-w-[200px] truncate text-xs text-slate-400">
        {{ selectedFile.name }}
      </span>
    </div>

    <a-input
      v-model:value="typedUrl"
      placeholder="Or enter image URL…"
      allow-clear
      @change="handleUrlInputChange"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  alt: { type: String, default: 'Image preview' },
  existingUrl: { type: String, default: '' },
})

const emit = defineEmits(['change'])

const uid = `img-input-${Math.random().toString(36).slice(2, 9)}`

const fileInputEl = ref(null)
const selectedFile = ref(null)
const objectUrl = ref('')
const typedUrl = ref('')
const previewFailed = ref(false)
const isDragOver = ref(false)
let dragLeaveTimer = null

const previewSrc = computed(() => {
  if (objectUrl.value) return objectUrl.value
  if (typedUrl.value) return typedUrl.value
  return props.existingUrl || ''
})

const hasSomething = computed(() => Boolean(previewSrc.value))

watch(typedUrl, () => {
  previewFailed.value = false
})

function selectFile(file) {
  if (objectUrl.value) URL.revokeObjectURL(objectUrl.value)
  selectedFile.value = file
  objectUrl.value = URL.createObjectURL(file)
  previewFailed.value = false
  if (fileInputEl.value) fileInputEl.value.value = ''
  emitChange()
}

function handleFileChange(event) {
  const file = event.target.files?.[0]
  if (file) selectFile(file)
}

function handleUrlInputChange() {
  previewFailed.value = false
  emitChange()
}

function clear() {
  if (objectUrl.value) URL.revokeObjectURL(objectUrl.value)
  selectedFile.value = null
  objectUrl.value = ''
  typedUrl.value = ''
  previewFailed.value = false
  emitChange()
}

function emitChange() {
  emit('change', {
    file: selectedFile.value ?? null,
    url: selectedFile.value ? '' : (typedUrl.value || ''),
  })
}

// Drag and drop
function onDragEnter(event) {
  event.preventDefault()
  clearTimeout(dragLeaveTimer)
  isDragOver.value = true
}

function onDragLeave() {
  dragLeaveTimer = setTimeout(() => {
    isDragOver.value = false
  }, 50)
}

function onDrop(event) {
  clearTimeout(dragLeaveTimer)
  isDragOver.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file?.type.startsWith('image/')) selectFile(file)
}

// Document-level paste (skips text inputs so URL field still pastes normally)
function onDocumentPaste(event) {
  const tag = event.target?.tagName?.toLowerCase()
  if (tag === 'input' || tag === 'textarea') return
  const items = Array.from(event.clipboardData?.items ?? [])
  const imageItem = items.find((item) => item.type.startsWith('image/'))
  if (!imageItem) return
  event.preventDefault()
  const file = imageItem.getAsFile()
  if (file) selectFile(file)
}

onMounted(() => document.addEventListener('paste', onDocumentPaste))
onUnmounted(() => {
  document.removeEventListener('paste', onDocumentPaste)
  clearTimeout(dragLeaveTimer)
  if (objectUrl.value) URL.revokeObjectURL(objectUrl.value)
})
</script>
