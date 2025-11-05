import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AdminAuthState {
  isAuthenticated: boolean;
  authenticatedTenantId: string | null;
  lastAuthenticatedAt: string | null;
  authenticate: (tenantId: string) => void;
  signOut: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      authenticatedTenantId: null,
      lastAuthenticatedAt: null,
      authenticate: (tenantId) =>
        set({
          isAuthenticated: true,
          authenticatedTenantId: tenantId,
          lastAuthenticatedAt: new Date().toISOString(),
        }),
      signOut: () =>
        set({ isAuthenticated: false, authenticatedTenantId: null, lastAuthenticatedAt: null }),
    }),
    {
      name: 'admin-auth',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useAdminAuthStore;
