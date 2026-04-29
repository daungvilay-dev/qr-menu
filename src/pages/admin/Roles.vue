<template>
  <div>
    <AppPageHeader
      eyebrow="System"
      title="Roles"
      description="Manage system roles used for user access and restaurant ownership assignments."
    >
      <a-button type="primary" class="!bg-brand-500 !shadow-none hover:!bg-brand-600" @click="openCreateModal">
        Add role
      </a-button>
    </AppPageHeader>

    <AppLoading v-if="systemStore.isLoading('roles')" />

    <div v-else class="rounded-[28px] border border-navy-500/50 bg-navy-700/50 p-4 shadow-card backdrop-blur">
      <a-table :data-source="systemStore.roles" :pagination="false" row-key="id">
        <a-table-column title="Name" data-index="name" key="name" />
        <a-table-column title="Value" data-index="value" key="value" />
        <a-table-column title="Remark" key="remark">
          <template #default="{ record }">
            {{ record.remark || '—' }}
          </template>
        </a-table-column>
        <a-table-column title="Status" key="status">
          <template #default="{ record }">
            <a-tag :color="record.status === 1 ? 'green' : 'default'">
              {{ record.status === 1 ? 'Enabled' : 'Disabled' }}
            </a-tag>
          </template>
        </a-table-column>
        <a-table-column title="Actions" key="actions" align="right">
          <template #default="{ record }">
            <div class="flex justify-end gap-2">
              <a-button size="small" @click="openEditModal(record)">Edit</a-button>
              <a-popconfirm title="Delete this role?" @confirm="removeRole(record.id)">
                <a-button danger size="small">Delete</a-button>
              </a-popconfirm>
            </div>
          </template>
        </a-table-column>
      </a-table>
    </div>

    <a-modal
      :open="isModalOpen"
      :title="editingRole ? 'Edit role' : 'Create role'"
      ok-text="Save"
      @cancel="closeModal"
      @ok="submitRole"
    >
      <a-form layout="vertical" :model="formState">
        <a-form-item label="Name" required>
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item label="Value" required>
          <a-input v-model:value="formState.value" placeholder="restaurant_owner" />
        </a-form-item>
        <a-form-item label="Remark">
          <a-textarea v-model:value="formState.remark" :rows="3" />
        </a-form-item>
        <a-form-item label="Status">
          <a-select v-model:value="formState.status">
            <a-select-option :value="1">Enabled</a-select-option>
            <a-select-option :value="0">Disabled</a-select-option>
          </a-select>
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
import { useSystemStore } from '@/store/system'

const systemStore = useSystemStore()
const isModalOpen = ref(false)
const editingRole = ref(null)

const formState = reactive({
  name: '',
  value: '',
  remark: '',
  status: 1,
})

function resetForm() {
  Object.assign(formState, {
    name: '',
    value: '',
    remark: '',
    status: 1,
  })
}

function openCreateModal() {
  editingRole.value = null
  resetForm()
  isModalOpen.value = true
}

function openEditModal(role) {
  editingRole.value = role
  Object.assign(formState, {
    name: role.name || '',
    value: role.value || '',
    remark: role.remark || '',
    status: role.status ?? 1,
  })
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

async function submitRole() {
  try {
    await systemStore.saveRole({ ...formState }, editingRole.value?.id)
    notification.success({ message: 'Role saved' })
    closeModal()
  } catch (error) {
    notification.error({ message: error.message })
  }
}

async function removeRole(id) {
  try {
    await systemStore.deleteRole(id)
    notification.success({ message: 'Role deleted' })
  } catch (error) {
    notification.error({ message: error.message })
  }
}

onMounted(() => {
  systemStore.fetchRoles()
})
</script>
