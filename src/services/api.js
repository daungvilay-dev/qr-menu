import axios from 'axios'

import { readStoredAuth } from '@/utils/storage'
import { getErrorMessage, normalizeCollection, unwrapResponse } from '@/utils/http'

function resolveApiBaseUrl() {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

  if (!configuredBaseUrl) {
    return '/api'
  }

  return configuredBaseUrl.replace(/\/+$/, '')
}

const api = axios.create({
  baseURL: resolveApiBaseUrl(),
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const auth = readStoredAuth()

  if (auth?.accessToken) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${auth.accessToken}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(new Error(getErrorMessage(error)))
)

async function getCollection(url, config) {
  const response = await api.get(url, config)
  return normalizeCollection(response.data)
}

async function getResource(url, config) {
  const response = await api.get(url, config)
  return unwrapResponse(response.data)
}

async function postResource(url, data, config) {
  const response = await api.post(url, data, config)
  return unwrapResponse(response.data)
}

async function putResource(url, data, config) {
  const response = await api.put(url, data, config)
  return unwrapResponse(response.data)
}

async function deleteResource(url, config) {
  const response = await api.delete(url, config)
  return unwrapResponse(response.data)
}

export const authApi = {
  login(payload) {
    return postResource('/auth/login', payload)
  },
  registerUser(payload) {
    return postResource('/auth/register', payload)
  },
  registerRestaurant(payload) {
    return postResource('/auth/register/restaurant', payload)
  },
}

export const categoriesApi = {
  list(params) {
    return getCollection('/basic/menu-categories', { params })
  },
  create(payload) {
    return postResource('/basic/menu-categories', payload)
  },
  update(id, payload) {
    return putResource(`/basic/menu-categories/${id}`, payload)
  },
  remove(id) {
    return deleteResource(`/basic/menu-categories/${id}`)
  },
}

export const restaurantsApi = {
  list(params) {
    return getCollection('/basic/restaurants', { params })
  },
  info(id) {
    return getResource(`/basic/restaurants/${id}`)
  },
  create(payload) {
    return postResource('/basic/restaurants', payload)
  },
  update(id, payload) {
    return putResource(`/basic/restaurants/${id}`, payload)
  },
  remove(id) {
    return deleteResource(`/basic/restaurants/${id}`)
  },
}

export const branchesApi = {
  list(params) {
    return getCollection('/basic/branches', { params })
  },
  info(id) {
    return getResource(`/basic/branches/${id}`)
  },
  create(payload) {
    return postResource('/basic/branches', payload)
  },
  update(id, payload) {
    return putResource(`/basic/branches/${id}`, payload)
  },
  remove(id) {
    return deleteResource(`/basic/branches/${id}`)
  },
}

export const menusApi = {
  list(params) {
    return getCollection('/basic/menus', { params })
  },
  create(payload) {
    return postResource('/basic/menus', payload)
  },
  update(id, payload) {
    return putResource(`/basic/menus/${id}`, payload)
  },
  remove(id) {
    return deleteResource(`/basic/menus/${id}`)
  },
}

export const variantsApi = {
  list(params) {
    return getCollection('/basic/variants', { params })
  },
  create(payload) {
    return postResource('/basic/variants', payload)
  },
  update(id, payload) {
    return putResource(`/basic/variants/${id}`, payload)
  },
  remove(id) {
    return deleteResource(`/basic/variants/${id}`)
  },
}

export const addonsApi = {
  list(params) {
    return getCollection('/basic/addons', { params })
  },
  create(payload) {
    return postResource('/basic/addons', payload)
  },
  update(id, payload) {
    return putResource(`/basic/addons/${id}`, payload)
  },
  remove(id) {
    return deleteResource(`/basic/addons/${id}`)
  },
}

export const itemAddonsApi = {
  list(params) {
    return getCollection('/basic/item-addons', { params })
  },
  create(payload) {
    return postResource('/basic/item-addons', payload)
  },
  remove(menuId, addonId) {
    return deleteResource(`/basic/item-addons/${menuId}/${addonId}`)
  },
}

export const qrCodesApi = {
  list(params) {
    return getCollection('/basic/qrcodes', { params })
  },
  info(id) {
    return getResource(`/basic/qrcodes/${id}`)
  },
  create(payload) {
    return postResource('/basic/qrcodes', payload)
  },
  update(id, payload) {
    return putResource(`/basic/qrcodes/${id}`, payload)
  },
  remove(id) {
    return deleteResource(`/basic/qrcodes/${id}`)
  },
}

export const publicMenuApi = {
  scan(uuid) {
    return getResource(`/basic/qrcodes/scan/${uuid}`)
  },
}

export default api
