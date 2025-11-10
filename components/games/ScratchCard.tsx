import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenantStore } from '../../stores/tenantStore';
import { logger } from '../../utils/logger';
import Button from '../common/Button';

// ========== CONSTANTES ==========

const SCRATCH_CONSTANTS = {
  /** Raio do pincel de raspagem */
  BRUSH_RADIUS: 40,
  /** Percentual mínimo raspado para revelar (0-100) */
  REVEAL_THRESHOLD_PERCENT: 60,
} as const;

const TEXTS = {
  TITLE: 'Raspadinha Premiada!',
  SCRATCH_HERE: 'RASPE AQUI',
  CONGRATULATIONS: 'Parabéns! Você ganhou:',
  DEFAULT_PRIZE: 'Prêmio Surpresa',
  BUTTON_CONTINUE: 'CONTINUAR',
} as const;

const ScratchCard: React.FC = () => {
    const navigate = useNavigate();
    const tenantConfig = useTenantStore((state) => state.tenantConfig);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [prize, setPrize] = useState<string>('');
    const [isRevealed, setIsRevealed] = useState(false);

    /**
     * Seleciona um prêmio aleatório ao montar o componente
     */
    useEffect(() => {
        const prizes = tenantConfig?.games_config.scratch_card.prizes || [];
        logger.debug('ScratchCard', 'Prêmios disponíveis:', prizes);
        
        if (prizes.length > 0) {
            const randomIndex = Math.floor(Math.random() * prizes.length);
            const selectedPrize = prizes[randomIndex];
            // Se o prêmio é um objeto, pega o nome, senão usa como string
            const prizeName = typeof selectedPrize === 'object' ? selectedPrize.name : selectedPrize;
            logger.debug('ScratchCard', 'Prêmio selecionado:', prizeName);
            setPrize(prizeName);
        } else {
            logger.warn('ScratchCard: Nenhum prêmio configurado!');
            setPrize(TEXTS.DEFAULT_PRIZE);
        }
    }, [tenantConfig]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const parent = canvas?.parentElement;
        if (!canvas || !parent) return;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;
        
        const rect = parent.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        const overlayColor = tenantConfig?.games_config.scratch_card.overlay_color || '#c0c0c0';
        ctx.fillStyle = overlayColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = `bold ${canvas.width / 12}px ${getComputedStyle(document.documentElement).getPropertyValue('--font-primary') || 'sans-serif'}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(TEXTS.SCRATCH_HERE, canvas.width / 2, canvas.height / 2);

    }, [prize, tenantConfig]);

    const getPosition = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top,
        };
    };

    /**
     * Inicia o desenho da raspagem
     */
    const startDrawing = (e: React.MouseEvent | React.TouchEvent): void => {
        e.preventDefault();
        logger.debug('ScratchCard', 'Iniciando raspagem');
        setIsDrawing(true);
        
        // Desenha imediatamente no ponto inicial
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx) {
            logger.error('ScratchCard: Contexto do canvas não disponível');
            return;
        }
        
        const { x, y } = getPosition(e);
        logger.debug('ScratchCard', 'Posição:', { x, y });
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, SCRATCH_CONSTANTS.BRUSH_RADIUS, 0, Math.PI * 2, false);
        ctx.fill();
    };

    /**
     * Para o desenho e verifica se já revelou o suficiente
     */
    const stopDrawing = (): void => {
        setIsDrawing(false);
        checkReveal(); // Verifica percentual apenas quando para de raspar
    };
    
    /**
     * Desenha conforme o usuário arrasta o cursor/dedo
     */
    const draw = (e: React.MouseEvent | React.TouchEvent): void => {
        e.preventDefault();
        if (!isDrawing) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        const { x, y } = getPosition(e);
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, SCRATCH_CONSTANTS.BRUSH_RADIUS, 0, Math.PI * 2, false);
        ctx.fill();
    };

    /**
     * Verifica se o prêmio foi revelado (percentual raspado)
     */
    const checkReveal = (): void => {
        if (isRevealed) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d', { willReadFrequently: true });
        if (!ctx || !canvas) return;

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Conta pixels transparentes
        let transparentPixels = 0;
        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] === 0) { // Canal alpha = 0
                transparentPixels++;
            }
        }
        
        const totalPixels = canvas.width * canvas.height;
        const percentage = (transparentPixels / totalPixels) * 100;
        
        if (percentage > SCRATCH_CONSTANTS.REVEAL_THRESHOLD_PERCENT) {
            setIsRevealed(true);
            logger.debug('ScratchCard', `Revelado! ${percentage.toFixed(1)}% raspado`);
        }
    };

    const backgroundImage = tenantConfig?.games_config.scratch_card.background_image;

    return (
        <div className="w-full min-h-screen flex flex-col justify-center items-center p-4 md:p-8 py-8 overflow-auto" style={{backgroundColor: 'var(--color-background)'}}>
            <h1 className="text-3xl md:text-5xl font-bold mb-6 md:mb-12 text-center" style={{color: 'var(--color-primary)'}}>
                {TEXTS.TITLE}
            </h1>

            <div className="relative w-full max-w-xl md:max-w-2xl aspect-[1.618] shadow-2xl" style={{borderRadius: 'var(--border-radius)'}}>
                {backgroundImage ? (
                    <div 
                        className="absolute inset-0 flex justify-center items-center text-center p-4"
                        style={{
                            backgroundImage: `url(${backgroundImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: 'var(--border-radius)'
                        }}
                    >
                        <div className="bg-black bg-opacity-50 p-8 rounded-lg">
                            <p className="text-2xl text-white">{TEXTS.CONGRATULATIONS}</p>
                            <p className="text-6xl font-bold mt-4 text-white">{prize}</p>
                        </div>
                    </div>
                ) : (
                    <div 
                        className="absolute inset-0 flex justify-center items-center text-center p-4"
                        style={{
                            backgroundColor: 'var(--color-accent)',
                            color: 'var(--color-button-primary-text)',
                            borderRadius: 'var(--border-radius)'
                        }}
                    >
                        <div>
                            <p className="text-2xl">{TEXTS.CONGRATULATIONS}</p>
                            <p className="text-6xl font-bold mt-4">{prize}</p>
                        </div>
                    </div>
                )}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 cursor-grab active:cursor-grabbing"
                    onMouseDown={startDrawing}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onMouseMove={draw}
                    onTouchStart={startDrawing}
                    onTouchEnd={stopDrawing}
                    onTouchMove={draw}
                    style={{
                        borderRadius: 'var(--border-radius)',
                        zIndex: 10,
                        touchAction: 'none'
                    }}
                />
            </div>
            
            <div className={`mt-6 md:mt-12 mb-8 transition-opacity duration-500 ${isRevealed ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <Button onClick={() => navigate('/thank-you')}>
                    {TEXTS.BUTTON_CONTINUE}
                </Button>
            </div>
        </div>
    );
};

export default ScratchCard;