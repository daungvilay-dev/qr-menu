<template>
  <div>
    <AppPageHeader
      eyebrow="Admin"
      title="Restaurants"
      description="Create and maintain restaurant records that power the QR menu workspace."
    >
      <a-button type="primary" class="!bg-brand-500 !shadow-none hover:!bg-brand-600" @click="openCreateModal">
        Add restaurant
      </a-button>
    </AppPageHeader>

    <AppLoading v-if="restaurantStore.isLoading('restaurants')" />

    <div v-else class="rounded-[28px] border border-navy-500/50 bg-navy-700/50 p-4 shadow-card backdrop-blur">
      <a-table :data-source="restaurantStore.restaurants" :pagination="false" row-key="id" :scroll="{ x: 980 }">
        <a-table-column title="Name" data-index="name" key="name" />
        <a-table-column title="Slug" data-index="slug" key="slug" />
        <a-table-column title="Contact Email" data-index="contactEmail" key="contactEmail" />
        <a-table-column title="Phone" key="phone">
          <template #default="{ record }">
            {{ record.phone || '—' }}
          </template>
        </a-table-column>
        <a-table-column title="Owner ID" data-index="ownerId" key="ownerId" />
        <a-table-column title="Status" key="isActive">
          <template #default="{ record }">
            <a-tag :color="record.isActive ? 'green' : 'default'">
              {{ record.isActive ? 'Active' : 'Inactive' }}
            </a-tag>
          </template>
        </a-table-column>
        <a-table-column title="Actions" key="actions" align="right">
          <template #default="{ record }">
            <div class="flex justify-end gap-2">
              <a-button size="small" @click="openEditModal(record.id)">Edit</a-button>
              <a-popconfirm title="Delete this restaurant?" @confirm="removeRestaurant(record.id)">
                <a-button danger size="small">Delete</a-button>
              </a-popconfirm>
            </div>
          </template>
        </a-table-column>
      </a-table>
    </div>

    <a-modal
      :open="isModalOpen"
      :title="editingRestaurantId ? 'Edit restaurant' : 'Create restaurant'"
      width="760px"
      ok-text="Save"
      :confirm-loading="restaurantStore.isLoading('restaurant')"
      @cancel="closeModal"
      @ok="submitRestaurant"
    >
      <a-form layout="vertical" :model="formState" class="grid grid-cols-1 gap-x-4 md:grid-cols-2">
        <a-form-item label="Name" required>
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item label="Slug" required>
          <a-input v-model:value="formState.slug" placeholder="my-restaurant" />
        </a-form-item>
        <a-form-item label="Contact Email" required>
          <a-input v-model:value="formState.contactEmail" />
        </a-form-item>
        <a-form-item label="Phone">
          <a-input v-model:value="formState.phone" />
        </a-form-item>
        <a-form-item label="Logo URL" class="md:col-span-2">
          <a-input v-model:value="formState.logo" />
        </a-form-item>
        <a-form-item label="Owner ID" required>
          <a-input-number v-model:value="formState.ownerId" class="w-full" :min="1" />
        </a-form-item>
        <a-form-item class="flex items-end">
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
import { useRestaurantStore } from '@/store/restaurant'

const restaurantStore = useRestaurantStore()
const isModalOpen = ref(false)
const editingRestaurantId = ref(null)

const formState = reactive({
  name: '',
  slug: '',
  contactEmail: '',
  phone: '',
  logo: '',
  isActive: true,
  ownerId: null,
})

function resetForm() {
  formState.name = ''
  formState.slug = ''
  formState.contactEmail = ''
  formState.phone = ''
  formState.logo = ''
  formState.isActive = true
  formState.ownerId = null
}

function openCreateModal() {
  editingRestaurantId.value = null
  resetForm()
  isModalOpen.value = true
}

async function openEditModal(id) {
  try {
    const restaurant = await restaurantStore.fetchRestaurant(id)
    editingRestaurantId.value = id
    formState.name = restaurant.name || ''
    formState.slug = restaurant.slug || ''
    formState.contactEmail = restaurant.contactEmail || ''
    formState.phone = restaurant.phone || ''
    formState.logo = restaurant.logo || ''
    formState.isActive = restaurant.isActive ?? true
    formState.ownerId = restaurant.ownerId ?? null
    isModalOpen.value = true
  } catch (error) {
    notification.error({ message: error.message })
  }
}

function closeModal() {
  isModalOpen.value = false
}

async function submitRestaurant() {
  try {
    await restaurantStore.saveRestaurant({ ...formState }, editingRestaurantId.value)
    notification.success({ message: 'Restaurant saved' })
    closeModal()
  } catch (error) {
    notification.error({ message: error.message })
  }
}

async function removeRestaurant(id) {
  try {
    await restaurantStore.deleteRestaurant(id)
    notification.success({ message: 'Restaurant deleted' })
  } catch (error) {
    notification.error({ message: error.message })
  }
}

onMounted(() => {
  restaurantStore.fetchRestaurants()
})
</script>
