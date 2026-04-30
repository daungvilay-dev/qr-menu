export function createObjectPreviewUrl(file) {
  if (!file) return ''
  return URL.createObjectURL(file)
}

export function revokeObjectPreviewUrl(url) {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}
