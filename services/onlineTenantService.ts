/**
 * Online Tenant Service - API REST para validação de tenants
 * InterativeLeads Desktop
 */

import { TenantConfig } from '../types';

// Configurar URL da sua API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://sua-api.com/api';
const API_KEY = process.env.REACT_APP_API_KEY || 'sua-chave-api';

/**
 * Buscar configuração de tenant da API online
 */
export async function fetchOnlineTenantConfig(tenantId: string): Promise<TenantConfig> {
  console.log(`🌐 [Online API] Buscando tenant: ${tenantId}`);
  
  try {
    const response = await fetch(`${API_BASE_URL}/tenants/${tenantId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'X-App-Version': '1.0.0'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Tenant não encontrado. Verifique o ID e tente novamente.');
      }
      if (response.status === 401) {
        throw new Error('Erro de autenticação. Verifique sua conexão.');
      }
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ [Online API] Tenant carregado: ${data.brand_name}`);
    
    return data as TenantConfig;
  } catch (error) {
    console.error('❌ [Online API] Erro:', error);
    throw error;
  }
}

/**
 * Validar se um tenant existe e está ativo
 */
export async function validateTenant(tenantId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/tenants/${tenantId}/validate`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      return data.valid === true && data.active === true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ [Online API] Erro na validação:', error);
    return false;
  }
}

/**
 * Listar todos os tenants disponíveis
 */
export async function listOnlineTenants(): Promise<Array<{id: string, name: string, active: boolean}>> {
  try {
    const response = await fetch(`${API_BASE_URL}/tenants`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
    
    return [];
  } catch (error) {
    console.error('❌ [Online API] Erro ao listar tenants:', error);
    return [];
  }
}

/**
 * Registrar um novo tenant (via painel admin web)
 */
export async function registerTenant(config: TenantConfig): Promise<{success: boolean, message: string}> {
  try {
    const response = await fetch(`${API_BASE_URL}/tenants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(config)
    });

    const data = await response.json();
    
    if (response.ok) {
      return { success: true, message: 'Tenant registrado com sucesso!' };
    }
    
    return { success: false, message: data.message || 'Erro ao registrar tenant' };
  } catch (error) {
    console.error('❌ [Online API] Erro ao registrar:', error);
    return { success: false, message: 'Erro de conexão com a API' };
  }
}

/**
 * Atualizar configuração de um tenant
 */
export async function updateOnlineTenant(tenantId: string, config: Partial<TenantConfig>): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/tenants/${tenantId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(config)
    });

    return response.ok;
  } catch (error) {
    console.error('❌ [Online API] Erro ao atualizar:', error);
    return false;
  }
}

/**
 * Deletar um tenant
 */
export async function deleteOnlineTenant(tenantId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/tenants/${tenantId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });

    return response.ok;
  } catch (error) {
    console.error('❌ [Online API] Erro ao deletar:', error);
    return false;
  }
}

/**
 * Sincronizar tenant local com servidor
 */
export async function syncTenantWithServer(tenantId: string, localConfig: TenantConfig): Promise<TenantConfig | null> {
  try {
    console.log(`🔄 [Sync] Sincronizando tenant ${tenantId}...`);
    
    // Buscar versão mais recente do servidor
    const serverConfig = await fetchOnlineTenantConfig(tenantId);
    
    // Comparar versões (você pode adicionar um campo version no TenantConfig)
    // Por enquanto, o servidor sempre tem prioridade
    
    console.log(`✅ [Sync] Tenant sincronizado com sucesso`);
    return serverConfig;
  } catch (error) {
    console.error('❌ [Sync] Erro na sincronização:', error);
    // Em caso de erro, manter configuração local
    return localConfig;
  }
}

/**
 * Verificar conexão com a API
 */
export async function checkAPIConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });

    return response.ok;
  } catch (error) {
    console.error('❌ [API] Sem conexão com o servidor');
    return false;
  }
}

