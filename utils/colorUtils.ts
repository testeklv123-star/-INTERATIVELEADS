/**
 * Utilitários para manipulação de cores
 * Fornece funções seguras para trabalhar com diferentes formatos de cor
 */

/**
 * Adiciona opacidade a uma cor de forma segura
 * Suporta cores hexadecimais (#RGB, #RRGGBB)
 * 
 * @param color - Cor no formato hexadecimal
 * @param opacity - Opacidade em formato hexadecimal (ex: '20' para 12.5%)
 * @returns Cor com opacidade aplicada
 * 
 * @example
 * addOpacityToColor('#FF0000', '20') // '#FF000020'
 * addOpacityToColor('rgba(255,0,0,1)', '20') // 'rgba(255,0,0,1)'
 */
export const addOpacityToColor = (color: string, opacity: string = '20'): string => {
  // Se já tem opacidade (rgba ou hsla), retorna como está
  if (color.includes('rgba') || color.includes('hsla')) {
    return color;
  }

  // Se é hexadecimal, adiciona opacidade
  if (color.startsWith('#')) {
    return `${color}${opacity}`;
  }

  // Fallback: retorna a cor original
  return color;
};

/**
 * Converte cor hexadecimal para RGB
 * 
 * @param hex - Cor no formato #RRGGBB ou #RGB
 * @returns Objeto com valores r, g, b ou null se inválido
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  // Remove o # se presente
  const cleanHex = hex.replace('#', '');

  // Valida formato
  if (!/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
    return null;
  }

  // Expande formato curto (#RGB -> #RRGGBB)
  const fullHex = cleanHex.length === 3
    ? cleanHex.split('').map(char => char + char).join('')
    : cleanHex;

  // Converte para RGB
  const r = parseInt(fullHex.substring(0, 2), 16);
  const g = parseInt(fullHex.substring(2, 4), 16);
  const b = parseInt(fullHex.substring(4, 6), 16);

  return { r, g, b };
};

/**
 * Converte RGB para hexadecimal
 * 
 * @param r - Componente vermelho (0-255)
 * @param g - Componente verde (0-255)
 * @param b - Componente azul (0-255)
 * @returns Cor no formato #RRGGBB
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (n: number) => {
    const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

