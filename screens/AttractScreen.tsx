import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenantStore } from '../stores/tenantStore';
import DynamicLogo from '../components/common/DynamicLogo';
import Button from '../components/common/Button';
import AdminPasswordModal from '../components/common/AdminPasswordModal';

const AttractScreen: React.FC = () => {
  const navigate = useNavigate();
  const tenantConfig = useTenantStore((state) => state.tenantConfig);
  const [key, setKey] = useState(0);
  const [showAdminModal, setShowAdminModal] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setKey(prev => prev + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAdminSuccess = () => {
    console.log('🔓 Acesso admin autorizado!');
    setShowAdminModal(false);
    navigate('/admin');
  };

  const adminPassword = tenantConfig?.behavior.admin_password || '1234';

  if (!tenantConfig) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-200">
        <p className="text-2xl">Carregando configuração...</p>
      </div>
    );
  }

  return (
    <div 
      className="w-full h-screen flex flex-col justify-between items-center p-12 text-center overflow-hidden relative"
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)'
      }}
    >
      {/* Botão discreto de admin */}
      <button
        onClick={() => setShowAdminModal(true)}
        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-all opacity-30 hover:opacity-100 z-10"
        title="Acesso Administrativo"
      >
        <span className="text-gray-600 text-sm">⚙️</span>
      </button>

      <header className="w-full">
        <DynamicLogo type="main" className="max-w-xs md:max-w-md mx-auto h-auto" />
      </header>

      <main className="flex flex-col items-center justify-center flex-grow">
          <div key={key} className="animate-fade-in-pulse">
            <h1 
              className="font-bold mb-4"
              style={{ 
                color: 'var(--color-primary)',
                fontSize: 'var(--font-size-h1)',
                fontFamily: 'var(--font-primary)',
                fontWeight: 'var(--heading-weight)'
              }}
            >
              {tenantConfig.content.welcome_title}
            </h1>
            <p 
              className="text-3xl"
              style={{ 
                color: 'var(--color-text-secondary)',
                fontFamily: 'var(--font-secondary)' 
              }}
            >
              {tenantConfig.content.welcome_subtitle}
            </p>
          </div>
      </main>

      <footer className="w-full flex flex-col items-center">
        <div className="animate-bounce mb-6">
          <Button onClick={() => navigate('/games')}>
            TOQUE PARA COMEÇAR
          </Button>
        </div>
        <div className="flex items-center space-x-2 opacity-70">
          <DynamicLogo type="watermark" className="h-8 w-8" />
          <span className="text-sm">{tenantConfig.brand_name}</span>
        </div>
      </footer>

      {/* Modal de senha do admin */}
      <AdminPasswordModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        onSuccess={handleAdminSuccess}
        correctPassword={adminPassword}
      />

      <style>{`
        @keyframes fade-in-pulse {
          0% { opacity: 0; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-pulse {
          animation: fade-in-pulse 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AttractScreen;