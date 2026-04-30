<template>
  <div>
    <AppPageHeader
      eyebrow="Admin"
      title="Restaurants"
      :description="
        isSuperAdmin
          ? 'Create and maintain restaurant records that power the QR menu workspace.'
          : 'Browse restaurant information. Only super admins can create, edit, or delete restaurants.'
      "
    >
      <a-button
        v-if="isSuperAdmin"
        type="primary"
        class="!bg-brand-500 !shadow-none hover:!bg-brand-600"
        @click="openCreateModal"
      >
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
        <a-table-column title="Owner" key="owner">
          <template #default="{ record }">
            {{ record.owner?.username || ownerName(record.ownerId) || record.ownerId || '—' }}
          </template>
        </a-table-column>
        <a-table-column title="Status" key="isActive">
          <template #default="{ record }">
            <a-tag :color="record.isActive ? 'green' : 'default'">
              {{ record.isActive ? 'Active' : 'Inactive' }}
            </a-tag>
          </template>
        </a-table-column>
        <a-table-column v-if="isSuperAdmin" title="Actions" key="actions" align="right">
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
      <RestaurantForm
        :form="formState"
        :users="systemStore.users"
        :preview-url="logoPreviewUrl"
        :file-name="logoFileName"
        :error-message="submitError"
        :show-owner-field="true"
        :show-status-field="true"
        @file-change="handleLogoFileChange"
        @file-clear="clearLogoFile"
      />
    </a-modal>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { notification } from 'ant-design-vue'

import RestaurantForm from '@/components/forms/RestaurantForm.vue'
import AppPageHeader from '@/components/common/AppPageHeader.vue'
import AppLoading from '@/components/ui/AppLoading.vue'
import { buildAssetUrl } from '@/services/api'
import { useAuthStore } from '@/store/auth'
import { useRestaurantStore } from '@/store/restaurant'
import { useSystemStore } from '@/store/system'
import { createObjectPreviewUrl, revokeObjectPreviewUrl } from '@/utils/filePreview'

const authStore = useAuthStore()
const restaurantStore = useRestaurantStore()
const systemStore = useSystemStore()
const isModalOpen = ref(false)
const editingRestaurantId = ref(null)
const logoFile = ref(null)
const localLogoPreviewUrl = ref('')
const submitError = ref('')

const formState = reactive({
  name: '',
  slug: '',
  contactEmail: '',
  phone: '',
  logo: '',
  isActive: true,
  ownerId: null,
})
const isSuperAdmin = computed(() => authStore.isSuperAdmin)
const logoPreviewUrl = computed(() => localLogoPreviewUrl.value || buildAssetUrl(formState.logo))
const logoFileName = computed(() => logoFile.value?.name || '')

function resetForm() {
  clearLogoFile()
  submitError.value = ''
  formState.name = ''
  formState.slug = ''
  formState.contactEmail = ''
  formState.phone = ''
  formState.logo = ''
  formState.isActive = true
  formState.ownerId = null
}

function handleLogoFileChange(file) {
  revokeObjectPreviewUrl(localLogoPreviewUrl.value)
  logoFile.value = file
  localLogoPreviewUrl.value = file ? createObjectPreviewUrl(file) : ''
}

function clearLogoFile() {
  revokeObjectPreviewUrl(localLogoPreviewUrl.value)
  logoFile.value = null
  localLogoPreviewUrl.value = ''
}

function openCreateModal() {
  if (!isSuperAdmin.value) return
  editingRestaurantId.value = null
  resetForm()
  isModalOpen.value = true
}

function ownerName(ownerId) {
  return systemStore.users.find((user) => user.id === ownerId)?.username || ''
}

async function openEditModal(id) {
  if (!isSuperAdmin.value) return

  try {
    clearLogoFile()
    submitError.value = ''
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
  submitError.value = ''
  isModalOpen.value = false
}

async function submitRestaurant() {
  if (!isSuperAdmin.value) return

  submitError.value = ''

  if (!formState.name || !formState.slug || !formState.contactEmail || !formState.ownerId) {
    submitError.value = 'Name, slug, contact email, and owner are required.'
    return
  }

  try {
    await restaurantStore.saveRestaurant({ ...formState, file: logoFile.value || undefined }, editingRestaurantId.value)
    notification.success({ message: 'Restaurant saved' })
    closeModal()
  } catch (error) {
    submitError.value = error.message
    notification.error({ message: error.message })
  }
}

async function removeRestaurant(id) {
  if (!isSuperAdmin.value) return

  try {
    await restaurantStore.deleteRestaurant(id)
    notification.success({ message: 'Restaurant deleted' })
  } catch (error) {
    notification.error({ message: error.message })
  }
}

onMounted(async () => {
  const tasks = [restaurantStore.fetchRestaurants()]

  if (isSuperAdmin.value) {
    tasks.push(systemStore.fetchUsers())
  }

  await Promise.all(tasks)
})
</script>
