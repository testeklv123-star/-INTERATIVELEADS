import { TenantConfig } from '../types';
import electronService from './electronService';
import { getFallbackTenant } from './tenantFallback';

export interface TenantSummary {
  tenant_id: string;
  brand_name: string;
  created_at?: string;
}

const ACTIVE_TENANT_SETTING_KEY = 'activeTenantId';

async function loadTenantFromElectron(tenantId: string): Promise<TenantConfig | null> {
  if (!electronService.isRunningInElectron()) {
    return null;
  }

  const tenantResponse = await electronService.getTenant(tenantId);
  if (!tenantResponse.success) {
    return null;
  }

  return tenantResponse.data as TenantConfig;
}

async function persistTenantToElectron(config: TenantConfig): Promise<void> {
  if (!electronService.isRunningInElectron()) {
    return;
  }

  const response = await electronService.saveTenant(config);
  if (!response.success) {
    throw new Error(response.error ?? 'Falha ao salvar tenant localmente');
  }
}

async function resolveTenantFromOnline(tenantId: string): Promise<TenantConfig | null> {
  try {
    const { fetchOnlineTenantConfig, checkAPIConnection } = await import('./onlineTenantService');
    const isOnline = await checkAPIConnection();
    if (!isOnline) {
      return null;
    }

    return await fetchOnlineTenantConfig(tenantId);
  } catch (error) {
    console.warn('⚠️ [TenantService] API online indisponível:', error);
    return null;
  }
}

async function loadTenantFromFallback(tenantId: string): Promise<TenantConfig | null> {
  const fallback = getFallbackTenant(tenantId);
  return fallback ? { ...fallback } : null;
}

export async function loadTenantConfig(tenantId: string): Promise<TenantConfig> {
  const trimmedId = tenantId.trim();
  if (!trimmedId) {
    throw new Error('Tenant ID inválido');
  }

  // 1) Banco local (Electron)
  const localConfig = await loadTenantFromElectron(trimmedId);
  if (localConfig) {
    return localConfig;
  }

  // 2) API online
  const onlineConfig = await resolveTenantFromOnline(trimmedId);
  if (onlineConfig) {
    await persistTenantToElectron(onlineConfig).catch((error) => {
      console.warn('⚠️ [TenantService] Falha ao persistir tenant carregado da API:', error);
    });
    return onlineConfig;
  }

  // 3) Fallback local (mock / bundle)
  const fallbackConfig = await loadTenantFromFallback(trimmedId);
  if (fallbackConfig) {
    await persistTenantToElectron(fallbackConfig).catch((error) => {
      console.warn('⚠️ [TenantService] Falha ao persistir tenant de fallback:', error);
    });
    return fallbackConfig;
  }

  throw new Error('Tenant não encontrado');
}

export async function listTenants(): Promise<TenantSummary[]> {
  if (!electronService.isRunningInElectron()) {
    return [];
  }

  const response = await electronService.listTenants();
  if (!response.success) {
    throw new Error(response.error ?? 'Erro ao listar tenants');
  }

  return response.data as TenantSummary[];
}

export async function deleteTenant(tenantId: string): Promise<void> {
  if (!electronService.isRunningInElectron()) {
    return;
  }

  const response = await electronService.deleteTenant(tenantId);
  if (!response.success) {
    throw new Error(response.error ?? 'Erro ao deletar tenant');
  }
}

export async function persistActiveTenantId(tenantId: string): Promise<void> {
  if (!electronService.isRunningInElectron()) {
    localStorage.setItem(ACTIVE_TENANT_SETTING_KEY, tenantId);
    return;
  }

  const response = await electronService.setSetting(ACTIVE_TENANT_SETTING_KEY, tenantId);
  if (!response.success) {
    throw new Error(response.error ?? 'Erro ao salvar tenant ativo');
  }
}

export async function resolveActiveTenantId(): Promise<string | null> {
  if (!electronService.isRunningInElectron()) {
    return localStorage.getItem(ACTIVE_TENANT_SETTING_KEY);
  }

  const response = await electronService.getSetting(ACTIVE_TENANT_SETTING_KEY);
  if (!response.success) {
    console.warn('⚠️ [TenantService] Não foi possível obter tenant ativo:', response.error);
    return null;
  }

  return (response.data as string) ?? null;
}

export async function clearActiveTenantId(): Promise<void> {
  if (!electronService.isRunningInElectron()) {
    localStorage.removeItem(ACTIVE_TENANT_SETTING_KEY);
    return;
  }

  const response = await electronService.deleteSetting(ACTIVE_TENANT_SETTING_KEY);
  if (!response.success) {
    console.warn('⚠️ [TenantService] Erro ao limpar tenant ativo:', response.error);
  }
}

export async function upsertTenant(config: TenantConfig): Promise<void> {
  await persistTenantToElectron(config);
}

export default {
  loadTenantConfig,
  listTenants,
  deleteTenant,
  persistActiveTenantId,
  resolveActiveTenantId,
  clearActiveTenantId,
  upsertTenant,
};