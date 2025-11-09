/**
 * Electron Service - Wrapper para APIs do Electron
 * Detecta se está rodando no Electron ou no navegador
 * InterativeLeads Desktop
 */

// Type definitions para a API do Electron
export interface ElectronAPI {
  // Generic invoke method for IPC calls
  invoke: (channel: string, ...args: any[]) => Promise<any>;
  
  // First run check
  isFirstRun: () => Promise<boolean>;
  
  getTenant: (tenantId: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  saveTenant: (config: any) => Promise<{ success: boolean; error?: string }>;
  listTenants: () => Promise<{ success: boolean; data?: any[]; error?: string }>;
  deleteTenant: (tenantId: string) => Promise<{ success: boolean; error?: string }>;
  
  saveLead: (leadData: any) => Promise<{ success: boolean; data?: any; error?: string }>;
  getLead: (leadId: number | string) => Promise<{ success: boolean; data?: any; error?: string }>;
  getLeads: (tenantId: string, limit?: number) => Promise<{ success: boolean; data?: any[]; error?: string }>;
  getLeadsCount: (tenantId: string) => Promise<{ success: boolean; data?: number; error?: string }>;
  updateLead: (leadId: number | string, updates: any) => Promise<{ success: boolean; error?: string }>;
  deleteLead: (leadId: number | string) => Promise<{ success: boolean; error?: string }>;
  
  updatePrizeInventory: (data: any) => Promise<{ success: boolean; error?: string }>;
  getPrizeInventory: (tenantId: string, gameType?: string) => Promise<{ success: boolean; data?: any[]; error?: string }>;
  decrementPrize: (tenantId: string, prizeId: string) => Promise<{ success: boolean; error?: string }>;
  getPrize: (prizeId: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  deletePrize: (tenantId: string, prizeId: string) => Promise<{ success: boolean; error?: string }>;
  
  // Roulette methods
  getRoulettePrizes: () => Promise<{ success: boolean; data?: any[]; error?: string }>;
  getRandomPrize: () => Promise<{ success: boolean; data?: any; error?: string }>;
  saveSpinResult: (leadId: number, prizeId: number) => Promise<{ success: boolean; data?: any; error?: string }>;
  
  getStats: (tenantId: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  
  exportData: () => Promise<{ success: boolean; data?: any; error?: string }>;
  backupDatabase: (backupPath: string) => Promise<{ success: boolean; error?: string }>;
  optimizeDatabase: () => Promise<{ success: boolean; error?: string }>;
  
  getSetting: (key: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  setSetting: (key: string, value: any) => Promise<{ success: boolean; error?: string }>;
  listSettings: () => Promise<{ success: boolean; data?: any[]; error?: string }>;
  deleteSetting: (key: string) => Promise<{ success: boolean; error?: string }>;
  
  getAppVersion: () => Promise<{ success: boolean; data?: string; error?: string }>;
  getUserDataPath: () => Promise<{ success: boolean; data?: string; error?: string }>;
  
  onAppReady: (callback: (data: any) => void) => void;
  
  // Display/Responsiveness methods
  onDisplayInfo?: (callback: (displayInfo: { width: number; height: number; scaleFactor: number }) => void) => void;
  onWindowResized?: (callback: (size: { width: number; height: number }) => void) => void;
  removeDisplayListeners?: () => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
    env?: {
      isElectron: boolean;
      platform: string;
      nodeVersion: string;
      chromeVersion: string;
      electronVersion: string;
    };
  }
}

class ElectronService {
  private isElectron: boolean;

  constructor() {
    this.isElectron = !!(window.electronAPI && window.env?.isElectron);
    
    if (this.isElectron) {
      console.log('🖥️ Rodando no Electron Desktop');
      console.log('Platform:', window.env?.platform);
      console.log('Electron:', window.env?.electronVersion);
    } else {
      console.log('🌐 Rodando no navegador (web)');
    }
  }

  // Verificar se está no Electron
  isRunningInElectron(): boolean {
    return this.isElectron;
  }

  // ==================== GENERIC IPC ====================

  /**
   * Generic method to invoke an IPC channel
   * @param channel The IPC channel name
   * @param args Arguments to pass to the IPC handler
   */
  async invoke(channel: string, ...args: any[]) {
    if (!this.isElectron) {
      throw new Error('Electron API não disponível');
    }
    if (!window.electronAPI?.invoke) {
      throw new Error('IPC invoke method not available');
    }
    return window.electronAPI.invoke(channel, ...args);
  }

  // ==================== FIRST RUN CHECK ====================

  async isFirstRun() {
    if (!this.isElectron) {
      return false;
    }
    try {
      return await this.invoke('is-first-run');
    } catch (error) {
      console.error('❌ [ElectronService] Erro ao verificar primeira execução:', error);
      return false;
    }
  }

  // ==================== TENANTS ====================

  async getTenant(tenantId: string) {
    if (!this.isElectron) {
      // Fallback para API web (implementar depois)
      throw new Error('Electron API não disponível');
    }
    return this.invoke('get-tenant', tenantId);
  }

  async saveTenant(config: any) {
    if (!this.isElectron) {
      throw new Error('Electron API não disponível');
    }
    return this.invoke('save-tenant', config);
  }

  async listTenants() {
    if (!this.isElectron) {
      throw new Error('Electron API não disponível');
    }
    return this.invoke('get-all-tenants');
  }

  async deleteTenant(tenantId: string) {
    if (!this.isElectron) {
      throw new Error('Electron API não disponível');
    }
    return window.electronAPI!.deleteTenant(tenantId);
  }

  // ==================== LEADS ====================

  async saveLead(leadData: any) {
    if (!this.isElectron) {
      throw new Error('Electron API não disponível');
    }
    return window.electronAPI!.saveLead(leadData);
  }

  async getLead(leadId: number | string) {
    if (!this.isElectron) {
      throw new Error('Electron API não disponível');
    }
    return window.electronAPI!.getLead(leadId);
  }

  async getLeads(tenantId: string, limit = 1000) {
    if (!this.isElectron) {
      throw new Error('Electron API não disponível');
    }
    return window.electronAPI!.getLeads(tenantId, limit);
  }

  async getLeadsCount(tenantId: string) {
    if (!this.isElectron) {
      throw new Error('Electron API não disponível');
    }
    return window.electronAPI!.getLeadsCount(tenantId);
  }

  async updateLead(leadId: number | string, updates: any) {
    if (!this.isElectron) {
      throw new Error('Electron API não disponível');
    }
    return window.electronAPI!.updateLead(leadId, updates);
  }

  async deleteLead(leadId: number | string) {
    if (!this.isElectron) {
      throw new Error('Electron API não disponível');
    }
    return window.electronAPI!.deleteLead(leadId);
  }

  // ==================== PRÊMIOS ====================

  async updatePrizeInventory(data: any) {
    if (!this.isElectron) {
      throw new Error('Electron API não disponível');
    }
    return window.electronAPI!.updatePrizeInventory(data);
  }

  async getPrizeInventory(tenantId: string, gameType?: string) {
    if (!this.isElectron) {
      throw new Error('Electron API não disponível');
    }
    return window.electronAPI!.getPrizeInventory(tenantId, gameType);
  }

  async decrementPrize(tenantId: string, prizeId: string) {
    if (!this.isElectron) {
      throw new Error('Electron API não disponível');
    }
    return window.electronAPI!.decrementPrize(tenantId, prizeId);
  }

  async getPrize(prizeId: string) {
    if (!this.isElectron) {
      throw new Error('Electron API não disponível');
    }
    return window.electronAPI!.getPrize(prizeId);
  }

  async deletePrize(tenantId: string, prizeId: string) {
    if (!this.isElectron) {
      throw new Error('Electron API não disponível');
    }
    return window.electronAPI!.deletePrize(tenantId, prizeId);
  }

  // ==================== ROLETA ====================

  /**
   * Busca todos os prêmios da roleta
   */
  async getRoulettePrizes() {
    if (!this.isElectron) {
      throw new Error('Electron API não disponível');
    }
    return this.invoke('get-roulette-prizes');
  }

  /**
   * Sorteia um prêmio aleatório baseado nas probabilidades
   */
  async getRandomPrize() {
    if (!this.isElectron) {
      throw new Error('Electron API não disponível');
    }
    return this.invoke('get-random-prize');
  }

  /**
   * Salva o resultado de um giro da roleta
   * @param leadId ID do lead que girou a roleta
   * @param prizeId ID do prêmio ganho
   */
  async saveSpinResult(leadId: number, prizeId: number) {
    if (!this.isElectron) {
      throw new Error('Electron API não disponível');
    }
    return this.invoke('save-spin-result', leadId, prizeId);
  }

  // ==================== ESTATÍSTICAS ====================

  async getStats(tenantId: string) {
    if (!this.isElectron) {
      throw new Error('Electron API não disponível');
    }
    return window.electronAPI!.getStats(tenantId);
  }

  // ==================== EXPORT & BACKUP ====================

  async exportData() {
    if (!this.isElectron) {
      throw new Error('Electron API não disponível');
    }
    return window.electronAPI!.exportData();
  }

  async backupDatabase(backupPath: string) {
    if (!this.isElectron) {
      throw new Error('Electron API não disponível');
    }
    return window.electronAPI!.backupDatabase(backupPath);
  }

  async optimizeDatabase() {
    if (!this.isElectron) {
      throw new Error('Electron API não disponível');
    }
    return window.electronAPI!.optimizeDatabase();
  }

  // ==================== CONFIGURAÇÕES ====================

  async getSetting(key: string) {
    if (!this.isElectron) {
      throw new Error('Electron API não disponível');
    }
    return window.electronAPI!.getSetting(key);
  }

  async setSetting(key: string, value: any) {
    if (!this.isElectron) {
      throw new Error('Electron API não disponível');
    }
    return window.electronAPI!.setSetting(key, value);
  }

  async listSettings() {
    if (!this.isElectron) {
      throw new Error('Electron API não disponível');
    }
    return window.electronAPI!.listSettings();
  }

  async deleteSetting(key: string) {
    if (!this.isElectron) {
      throw new Error('Electron API não disponível');
    }
    return window.electronAPI!.deleteSetting(key);
  }

  // ==================== APP INFO ====================

  async getAppVersion() {
    if (!this.isElectron) {
      return { success: true, data: '1.0.0 (Web)' };
    }
    return window.electronAPI!.getAppVersion();
  }

  async getUserDataPath() {
    if (!this.isElectron) {
      throw new Error('Electron API não disponível');
    }
    return window.electronAPI!.getUserDataPath();
  }

  // ==================== EVENTOS ====================

  onAppReady(callback: (data: any) => void) {
    if (this.isElectron && window.electronAPI) {
      window.electronAPI.onAppReady(callback);
    }
  }
}

// Exportar instância única
export const electronService = new ElectronService();
export default electronService;

