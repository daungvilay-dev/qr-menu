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
              <a-button size="small" @click="openPrintModal(record)">Print</a-button>
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

    <a-modal
      :open="isPrintModalOpen"
      title="Print QR code"
      width="520px"
      ok-text="Print"
      @cancel="closePrintModal"
      @ok="printQrCode"
    >
      <div v-if="selectedQrCodeForPrint" class="space-y-5">
        <div
          ref="qrPrintCard"
          class="rounded-[28px] bg-white p-8 text-center text-slate-900"
        >
          <p class="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">QR Menu</p>
          <h3 class="mt-3 text-2xl font-semibold">
            {{ selectedQrCodeForPrint.branch?.name || 'Restaurant Menu' }}
          </h3>
          <p class="mt-2 text-sm text-slate-500">
            Table: {{ selectedQrCodeForPrint.tableNumber || 'Walk-in' }}
          </p>

          <div class="mt-6 flex justify-center">
            <a-qrcode
              :value="publicUrl(selectedQrCodeForPrint.uuid)"
              :size="220"
              color="#111827"
              bg-color="#ffffff"
            />
          </div>

          <p class="mt-6 break-all font-mono text-xs text-slate-500">
            {{ publicUrl(selectedQrCodeForPrint.uuid) }}
          </p>
        </div>

        <p class="text-sm text-slate-400">
          This print layout uses the public scan URL tied to this QR code.
        </p>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import { notification } from 'ant-design-vue'

import AppPageHeader from '@/components/common/AppPageHeader.vue'
import AppLoading from '@/components/ui/AppLoading.vue'
import { useMenuStore } from '@/store/menu'

const menuStore = useMenuStore()
const isModalOpen = ref(false)
const editingQrCode = ref(null)
const isPrintModalOpen = ref(false)
const selectedQrCodeForPrint = ref(null)
const qrPrintCard = ref(null)

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

async function openPrintModal(record) {
  selectedQrCodeForPrint.value = record
  isPrintModalOpen.value = true
  await nextTick()
}

function closePrintModal() {
  isPrintModalOpen.value = false
  selectedQrCodeForPrint.value = null
}

function extractQrMarkup() {
  const container = qrPrintCard.value
  if (!container) return ''

  const canvas = container.querySelector('canvas')
  if (canvas) {
    const imageUrl = canvas.toDataURL('image/png')
    return `<img src="${imageUrl}" alt="QR code" style="width:220px;height:220px;" />`
  }

  const svg = container.querySelector('svg')
  if (svg) {
    return svg.outerHTML
  }

  return ''
}

function printQrCode() {
  if (!selectedQrCodeForPrint.value) return

  const popup = window.open('', '_blank', 'width=900,height=700')
  if (!popup) {
    notification.error({ message: 'Unable to open print window' })
    return
  }

  const qrMarkup = extractQrMarkup()
  const branchName = selectedQrCodeForPrint.value.branch?.name || 'Restaurant Menu'
  const tableNumber = selectedQrCodeForPrint.value.tableNumber || 'Walk-in'
  const url = publicUrl(selectedQrCodeForPrint.value.uuid)

  popup.document.write(`
    <html>
      <head>
        <title>Print QR Code</title>
        <style>
          body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: #ffffff;
            color: #111827;
          }
          .sheet {
            width: 360px;
            margin: 32px auto;
            border: 1px solid #e5e7eb;
            border-radius: 24px;
            padding: 32px 24px;
            text-align: center;
          }
          .eyebrow {
            font-size: 12px;
            letter-spacing: 0.35em;
            text-transform: uppercase;
            color: #6b7280;
            font-weight: 700;
          }
          h1 {
            margin: 16px 0 8px;
            font-size: 28px;
          }
          .meta {
            margin: 0;
            font-size: 14px;
            color: #6b7280;
          }
          .qr {
            margin: 24px 0;
            display: flex;
            justify-content: center;
          }
          .url {
            word-break: break-all;
            font-family: monospace;
            font-size: 11px;
            color: #6b7280;
          }
          @media print {
            .sheet {
              border: none;
              margin-top: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="sheet">
          <div class="eyebrow">QR Menu</div>
          <h1>${branchName}</h1>
          <p class="meta">Table: ${tableNumber}</p>
          <div class="qr">${qrMarkup}</div>
          <div class="url">${url}</div>
        </div>
      </body>
    </html>
  `)
  popup.document.close()
  popup.focus()
  popup.print()
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
