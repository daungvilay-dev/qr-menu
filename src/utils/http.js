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
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  )
}
