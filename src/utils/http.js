export function unwrapResponse(payload) {
  if (payload && typeof payload === 'object' && 'data' in payload && 'code' in payload) {
    return payload.data
  }

  return payload
}

export function normalizeCollection(payload) {
  const data = unwrapResponse(payload)

  if (Array.isArray(data)) {
    return { items: data, total: data.length }
  }

  if (data?.items && Array.isArray(data.items)) {
    const total =
      data.meta?.totalItems ??
      data.meta?.itemCount ??
      data.total ??
      data.items.length

    return { items: data.items, total, meta: data.meta ?? null }
  }

  if (data?.list && Array.isArray(data.list)) {
    return { items: data.list, total: data.total ?? data.list.length }
  }

  return { items: [], total: 0 }
}

export function getErrorMessage(error, fallback = 'Something went wrong') {
  const responseData = error?.response?.data
  const message = responseData?.message
  const errorField = responseData?.error

  if (Array.isArray(message) && message.length) {
    return message.join(', ')
  }

  if (typeof message === 'string' && message.trim()) {
    return message
  }

  if (Array.isArray(errorField) && errorField.length) {
    return errorField.join(', ')
  }

  if (typeof errorField === 'string' && errorField.trim()) {
    return errorField
  }

  if (typeof responseData === 'string' && responseData.trim()) {
    return responseData
  }

  if (typeof error?.message === 'string' && error.message.trim()) {
    return error.message
  }

  return fallback
}
