import React from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className="w-full min-h-screen flex flex-col items-center p-8" style={{backgroundColor: 'var(--color-background)'}}>
      <DynamicLogo type="main" className="max-w-sm mx-auto h-auto mb-8" />
      <h2 
        className="text-4xl font-bold mb-12 text-center"
        style={{
          color: 'var(--color-primary)',
          fontSize: 'var(--font-size-h2)'
        }}
      >
        Escolha seu Jogo
      </h2>
      <div className="grid grid-cols-1 gap-8 w-full max-w-4xl">
        {enabledGames.map((gameKey) => {
          const game = GAME_DEFINITIONS[gameKey];
          if (!game) return null;
          return (
            <div 
              key={gameKey} 
              className="p-8 shadow-lg w-full flex flex-col items-center text-center transition-transform hover:scale-105"
              style={{
                backgroundColor: 'var(--color-background)',
                borderRadius: 'var(--border-radius)',
                border: '2px solid var(--color-primary)'
              }}
            >
              <span className="text-8xl mb-4">{game.icon}</span>
              <h3 className="text-3xl font-bold mb-2" style={{color: 'var(--color-text)'}}>{game.title}</h3>
              <p className="text-xl mb-6 flex-grow" style={{color: 'var(--color-text-secondary)'}}>{game.description}</p>
              <Button onClick={() => navigate(`/form?game=${gameKey}`)}>
                JOGAR
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameSelection;