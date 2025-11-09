import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useTenantStore } from './stores/tenantStore';
import { applyTheme } from './utils/themeApplier';
import { useInactivityTimeout } from './hooks/useInactivityTimeout';
import { useZoomControl } from './hooks/useZoomControl';
import ResponsiveProvider from './components/common/ResponsiveProvider';
import TenantSetup from './screens/TenantSetup';
import TenantSelectionScreen from './screens/TenantSelectionScreen';
import LicenseActivation from './screens/LicenseActivation';
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
import electronService from './services/electronService';
import licenseService from './services/licenseService';
import type { ElectronAPI } from './services/electronService';

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

const AppContent: React.FC = () => {
  const { isConfigured, isLoading, tenantConfig, _hasHydrated, loadTenant } = useTenantStore();
  const [isFirstRun, setIsFirstRun] = useState<boolean | null>(null);
  const [isLicenseValid, setIsLicenseValid] = useState<boolean | null>(null);
  const location = useLocation();
  
  // Ativar timeout de inatividade
  useInactivityTimeout();
  
  // Ativar controle de zoom com Ctrl+Scroll
  useZoomControl();

  // Check license validity
  useEffect(() => {
    const checkLicense = async () => {
      try {
        const cachedLicense = licenseService.getCachedLicenseInfo();
        
        if (cachedLicense) {
          console.log('🔐 [App] Licença encontrada no cache');
          
          // Valida a licença em background
          try {
            const result = await licenseService.validate(cachedLicense.license_key);
            setIsLicenseValid(result.valid);
            
            if (!result.valid) {
              console.warn('⚠️ [App] Licença inválida, necessário reativar');
            }
          } catch (error) {
            // Se falhar online, mas tem cache válido, continua
            if (licenseService.hasValidCache()) {
              console.log('✅ [App] Usando licença do cache (offline)');
              setIsLicenseValid(true);
            } else {
              setIsLicenseValid(false);
            }
          }
        } else {
          console.log('⚠️ [App] Nenhuma licença encontrada');
          setIsLicenseValid(false);
        }
      } catch (error) {
        console.error('❌ [App] Erro ao verificar licença:', error);
        setIsLicenseValid(false);
      }
    };

    checkLicense();
  }, []);

  // Check if it's the first run
  useEffect(() => {
    const checkFirstRun = async () => {
      try {
        if (electronService.isRunningInElectron()) {
          const firstRun = await electronService.isFirstRun();
          console.log('🚀 [App] First run check:', firstRun);
          setIsFirstRun(firstRun);
        } else {
          console.warn('⚠️ [App] Electron API not available, assuming not first run');
          setIsFirstRun(false);
        }
      } catch (error) {
        console.error('❌ [App] Error checking first run:', error);
        setIsFirstRun(false);
      }
    };

    checkFirstRun();
  }, []);

  // Debug: Log do estado
  useEffect(() => {
    console.log('🎯 [App] Estado atual:', {
      isFirstRun,
      isConfigured,
      isLoading,
      _hasHydrated,
      hasTenantConfig: !!tenantConfig,
      brandName: tenantConfig?.brand_name
    });
  }, [isFirstRun, isConfigured, isLoading, tenantConfig, _hasHydrated]);

  useEffect(() => {
    if (tenantConfig) {
      console.log('🎨 [App] Aplicando tema...');
      applyTheme(tenantConfig.theme);
    }
  }, [tenantConfig]);

  // Bootstrap tenant configuration - MOVIDO PARA ANTES DOS RETURNS
  useEffect(() => {
    const bootstrapTenant = async () => {
      if (isConfigured) return;

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
  }, [isConfigured, loadTenant]);

  // Show loading state while checking license and first run
  if (isLicenseValid === null || isFirstRun === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Inicializando...</p>
        </div>
      </div>
    );
  }

  // Show license activation if not valid
  if (!isLicenseValid) {
    return (
      <LicenseActivation 
        onSuccess={(tenantId) => {
          console.log('✅ [App] Licença ativada, carregando tenant:', tenantId);
          setIsLicenseValid(true);
          void loadTenant(tenantId);
        }} 
      />
    );
  }

  // Show setup screen on first run
  if (isFirstRun) {
    return <TenantSetup />;
  }

  // Show tenant selection if not configured
  if (!isConfigured && _hasHydrated) {
    return <TenantSelectionScreen />;
  }

  // Show loading state while checking tenant config
  if (isLoading || !_hasHydrated) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
    <ResponsiveProvider>
      <Router>
        <AppContent />
      </Router>
    </ResponsiveProvider>
  );
};

export default App;
