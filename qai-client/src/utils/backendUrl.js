export function getBackendUrl() {
  if (window.electronAPI?.getBackendUrl) {
    return window.electronAPI.getBackendUrl()
  }
  return Promise.resolve(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000')
}
