import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import {
  addonsApi,
  branchesApi,
  categoriesApi,
  itemAddonsApi,
  menusApi,
  publicMenuApi,
  qrCodesApi,
  variantsApi,
} from '@/services/api'

export const useMenuStore = defineStore('menu', () => {
  const categories = ref([])
  const categoriesTotal = ref(0)
  const branches = ref([])
  const branchesTotal = ref(0)
  const menuItems = ref([])
  const menuItemsTotal = ref(0)
  const qrCodes = ref([])
  const qrCodesTotal = ref(0)
  const variantsByMenuId = ref({})
  const addons = ref([])
  const linkedAddonsByMenuId = ref({})
  const loadingStates = ref({})
  const publicMenu = ref(null)
  const publicLoading = ref(false)
  const publicError = ref('')
  const selectedItem = ref(null)
  const selectedVariantId = ref(null)
  const selectedAddonIds = ref([])

  function setLoading(key, value) {
    loadingStates.value = { ...loadingStates.value, [key]: value }
  }

  function isLoading(key) {
    return Boolean(loadingStates.value[key])
  }

  async function fetchCategories(params = {}) {
    setLoading('categories', true)
    try {
      const response = await categoriesApi.list(params)
      categories.value = response.items
      categoriesTotal.value = response.total
      return response
    } finally {
      setLoading('categories', false)
    }
  }

  async function saveCategory(payload, id) {
    if (id) {
      await categoriesApi.update(id, payload)
    } else {
      await categoriesApi.create(payload)
    }

    return fetchCategories()
  }

  async function deleteCategory(id) {
    await categoriesApi.remove(id)
    return fetchCategories()
  }

  async function fetchBranches(params = {}) {
    setLoading('branches', true)
    try {
      const response = await branchesApi.list(params)
      branches.value = response.items
      branchesTotal.value = response.total
      return response
    } finally {
      setLoading('branches', false)
    }
  }

  async function saveBranch(payload, id) {
    if (id) {
      await branchesApi.update(id, payload)
    } else {
      await branchesApi.create(payload)
    }

    return fetchBranches()
  }

  async function deleteBranch(id) {
    await branchesApi.remove(id)
    return fetchBranches()
  }

  async function fetchMenuItems(params = {}) {
    setLoading('menus', true)
    try {
      const response = await menusApi.list(params)
      menuItems.value = response.items
      menuItemsTotal.value = response.total
      return response
    } finally {
      setLoading('menus', false)
    }
  }

  async function saveMenuItem(payload, id) {
    if (id) {
      await menusApi.update(id, payload)
    } else {
      await menusApi.create(payload)
    }

    return fetchMenuItems()
  }

  async function deleteMenuItem(id) {
    await menusApi.remove(id)
    return fetchMenuItems()
  }

  async function fetchVariants(menuId) {
    const response = await variantsApi.list({ menuId })
    variantsByMenuId.value = { ...variantsByMenuId.value, [menuId]: response.items }
    return response.items
  }

  async function saveVariant(payload, id) {
    if (id) {
      await variantsApi.update(id, payload)
    } else {
      await variantsApi.create(payload)
    }

    return fetchVariants(payload.menuId)
  }

  async function deleteVariant(id, menuId) {
    await variantsApi.remove(id)
    return fetchVariants(menuId)
  }

  async function fetchAddons(params = {}) {
    const response = await addonsApi.list(params)
    if (!params.menuId) {
      addons.value = response.items
    }
    return response.items
  }

  async function saveAddon(payload, id) {
    if (id) {
      await addonsApi.update(id, payload)
    } else {
      await addonsApi.create(payload)
    }

    await fetchAddons()
  }

  async function deleteAddon(id, menuId) {
    await addonsApi.remove(id)
    await fetchAddons()

    if (menuId) {
      await fetchLinkedAddons(menuId)
    }
  }

  async function fetchLinkedAddons(menuId) {
    const response = await itemAddonsApi.list({ menuId })
    const items = response.items || []
    linkedAddonsByMenuId.value = {
      ...linkedAddonsByMenuId.value,
      [menuId]: items.map((item) => item.addonId ?? item.addon?.id).filter(Boolean),
    }
    return items
  }

  async function syncMenuAddons(menuId, nextAddonIds) {
    const current = linkedAddonsByMenuId.value[menuId] || []
    const toCreate = nextAddonIds.filter((id) => !current.includes(id))
    const toDelete = current.filter((id) => !nextAddonIds.includes(id))

    await Promise.all(toCreate.map((addonId) => itemAddonsApi.create({ menuId, addonId })))
    await Promise.all(toDelete.map((addonId) => itemAddonsApi.remove(menuId, addonId)))

    linkedAddonsByMenuId.value = {
      ...linkedAddonsByMenuId.value,
      [menuId]: [...nextAddonIds],
    }
  }

  async function fetchQrCodes() {
    setLoading('qrcodes', true)
    try {
      const response = await qrCodesApi.list()
      qrCodes.value = response.items
      qrCodesTotal.value = response.total
      return response
    } finally {
      setLoading('qrcodes', false)
    }
  }

  async function createQrCode(payload) {
    await qrCodesApi.create(payload)
    return fetchQrCodes()
  }

  async function updateQrCode(id, payload) {
    await qrCodesApi.update(id, payload)
    return fetchQrCodes()
  }

  async function deleteQrCode(id) {
    await qrCodesApi.remove(id)
    return fetchQrCodes()
  }

  async function fetchPublicMenu(uuid) {
    publicLoading.value = true
    publicError.value = ''

    try {
      publicMenu.value = await publicMenuApi.scan(uuid)
      return publicMenu.value
    } catch (error) {
      publicMenu.value = null
      publicError.value = error.message
      throw error
    } finally {
      publicLoading.value = false
    }
  }

  function openItem(item) {
    selectedItem.value = item
    const activeVariants = item?.variants?.filter((variant) => variant.isActive !== false) || []
    selectedVariantId.value = activeVariants[0]?.id ?? null
    selectedAddonIds.value = []
  }

  function closeItem() {
    selectedItem.value = null
    selectedVariantId.value = null
    selectedAddonIds.value = []
  }

  function selectVariant(variantId) {
    selectedVariantId.value = variantId
  }

  function toggleAddon(addonId, checked) {
    const current = new Set(selectedAddonIds.value)

    if (checked) {
      current.add(addonId)
    } else {
      current.delete(addonId)
    }

    selectedAddonIds.value = [...current]
  }

  const selectedVariant = computed(() => {
    if (!selectedItem.value) return null
    return selectedItem.value.variants?.find((variant) => variant.id === selectedVariantId.value) || null
  })

  const selectedAddons = computed(() => {
    if (!selectedItem.value) return []
    return selectedItem.value.addons?.filter((addon) => selectedAddonIds.value.includes(addon.id)) || []
  })

  const publicCategories = computed(() => publicMenu.value?.items?.categories || [])

  const currentTotal = computed(() => {
    const basePrice = Number(selectedItem.value?.price || 0)
    const variantDelta = Number(selectedVariant.value?.priceDeltaCents || 0)
    const addonTotal = selectedAddons.value.reduce((sum, addon) => sum + Number(addon.price || 0), 0)
    return basePrice + variantDelta + addonTotal
  })

  return {
    categories,
    categoriesTotal,
    branches,
    branchesTotal,
    menuItems,
    menuItemsTotal,
    qrCodes,
    qrCodesTotal,
    variantsByMenuId,
    addons,
    linkedAddonsByMenuId,
    loadingStates,
    publicMenu,
    publicLoading,
    publicError,
    selectedItem,
    selectedVariantId,
    selectedAddonIds,
    selectedVariant,
    selectedAddons,
    publicCategories,
    currentTotal,
    isLoading,
    fetchCategories,
    fetchBranches,
    saveBranch,
    deleteBranch,
    saveCategory,
    deleteCategory,
    fetchMenuItems,
    saveMenuItem,
    deleteMenuItem,
    fetchVariants,
    saveVariant,
    deleteVariant,
    fetchAddons,
    saveAddon,
    deleteAddon,
    fetchLinkedAddons,
    syncMenuAddons,
    fetchQrCodes,
    createQrCode,
    updateQrCode,
    deleteQrCode,
    fetchPublicMenu,
    openItem,
    closeItem,
    selectVariant,
    toggleAddon,
  }
})
