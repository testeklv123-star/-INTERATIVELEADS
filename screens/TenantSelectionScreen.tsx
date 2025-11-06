import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenantStore } from '../stores/tenantStore';
import tenantService from '../services/tenantService';

export interface TenantSummary {
  tenant_id: string;
  brand_name: string;
  created_at?: string;
}

const TenantSelectionScreen: React.FC = () => {
  const [tenants, setTenants] = useState<TenantSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTenants = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const tenantsList = await tenantService.listTenants();
        setTenants(tenantsList);
      } catch (err) {
        console.error('Error loading tenants:', err);
        setError('Falha ao carregar tenants. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    loadTenants();
  }, []);

  const handleTenantSelect = async (tenant: TenantSummary) => {
    try {
      // Update the global tenant state by loading the full tenant config
      await useTenantStore.getState().loadTenant(tenant.tenant_id);
      // Navigate to the home screen
      navigate('/');
    } catch (error) {
      console.error('Error loading tenant:', error);
      setError('Falha ao carregar o tenant selecionado. Por favor, tente novamente.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando tenants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-gray-900">Erro ao carregar tenants</h2>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <div className="mt-6">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900">Selecione um Tenant</h1>
          <p className="mt-2 text-sm text-gray-600">Escolha um tenant para continuar</p>
        </div>

        {tenants.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum tenant encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">Não há tenants disponíveis para seleção.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {tenants.map((tenant) => (
              <div
                key={tenant.tenant_id}
                className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-blue-500 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 cursor-pointer transition-colors duration-150"
                onClick={() => handleTenantSelect(tenant)}
              >
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg
                    className="h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {tenant.brand_name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      ID: {tenant.tenant_id}
                    </p>
                    {tenant.created_at && (
                      <p className="text-xs text-gray-400 mt-1">
                        Criado em: {new Date(tenant.created_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-blue-600">
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantSelectionScreen;
