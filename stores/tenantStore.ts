import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TenantConfig, Theme, GamesConfig } from '../types';
import tenantService from '../services/tenantService';
import { applyTheme } from '../utils/themeApplier';

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
        set({ isLoading: true, error: null });
        try {
          const config = await tenantService.loadTenantConfig(tenantId);
          set({ tenantConfig: config, isConfigured: true, isLoading: false });
          applyTheme(config.theme);
          await tenantService.persistActiveTenantId(tenantId);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido';
          set({ error: errorMessage, isLoading: false, tenantConfig: null, isConfigured: false });
          throw error;
        }
      },
      clearTenant: () => {
        set({ tenantConfig: null, isConfigured: false, error: null });
        tenantService.clearActiveTenantId().catch((error) => {
          console.warn('⚠️ [Store] Falha ao limpar tenant ativo:', error);
        });
      },
      setTheme: async (theme: Theme) => {
        const currentConfig = get().tenantConfig;
        if (currentConfig) {
          const newConfig = { ...currentConfig, theme };
          set({ tenantConfig: newConfig });
          applyTheme(newConfig.theme);
          await tenantService.upsertTenant(newConfig);
        }
      },
      setGamesConfig: async (gamesConfig: GamesConfig) => {
        const currentConfig = get().tenantConfig;
        if (currentConfig) {
          const newConfig = { ...currentConfig, games_config: gamesConfig };
          set({ tenantConfig: newConfig });
          await tenantService.upsertTenant(newConfig);
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