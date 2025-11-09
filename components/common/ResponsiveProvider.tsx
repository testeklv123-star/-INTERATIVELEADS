import React, { useEffect, useState } from 'react';
import { useResponsiveScreen } from '../../hooks/useResponsiveScreen';

interface ResponsiveProviderProps {
  children: React.ReactNode;
}

/**
 * Provider que aplica estilos responsivos globalmente
 * Injeta variáveis CSS dinâmicas baseadas na resolução da tela
 */
export const ResponsiveProvider: React.FC<ResponsiveProviderProps> = ({ children }) => {
  const { scale, windowSize, resolutionCategory, isSmallScreen, isPortrait } = useResponsiveScreen();
  const [userZoomTrigger, setUserZoomTrigger] = useState(0);

  // Listener para mudanças no zoom do usuário
  useEffect(() => {
    const handleUserZoomChange = () => {
      setUserZoomTrigger(prev => prev + 1);
    };
    
    window.addEventListener('user-zoom-change', handleUserZoomChange);
    
    return () => {
      window.removeEventListener('user-zoom-change', handleUserZoomChange);
    };
  }, []);

  useEffect(() => {
    console.log('🎨 [ResponsiveProvider] Aplicando escalas responsivas:');
    console.log(`   Resolução: ${windowSize.width}x${windowSize.height}`);
    console.log(`   Categoria: ${resolutionCategory}`);
    console.log(`   Orientação: ${isPortrait ? 'Portrait' : 'Landscape'}`);
    console.log(`   Escala: ${scale.fontSize.toFixed(2)}x`);
    
    // Define variáveis CSS globais para responsividade
    const root = document.documentElement;
    
    // Adiciona classe de orientação ao body
    document.body.classList.remove('is-portrait', 'is-landscape');
    document.body.classList.add(isPortrait ? 'is-portrait' : 'is-landscape');
    
    // Escala base
    root.style.setProperty('--responsive-scale', scale.fontSize.toString());
    root.style.setProperty('--responsive-spacing-scale', scale.spacing.toString());
    
    // Tamanhos de fonte responsivos
    root.style.setProperty('--font-size-xs', `${0.75 * scale.fontSize}rem`);
    root.style.setProperty('--font-size-sm', `${0.875 * scale.fontSize}rem`);
    root.style.setProperty('--font-size-base', `${1 * scale.fontSize}rem`);
    root.style.setProperty('--font-size-lg', `${1.125 * scale.fontSize}rem`);
    root.style.setProperty('--font-size-xl', `${1.25 * scale.fontSize}rem`);
    root.style.setProperty('--font-size-2xl', `${1.5 * scale.fontSize}rem`);
    root.style.setProperty('--font-size-3xl', `${1.875 * scale.fontSize}rem`);
    root.style.setProperty('--font-size-4xl', `${2.25 * scale.fontSize}rem`);
    root.style.setProperty('--font-size-5xl', `${3 * scale.fontSize}rem`);
    root.style.setProperty('--font-size-6xl', `${3.75 * scale.fontSize}rem`);
    root.style.setProperty('--font-size-7xl', `${4.5 * scale.fontSize}rem`);
    root.style.setProperty('--font-size-8xl', `${6 * scale.fontSize}rem`);
    root.style.setProperty('--font-size-9xl', `${8 * scale.fontSize}rem`);
    
    // Espaçamentos responsivos
    root.style.setProperty('--spacing-1', `${4 * scale.spacing}px`);
    root.style.setProperty('--spacing-2', `${8 * scale.spacing}px`);
    root.style.setProperty('--spacing-3', `${12 * scale.spacing}px`);
    root.style.setProperty('--spacing-4', `${16 * scale.spacing}px`);
    root.style.setProperty('--spacing-5', `${20 * scale.spacing}px`);
    root.style.setProperty('--spacing-6', `${24 * scale.spacing}px`);
    root.style.setProperty('--spacing-8', `${32 * scale.spacing}px`);
    root.style.setProperty('--spacing-10', `${40 * scale.spacing}px`);
    root.style.setProperty('--spacing-12', `${48 * scale.spacing}px`);
    root.style.setProperty('--spacing-16', `${64 * scale.spacing}px`);
    root.style.setProperty('--spacing-20', `${80 * scale.spacing}px`);
    root.style.setProperty('--spacing-24', `${96 * scale.spacing}px`);
    
    // Tamanhos de ícones
    root.style.setProperty('--icon-size-sm', `${16 * scale.iconSize}px`);
    root.style.setProperty('--icon-size-md', `${24 * scale.iconSize}px`);
    root.style.setProperty('--icon-size-lg', `${32 * scale.iconSize}px`);
    root.style.setProperty('--icon-size-xl', `${48 * scale.iconSize}px`);
    root.style.setProperty('--icon-size-2xl', `${64 * scale.iconSize}px`);
    
    // Dimensões da viewport
    root.style.setProperty('--viewport-width', `${windowSize.width}px`);
    root.style.setProperty('--viewport-height', `${windowSize.height}px`);
    
    // Border radius responsivo
    const borderRadiusBase = isSmallScreen ? 8 : 12;
    root.style.setProperty('--border-radius-sm', `${borderRadiusBase * 0.5 * scale.spacing}px`);
    root.style.setProperty('--border-radius', `${borderRadiusBase * scale.spacing}px`);
    root.style.setProperty('--border-radius-lg', `${borderRadiusBase * 1.5 * scale.spacing}px`);
    root.style.setProperty('--border-radius-xl', `${borderRadiusBase * 2 * scale.spacing}px`);
    root.style.setProperty('--border-radius-full', '9999px');
    
    // Ajusta o zoom automático baseado na resolução
    // Este será COMBINADO com o zoom do usuário (Ctrl+Scroll)
    let autoZoomFactor = 1;
    
    if (isPortrait) {
      // Em portrait, reduz mais o zoom para caber verticalmente
      if (scale.fontSize < 0.6) {
        autoZoomFactor = 0.75;
      } else if (scale.fontSize < 0.8) {
        autoZoomFactor = 0.85;
      } else if (scale.fontSize > 1.5) {
        autoZoomFactor = 1.1;
      }
    } else {
      // Em landscape, ajuste normal
      if (scale.fontSize < 0.7) {
        autoZoomFactor = 0.85;
      } else if (scale.fontSize > 1.3) {
        autoZoomFactor = 1.15;
      }
    }
    
    // Define o zoom automático como variável CSS
    root.style.setProperty('--auto-zoom', autoZoomFactor.toString());
    
    // Combina zoom automático com zoom do usuário
    const userZoom = parseFloat(root.style.getPropertyValue('--user-zoom') || '1');
    const finalZoom = autoZoomFactor * userZoom;
    root.style.setProperty('zoom', finalZoom.toString());
    
    console.log(`   Auto Zoom: ${autoZoomFactor}x`);
    console.log(`   User Zoom: ${userZoom}x`);
    console.log(`   Final Zoom: ${finalZoom.toFixed(2)}x`);
    console.log('✅ [ResponsiveProvider] Variáveis CSS aplicadas com sucesso');
  }, [scale, windowSize, resolutionCategory, isSmallScreen, isPortrait, userZoomTrigger]);

  return <>{children}</>;
};

export default ResponsiveProvider;

