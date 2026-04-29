import axios from 'axios'

import { readStoredAuth } from '@/utils/storage'
import { getErrorMessage, normalizeCollection, unwrapResponse } from '@/utils/http'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
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
    return getCollection('/menu-categories', { params })
  },
  create(payload) {
    return postResource('/menu-categories', payload)
  },
  update(id, payload) {
    return putResource(`/menu-categories/${id}`, payload)
  },
  remove(id) {
    return deleteResource(`/menu-categories/${id}`)
  },
}

export const menusApi = {
  list(params) {
    return getCollection('/menus', { params })
  },
  create(payload) {
    return postResource('/menus', payload)
  },
  update(id, payload) {
    return putResource(`/menus/${id}`, payload)
  },
  remove(id) {
    return deleteResource(`/menus/${id}`)
  },
}

export const variantsApi = {
  list(params) {
    return getCollection('/variants', { params })
  },
  create(payload) {
    return postResource('/variants', payload)
  },
  update(id, payload) {
    return putResource(`/variants/${id}`, payload)
  },
  remove(id) {
    return deleteResource(`/variants/${id}`)
  },
}

export const addonsApi = {
  list(params) {
    return getCollection('/addons', { params })
  },
  create(payload) {
    return postResource('/addons', payload)
  },
  update(id, payload) {
    return putResource(`/addons/${id}`, payload)
  },
  remove(id) {
    return deleteResource(`/addons/${id}`)
  },
}

export const itemAddonsApi = {
  create(payload) {
    return postResource('/item-addons', payload)
  },
  remove(menuId, addonId) {
    return deleteResource(`/item-addons/${menuId}/${addonId}`)
  },
}

export const qrCodesApi = {
  list(params) {
    return getCollection('/qrcodes', { params })
  },
  create(payload) {
    return postResource('/qrcodes', payload)
  },
}

export const publicMenuApi = {
  scan(uuid) {
    return getResource(`/qrcodes/scan/${uuid}`)
  },
}

export default api
