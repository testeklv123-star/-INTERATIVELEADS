import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenantStore } from '../../stores/tenantStore';
import { Prize } from '../../types';
import { selectPrizeByProbability } from '../../utils/prizeSelector';
import Button from '../common/Button';
import Modal from '../common/Modal';
import DynamicLogo from '../common/DynamicLogo';

// ========== CONSTANTES ==========

const ANIMATION_CONSTANTS = {
  /** Duração da animação de giro em milissegundos */
  SPIN_DURATION_MS: 6000,
  /** Número de voltas completas antes de parar */
  SPIN_CYCLES: 5,
  /** Ângulo do ponteiro (topo = 270° em coordenadas SVG) */
  POINTER_ANGLE: 270,
} as const;

const TEXTS = {
  TITLE: 'Gire a Roda da Fortuna!',
  BUTTON_SPIN: 'GIRAR!',
  BUTTON_SPINNING: 'GIRANDO...',
  MODAL_TITLE: 'Parabéns!',
  MODAL_TEXT: 'Você ganhou:',
} as const;

// Helper function to create SVG path for a wheel slice
const getPath = (sliceAngle: number, size: number, index: number): string => {
  const radius = size / 2;
  const startAngle = sliceAngle * index;
  const endAngle = startAngle + sliceAngle;

  const x1 = radius + radius * Math.cos(Math.PI * startAngle / 180);
  const y1 = radius + radius * Math.sin(Math.PI * startAngle / 180);
  const x2 = radius + radius * Math.cos(Math.PI * endAngle / 180);
  const y2 = radius + radius * Math.sin(Math.PI * endAngle / 180);

  const largeArcFlag = sliceAngle > 180 ? 1 : 0;

  return `M${radius},${radius} L${x1},${y1} A${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2} Z`;
};

const PrizeWheel: React.FC = () => {
  const navigate = useNavigate();
  const tenantConfig = useTenantStore((state) => state.tenantConfig);
  const prizes = tenantConfig?.games_config.prize_wheel.prizes || [];
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);

  /**
   * Executa o giro da roda e seleciona um prêmio baseado em probabilidade
   */
  const spinWheel = (): void => {
    if (isSpinning) return;
    setIsSpinning(true);

    // Usa função utilitária para seleção baseada em probabilidade
    const selectedPrizeIndex = selectPrizeByProbability(prizes);

    // Calcula ângulos para animação
    const sliceAngle = 360 / prizes.length;
    const prizeAngle = sliceAngle * selectedPrizeIndex + (sliceAngle / 2);
    
    // Alinha com o ponteiro no topo (270° em coordenadas SVG)
    const rotationNeeded = ANIMATION_CONSTANTS.POINTER_ANGLE - prizeAngle;
    const randomOffset = (Math.random() - 0.5) * (sliceAngle * 0.8);
    const finalAngle = rotationNeeded + randomOffset;
    
    // Calcula rotação final com múltiplas voltas
    const newRotation = rotation + (360 * ANIMATION_CONSTANTS.SPIN_CYCLES) + finalAngle;
    setRotation(newRotation);

    // Define o prêmio após a animação
    setTimeout(() => {
      setIsSpinning(false);
      setWonPrize(prizes[selectedPrizeIndex]);
    }, ANIMATION_CONSTANTS.SPIN_DURATION_MS);
  };

  const wheelSize = 600;
  const sliceAngle = 360 / prizes.length;

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center p-4 md:p-8 py-8 overflow-auto" style={{backgroundColor: 'var(--color-background)'}}>
      <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-8" style={{color: 'var(--color-primary)'}}>
        {TEXTS.TITLE}
      </h1>
      
      <div className="relative flex justify-center items-center mb-4 md:mb-8 w-full max-w-[90vmin] aspect-square">
        <div 
            className="absolute top-[-20px] md:top-[-25px] z-10 w-0 h-0"
            style={{
                borderLeft: '20px solid transparent',
                borderRight: '20px solid transparent',
                borderTop: '40px solid var(--color-accent)'
            }}
        />

        <div 
          className="relative transition-transform ease-out w-full h-full"
          style={{ 
            transform: `rotate(${rotation}deg)`,
            transitionDuration: `${ANIMATION_CONSTANTS.SPIN_DURATION_MS}ms`
          }}
        >
          <svg width="100%" height="100%" viewBox={`0 0 ${wheelSize} ${wheelSize}`} className="w-full h-full">
            {prizes.map((prize, index) => (
              <g key={prize.id}>
                <path d={getPath(sliceAngle, wheelSize, index)} fill={prize.color} />
                <text
                  x={wheelSize / 2}
                  y={wheelSize / 4}
                  transform={`rotate(${sliceAngle * index + sliceAngle / 2}, ${wheelSize / 2}, ${wheelSize / 2})`}
                  textAnchor="middle"
                  dy=".3em"
                  className="text-2xl font-bold"
                  fill="#FFFFFF"
                >
                  {prize.label}
                </text>
              </g>
            ))}
          </svg>
          <div className="absolute inset-0 flex justify-center items-center">
             <DynamicLogo type="center" className="w-24 h-24 md:w-40 md:h-40 object-contain rounded-full bg-white p-2 shadow-lg"/>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <Button onClick={spinWheel} disabled={isSpinning}>
          {isSpinning ? TEXTS.BUTTON_SPINNING : TEXTS.BUTTON_SPIN}
        </Button>
      </div>

      <Modal
        isOpen={!!wonPrize}
        onClose={() => navigate('/thank-you')}
        title={TEXTS.MODAL_TITLE}
      >
        <p>{TEXTS.MODAL_TEXT}</p>
        <p className="font-bold text-3xl mt-2">{wonPrize?.name}</p>
      </Modal>
    </div>
  );
};

export default PrizeWheel;