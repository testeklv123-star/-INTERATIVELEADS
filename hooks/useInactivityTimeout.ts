import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTenantStore } from '../stores/tenantStore';

/**
 * Hook para gerenciar timeout por inatividade
 * Retorna automaticamente para a tela inicial após período configurado
 * Ignora timeout em páginas de admin e setup
 */
export function useInactivityTimeout() {
  const navigate = useNavigate();
  const location = useLocation();
  const tenantConfig = useTenantStore((state) => state.tenantConfig);
  const timeoutRef = useRef<number | null>(null);
  
  // Páginas que não devem ter timeout
  const excludedPaths = ['/setup', '/admin'];
  const shouldApplyTimeout = !excludedPaths.some(path => location.pathname.startsWith(path));
  
  const resetTimer = () => {
    if (!shouldApplyTimeout || !tenantConfig?.behavior.auto_return_home) {
      return;
    }
    
    // Limpar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Criar novo timeout
    const timeoutSeconds = tenantConfig.behavior.inactivity_timeout || 30;
    timeoutRef.current = window.setTimeout(() => {
      // Retornar para home apenas se não estiver na home
      if (location.pathname !== '/') {
        console.log('Inatividade detectada - retornando para home');
        navigate('/', { replace: true });
      }
    }, timeoutSeconds * 1000);
  };
  
  useEffect(() => {
    if (!shouldApplyTimeout || !tenantConfig?.behavior.auto_return_home) {
      return;
    }
    
    // Eventos de atividade do usuário
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];
    
    // Resetar timer quando houver atividade
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });
    
    // Iniciar timer
    resetTimer();
    
    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [location.pathname, tenantConfig, shouldApplyTimeout]);
  
  return null;
}

