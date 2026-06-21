const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // API key management — stored securely via electron-store in main process
  getApiKey: () => ipcRenderer.invoke('get-api-key'),
  setApiKey: (key) => ipcRenderer.invoke('set-api-key', key),

  // Renderer can ask main process for the backend URL (allows dynamic port later)
  getBackendUrl: () => ipcRenderer.invoke('get-backend-url'),

  // Lets React code detect it's running inside Electron vs a browser
  isElectron: true
})
