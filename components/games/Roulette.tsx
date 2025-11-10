import React, { useState, useEffect } from 'react';
import RouletteWheel from 'react-roulette-pro';
import 'react-roulette-pro/dist/index.css';
import Button from '../common/Button';
import { Prize } from '../../types';
import { addOpacityToColor } from '../../utils/colorUtils';

// ========== CONSTANTES ==========

/**
 * Constantes de animação da roleta
 */
const ANIMATION_CONSTANTS = {
  /** Duração do giro em segundos */
  SPIN_DURATION_SECONDS: 5,
  /** Delay antes de mostrar resultado em milissegundos */
  RESULT_DISPLAY_DELAY_MS: 500,
} as const;

/**
 * Textos da interface da roleta
 */
const TEXTS = {
  TITLE: '🎰 Roleta de Prêmios',
  INSTRUCTION_SPIN: 'Clique no botão para girar!',
  INSTRUCTION_SPINNING: 'Girando...',
  BUTTON_SPIN: '🎲 GIRAR ROLETA',
  BUTTON_SPINNING: '🎲 GIRANDO...',
  CONGRATULATIONS: '🎉 Parabéns!',
  YOU_WON: 'Você ganhou:',
  CONTINUE: 'CONTINUAR',
  LOADING_PRIZES: 'Carregando prêmios...',
  FOOTER_TEXT: 'Você tem uma chance de girar a roleta e ganhar prêmios incríveis!',
} as const;

/**
 * Estilos reutilizáveis para consistência visual
 */
const STYLES = {
  primaryText: {
    color: 'var(--color-primary)',
    fontFamily: 'var(--font-primary)',
  },
  secondaryText: {
    color: 'var(--color-text-secondary)',
    fontFamily: 'var(--font-secondary)',
  },
  primaryBorder: {
    borderColor: 'var(--color-primary)',
  },
  successText: {
    color: 'var(--color-success)',
  },
  defaultText: {
    color: 'var(--color-text)',
  },
} as const;

// ========== INTERFACE ==========

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

  // ========== PREPARAÇÃO DE DADOS ==========

  /**
   * Prepara os dados da roleta no formato esperado pela biblioteca react-roulette-pro
   */
  const rouletteItems = prizes.map((prize) => ({
    id: prize.id.toString(),
    image: prize.image_url || '',
    text: prize.name || prize.label,
  }));

  // ========== EFEITOS ==========

  /**
   * Atualiza o índice do prêmio vencedor quando ele é definido
   */
  useEffect(() => {
    if (winningPrize && prizes.length > 0) {
      const index = prizes.findIndex(p => p.id === winningPrize.id);
      if (index !== -1) {
        setPrizeIndex(index);
      }
    }
  }, [winningPrize, prizes]);

  // ========== HANDLERS ==========

  /**
   * Inicia o giro da roleta
   * Só permite girar uma vez e quando há um prêmio definido
   */
  const handleSpin = (): void => {
    const canSpin = !spinning && !hasSpun && winningPrize;
    
    if (canSpin) {
      setSpinning(true);
      setHasSpun(true);
    }
  };

  /**
   * Callback executado quando o giro termina
   * Aguarda um delay antes de mostrar o resultado
   */
  const handleSpinEnd = (): void => {
    setSpinning(false);
    
    setTimeout(() => {
      setShowResult(true);
      if (winningPrize) {
        onSpinComplete(winningPrize);
      }
    }, ANIMATION_CONSTANTS.RESULT_DISPLAY_DELAY_MS);
  };

  /**
   * Fecha o modal e reseta todos os estados
   */
  const handleClose = (): void => {
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
          style={STYLES.primaryBorder}
        >
          <h2 
            className="text-4xl font-bold mb-2"
            style={STYLES.primaryText}
          >
            {TEXTS.TITLE}
          </h2>
          <p 
            className="text-xl"
            style={STYLES.secondaryText}
          >
            {!hasSpun ? TEXTS.INSTRUCTION_SPIN : TEXTS.INSTRUCTION_SPINNING}
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
                spinningTime={ANIMATION_CONSTANTS.SPIN_DURATION_SECONDS}
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
                style={STYLES.secondaryText}
              >
                {TEXTS.LOADING_PRIZES}
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
                {spinning ? TEXTS.BUTTON_SPINNING : TEXTS.BUTTON_SPIN}
              </Button>
            </div>
          )}

          {/* Resultado */}
          {showResult && winningPrize && (
            <div className="mt-8 w-full max-w-md">
              <div 
                className="p-6 rounded-xl text-center border-4"
                style={{ 
                  backgroundColor: addOpacityToColor(winningPrize.color, '20'),
                  borderColor: winningPrize.color
                }}
              >
                <h3 
                  className="text-3xl font-bold mb-4"
                  style={STYLES.successText}
                >
                  {TEXTS.CONGRATULATIONS}
                </h3>
                <p 
                  className="text-2xl font-semibold mb-4"
                  style={STYLES.defaultText}
                >
                  {TEXTS.YOU_WON}
                </p>
                {winningPrize.image_url && (
                  <div className="mb-4">
                    <img 
                      src={winningPrize.image_url} 
                      alt={winningPrize.name}
                      className="w-32 h-32 mx-auto rounded-lg shadow-lg object-cover"
                    />
                  </div>
                )}
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
                {TEXTS.CONTINUE}
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
              style={STYLES.secondaryText}
            >
              {TEXTS.FOOTER_TEXT}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Roulette;

