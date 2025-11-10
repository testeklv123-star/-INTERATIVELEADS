/**
 * Logger condicional que só exibe logs em ambiente de desenvolvimento
 * Evita poluição do console em produção mantendo capacidade de debug
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  /**
   * Log de informação (apenas em desenvolvimento)
   */
  log: (...args: any[]): void => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * Log de aviso (apenas em desenvolvimento)
   */
  warn: (...args: any[]): void => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  /**
   * Log de erro (sempre exibido)
   */
  error: (...args: any[]): void => {
    console.error(...args);
  },

  /**
   * Log de debug com prefixo (apenas em desenvolvimento)
   */
  debug: (component: string, ...args: any[]): void => {
    if (isDevelopment) {
      console.log(`[${component}]`, ...args);
    }
  },
};

export default logger;

