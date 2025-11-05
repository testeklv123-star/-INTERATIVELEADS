import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useTenantStore } from './stores/tenantStore';
import { applyTheme } from './utils/themeApplier';
import { useInactivityTimeout } from './hooks/useInactivityTimeout';
import TenantSetup from './screens/TenantSetup';
import AttractScreen from './screens/AttractScreen';
import GameSelection from './screens/GameSelection';
import LeadForm from './screens/LeadForm';
import GameScreen from './screens/GameScreen';
import ThankYouScreen from './screens/ThankYouScreen';
import AdminProtectedLayout from './screens/admin/AdminProtectedLayout';
import LeadsDashboard from './screens/admin/LeadsDashboard';
import BrandCustomization from './screens/admin/BrandCustomization';
import PrizeManagement from './screens/admin/PrizeManagement';
import GamesConfiguration from './screens/admin/GamesConfiguration';
import tenantService from './services/tenantService';

const AppContent: React.FC = () => {
  const { isConfigured, isLoading, tenantConfig, _hasHydrated, loadTenant } = useTenantStore();
  const location = useLocation();
  
  // Ativar timeout de inatividade
  useInactivityTimeout();

  // Debug: Log do estado
  useEffect(() => {
    console.log('🎯 [App] Estado atual:', {
      isConfigured,
      isLoading,
      _hasHydrated,
      hasTenantConfig: !!tenantConfig,
      brandName: tenantConfig?.brand_name
    });
  }, [isConfigured, isLoading, tenantConfig, _hasHydrated]);

  useEffect(() => {
    if (tenantConfig) {
      console.log('🎨 [App] Aplicando tema...');
      applyTheme(tenantConfig.theme);
    }
  }, [tenantConfig]);

  useEffect(() => {
    const bootstrapTenant = async () => {
      if (!isConfigured && !_hasHydrated) {
        return;
      }

      if (isConfigured || isLoading) {
        return;
      }

      try {
        const tenantId = await tenantService.resolveActiveTenantId();
        if (tenantId) {
          console.log('🔁 [App] Tenant ativo encontrado, carregando...', tenantId);
          await loadTenant(tenantId);
        }
      } catch (error) {
        console.warn('⚠️ [App] Falha ao carregar tenant ativo:', error);
      }
    };

    void bootstrapTenant();
  }, [isConfigured, isLoading, _hasHydrated, loadTenant]);

  // Wait until the store is rehydrated from localStorage
  if (!_hasHydrated) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-100">
        <p className="text-2xl text-gray-600">Inicializando Totem...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-100">
        <p className="text-2xl text-gray-600">Carregando...</p>
      </div>
    );
  }

  return (
    <div key={location.pathname} className="page-container">
      <Routes>
        <Route path="/setup" element={<TenantSetup />} />
        <Route
          path="/*"
          element={
            isConfigured ? (
              <Routes>
                <Route path="/" element={<AttractScreen />} />
                <Route path="/games" element={<GameSelection />} />
                <Route path="/form" element={<LeadForm />} />
                <Route path="/game/:gameId" element={<GameScreen />} />
                <Route path="/thank-you" element={<ThankYouScreen />} />
                <Route path="/admin" element={<AdminProtectedLayout />}>
                  <Route index element={<Navigate to="leads" replace />} />
                  <Route path="leads" element={<LeadsDashboard />} />
                  <Route path="brand" element={<BrandCustomization />} />
                  <Route path="prizes" element={<PrizeManagement />} />
                  <Route path="games" element={<GamesConfiguration />} />
                </Route>
                 <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            ) : (
              <Navigate to="/setup" replace />
            )
          }
        />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
