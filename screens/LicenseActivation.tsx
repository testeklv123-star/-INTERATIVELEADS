import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';
import licenseService from '../services/licenseService';

interface LicenseActivationProps {
  onSuccess: (tenantId: string) => void;
}

const LicenseActivation: React.FC<LicenseActivationProps> = ({ onSuccess }) => {
  const [licenseKey, setLicenseKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  
  const deviceId = licenseService.getDeviceId();

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await licenseService.validate(licenseKey.trim());

      if (result.valid && result.license) {
        console.log('✅ [LicenseActivation] Licença ativada com sucesso');
        onSuccess(result.license.tenant_id);
      } else {
        setError(result.message);
        console.error('❌ [LicenseActivation] Licença inválida:', result.message);
      }
    } catch (err) {
      console.error('❌ [LicenseActivation] Erro ao validar:', err);
      setError('Erro ao conectar com o servidor. Verifique sua conexão.');
      setIsOfflineMode(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOfflineContinue = () => {
    if (licenseService.hasValidCache()) {
      const cached = licenseService.getCachedLicenseInfo();
      if (cached) {
        console.log('✅ [LicenseActivation] Usando licença do cache (modo offline)');
        onSuccess(cached.tenant_id);
      }
    } else {
      setError('Nenhuma licença válida em cache. É necessário conexão com a internet na primeira ativação.');
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: '#F8FAFC' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div 
          className="bg-white rounded-2xl shadow-xl p-8"
          style={{ border: '1px solid #E2E8F0' }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔐</div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#1E293B' }}>
              Ativação de Licença
            </h1>
            <p className="text-gray-600">
              Digite sua chave de licença para ativar o sistema
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleActivate}>
            <div className="mb-6">
              <label 
                htmlFor="licenseKey" 
                className="block text-sm font-semibold mb-2"
                style={{ color: '#475569' }}
              >
                Chave de Licença
              </label>
              <input
                type="text"
                id="licenseKey"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                placeholder="WLT-XXXX-XXXX-XXXX-XXXX"
                className="w-full px-4 py-3 border-2 rounded-lg text-center font-mono text-lg"
                style={{
                  borderColor: error ? '#EF4444' : '#E2E8F0',
                  outline: 'none'
                }}
                required
                disabled={isLoading}
              />
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-sm text-red-600 flex items-center gap-2"
                >
                  <span>⚠️</span>
                  {error}
                </motion.p>
              )}
            </div>

            {/* Device ID Info */}
            <div className="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">ID do Dispositivo:</p>
              <p className="text-xs font-mono text-gray-800 break-all">{deviceId}</p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                type="submit"
                disabled={isLoading || !licenseKey.trim()}
                className="w-full"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Validando...
                  </span>
                ) : (
                  '🔓 Ativar Licença'
                )}
              </Button>

              {isOfflineMode && licenseService.hasValidCache() && (
                <Button
                  type="button"
                  onClick={handleOfflineContinue}
                  variant="secondary"
                  className="w-full"
                >
                  📱 Continuar Offline
                </Button>
              )}
            </div>
          </form>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Não possui uma licença?<br />
              Entre em contato com o administrador do sistema.
            </p>
          </div>
        </div>

        {/* Debug Info (apenas em desenvolvimento) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs font-semibold text-yellow-800 mb-2">🔧 Modo Desenvolvimento</p>
            <p className="text-xs text-yellow-700">
              Cache válido: {licenseService.hasValidCache() ? 'Sim' : 'Não'}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default LicenseActivation;

