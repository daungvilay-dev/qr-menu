<template>
  <div class="space-y-5">
    <a-alert v-if="errorMessage" type="error" :message="errorMessage" show-icon />

    <a-form layout="vertical" :model="form" class="grid grid-cols-1 gap-x-4 md:grid-cols-2">
      <a-form-item label="Name" required>
        <a-input v-model:value="form.name" />
      </a-form-item>

      <a-form-item label="Slug" required>
        <a-input v-model:value="form.slug" placeholder="my-restaurant" />
      </a-form-item>

      <a-form-item label="Contact Email" required>
        <a-input v-model:value="form.contactEmail" />
      </a-form-item>

      <a-form-item label="Phone">
        <a-input v-model:value="form.phone" />
      </a-form-item>

      <a-form-item v-if="showOwnerField" label="Owner" required>
        <a-select v-model:value="form.ownerId" placeholder="Select an owner">
          <a-select-option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.username }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item v-if="showStatusField" class="flex items-end">
        <a-checkbox v-model:checked="form.isActive">Active</a-checkbox>
      </a-form-item>

      <a-form-item class="md:col-span-2" label="Logo">
        <ImageUploadPreview
          input-id="restaurant-logo-upload"
          button-label="Choose restaurant logo"
          empty-title="No restaurant logo selected"
          empty-description="Upload a logo or storefront image."
          :preview-url="previewUrl"
          :file-name="fileName"
          :has-preview="Boolean(previewUrl)"
          alt="Restaurant logo preview"
          @change="$emit('file-change', $event)"
          @clear="$emit('file-clear')"
        />
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import ImageUploadPreview from '@/components/forms/ImageUploadPreview.vue'

defineProps({
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
  showOwnerField: {
    type: Boolean,
    default: false,
  },
  showStatusField: {
    type: Boolean,
    default: false,
  },
  users: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['file-change', 'file-clear'])
</script>
