const { contextBridge, ipcRenderer } = require('electron');

/**
 * Preload Script - Expo

e APIs seguras para o React
 * InterativeLeads Desktop
 */

// Expor API segura para o renderer (React)
contextBridge.exposeInMainWorld('electronAPI', {
  // ==================== TENANTS ====================
  getTenant: (tenantId) => ipcRenderer.invoke('tenant:get', tenantId),
  saveTenant: (config) => ipcRenderer.invoke('tenant:save', config),
  listTenants: () => ipcRenderer.invoke('tenant:list'),
  deleteTenant: (tenantId) => ipcRenderer.invoke('tenant:delete', tenantId),

  // ==================== LEADS ====================
  saveLead: (leadData) => ipcRenderer.invoke('lead:save', leadData),
  getLeads: (tenantId, limit = 1000) => ipcRenderer.invoke('lead:list', tenantId, limit),
  getLeadsCount: (tenantId) => ipcRenderer.invoke('lead:count', tenantId),

  // ==================== PRÊMIOS ====================
  updatePrizeInventory: (data) => ipcRenderer.invoke('prize:update-inventory', data),
  getPrizeInventory: (tenantId, gameType) => ipcRenderer.invoke('prize:get-inventory', tenantId, gameType),
  decrementPrize: (tenantId, prizeId) => ipcRenderer.invoke('prize:decrement', tenantId, prizeId),

  // ==================== ESTATÍSTICAS ====================
  getStats: (tenantId) => ipcRenderer.invoke('stats:get', tenantId),

  // ==================== BACKUP & EXPORT ====================
  exportData: () => ipcRenderer.invoke('data:export'),
  backupDatabase: (backupPath) => ipcRenderer.invoke('database:backup', backupPath),
  optimizeDatabase: () => ipcRenderer.invoke('database:optimize'),

  // ==================== CONFIGURAÇÕES ====================
  getSetting: (key) => ipcRenderer.invoke('settings:get', key),
  setSetting: (key, value) => ipcRenderer.invoke('settings:set', key, value),

  // ==================== APP INFO ====================
  getAppVersion: () => ipcRenderer.invoke('app:version'),
  getUserDataPath: () => ipcRenderer.invoke('app:user-data-path'),

  // ==================== EVENTOS ====================
  onAppReady: (callback) => {
    ipcRenderer.on('app-ready', (_event, data) => callback(data));
  }
});

// Log de inicialização
console.log('🔒 Preload script carregado - APIs expostas com segurança');

// Detector de ambiente
contextBridge.exposeInMainWorld('env', {
  isElectron: true,
  platform: process.platform,
  nodeVersion: process.versions.node,
  chromeVersion: process.versions.chrome,
  electronVersion: process.versions.electron
});

console.log(`
🖥️ Ambiente:
   - Platform: ${process.platform}
   - Electron: ${process.versions.electron}
   - Chrome: ${process.versions.chrome}
   - Node: ${process.versions.node}
`);

