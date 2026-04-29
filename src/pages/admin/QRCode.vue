<template>
  <div>
    <AppPageHeader
      eyebrow="Admin"
      title="QR Codes"
      description="Generate QR records and expose the final scan link used by the public customer menu."
    >
      <a-button type="primary" class="!bg-brand-500 !shadow-none hover:!bg-brand-600" @click="openCreateModal">
        Create QR code
      </a-button>
    </AppPageHeader>

    <AppLoading v-if="menuStore.isLoading('qrcodes') || menuStore.isLoading('branches')" />

    <div v-else class="rounded-[28px] border border-navy-500/50 bg-navy-700/50 p-4 shadow-card backdrop-blur">
      <a-table :data-source="menuStore.qrCodes" :pagination="false" row-key="id" :scroll="{ x: 900 }">
        <a-table-column title="UUID" data-index="uuid" key="uuid" />
        <a-table-column title="Table" key="tableNumber">
          <template #default="{ record }">
            {{ record.tableNumber || '—' }}
          </template>
        </a-table-column>
        <a-table-column title="Branch" key="branch">
          <template #default="{ record }">
            {{ record.branch?.name || record.branchId || '—' }}
          </template>
        </a-table-column>
        <a-table-column title="Scans" data-index="scanCount" key="scanCount" />
        <a-table-column title="Public URL" key="publicUrl">
          <template #default="{ record }">
            <a :href="publicUrl(record.uuid)" target="_blank" class="font-mono font-semibold text-brand-400 hover:text-brand-300">
              {{ publicUrl(record.uuid) }}
            </a>
          </template>
        </a-table-column>
        <a-table-column title="Actions" key="actions" align="right">
          <template #default="{ record }">
            <div class="flex justify-end gap-2">
              <a-button size="small" @click="openEditModal(record)">Edit</a-button>
              <a-popconfirm title="Delete this QR code?" @confirm="removeQrCode(record.id)">
                <a-button size="small" danger>Delete</a-button>
              </a-popconfirm>
            </div>
          </template>
        </a-table-column>
      </a-table>
    </div>

    <a-modal
      :open="isModalOpen"
      :title="editingQrCode ? 'Edit QR code' : 'Create QR code'"
      :ok-text="editingQrCode ? 'Save' : 'Generate'"
      @cancel="closeModal"
      @ok="submitQrCode"
    >
      <a-form layout="vertical" :model="formState">
        <a-form-item label="Branch">
          <a-select v-model:value="formState.branchId" allow-clear placeholder="Select a branch">
            <a-select-option v-for="branch in menuStore.branches" :key="branch.id" :value="branch.id">
              {{ branch.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Table number">
          <a-input v-model:value="formState.tableNumber" placeholder="A1" />
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
const editingQrCode = ref(null)

const formState = reactive({
  branchId: null,
  tableNumber: '',
})

const publicQrBaseUrl = (import.meta.env.VITE_PUBLIC_QR_BASE_URL || 'http://localhost:5173/scan').replace(/\/$/, '')

function publicUrl(uuid) {
  return `${publicQrBaseUrl}/${uuid}`
}

function resetForm() {
  formState.branchId = null
  formState.tableNumber = ''
}

function openCreateModal() {
  editingQrCode.value = null
  resetForm()
  isModalOpen.value = true
}

function openEditModal(record) {
  editingQrCode.value = record
  formState.branchId = record.branch?.id ?? record.branchId ?? null
  formState.tableNumber = record.tableNumber || ''
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

async function submitQrCode() {
  try {
    const payload = {
      branchId: formState.branchId || undefined,
      tableNumber: formState.tableNumber || undefined,
    }

    if (editingQrCode.value) {
      await menuStore.updateQrCode(editingQrCode.value.id, payload)
      notification.success({ message: 'QR code updated' })
    } else {
      await menuStore.createQrCode(payload)
      notification.success({ message: 'QR code created' })
    }

    resetForm()
    closeModal()
  } catch (error) {
    notification.error({ message: error.message })
  }
}

async function removeQrCode(id) {
  try {
    await menuStore.deleteQrCode(id)
    notification.success({ message: 'QR code deleted' })
  } catch (error) {
    notification.error({ message: error.message })
  }
}

onMounted(async () => {
  await Promise.all([menuStore.fetchQrCodes(), menuStore.fetchBranches()])
})
</script>
