import { ref } from 'vue'
import { defineStore } from 'pinia'

import { rolesApi, usersApi } from '@/services/api'

export const useSystemStore = defineStore('system', () => {
  const roles = ref([])
  const rolesTotal = ref(0)
  const users = ref([])
  const usersTotal = ref(0)
  const loadingStates = ref({})

  function setLoading(key, value) {
    loadingStates.value = { ...loadingStates.value, [key]: value }
  }

  function isLoading(key) {
    return Boolean(loadingStates.value[key])
  }

  async function fetchRoles(params = {}) {
    setLoading('roles', true)
    try {
      const response = await rolesApi.list(params)
      roles.value = response.items
      rolesTotal.value = response.total
      return response
    } finally {
      setLoading('roles', false)
    }
  }

  async function saveRole(payload, id) {
    if (id) {
      await rolesApi.update(id, payload)
    } else {
      await rolesApi.create(payload)
    }

    return fetchRoles()
  }

  async function deleteRole(id) {
    await rolesApi.remove(id)
    return fetchRoles()
  }

  async function fetchUsers(params = {}) {
    setLoading('users', true)
    try {
      const response = await usersApi.list(params)
      users.value = response.items
      usersTotal.value = response.total
      return response
    } finally {
      setLoading('users', false)
    }
  }

  async function saveUser(payload, id) {
    if (id) {
      await usersApi.update(id, payload)
    } else {
      await usersApi.create(payload)
    }

    return fetchUsers()
  }

  async function deleteUser(id) {
    await usersApi.remove(id)
    return fetchUsers()
  }

  async function changeUserPassword(id, password) {
    await usersApi.changePassword(id, { id, password })
  }

  return {
    roles,
    rolesTotal,
    users,
    usersTotal,
    isLoading,
    fetchRoles,
    saveRole,
    deleteRole,
    fetchUsers,
    saveUser,
    deleteUser,
    changeUserPassword,
  }
})
