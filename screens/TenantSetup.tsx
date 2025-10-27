
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenantStore } from '../stores/tenantStore';
import Button from '../components/common/Button';

const TenantSetup: React.FC = () => {
  const navigate = useNavigate();
  const [tenantId, setTenantId] = useState('');
  const { loadTenant, isLoading, error, isConfigured } = useTenantStore();
  
  // Redirecionar automaticamente quando configuração for bem-sucedida
  useEffect(() => {
    if (isConfigured) {
      console.log('🚀 [Setup] Tenant configurado! Redirecionando para home...');
      navigate('/', { replace: true });
    }
  }, [isConfigured, navigate]);

  const handleConnect = async () => {
    if (!tenantId) return;
    try {
      await loadTenant(tenantId);
    } catch (e) {
      console.error("Failed to load tenant:", e);
      // O erro já está sendo tratado pelo store e será exibido na tela
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleConnect();
    }
  };
  
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-100 p-8">
      <div className="w-full max-w-lg text-center bg-white p-12 rounded-2xl shadow-2xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Configure seu Totem</h1>
        <p className="text-xl text-gray-600 mb-8">Insira o código do cliente para iniciar.</p>
        
        <input
          type="text"
          value={tenantId}
          onChange={(e) => setTenantId(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="ex: loja_tech_sp_001"
          className="w-full text-center text-2xl p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
        />
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
            <p className="text-red-600 font-semibold mb-2">❌ {error}</p>
            <p className="text-sm text-gray-600 mb-2">Códigos válidos:</p>
            <div className="text-sm text-left space-y-1">
              <p className="font-mono bg-gray-100 p-2 rounded">• loja_tech_sp_001</p>
              <p className="font-mono bg-gray-100 p-2 rounded">• evento_tech_2025</p>
            </div>
          </div>
        )}
        
        <div className="mt-8">
          <Button onClick={handleConnect} disabled={isLoading || !tenantId}>
            {isLoading ? 'Conectando...' : 'Conectar'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TenantSetup;
