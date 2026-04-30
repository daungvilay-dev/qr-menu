<template>
  <div class="space-y-5">
    <a-alert v-if="errorMessage" type="error" :message="errorMessage" show-icon />

    <a-form layout="vertical" :model="form" class="grid grid-cols-1 gap-x-4 md:grid-cols-2">
      <a-form-item label="Category" required>
        <a-select v-model:value="form.categoryId" placeholder="Select a category">
          <a-select-option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="Name" required>
        <a-input v-model:value="form.name" />
      </a-form-item>

      <a-form-item label="Base price" required>
        <a-input-number v-model:value="form.price" class="w-full" :min="0" />
      </a-form-item>

      <a-form-item label="Currency">
        <a-input v-model:value="form.currency" />
      </a-form-item>

      <a-form-item label="Spicy level">
        <a-input-number v-model:value="form.spicyLevel" class="w-full" :min="0" :max="3" />
      </a-form-item>

      <a-form-item label="Sort order">
        <a-input-number v-model:value="form.sortOrder" class="w-full" :min="0" />
      </a-form-item>

      <a-form-item label="Description" class="md:col-span-2">
        <a-textarea v-model:value="form.description" :rows="4" />
      </a-form-item>

      <a-form-item label="Image" class="md:col-span-2">
        <ImageUploadPreview
          input-id="menu-image-upload"
          button-label="Choose menu image"
          empty-title="No menu image selected"
          empty-description="Upload a dish photo for the public menu."
          :preview-url="previewUrl"
          :file-name="fileName"
          :has-preview="Boolean(previewUrl)"
          alt="Menu image preview"
          @change="$emit('file-change', $event)"
          @clear="$emit('file-clear')"
        />
      </a-form-item>

      <div class="flex items-center gap-4 pt-2 md:col-span-2">
        <a-checkbox v-model:checked="form.isAvailable">Available</a-checkbox>
        <a-checkbox v-model:checked="form.isVeg">Vegetarian</a-checkbox>
      </div>
    </a-form>
  </div>
</template>

<script setup>
import ImageUploadPreview from '@/components/forms/ImageUploadPreview.vue'

defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
  errorMessage: {
    type: String,
    default: '',
  },
  fileName: {
    type: String,
    default: '',
  },
  form: {
    type: Object,
    required: true,
  },
  previewUrl: {
    type: String,
    default: '',
  },
})

defineEmits(['file-change', 'file-clear'])
</script>
