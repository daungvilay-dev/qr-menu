<template>
  <div>
    <AppPageHeader
      eyebrow="Admin"
      title="Categories"
      description="Create and maintain the sections customers browse in the public menu."
    >
      <a-button type="primary" class="!bg-brand-600 !shadow-none hover:!bg-brand-700" @click="openCreateModal">
        Add category
      </a-button>
    </AppPageHeader>

    <AppLoading v-if="menuStore.isLoading('categories')" />

    <div v-else class="rounded-[28px] border border-stone-200 bg-white/80 p-4 shadow-card">
      <a-table :data-source="menuStore.categories" :pagination="false" row-key="id">
        <a-table-column title="Name" data-index="name" key="name" />
        <a-table-column title="Description" key="description">
          <template #default="{ record }">
            {{ record.description || '—' }}
          </template>
        </a-table-column>
        <a-table-column title="Active" key="isActive">
          <template #default="{ record }">
            <a-tag :color="record.isActive ? 'green' : 'default'">
              {{ record.isActive ? 'Active' : 'Inactive' }}
            </a-tag>
          </template>
        </a-table-column>
        <a-table-column title="Sort" data-index="sortOrder" key="sortOrder" />
        <a-table-column title="Actions" key="actions" align="right">
          <template #default="{ record }">
            <div class="flex justify-end gap-2">
              <a-button size="small" @click="openEditModal(record)">Edit</a-button>
              <a-popconfirm title="Delete this category?" @confirm="removeCategory(record.id)">
                <a-button danger size="small">Delete</a-button>
              </a-popconfirm>
            </div>
          </template>
        </a-table-column>
      </a-table>
    </div>

    <a-modal
      :open="isModalOpen"
      :title="editingCategory ? 'Edit category' : 'Create category'"
      ok-text="Save"
      @cancel="closeModal"
      @ok="submitCategory"
    >
      <a-form layout="vertical" :model="formState">
        <a-form-item label="Name" required>
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item label="Description">
          <a-textarea v-model:value="formState.description" :rows="3" />
        </a-form-item>
        <a-form-item label="Sort order">
          <a-input-number v-model:value="formState.sortOrder" class="w-full" :min="0" />
        </a-form-item>
        <a-form-item>
          <a-checkbox v-model:checked="formState.isActive">Active</a-checkbox>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { notification } from 'ant-design-vue'

import AppPageHeader from '@/components/common/AppPageHeader.vue'
import AppLoading from '@/components/ui/AppLoading.vue'
import { useMenuStore } from '@/store/menu'

const menuStore = useMenuStore()
const isModalOpen = ref(false)
const editingCategory = ref(null)

const formState = reactive({
  name: '',
  description: '',
  sortOrder: 0,
  isActive: true,
})

function resetForm() {
  formState.name = ''
  formState.description = ''
  formState.sortOrder = 0
  formState.isActive = true
}

function openCreateModal() {
  editingCategory.value = null
  resetForm()
  isModalOpen.value = true
}

function openEditModal(category) {
  editingCategory.value = category
  formState.name = category.name
  formState.description = category.description || ''
  formState.sortOrder = category.sortOrder || 0
  formState.isActive = category.isActive ?? true
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

async function submitCategory() {
  try {
    await menuStore.saveCategory({ ...formState }, editingCategory.value?.id)
    notification.success({ message: 'Category saved' })
    closeModal()
  } catch (error) {
    notification.error({ message: error.message })
  }
}

async function removeCategory(id) {
  try {
    await menuStore.deleteCategory(id)
    notification.success({ message: 'Category deleted' })
  } catch (error) {
    notification.error({ message: error.message })
  }
}

onMounted(() => {
  menuStore.fetchCategories()
})
</script>
