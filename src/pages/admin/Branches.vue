<template>
  <div>
    <AppPageHeader
      eyebrow="Admin"
      title="Branches"
      description="Manage branch records used by QR codes and branch-specific menu access."
    >
      <a-button type="primary" class="!bg-brand-500 !shadow-none hover:!bg-brand-600" @click="openCreateModal">
        Add branch
      </a-button>
    </AppPageHeader>

    <AppLoading v-if="menuStore.isLoading('branches')" />

    <div v-else class="rounded-[28px] border border-navy-500/50 bg-navy-700/50 p-4 shadow-card backdrop-blur">
      <a-table :data-source="menuStore.branches" :pagination="false" row-key="id" :scroll="{ x: 980 }">
        <a-table-column title="Name" data-index="name" key="name" />
        <a-table-column title="Slug" data-index="slug" key="slug" />
        <a-table-column title="Address" key="address">
          <template #default="{ record }">
            {{ record.address || '—' }}
          </template>
        </a-table-column>
        <a-table-column title="Phone" key="phone">
          <template #default="{ record }">
            {{ record.phone || '—' }}
          </template>
        </a-table-column>
        <a-table-column title="Timezone" key="timezone">
          <template #default="{ record }">
            {{ record.timezone || '—' }}
          </template>
        </a-table-column>
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
              <a-button size="small" @click="openEditModal(record)">Edit</a-button>
              <a-popconfirm title="Delete this branch?" @confirm="removeBranch(record.id)">
                <a-button danger size="small">Delete</a-button>
              </a-popconfirm>
            </div>
          </template>
        </a-table-column>
      </a-table>
    </div>

    <a-modal
      :open="isModalOpen"
      :title="editingBranch ? 'Edit branch' : 'Create branch'"
      width="760px"
      ok-text="Save"
      @cancel="closeModal"
      @ok="submitBranch"
    >
      <a-form layout="vertical" :model="formState" class="grid grid-cols-1 gap-x-4 md:grid-cols-2">
        <a-form-item label="Name" required>
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item label="Slug" required>
          <a-input v-model:value="formState.slug" placeholder="main-branch" />
        </a-form-item>
        <a-form-item label="Phone">
          <a-input v-model:value="formState.phone" />
        </a-form-item>
        <a-form-item label="Timezone">
          <a-input v-model:value="formState.timezone" placeholder="Asia/Vientiane" />
        </a-form-item>
        <a-form-item label="Address" class="md:col-span-2">
          <a-textarea v-model:value="formState.address" :rows="3" />
        </a-form-item>
        <a-form-item class="md:col-span-2">
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
const editingBranch = ref(null)

const formState = reactive({
  name: '',
  slug: '',
  address: '',
  phone: '',
  timezone: 'Asia/Vientiane',
  isActive: true,
})

function resetForm() {
  Object.assign(formState, {
    name: '',
    slug: '',
    address: '',
    phone: '',
    timezone: 'Asia/Vientiane',
    isActive: true,
  })
}

function openCreateModal() {
  editingBranch.value = null
  resetForm()
  isModalOpen.value = true
}

function openEditModal(branch) {
  editingBranch.value = branch
  Object.assign(formState, {
    name: branch.name || '',
    slug: branch.slug || '',
    address: branch.address || '',
    phone: branch.phone || '',
    timezone: branch.timezone || 'Asia/Vientiane',
    isActive: branch.isActive ?? true,
  })
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

async function submitBranch() {
  try {
    await menuStore.saveBranch({ ...formState }, editingBranch.value?.id)
    notification.success({ message: 'Branch saved' })
    closeModal()
  } catch (error) {
    notification.error({ message: error.message })
  }
}

async function removeBranch(id) {
  try {
    await menuStore.deleteBranch(id)
    notification.success({ message: 'Branch deleted' })
  } catch (error) {
    notification.error({ message: error.message })
  }
}

onMounted(() => {
  menuStore.fetchBranches()
})
</script>
