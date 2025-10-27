import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TenantConfig, Theme, GamesConfig } from '../types';
import { fetchTenantConfig } from '../services/tenantService';
import { applyTheme } from '../utils/themeApplier';
import electronService from '../services/electronService';

interface TenantState {
  tenantConfig: TenantConfig | null;
  isConfigured: boolean;
  isLoading: boolean;
  error: string | null;
  _hasHydrated: boolean; // Flag to check if rehydration is complete
  setHasHydrated: (hydrated: boolean) => void; // Action to set the flag
  loadTenant: (tenantId: string) => Promise<void>;
  clearTenant: () => void;
  setTheme: (theme: Theme) => Promise<void>;
  setGamesConfig: (gamesConfig: GamesConfig) => Promise<void>;
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set, get) => ({
      tenantConfig: null,
      isConfigured: false,
      isLoading: false,
      error: null,
      _hasHydrated: false,
      setHasHydrated: (hydrated) => set({ _hasHydrated: hydrated }),
      loadTenant: async (tenantId: string) => {
        console.log('🏪 [Store] Iniciando loadTenant...');
        set({ isLoading: true, error: null });
        try {
          console.log('🏪 [Store] Buscando config...');
          
          let config: TenantConfig;
          
          // Tentar carregar do Electron primeiro
          if (electronService.isRunningInElectron()) {
            console.log('🖥️ [Store] Buscando do Electron...');
            const result = await electronService.getTenant(tenantId);
            
            if (result.success && result.data) {
              config = result.data;
              console.log('✅ [Store] Config carregada do Electron:', config.brand_name);
            } else {
              // Se não encontrar no Electron, buscar da API/mock
              console.log('📡 [Store] Não encontrado no Electron, buscando da API...');
              config = await fetchTenantConfig(tenantId);
              
              // Salvar no banco do Electron para próxima vez
              await electronService.saveTenant(config);
              console.log('💾 [Store] Config salva no Electron');
            }
          } else {
            // Modo web - usar API/mock
            console.log('🌐 [Store] Buscando da API (modo web)...');
            config = await fetchTenantConfig(tenantId);
          }
          
          console.log('🏪 [Store] Config recebida:', config.brand_name);
          
          console.log('🏪 [Store] Atualizando estado...');
          set({ tenantConfig: config, isConfigured: true, isLoading: false });
          console.log('🏪 [Store] Estado atualizado! isConfigured:', true);
          
          console.log('🏪 [Store] Aplicando tema...');
          applyTheme(config.theme);
          console.log('✅ [Store] Tema aplicado com sucesso!');
        } catch (error) {
          console.error('❌ [Store] Erro ao carregar tenant:', error);
          const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido';
          set({ error: errorMessage, isLoading: false, tenantConfig: null, isConfigured: false });
          throw error;
        }
      },
      clearTenant: () => {
        set({ tenantConfig: null, isConfigured: false, error: null });
      },
      setTheme: async (theme: Theme) => {
        const currentConfig = get().tenantConfig;
        if (currentConfig) {
          const newConfig = { ...currentConfig, theme };
          set({ tenantConfig: newConfig });
          applyTheme(newConfig.theme);
          
          // Salvar no Electron se disponível
          if (electronService.isRunningInElectron()) {
            await electronService.saveTenant(newConfig);
            console.log('💾 [Store] Tema salvo no Electron');
          }
        }
      },
      setGamesConfig: async (gamesConfig: GamesConfig) => {
        const currentConfig = get().tenantConfig;
        if (currentConfig) {
          const newConfig = { ...currentConfig, games_config: gamesConfig };
          set({ tenantConfig: newConfig });
          
          // Salvar no Electron se disponível
          if (electronService.isRunningInElectron()) {
            await electronService.saveTenant(newConfig);
            console.log('💾 [Store] Config de jogos salva no Electron');
          }
        }
      },
    }),
    {
      name: 'tenant-storage',
      storage: createJSONStorage(() => localStorage),
      // This ensures the _hasHydrated flag is not persisted to storage.
      // It's a transient state that should be false on every app load.
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !key.startsWith('_'))
        ),
      // This callback runs after the state has been rehydrated.
      // Corrected signature: Directly receives the state and calls the action.
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);