import React from 'react';

interface LoadingScreenProps {
  /** Mensagem a ser exibida abaixo do spinner */
  message?: string;
  /** Classe CSS adicional para personalização */
  className?: string;
}

/**
 * Componente de tela de carregamento padronizado
 * Usado em todo o app para manter consistência visual
 * 
 * @example
 * <LoadingScreen message="Inicializando..." />
 */
const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Carregando...',
  className = '' 
}) => {
  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-50 ${className}`}>
      <div className="text-center">
        <div 
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"
          role="status"
          aria-label="Carregando"
        />
        {message && (
          <p className="mt-4 text-gray-600 text-lg">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;

