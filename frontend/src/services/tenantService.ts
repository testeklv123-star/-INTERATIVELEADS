import { TenantConfig } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export async function fetchTenantConfig(tenantId: string): Promise<TenantConfig> {
  const response = await fetch(`${API_BASE_URL}/tenants/${tenantId}/config`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(response.status === 404 
      ? 'Tenant não encontrado' 
      : 'Erro ao carregar configuração');
  }

  return response.json();
}
