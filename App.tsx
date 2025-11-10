import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useTenantStore } from './stores/tenantStore';
import { applyTheme } from './utils/themeApplier';
import { logger } from './utils/logger';
import { useInactivityTimeout } from './hooks/useInactivityTimeout';
import { useZoomControl } from './hooks/useZoomControl';
import ResponsiveProvider from './components/common/ResponsiveProvider';
import LoadingScreen from './components/common/LoadingScreen';
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

  /**
   * Verifica a validade da licença ao iniciar o app
   */
  useEffect(() => {
    const checkLicense = async () => {
      try {
        const cachedLicense = licenseService.getCachedLicenseInfo();
        
        if (cachedLicense) {
          logger.log('🔐 [App] Licença encontrada no cache');
          
          // Valida a licença em background
          try {
            const result = await licenseService.validate(cachedLicense.license_key);
            setIsLicenseValid(result.valid);
            
            if (!result.valid) {
              logger.warn('⚠️ [App] Licença inválida, necessário reativar');
            }
          } catch (error) {
            // Se falhar online, mas tem cache válido, continua
            if (licenseService.hasValidCache()) {
              logger.log('✅ [App] Usando licença do cache (offline)');
              setIsLicenseValid(true);
            } else {
              setIsLicenseValid(false);
            }
          }
        } else {
          logger.log('⚠️ [App] Nenhuma licença encontrada');
          setIsLicenseValid(false);
        }
      } catch (error) {
        logger.error('❌ [App] Erro ao verificar licença:', error);
        setIsLicenseValid(false);
      }
    };

    checkLicense();
  }, []);

  /**
   * Verifica se é a primeira execução do app
   */
  useEffect(() => {
    const checkFirstRun = async () => {
      try {
        if (electronService.isRunningInElectron()) {
          const firstRun = await electronService.isFirstRun();
          logger.log('🚀 [App] First run check:', firstRun);
          setIsFirstRun(firstRun);
        } else {
          logger.warn('⚠️ [App] Electron API not available, assuming not first run');
          setIsFirstRun(false);
        }
      } catch (error) {
        logger.error('❌ [App] Error checking first run:', error);
        setIsFirstRun(false);
      }
    };

    checkFirstRun();
  }, []);

  /**
   * Log de debug do estado atual (apenas em desenvolvimento)
   */
  useEffect(() => {
    logger.log('🎯 [App] Estado atual:', {
      isFirstRun,
      isConfigured,
      isLoading,
      _hasHydrated,
      hasTenantConfig: !!tenantConfig,
      brandName: tenantConfig?.brand_name
    });
  }, [isFirstRun, isConfigured, isLoading, tenantConfig, _hasHydrated]);

  /**
   * Aplica o tema do tenant quando disponível
   */
  useEffect(() => {
    if (tenantConfig) {
      logger.log('🎨 [App] Aplicando tema...');
      applyTheme(tenantConfig.theme);
    }
  }, [tenantConfig]);

  /**
   * Carrega a configuração do tenant ativo ao iniciar
   */
  useEffect(() => {
    const bootstrapTenant = async () => {
      if (isConfigured) return;

      try {
        const tenantId = await tenantService.resolveActiveTenantId();
        if (tenantId) {
          logger.log('🔁 [App] Tenant ativo encontrado, carregando...', tenantId);
          await loadTenant(tenantId);
        }
      } catch (error) {
        logger.warn('⚠️ [App] Falha ao carregar tenant ativo:', error);
      }
    };

    void bootstrapTenant();
  }, [isConfigured, loadTenant]);

  // Exibe loading durante verificação inicial
  if (isLicenseValid === null || isFirstRun === null) {
    return <LoadingScreen message="Inicializando..." />;
  }

  // Exibe tela de ativação se licença inválida
  if (!isLicenseValid) {
    return (
      <LicenseActivation 
        onSuccess={(tenantId) => {
          logger.log('✅ [App] Licença ativada, carregando tenant:', tenantId);
          setIsLicenseValid(true);
          void loadTenant(tenantId);
        }} 
      />
    );
  }

  // Exibe tela de setup na primeira execução
  if (isFirstRun) {
    return <TenantSetup />;
  }

  // Exibe seleção de tenant se não configurado
  if (!isConfigured && _hasHydrated) {
    return <TenantSelectionScreen />;
  }

  // Exibe loading durante carregamento do tenant
  if (isLoading || !_hasHydrated) {
    return <LoadingScreen message="Carregando configuração..." />;
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
