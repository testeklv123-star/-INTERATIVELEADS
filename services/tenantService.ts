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
  console.log('🔍 [TenantService] loadTenantConfig chamado para:', tenantId);
  
  const trimmedId = tenantId.trim();
  if (!trimmedId) {
    throw new Error('Tenant ID inválido');
  }

  // 1) Banco local (Electron)
  console.log('📂 [TenantService] Tentando carregar do Electron...');
  const localConfig = await loadTenantFromElectron(trimmedId);
  if (localConfig) {
    console.log('✅ [TenantService] Tenant carregado do Electron:', localConfig.brand_name);
    console.log('🔍 [TenantService] Validando estrutura:', {
      hasTheme: !!localConfig.theme,
      hasContent: !!localConfig.content,
      hasGamesConfig: !!localConfig.games_config,
      hasFormFields: !!localConfig.form_fields,
      hasBehavior: !!localConfig.behavior
    });
    return localConfig;
  }
  console.log('⚠️ [TenantService] Tenant não encontrado no Electron');

  // 2) API online
  console.log('🌐 [TenantService] Tentando carregar da API online...');
  const onlineConfig = await resolveTenantFromOnline(trimmedId);
  if (onlineConfig) {
    console.log('✅ [TenantService] Tenant carregado da API');
    await persistTenantToElectron(onlineConfig).catch((error) => {
      console.warn('⚠️ [TenantService] Falha ao persistir tenant carregado da API:', error);
    });
    return onlineConfig;
  }
  console.log('⚠️ [TenantService] Tenant não encontrado na API');

  // 3) Fallback local (mock / bundle)
  console.log('📦 [TenantService] Tentando carregar do fallback...');
  const fallbackConfig = await loadTenantFromFallback(trimmedId);
  if (fallbackConfig) {
    console.log('✅ [TenantService] Tenant carregado do fallback');
    await persistTenantToElectron(fallbackConfig).catch((error) => {
      console.warn('⚠️ [TenantService] Falha ao persistir tenant de fallback:', error);
    });
    return fallbackConfig;
  }
  console.log('❌ [TenantService] Tenant não encontrado em lugar nenhum');

  throw new Error('Tenant não encontrado');
}

export async function listTenants(): Promise<TenantSummary[]> {
  console.log('🔍 [TenantService] listTenants chamado');
  if (!electronService.isRunningInElectron()) {
    console.warn('⚠️ [TenantService] Não está rodando no Electron');
    return [];
  }

  try {
    const response = await electronService.listTenants();
    console.log('📦 [TenantService] Resposta do electronService:', response);
    if (!response.success) {
      console.error('❌ [TenantService] Erro na resposta:', response.error);
      throw new Error(response.error ?? 'Erro ao listar tenants');
    }

    const tenants = response.data as TenantSummary[] || [];
    console.log(`✅ [TenantService] Retornando ${tenants.length} tenant(s):`, tenants);
    return tenants;
  } catch (error) {
    console.error('❌ [TenantService] Erro ao listar tenants:', error);
    throw error;
  }
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

export interface CreateTenantParams {
  tenantId: string;
  brandName: string;
  adminPassword: string;
}

export interface CreateTenantResult {
  success: boolean;
  message?: string;
  tenant?: TenantConfig;
  error?: string;
}

export async function createTenant(params: CreateTenantParams): Promise<CreateTenantResult> {
  try {
    if (!electronService.isRunningInElectron()) {
      throw new Error('Esta funcionalidade está disponível apenas na versão desktop do aplicativo');
    }

    const response = await electronService.invoke('create-tenant', {
      tenantId: params.tenantId,
      brandName: params.brandName,
      adminPassword: params.adminPassword
    });

    if (!response.success) {
      console.error('❌ [TenantService] Erro ao criar tenant:', response.error);
      return {
        success: false,
        error: response.error || 'Erro desconhecido ao criar tenant'
      };
    }

    return {
      success: true,
      message: response.message || 'Tenant criado com sucesso',
      tenant: response.tenant
    };
  } catch (error) {
    console.error('❌ [TenantService] Erro inesperado ao criar tenant:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}

export default {
  loadTenantConfig,
  listTenants,
  deleteTenant,
  persistActiveTenantId,
  resolveActiveTenantId,
  clearActiveTenantId,
  upsertTenant,
  createTenant
};