import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenantStore } from '../../stores/tenantStore';
import Button from '../common/Button';

const ScratchCard: React.FC = () => {
    const navigate = useNavigate();
    const tenantConfig = useTenantStore((state) => state.tenantConfig);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [prize, setPrize] = useState<string>('');
    const [isRevealed, setIsRevealed] = useState(false);

    useEffect(() => {
        const prizes = tenantConfig?.games_config.scratch_card.prizes || [];
        if (prizes.length > 0) {
            const randomIndex = Math.floor(Math.random() * prizes.length);
            setPrize(prizes[randomIndex]);
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
        ctx.fillText('RASPE AQUI', canvas.width / 2, canvas.height / 2);

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

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        setIsDrawing(true);
        draw(e);
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        checkReveal(); // Check percentage only when drawing stops
    };
    
    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        const { x, y } = getPosition(e);
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 40, 0, Math.PI * 2, false);
        ctx.fill();
    };

    const checkReveal = () => {
        if (isRevealed) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d', { willReadFrequently: true });
        if (!ctx || !canvas) return;

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let transparentPixels = 0;
        for (let i = 0; i < data.length; i += 4) {
            // Check for transparent pixels
            if (data[i + 3] === 0) {
                transparentPixels++;
            }
        }
        
        const totalPixels = canvas.width * canvas.height;
        const percentage = (transparentPixels / totalPixels) * 100;
        
        if (percentage > 60) {
            setIsRevealed(true);
        }
    };

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center p-8 overflow-hidden" style={{backgroundColor: 'var(--color-background)'}}>
            <h1 className="text-5xl font-bold mb-12 text-center" style={{color: 'var(--color-primary)'}}>Raspadinha Premiada!</h1>

            <div className="relative w-full max-w-2xl aspect-[1.618] shadow-2xl" style={{borderRadius: 'var(--border-radius)'}}>
                <div 
                    className="absolute inset-0 flex justify-center items-center text-center p-4"
                    style={{
                        backgroundColor: 'var(--color-accent)',
                        color: 'var(--color-button-primary-text)',
                        borderRadius: 'var(--border-radius)'
                    }}
                >
                    <div>
                        <p className="text-2xl">Parabéns! Você ganhou:</p>
                        <p className="text-6xl font-bold mt-4">{prize}</p>
                    </div>
                </div>
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
                    style={{borderRadius: 'var(--border-radius)'}}
                />
            </div>
            
            <div className={`mt-12 transition-opacity duration-500 ${isRevealed ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <Button onClick={() => navigate('/thank-you')}>
                    CONTINUAR
                </Button>
            </div>
        </div>
    );
};

export default ScratchCard;