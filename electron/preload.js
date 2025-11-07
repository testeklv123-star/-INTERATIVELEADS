// electron/preload.js
const { contextBridge, ipcRenderer } = require('electron');

console.log('🔧 [Preload] Preload script carregado');

// Expõe informações do ambiente
contextBridge.exposeInMainWorld('env', {
  isElectron: true,
  platform: process.platform,
  nodeVersion: process.versions.node,
  chromeVersion: process.versions.chrome,
  electronVersion: process.versions.electron,
});

// Expõe uma API segura para o processo de renderização (o seu app React)
contextBridge.exposeInMainWorld('electronAPI', {
  // Método genérico para invocar qualquer handler IPC
  invoke: (channel, ...args) => {
    console.log(`📡 [Preload] IPC invoke: ${channel}`, args.length > 0 ? args : '');
    return ipcRenderer.invoke(channel, ...args);
  },

  // Métodos específicos para melhor type safety e autocomplete
  isFirstRun: () => ipcRenderer.invoke('is-first-run'),
  
  // Tenants
  getTenant: (tenantId) => ipcRenderer.invoke('get-tenant', tenantId),
  saveTenant: (config) => ipcRenderer.invoke('save-tenant', config),
  listTenants: () => ipcRenderer.invoke('get-all-tenants'),
  deleteTenant: (tenantId) => ipcRenderer.invoke('delete-tenant', tenantId),
  
  // Settings
  getSetting: (key) => ipcRenderer.invoke('get-setting', key),
  setSetting: (key, value) => ipcRenderer.invoke('set-setting', key, value),
  deleteSetting: (key) => ipcRenderer.invoke('delete-setting', key),
  
  // Admin
  adminLogin: (tenant_id, password) => ipcRenderer.invoke('admin-login', { tenant_id, password }),
  
  // Eventos
  onAppReady: (callback) => ipcRenderer.on('app-ready', callback),
});

console.log('✅ [Preload] API do Electron exposta com sucesso');