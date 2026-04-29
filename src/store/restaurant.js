import { ref } from 'vue'
import { defineStore } from 'pinia'

import { restaurantsApi } from '@/services/api'

export const useRestaurantStore = defineStore('restaurant', () => {
  const restaurants = ref([])
  const restaurantsTotal = ref(0)
  const currentRestaurant = ref(null)
  const loadingStates = ref({})

  function setLoading(key, value) {
    loadingStates.value = { ...loadingStates.value, [key]: value }
  }

  function isLoading(key) {
    return Boolean(loadingStates.value[key])
  }

  async function fetchRestaurants(params = {}) {
    setLoading('restaurants', true)
    try {
      const response = await restaurantsApi.list(params)
      restaurants.value = response.items
      restaurantsTotal.value = response.total
      return response
    } finally {
      setLoading('restaurants', false)
    }
  }

  async function fetchRestaurant(id) {
    setLoading('restaurant', true)
    try {
      const response = await restaurantsApi.info(id)
      currentRestaurant.value = response
      return response
    } finally {
      setLoading('restaurant', false)
    }
  }

  async function saveRestaurant(payload, id) {
    if (id) {
      await restaurantsApi.update(id, payload)
    } else {
      await restaurantsApi.create(payload)
    }

    return fetchRestaurants()
  }

  async function deleteRestaurant(id) {
    await restaurantsApi.remove(id)
    return fetchRestaurants()
  }

  return {
    restaurants,
    restaurantsTotal,
    currentRestaurant,
    isLoading,
    fetchRestaurants,
    fetchRestaurant,
    saveRestaurant,
    deleteRestaurant,
  }
})
