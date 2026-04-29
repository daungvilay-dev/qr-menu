<template>
  <div>
    <AppPageHeader
      eyebrow="Admin"
      title="QR Codes"
      description="Generate QR records and expose the final scan link used by the public customer menu."
    >
      <a-button type="primary" class="!bg-brand-600 !shadow-none hover:!bg-brand-700" @click="isModalOpen = true">
        Create QR code
      </a-button>
    </AppPageHeader>

    <AppLoading v-if="menuStore.isLoading('qrcodes')" />

    <div v-else class="rounded-[28px] border border-stone-200 bg-white/80 p-4 shadow-card">
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
            <a :href="publicUrl(record.uuid)" target="_blank" class="font-semibold text-brand-700">
              {{ publicUrl(record.uuid) }}
            </a>
          </template>
        </a-table-column>
      </a-table>
    </div>

    <a-modal
      :open="isModalOpen"
      title="Create QR code"
      ok-text="Generate"
      @cancel="isModalOpen = false"
      @ok="submitQrCode"
    >
      <a-form layout="vertical" :model="formState">
        <a-form-item label="Branch ID">
          <a-input-number v-model:value="formState.branchId" class="w-full" :min="1" />
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

const formState = reactive({
  branchId: null,
  tableNumber: '',
})

const publicQrBaseUrl = (import.meta.env.VITE_PUBLIC_QR_BASE_URL || 'http://localhost:5173/scan').replace(/\/$/, '')

function publicUrl(uuid) {
  return `${publicQrBaseUrl}/${uuid}`
}

async function submitQrCode() {
  try {
    await menuStore.createQrCode({
      branchId: formState.branchId || undefined,
      tableNumber: formState.tableNumber || undefined,
    })
    notification.success({ message: 'QR code created' })
    formState.branchId = null
    formState.tableNumber = ''
    isModalOpen.value = false
  } catch (error) {
    notification.error({ message: error.message })
  }
}

onMounted(() => {
  menuStore.fetchQrCodes()
})
</script>
