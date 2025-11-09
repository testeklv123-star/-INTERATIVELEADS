import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTenantStore } from '../stores/tenantStore';
import DynamicLogo from '../components/common/DynamicLogo';
import Button from '../components/common/Button';

const GAME_DEFINITIONS: { [key: string]: { title: string; icon: string; description: string } } = {
  prize_wheel: {
    title: 'Roda da Fortuna',
    icon: '🎡',
    description: 'Gire e ganhe prêmios incríveis!'
  },
  scratch_card: {
    title: 'Raspadinha Premiada',
    icon: '🎫',
    description: 'Raspe e descubra seu prêmio na hora.'
  },
  quiz: {
    title: 'Quiz Interativo',
    icon: '🧠',
    description: 'Teste seus conhecimentos e ganhe.'
  }
};

const GameSelection: React.FC = () => {
  const navigate = useNavigate();
  const tenantConfig = useTenantStore((state) => state.tenantConfig);

  if (!tenantConfig) return null;

  const enabledGames = tenantConfig.games_config.enabled_games;

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center p-4 md:p-8 py-8 overflow-auto"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="flex flex-col items-center"
      >
        <DynamicLogo type="main" className="max-w-xs md:max-w-sm mx-auto h-auto mb-4 md:mb-8" />
        <h2
          className="text-2xl md:text-4xl font-bold mb-4 md:mb-8 text-center"
          style={{
            color: 'var(--color-primary)',
            fontSize: 'var(--font-size-h2)'
          }}
        >
          Escolha seu Jogo
        </h2>
        <p className="text-base md:text-lg text-center max-w-3xl mb-6 md:mb-8 px-4" style={{ color: 'var(--color-text-secondary)' }}>
          Cada jogo oferece uma experiência única para coletar seus dados e distribuir prêmios da marca. Selecione uma opção
          para continuar.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-6xl mb-8">
        {enabledGames.map((gameKey, index) => {
          const game = GAME_DEFINITIONS[gameKey];
          if (!game) return null;

          return (
            <motion.div
              key={gameKey}
              className="p-6 md:p-8 shadow-lg w-full flex flex-col items-center text-center min-h-[400px]"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 'var(--border-radius)',
                border: '2px solid var(--color-primary)',
                boxShadow: '0 20px 35px rgba(0,0,0,0.12)'
              }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.span
                className="text-5xl md:text-7xl mb-4"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 6, delay: index * 0.5 }}
              >
                {game.icon}
              </motion.span>
              <h3 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                {game.title}
              </h3>
              <p className="text-lg md:text-xl mb-6 flex-grow" style={{ color: 'var(--color-text-secondary)' }}>
                {game.description}
              </p>
              <div className="mt-auto w-full flex justify-center">
                <Button onClick={() => navigate(`/form?game=${gameKey}`)}>
                  JOGAR
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default GameSelection;