import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTenantStore } from '../stores/tenantStore';
import DynamicLogo from '../components/common/DynamicLogo';
import Button from '../components/common/Button';
import AdminPasswordModal from '../components/common/AdminPasswordModal';

const AttractScreen: React.FC = () => {
  const navigate = useNavigate();
  const tenantConfig = useTenantStore((state) => state.tenantConfig);
  const [heroIndex, setHeroIndex] = useState(0);
  const [showAdminModal, setShowAdminModal] = useState(false);

  const heroMessages = useMemo(() => {
    if (!tenantConfig) return [];

    const { content, games_config } = tenantConfig;
    const enabledGames = games_config.enabled_games;

    const gamesMessages = enabledGames.map((gameKey) => {
      switch (gameKey) {
        case 'prize_wheel':
          return 'Gire a roda e conquiste prêmios instantâneos!';
        case 'scratch_card':
          return 'Raspe e descubra recompensas exclusivas.';
        case 'quiz':
          return 'Mostre seus conhecimentos no quiz premiado!';
        default:
          return null;
      }
    }).filter(Boolean) as string[];

    return [
      content.welcome_subtitle,
      content.form_subtitle,
      ...gamesMessages
    ].filter(Boolean);
  }, [tenantConfig]);

  useEffect(() => {
    if (heroMessages.length === 0) return;

    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroMessages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [heroMessages]);

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
        <div className="relative w-full max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mb-6"
          >
            <motion.h1
              className="font-bold mb-4"
              style={{
                color: 'var(--color-primary)',
                fontSize: 'var(--font-size-h1)',
                fontFamily: 'var(--font-primary)',
                fontWeight: 'var(--heading-weight)'
              }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {tenantConfig.content.welcome_title}
            </motion.h1>
          </motion.div>

          <div className="min-h-[96px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={`${heroIndex}-${heroMessages[heroIndex]}`}
                className="text-3xl text-center"
                style={{
                  color: 'var(--color-text-secondary)',
                  fontFamily: 'var(--font-secondary)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.45 }}
              >
                {heroMessages[heroIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="w-full flex flex-col items-center">
        <motion.div
          className="mb-6"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1.8 }}
        >
          <Button onClick={() => navigate('/games')}>
            TOQUE PARA COMEÇAR
          </Button>
        </motion.div>
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

      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 2 }}
        style={{
          background: `radial-gradient(circle at 20% 20%, var(--color-accent) 0%, transparent 55%), radial-gradient(circle at 80% 30%, var(--color-secondary) 0%, transparent 60%), radial-gradient(circle at 50% 80%, var(--color-primary) 0%, transparent 65%)`,
          zIndex: -1,
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};

export default AttractScreen;