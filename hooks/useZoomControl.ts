import { useEffect, useState } from 'react';

/**
 * Hook personalizado para controlar zoom com Ctrl+Scroll
 * Permite ao usuário aumentar/diminuir o tamanho da interface
 */
export function useZoomControl() {
  const [zoomLevel, setZoomLevel] = useState(1);
  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 2.0;
  const ZOOM_STEP = 0.1;

  useEffect(() => {
    // Declarar as funções primeiro, antes de usá-las
    const showZoomNotification = (zoom: number) => {
      // Remove notificação anterior se existir
      const existingNotification = document.getElementById('zoom-notification');
      if (existingNotification) {
        existingNotification.remove();
      }

      // Cria nova notificação
      const notification = document.createElement('div');
      notification.id = 'zoom-notification';
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: bold;
        z-index: 10000;
        pointer-events: none;
        transition: opacity 0.3s ease;
      `;
      notification.textContent = `🔍 Zoom: ${(zoom * 100).toFixed(0)}%`;
      document.body.appendChild(notification);

      // Remove após 1.5 segundos
      setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
      }, 1500);
    };

    const applyZoom = (zoom: number) => {
      const root = document.documentElement;
      
      // Define o zoom do usuário
      root.style.setProperty('--user-zoom', zoom.toString());
      
      // Combina com o zoom automático (se existir)
      const autoZoom = parseFloat(root.style.getPropertyValue('--auto-zoom') || '1');
      const finalZoom = autoZoom * zoom;
      
      // Aplica o zoom final
      root.style.setProperty('zoom', finalZoom.toString());
      
      console.log(`🔍 [Zoom] User: ${zoom}x | Auto: ${autoZoom}x | Final: ${finalZoom.toFixed(2)}x`);
      
      // Dispara evento customizado para que outros componentes possam reagir
      window.dispatchEvent(new CustomEvent('user-zoom-change', { detail: { zoom } }));
      
      // Mostra notificação visual temporária
      showZoomNotification(zoom);
    };

    // Carrega o zoom salvo do localStorage
    const savedZoom = localStorage.getItem('app-zoom-level');
    if (savedZoom) {
      const zoom = parseFloat(savedZoom);
      if (zoom >= MIN_ZOOM && zoom <= MAX_ZOOM) {
        setZoomLevel(zoom);
        applyZoom(zoom);
      }
    }

    const handleWheel = (event: WheelEvent) => {
      // Detecta Ctrl+Scroll ou Cmd+Scroll (Mac)
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();

        setZoomLevel((prevZoom) => {
          let newZoom = prevZoom;

          // Scroll para cima (zoom in)
          if (event.deltaY < 0) {
            newZoom = Math.min(prevZoom + ZOOM_STEP, MAX_ZOOM);
          }
          // Scroll para baixo (zoom out)
          else {
            newZoom = Math.max(prevZoom - ZOOM_STEP, MIN_ZOOM);
          }

          // Arredonda para 1 casa decimal
          newZoom = Math.round(newZoom * 10) / 10;

          console.log(`🔍 [Zoom] ${(newZoom * 100).toFixed(0)}%`);

          // Aplica o zoom
          applyZoom(newZoom);

          // Salva no localStorage
          localStorage.setItem('app-zoom-level', newZoom.toString());

          return newZoom;
        });
      }
    };

    // Adiciona listener com { passive: false } para permitir preventDefault
    document.addEventListener('wheel', handleWheel, { passive: false });

    // Listener para atalhos de teclado
    const handleKeyboard = (event: KeyboardEvent) => {
      // Ctrl+0 ou Cmd+0 - Reseta zoom
      if ((event.ctrlKey || event.metaKey) && event.key === '0') {
        event.preventDefault();
        setZoomLevel(1);
        applyZoom(1);
        localStorage.setItem('app-zoom-level', '1');
        console.log('🔍 [Zoom] Resetado para 100%');
      }

      // Ctrl++ ou Ctrl+= - Aumenta zoom
      if ((event.ctrlKey || event.metaKey) && (event.key === '+' || event.key === '=')) {
        event.preventDefault();
        setZoomLevel((prev) => {
          const newZoom = Math.min(prev + ZOOM_STEP, MAX_ZOOM);
          applyZoom(newZoom);
          localStorage.setItem('app-zoom-level', newZoom.toString());
          return newZoom;
        });
      }

      // Ctrl+- - Diminui zoom
      if ((event.ctrlKey || event.metaKey) && event.key === '-') {
        event.preventDefault();
        setZoomLevel((prev) => {
          const newZoom = Math.max(prev - ZOOM_STEP, MIN_ZOOM);
          applyZoom(newZoom);
          localStorage.setItem('app-zoom-level', newZoom.toString());
          return newZoom;
        });
      }
    };

    document.addEventListener('keydown', handleKeyboard);

    console.log('🔍 [Zoom Control] Ativado');
    console.log('   Ctrl+Scroll: Aumentar/Diminuir');
    console.log('   Ctrl+0: Resetar zoom');
    console.log('   Ctrl++: Aumentar zoom');
    console.log('   Ctrl+-: Diminuir zoom');

    // Cleanup
    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('keydown', handleKeyboard);
    };
  }, []);

  const resetZoom = () => {
    setZoomLevel(1);
    const root = document.documentElement;
    root.style.setProperty('--user-zoom', '1');
    
    // Recalcula com zoom automático
    const autoZoom = parseFloat(root.style.getPropertyValue('--auto-zoom') || '1');
    root.style.setProperty('zoom', autoZoom.toString());
    
    localStorage.setItem('app-zoom-level', '1');
    console.log('🔍 [Zoom] Resetado para 100%');
  };

  return {
    zoomLevel,
    resetZoom,
  };
}

export default useZoomControl;

