export const STORAGE_KEYS = {
  auth: 'qr-menu-auth',
}

export function readStoredAuth() {
  try {
    const value = window.localStorage.getItem(STORAGE_KEYS.auth)
    return value ? JSON.parse(value) : null
  } catch {
    return null
  }
}

export function writeStoredAuth(payload) {
  window.localStorage.setItem(STORAGE_KEYS.auth, JSON.stringify(payload))
}

export function clearStoredAuth() {
  window.localStorage.removeItem(STORAGE_KEYS.auth)
}
