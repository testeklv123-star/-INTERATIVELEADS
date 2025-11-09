import { useState, useEffect } from 'react';

/**
 * Interface para informações de display
 */
export interface DisplayInfo {
  width: number;
  height: number;
  scaleFactor: number;
}

/**
 * Interface para tamanho da janela/viewport
 */
export interface WindowSize {
  width: number;
  height: number;
}

/**
 * Interface para escala responsiva
 */
export interface ResponsiveScale {
  fontSize: number;
  spacing: number;
  iconSize: number;
}

/**
 * Hook personalizado para detectar e adaptar à resolução da tela
 * 
 * @returns {Object} Informações de display e funções de utilidade
 * 
 * @example
 * const { windowSize, displayInfo, scale, isPortrait, isLandscape } = useResponsiveScreen();
 * 
 * // Usar no estilo
 * <div style={{ fontSize: `${scale.fontSize}rem` }}>...</div>
 */
export function useResponsiveScreen() {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
  });

  const [displayInfo, setDisplayInfo] = useState<DisplayInfo | null>(null);

  useEffect(() => {
    // Função para atualizar o tamanho da janela
    const handleResize = () => {
      const newSize = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      
      console.log(`📏 [useResponsiveScreen] Janela redimensionada: ${newSize.width}x${newSize.height}`);
      setWindowSize(newSize);
    };

    // Listener para resize do navegador
    window.addEventListener('resize', handleResize);

    // Se estiver rodando no Electron, escuta eventos de display
    if (window.electronAPI) {
      console.log('🖥️  [useResponsiveScreen] Electron detectado - configurando listeners');
      
      // Recebe informações do display do Electron
      window.electronAPI.onDisplayInfo((info: DisplayInfo) => {
        console.log('📡 [useResponsiveScreen] Display info recebido:', info);
        setDisplayInfo(info);
      });

      // Recebe eventos de redimensionamento do Electron
      window.electronAPI.onWindowResized((size: WindowSize) => {
        console.log('🔄 [useResponsiveScreen] Window resized event:', size);
        setWindowSize(size);
      });
    }

    // Chama uma vez no mount
    handleResize();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (window.electronAPI && window.electronAPI.removeDisplayListeners) {
        window.electronAPI.removeDisplayListeners();
      }
    };
  }, []);

  /**
   * Calcula escala baseada na resolução
   * Resolução base: 1920x1080 (Full HD)
   */
  const calculateScale = (): ResponsiveScale => {
    const baseWidth = 1920;
    const baseHeight = 1080;
    
    // Calcula escala baseada na largura e altura
    const widthScale = windowSize.width / baseWidth;
    const heightScale = windowSize.height / baseHeight;
    
    // Usa a menor escala para garantir que tudo caiba na tela
    const scale = Math.min(widthScale, heightScale);
    
    return {
      fontSize: scale,           // Multiplica os tamanhos de fonte
      spacing: scale,            // Multiplica espaçamentos/padding
      iconSize: scale,           // Multiplica tamanhos de ícones
    };
  };

  const scale = calculateScale();

  /**
   * Detecta orientação da tela
   */
  const isPortrait = windowSize.height > windowSize.width;
  const isLandscape = windowSize.width > windowSize.height;

  /**
   * Detecta categoria de resolução
   */
  const getResolutionCategory = () => {
    if (windowSize.width >= 3840) return '4K';
    if (windowSize.width >= 2560) return 'QHD';
    if (windowSize.width >= 1920) return 'Full HD';
    if (windowSize.width >= 1280) return 'HD';
    return 'SD';
  };

  /**
   * Verifica se é uma tela pequena
   */
  const isSmallScreen = windowSize.width < 1280 || windowSize.height < 720;
  const isMediumScreen = windowSize.width >= 1280 && windowSize.width < 1920;
  const isLargeScreen = windowSize.width >= 1920;

  /**
   * Calcula tamanho de fonte responsivo em rem
   * @param baseSize Tamanho base em rem (padrão: 1)
   */
  const responsiveFontSize = (baseSize: number = 1): number => {
    return baseSize * scale.fontSize;
  };

  /**
   * Calcula espaçamento responsivo em pixels
   * @param baseSpacing Espaçamento base em px
   */
  const responsiveSpacing = (baseSpacing: number): number => {
    return Math.round(baseSpacing * scale.spacing);
  };

  return {
    // Tamanho da janela/viewport
    windowSize,
    
    // Informações do display (Electron)
    displayInfo,
    
    // Escala calculada
    scale,
    
    // Orientação
    isPortrait,
    isLandscape,
    
    // Categoria de resolução
    resolutionCategory: getResolutionCategory(),
    
    // Tamanhos de tela
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    
    // Funções utilitárias
    responsiveFontSize,
    responsiveSpacing,
  };
}

export default useResponsiveScreen;

