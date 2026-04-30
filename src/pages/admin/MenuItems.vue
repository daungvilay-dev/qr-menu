<template>
  <div>
    <AppPageHeader
      eyebrow="Admin"
      title="Menu Items"
      description="Manage dishes and their linked variants and addons from one workspace."
    >
      <a-button type="primary" class="!bg-brand-500 !shadow-none hover:!bg-brand-600" @click="openCreateModal">
        Add menu item
      </a-button>
    </AppPageHeader>

    <AppLoading v-if="menuStore.isLoading('menus') || menuStore.isLoading('categories')" />

    <div v-else class="rounded-[28px] border border-navy-500/50 bg-navy-700/50 p-4 shadow-card backdrop-blur">
      <a-table :data-source="menuStore.menuItems" :pagination="false" row-key="id" :scroll="{ x: 900 }">
        <a-table-column title="Image" key="img" width="110">
          <template #default="{ record }">
            <div class="flex items-center">
              <img
                v-if="record.img"
                :src="buildAssetUrl(record.img)"
                :alt="record.name"
                class="h-14 w-14 rounded-2xl object-cover ring-1 ring-navy-400/60"
              />
              <div
                v-else
                class="flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-navy-500/60 bg-navy-800/70 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500"
              >
                No image
              </div>
            </div>
          </template>
        </a-table-column>
        <a-table-column title="Name" data-index="name" key="name" />
        <a-table-column title="Category" key="category">
          <template #default="{ record }">
            {{ record.category?.name || categoryName(record.category?.id) }}
          </template>
        </a-table-column>
        <a-table-column title="Price" key="price">
          <template #default="{ record }">
            {{ formatCurrency(record.price, record.currency) }}
          </template>
        </a-table-column>
        <a-table-column title="Available" key="isAvailable">
          <template #default="{ record }">
            <a-tag :color="record.isAvailable ? 'green' : 'default'">
              {{ record.isAvailable ? 'Available' : 'Hidden' }}
            </a-tag>
          </template>
        </a-table-column>
        <a-table-column title="Actions" key="actions" align="right">
          <template #default="{ record }">
            <div class="flex justify-end gap-2">
              <a-button size="small" @click="openEditModal(record.id)">Edit</a-button>
              <a-button size="small" @click="openOptionsDrawer(record)">Options</a-button>
              <a-popconfirm title="Delete this menu item?" @confirm="removeMenuItem(record.id)">
                <a-button danger size="small">Delete</a-button>
              </a-popconfirm>
            </div>
          </template>
        </a-table-column>
      </a-table>
    </div>

    <a-modal
      :open="isMenuModalOpen"
      :title="editingMenu ? 'Edit menu item' : 'Create menu item'"
      width="760px"
      ok-text="Save"
      @cancel="closeMenuModal"
      @ok="submitMenuItem"
    >
      <MenuForm
        :key="menuFormKey"
        :form="menuFormState"
        :categories="menuStore.categories"
        :existing-image-url="menuExistingImageUrl"
        :error-message="menuSubmitError"
        @image-change="menuImage = $event"
      />
    </a-modal>

    <a-drawer
      :open="isOptionsDrawerOpen"
      :title="selectedMenuForOptions ? `${selectedMenuForOptions.name} options` : 'Options'"
      width="960"
      @close="closeOptionsDrawer"
    >
      <div v-if="selectedMenuForOptions" class="space-y-8">
        <section class="rounded-[24px] border border-navy-500/50 bg-navy-700/50 p-5">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-slate-100">Variants</h3>
              <p class="text-sm text-slate-400">Variant pricing uses `priceDeltaCents` from the backend.</p>
            </div>
            <a-button @click="openVariantModal()">Add variant</a-button>
          </div>

          <a-table
            :data-source="currentVariants"
            :pagination="false"
            row-key="id"
            size="small"
          >
            <a-table-column title="Name" data-index="name" key="name" />
            <a-table-column title="Delta" key="priceDeltaCents">
              <template #default="{ record }">
                {{ formatCurrency(record.priceDeltaCents, selectedMenuForOptions.currency) }}
              </template>
            </a-table-column>
            <a-table-column title="Active" key="isActive">
              <template #default="{ record }">
                <a-tag :color="record.isActive ? 'green' : 'default'">
                  {{ record.isActive ? 'Active' : 'Inactive' }}
                </a-tag>
              </template>
            </a-table-column>
            <a-table-column title="Actions" key="actions" align="right">
              <template #default="{ record }">
                <div class="flex justify-end gap-2">
                  <a-button size="small" @click="openVariantModal(record)">Edit</a-button>
                  <a-popconfirm title="Delete this variant?" @confirm="removeVariant(record.id)">
                    <a-button size="small" danger>Delete</a-button>
                  </a-popconfirm>
                </div>
              </template>
            </a-table-column>
          </a-table>
        </section>

        <section class="rounded-[24px] border border-navy-500/50 bg-navy-700/50 p-5">
          <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 class="text-lg font-semibold text-slate-100">Addons</h3>
              <p class="text-sm text-slate-400">Create addon definitions, then link the ones this item can use.</p>
            </div>
            <div class="flex gap-2">
              <a-button @click="openAddonModal()">Add addon</a-button>
              <a-button type="primary" class="!bg-brand-500 !shadow-none hover:!bg-brand-600" @click="saveAddonLinks">
                Save linked addons
              </a-button>
            </div>
          </div>

          <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            <a-table :data-source="menuStore.addons" :pagination="false" row-key="id" size="small">
              <a-table-column title="Link" key="link">
                <template #default="{ record }">
                  <a-checkbox
                    :checked="selectedAddonLinkIds.includes(record.id)"
                    @change="updateAddonLink(record.id, $event.target.checked)"
                  />
                </template>
              </a-table-column>
              <a-table-column title="Addon" data-index="name" key="name" />
              <a-table-column title="Price" key="price">
                <template #default="{ record }">
                  {{ formatCurrency(record.price, record.currency) }}
                </template>
              </a-table-column>
              <a-table-column title="Actions" key="actions" align="right">
                <template #default="{ record }">
                  <div class="flex justify-end gap-2">
                    <a-button size="small" @click="openAddonModal(record)">Edit</a-button>
                    <a-popconfirm title="Delete this addon?" @confirm="removeAddon(record.id)">
                      <a-button size="small" danger>Delete</a-button>
                    </a-popconfirm>
                  </div>
                </template>
              </a-table-column>
            </a-table>

            <div class="rounded-[20px] border border-dashed border-navy-500/50 bg-navy-800/50 p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.35em] text-brand-400">Linked now</p>
              <ul class="mt-3 space-y-2 text-sm text-slate-300">
                <li v-for="addon in linkedAddonObjects" :key="addon.id" class="flex items-center justify-between rounded-xl bg-navy-600 px-3 py-2">
                  <span>{{ addon.name }}</span>
                  <span>{{ formatCurrency(addon.price, addon.currency) }}</span>
                </li>
              </ul>
              <p v-if="!linkedAddonObjects.length" class="mt-3 text-sm text-slate-500">
                No addons linked yet.
              </p>
            </div>
          </div>
        </section>
      </div>
    </a-drawer>

    <a-modal
      :open="isVariantModalOpen"
      :title="editingVariant ? 'Edit variant' : 'Create variant'"
      ok-text="Save"
      @cancel="closeVariantModal"
      @ok="submitVariant"
    >
      <a-form layout="vertical" :model="variantFormState">
        <a-form-item label="Variant name">
          <a-input v-model:value="variantFormState.name" />
        </a-form-item>
        <a-form-item label="Price delta">
          <a-input-number v-model:value="variantFormState.priceDeltaCents" class="w-full" />
        </a-form-item>
        <a-form-item label="Sort order">
          <a-input-number v-model:value="variantFormState.sortOrder" class="w-full" :min="0" />
        </a-form-item>
        <a-form-item>
          <a-checkbox v-model:checked="variantFormState.isActive">Active</a-checkbox>
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      :open="isAddonModalOpen"
      :title="editingAddon ? 'Edit addon' : 'Create addon'"
      ok-text="Save"
      @cancel="closeAddonModal"
      @ok="submitAddon"
    >
      <a-form layout="vertical" :model="addonFormState">
        <a-form-item label="Addon name">
          <a-input v-model:value="addonFormState.name" />
        </a-form-item>
        <a-form-item label="Price">
          <a-input-number v-model:value="addonFormState.price" class="w-full" :min="0" />
        </a-form-item>
        <a-form-item label="Currency">
          <a-input v-model:value="addonFormState.currency" />
        </a-form-item>
        <a-form-item label="Sort order">
          <a-input-number v-model:value="addonFormState.sortOrder" class="w-full" :min="0" />
        </a-form-item>
        <a-form-item>
          <a-checkbox v-model:checked="addonFormState.isActive">Active</a-checkbox>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { notification } from 'ant-design-vue'

import MenuForm from '@/components/forms/MenuForm.vue'
import AppPageHeader from '@/components/common/AppPageHeader.vue'
import AppLoading from '@/components/ui/AppLoading.vue'
import { buildAssetUrl } from '@/services/api'
import { useMenuStore } from '@/store/menu'
import { formatCurrency } from '@/utils/currency'

const menuStore = useMenuStore()

const isMenuModalOpen = ref(false)
const editingMenu = ref(null)
const isOptionsDrawerOpen = ref(false)
const selectedMenuForOptions = ref(null)
const isVariantModalOpen = ref(false)
const editingVariant = ref(null)
const isAddonModalOpen = ref(false)
const editingAddon = ref(null)
const selectedAddonLinkIds = ref([])
const menuImage = ref({ file: null, url: '' })
const menuExistingImageUrl = ref('')
const menuFormKey = ref(0)
const menuSubmitError = ref('')

const menuFormState = reactive({
  categoryId: undefined,
  name: '',
  img: '',
  description: '',
  price: 0,
  currency: 'LAK',
  isAvailable: true,
  spicyLevel: 0,
  isVeg: false,
  sortOrder: 0,
})

const variantFormState = reactive({
  name: '',
  priceDeltaCents: 0,
  isActive: true,
  sortOrder: 0,
})

const addonFormState = reactive({
  name: '',
  price: 0,
  currency: 'LAK',
  isActive: true,
  sortOrder: 0,
})

const currentVariants = computed(() => {
  const menuId = selectedMenuForOptions.value?.id
  return menuId ? menuStore.variantsByMenuId[menuId] || [] : []
})

const linkedAddonObjects = computed(() =>
  menuStore.addons.filter((addon) => selectedAddonLinkIds.value.includes(addon.id))
)
function categoryName(categoryId) {
  return menuStore.categories.find((category) => category.id === categoryId)?.name || '—'
}

function resetMenuForm() {
  menuSubmitError.value = ''
  menuExistingImageUrl.value = ''
  menuImage.value = { file: null, url: '' }
  menuFormKey.value++
  Object.assign(menuFormState, {
    categoryId: undefined,
    name: '',
    description: '',
    price: 0,
    currency: 'LAK',
    isAvailable: true,
    spicyLevel: 0,
    isVeg: false,
    sortOrder: 0,
  })
}

function resetVariantForm() {
  Object.assign(variantFormState, {
    name: '',
    priceDeltaCents: 0,
    isActive: true,
    sortOrder: 0,
  })
}

function resetAddonForm() {
  Object.assign(addonFormState, {
    name: '',
    price: 0,
    currency: 'LAK',
    isActive: true,
    sortOrder: 0,
  })
}

function openCreateModal() {
  editingMenu.value = null
  resetMenuForm()
  isMenuModalOpen.value = true
}

async function openEditModal(id) {
  menuSubmitError.value = ''
  menuExistingImageUrl.value = ''
  menuImage.value = { file: null, url: '' }
  menuFormKey.value++

  try {
    const item = await menuStore.fetchMenuItem(id)
    editingMenu.value = item
    menuExistingImageUrl.value = buildAssetUrl(item.img || '')
    Object.assign(menuFormState, {
      categoryId: item.category?.id || item.categoryId,
      name: item.name,
      description: item.description || '',
      price: item.price || 0,
      currency: item.currency || 'LAK',
      isAvailable: item.isAvailable ?? true,
      spicyLevel: item.spicyLevel || 0,
      isVeg: item.isVeg ?? false,
      sortOrder: item.sortOrder || 0,
    })
    isMenuModalOpen.value = true
  } catch (error) {
    menuSubmitError.value = error.message
    notification.error({ message: error.message })
  }
}

function closeMenuModal() {
  menuSubmitError.value = ''
  isMenuModalOpen.value = false
}

async function submitMenuItem() {
  menuSubmitError.value = ''

  if (!menuFormState.categoryId || !menuFormState.name || menuFormState.price === null || menuFormState.price === undefined) {
    menuSubmitError.value = 'Category, name, and price are required.'
    return
  }

  try {
    const payload = { ...menuFormState }
    if (menuImage.value.file) {
      payload.file = menuImage.value.file
    } else if (menuImage.value.url) {
      payload.imageUrl = menuImage.value.url
    }
    await menuStore.saveMenuItem(payload, editingMenu.value?.id)
    notification.success({ message: 'Menu item saved' })
    closeMenuModal()
  } catch (error) {
    menuSubmitError.value = error.message
    notification.error({ message: error.message })
  }
}

async function removeMenuItem(id) {
  try {
    await menuStore.deleteMenuItem(id)
    notification.success({ message: 'Menu item deleted' })
  } catch (error) {
    notification.error({ message: error.message })
  }
}

async function openOptionsDrawer(menuItem) {
  selectedMenuForOptions.value = menuItem
  isOptionsDrawerOpen.value = true

  try {
    await Promise.all([
      menuStore.fetchVariants(menuItem.id),
      menuStore.fetchAddons(),
      menuStore.fetchLinkedAddons(menuItem.id),
    ])
    selectedAddonLinkIds.value = [...(menuStore.linkedAddonsByMenuId[menuItem.id] || [])]
  } catch (error) {
    notification.error({ message: error.message })
  }
}

function closeOptionsDrawer() {
  isOptionsDrawerOpen.value = false
  selectedMenuForOptions.value = null
  selectedAddonLinkIds.value = []
}

function openVariantModal(variant = null) {
  editingVariant.value = variant
  resetVariantForm()
  if (variant) {
    Object.assign(variantFormState, {
      name: variant.name,
      priceDeltaCents: variant.priceDeltaCents,
      isActive: variant.isActive ?? true,
      sortOrder: variant.sortOrder || 0,
    })
  }
  isVariantModalOpen.value = true
}

function closeVariantModal() {
  isVariantModalOpen.value = false
}

async function submitVariant() {
  try {
    await menuStore.saveVariant(
      { ...variantFormState, menuId: selectedMenuForOptions.value.id },
      editingVariant.value?.id
    )
    notification.success({ message: 'Variant saved' })
    closeVariantModal()
  } catch (error) {
    notification.error({ message: error.message })
  }
}

async function removeVariant(id) {
  try {
    await menuStore.deleteVariant(id, selectedMenuForOptions.value.id)
    notification.success({ message: 'Variant deleted' })
  } catch (error) {
    notification.error({ message: error.message })
  }
}

function openAddonModal(addon = null) {
  editingAddon.value = addon
  resetAddonForm()
  if (addon) {
    Object.assign(addonFormState, {
      name: addon.name,
      price: addon.price,
      currency: addon.currency || 'LAK',
      isActive: addon.isActive ?? true,
      sortOrder: addon.sortOrder || 0,
    })
  }
  isAddonModalOpen.value = true
}

function closeAddonModal() {
  isAddonModalOpen.value = false
}

async function submitAddon() {
  try {
    await menuStore.saveAddon({ ...addonFormState }, editingAddon.value?.id)
    if (selectedMenuForOptions.value) {
      await menuStore.fetchLinkedAddons(selectedMenuForOptions.value.id)
    }
    notification.success({ message: 'Addon saved' })
    closeAddonModal()
  } catch (error) {
    notification.error({ message: error.message })
  }
}

async function removeAddon(id) {
  try {
    await menuStore.deleteAddon(id, selectedMenuForOptions.value?.id)
    selectedAddonLinkIds.value = selectedAddonLinkIds.value.filter((addonId) => addonId !== id)
    notification.success({ message: 'Addon deleted' })
  } catch (error) {
    notification.error({ message: error.message })
  }
}

function updateAddonLink(addonId, checked) {
  const next = new Set(selectedAddonLinkIds.value)
  if (checked) {
    next.add(addonId)
  } else {
    next.delete(addonId)
  }
  selectedAddonLinkIds.value = [...next]
}

async function saveAddonLinks() {
  try {
    await menuStore.syncMenuAddons(selectedMenuForOptions.value.id, selectedAddonLinkIds.value)
    notification.success({ message: 'Addon links updated' })
  } catch (error) {
    notification.error({ message: error.message })
  }
}

onMounted(async () => {
  await Promise.all([menuStore.fetchCategories(), menuStore.fetchMenuItems()])
})
</script>
