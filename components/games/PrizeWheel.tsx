import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTenantStore } from '../../stores/tenantStore';
import { Prize } from '../../types';
import Button from '../common/Button';
import Modal from '../common/Modal';
import DynamicLogo from '../common/DynamicLogo';

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

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const totalProbability = prizes.reduce((sum, p) => sum + p.probability, 0);
    let random = Math.random() * totalProbability;
    
    let selectedPrizeIndex = -1;
    for (let i = 0; i < prizes.length; i++) {
        if (random < prizes[i].probability) {
            selectedPrizeIndex = i;
            break;
        }
        random -= prizes[i].probability;
    }
    if (selectedPrizeIndex === -1) selectedPrizeIndex = prizes.length -1;

    const sliceAngle = 360 / prizes.length;
    const prizeAngle = sliceAngle * selectedPrizeIndex + (sliceAngle / 2);
    
    // Correction: Align with the top pointer (270 degrees in SVG coordinates)
    const POINTER_ANGLE = 270;
    const rotationNeeded = POINTER_ANGLE - prizeAngle;
    const randomOffset = (Math.random() - 0.5) * (sliceAngle * 0.8);
    const finalAngle = rotationNeeded + randomOffset;
    
    const spinCycles = 5;
    const newRotation = rotation + (360 * spinCycles) + finalAngle;
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setWonPrize(prizes[selectedPrizeIndex]);
    }, 6000); // Corresponds to animation duration
  };

  const wheelSize = 600;
  const sliceAngle = 360 / prizes.length;

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center p-8 overflow-hidden" style={{backgroundColor: 'var(--color-background)'}}>
      <h1 className="text-5xl font-bold mb-12" style={{color: 'var(--color-primary)'}}>Gire a Roda da Fortuna!</h1>
      
      <div className="relative flex justify-center items-center mb-12">
        <div 
            className="absolute top-[-25px] z-10 w-0 h-0"
            style={{
                borderLeft: '25px solid transparent',
                borderRight: '25px solid transparent',
                borderTop: '50px solid var(--color-accent)'
            }}
        />

        <div 
          className="relative transition-transform duration-[6000ms] ease-out"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <svg width={wheelSize} height={wheelSize} viewBox={`0 0 ${wheelSize} ${wheelSize}`}>
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
             <DynamicLogo type="center" className="w-40 h-40 object-contain rounded-full bg-white p-2 shadow-lg"/>
          </div>
        </div>
      </div>
      
      <Button onClick={spinWheel} disabled={isSpinning}>
        {isSpinning ? 'GIRANDO...' : 'GIRAR!'}
      </Button>

      <Modal
        isOpen={!!wonPrize}
        onClose={() => navigate('/thank-you')}
        title="Parabéns!"
      >
        <p>Você ganhou:</p>
        <p className="font-bold text-3xl mt-2">{wonPrize?.name}</p>
      </Modal>
    </div>
  );
};

export default PrizeWheel;