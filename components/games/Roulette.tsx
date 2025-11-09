import React, { useState, useEffect } from 'react';
import RouletteWheel from 'react-roulette-pro';
import 'react-roulette-pro/dist/index.css';
import Button from '../common/Button';

interface Prize {
  id: number;
  name: string;
  image_url: string;
  color: string;
  probability: number;
}

interface RouletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSpinComplete: (prize: Prize) => void;
  prizes: Prize[];
  winningPrize: Prize | null;
}

const Roulette: React.FC<RouletteProps> = ({
  isOpen,
  onClose,
  onSpinComplete,
  prizes,
  winningPrize
}) => {
  const [spinning, setSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [prizeIndex, setPrizeIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // Prepara os dados da roleta no formato esperado pela biblioteca
  const rouletteItems = prizes.map((prize) => ({
    id: prize.id.toString(),
    image: prize.image_url,
    text: prize.name,
  }));

  useEffect(() => {
    if (winningPrize && prizes.length > 0) {
      // Encontra o índice do prêmio vencedor
      const index = prizes.findIndex(p => p.id === winningPrize.id);
      if (index !== -1) {
        setPrizeIndex(index);
      }
    }
  }, [winningPrize, prizes]);

  const handleSpin = () => {
    if (!spinning && !hasSpun && winningPrize) {
      setSpinning(true);
      setHasSpun(true);
    }
  };

  const handleSpinEnd = () => {
    setSpinning(false);
    setTimeout(() => {
      setShowResult(true);
      if (winningPrize) {
        onSpinComplete(winningPrize);
      }
    }, 500);
  };

  const handleClose = () => {
    setShowResult(false);
    setHasSpun(false);
    setSpinning(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        style={{ 
          backgroundColor: 'var(--color-background)',
          borderColor: 'var(--color-primary)',
          borderWidth: '4px'
        }}
      >
        {/* Header */}
        <div 
          className="p-6 text-center border-b-4"
          style={{ borderColor: 'var(--color-primary)' }}
        >
          <h2 
            className="text-4xl font-bold mb-2"
            style={{ 
              color: 'var(--color-primary)',
              fontFamily: 'var(--font-primary)'
            }}
          >
            🎰 Roleta de Prêmios
          </h2>
          <p 
            className="text-xl"
            style={{ 
              color: 'var(--color-text-secondary)',
              fontFamily: 'var(--font-secondary)'
            }}
          >
            {!hasSpun ? 'Clique no botão para girar!' : 'Girando...'}
          </p>
        </div>

        {/* Roleta */}
        <div className="p-8 flex flex-col items-center justify-center">
          {prizes.length > 0 ? (
            <div className="w-full max-w-2xl">
              <RouletteWheel
                prizes={rouletteItems}
                prizeIndex={prizeIndex}
                start={spinning}
                onPrizeDefined={handleSpinEnd}
                spinningTime={5}
                options={{
                  withoutAnimation: false,
                  stopInCenter: true
                }}
                defaultDesignOptions={{
                  prizesWithText: true,
                  hideCenterDelimiter: false
                }}
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <p 
                className="text-2xl"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Carregando prêmios...
              </p>
            </div>
          )}

          {/* Botão de Girar */}
          {!hasSpun && prizes.length > 0 && (
            <div className="mt-8 w-full max-w-md">
              <Button
                onClick={handleSpin}
                disabled={spinning}
                className="w-full py-6 text-2xl font-bold"
              >
                {spinning ? '🎲 GIRANDO...' : '🎲 GIRAR ROLETA'}
              </Button>
            </div>
          )}

          {/* Resultado */}
          {showResult && winningPrize && (
            <div className="mt-8 w-full max-w-md">
              <div 
                className="p-6 rounded-xl text-center border-4"
                style={{ 
                  backgroundColor: winningPrize.color + '20',
                  borderColor: winningPrize.color
                }}
              >
                <h3 
                  className="text-3xl font-bold mb-4"
                  style={{ color: 'var(--color-success)' }}
                >
                  🎉 Parabéns!
                </h3>
                <p 
                  className="text-2xl font-semibold mb-4"
                  style={{ color: 'var(--color-text)' }}
                >
                  Você ganhou:
                </p>
                <div className="mb-4">
                  <img 
                    src={winningPrize.image_url} 
                    alt={winningPrize.name}
                    className="w-32 h-32 mx-auto rounded-lg shadow-lg object-cover"
                  />
                </div>
                <p 
                  className="text-3xl font-bold"
                  style={{ color: winningPrize.color }}
                >
                  {winningPrize.name}
                </p>
              </div>

              <Button
                onClick={handleClose}
                className="w-full mt-6 py-4 text-xl"
              >
                CONTINUAR
              </Button>
            </div>
          )}
        </div>

        {/* Footer com instruções */}
        {!showResult && (
          <div 
            className="p-4 text-center border-t-2"
            style={{ borderColor: 'var(--color-text-secondary)' }}
          >
            <p 
              className="text-sm"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Você tem uma chance de girar a roleta e ganhar prêmios incríveis!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Roulette;

