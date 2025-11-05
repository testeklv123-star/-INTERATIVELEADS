import { useEffect, useState } from 'react';
import { fetchTenantConfig } from '../services/tenantService';
import { TenantConfig } from '../types';

export function useTenantConfig(tenantId: string) {
  const [config, setConfig] = useState<TenantConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    fetchTenantConfig(tenantId)
      .then(data => {
        setConfig(data);
        setError(null);
      })
      .catch(err => {
        setError(err.message);
        setConfig(null);
      })
      .finally(() => setLoading(false));
  }, [tenantId]);

  return { config, loading, error };
}
