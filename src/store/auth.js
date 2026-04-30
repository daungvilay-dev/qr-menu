import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { authApi } from '@/services/api'
import { clearStoredAuth, readStoredAuth, writeStoredAuth } from '@/utils/storage'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref('')
  const refreshToken = ref('')
  const user = ref(null)
  const loading = ref(false)
  const initialized = ref(false)

  const tokenPayload = computed(() => {
    if (!accessToken.value) return null

    try {
      const [, payload] = accessToken.value.split('.')
      if (!payload) return null

      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
      const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')
      return JSON.parse(window.atob(padded))
    } catch {
      return null
    }
  })
  const isAuthenticated = computed(() => Boolean(accessToken.value))
  const roleValues = computed(() => {
    return Array.isArray(tokenPayload.value?.roles) ? tokenPayload.value.roles : []
  })
  const userId = computed(() => tokenPayload.value?.uid ?? null)
  const isSuperAdmin = computed(() => roleValues.value.includes('super_admin'))
  const isRestaurantOwner = computed(() => roleValues.value.includes('restaurant_owner'))

  function hydrate() {
    if (initialized.value) return

    const stored = readStoredAuth()
    if (stored) {
      accessToken.value = stored.accessToken || ''
      refreshToken.value = stored.refreshToken || ''
      user.value = stored.user || null
    }

    initialized.value = true
  }

  function persist() {
    writeStoredAuth({
      accessToken: accessToken.value,
      refreshToken: refreshToken.value,
      user: user.value,
    })
  }

  async function login(credentials) {
    loading.value = true

    try {
      const response = await authApi.login(credentials)
      accessToken.value = response?.accessToken || ''
      refreshToken.value = response?.refreshToken || ''
      user.value = response?.user || null
      persist()
      return response
    } catch (error) {
      accessToken.value = ''
      refreshToken.value = ''
      user.value = null
      clearStoredAuth()
      throw error
    } finally {
      loading.value = false
    }
  }

  async function registerRestaurantOwner(payload) {
    loading.value = true

    try {
      const userResult = await authApi.registerUser({
        username: payload.username,
        password: payload.password,
        lang: payload.lang,
      })

      return authApi.registerRestaurant({
        userId: userResult.userId,
        name: payload.restaurantName,
        slug: payload.restaurantSlug,
        contactEmail: payload.contactEmail,
        phone: payload.phone,
        logoUrl: payload.logoUrl,
      })
    } finally {
      loading.value = false
    }
  }

  function logout() {
    accessToken.value = ''
    refreshToken.value = ''
    user.value = null
    clearStoredAuth()
  }

  hydrate()

  return {
    accessToken,
    refreshToken,
    user,
    loading,
    initialized,
    isAuthenticated,
    userId,
    roleValues,
    isSuperAdmin,
    isRestaurantOwner,
    hydrate,
    login,
    logout,
    registerRestaurantOwner,
  }
})
