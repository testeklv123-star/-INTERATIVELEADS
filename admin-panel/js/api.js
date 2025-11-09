// ============================================
// API CLIENT - Comunicação com o Backend
// ============================================
// Este arquivo é o "cérebro" que fala com seu servidor backend
// Todas as requisições HTTP passam por aqui

const API_BASE_URL = 'http://localhost:5000/api';

// ============================================
// FUNÇÕES PARA GERENCIAR TENANTS (CLIENTES)
// ============================================

/**
 * Busca todos os tenants cadastrados
 * @returns {Promise<Array>} Lista de tenants
 */
async function fetchTenants() {
  try {
    const response = await fetch(`${API_BASE_URL}/tenants`);
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar tenants:', error);
    throw error;
  }
}

/**
 * Cria um novo tenant
 * @param {Object} tenantData - Dados do tenant (name, slug)
 * @returns {Promise<Object>} Tenant criado
 */
async function createTenant(tenantData) {
  try {
    const response = await fetch(`${API_BASE_URL}/tenants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tenantData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao criar tenant:', error);
    throw error;
  }
}

/**
 * Atualiza um tenant existente
 * @param {string} slug - Identificador único do tenant
 * @param {Object} tenantData - Novos dados do tenant
 * @returns {Promise<Object>} Tenant atualizado
 */
async function updateTenant(slug, tenantData) {
  try {
    const response = await fetch(`${API_BASE_URL}/tenants/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tenantData),
    });
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao atualizar tenant:', error);
    throw error;
  }
}

/**
 * Deleta um tenant
 * @param {string} slug - Identificador único do tenant
 * @returns {Promise<Object>} Confirmação da exclusão
 */
async function deleteTenant(slug) {
  try {
    const response = await fetch(`${API_BASE_URL}/tenants/${slug}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao deletar tenant:', error);
    throw error;
  }
}

// ============================================
// FUNÇÕES PARA GERENCIAR LEADS (CONTATOS)
// ============================================

/**
 * Busca leads de um tenant específico
 * @param {string} tenantSlug - Identificador do tenant
 * @returns {Promise<Array>} Lista de leads
 */
async function fetchLeads(tenantSlug) {
  try {
    const response = await fetch(`${API_BASE_URL}/leads?tenant=${tenantSlug}`);
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar leads:', error);
    throw error;
  }
}

/**
 * Busca todos os leads (sem filtro)
 * @returns {Promise<Array>} Lista de todos os leads
 */
async function fetchAllLeads() {
  try {
    const response = await fetch(`${API_BASE_URL}/leads`);
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar todos os leads:', error);
    throw error;
  }
}

// ============================================
// FUNÇÕES DE ESTATÍSTICAS E SINCRONIZAÇÃO
// ============================================

/**
 * Busca estatísticas de sincronização
 * @returns {Promise<Object>} Dados de sincronização
 */
async function fetchSyncStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/sync/stats`);
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    throw error;
  }
}

/**
 * Verifica o status de saúde do servidor
 * @returns {Promise<Object>} Status do servidor
 */
async function checkServerHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao verificar saúde do servidor:', error);
    throw error;
  }
}

