/**
 * Utilitários para seleção de prêmios baseada em probabilidade
 * Centraliza a lógica de sorteio para reutilização em múltiplos jogos
 */

export interface PrizeWithProbability {
  probability: number;
}

/**
 * Seleciona um prêmio aleatoriamente baseado em probabilidades ponderadas
 * 
 * @param prizes - Array de prêmios com propriedade probability
 * @returns Índice do prêmio selecionado ou -1 se array vazio
 * 
 * @example
 * const prizes = [
 *   { name: "Prêmio 1", probability: 0.5 },
 *   { name: "Prêmio 2", probability: 0.3 },
 *   { name: "Prêmio 3", probability: 0.2 }
 * ];
 * const index = selectPrizeByProbability(prizes);
 */
export const selectPrizeByProbability = <T extends PrizeWithProbability>(
  prizes: T[]
): number => {
  if (prizes.length === 0) {
    return -1;
  }

  // Calcula a soma total das probabilidades
  const totalProbability = prizes.reduce((sum, prize) => sum + prize.probability, 0);
  
  // Gera número aleatório entre 0 e o total
  let random = Math.random() * totalProbability;

  // Percorre os prêmios subtraindo as probabilidades
  for (let i = 0; i < prizes.length; i++) {
    if (random < prizes[i].probability) {
      return i;
    }
    random -= prizes[i].probability;
  }

  // Fallback: retorna o último prêmio
  return prizes.length - 1;
};

/**
 * Valida se as probabilidades somam aproximadamente 1.0 (100%)
 * 
 * @param prizes - Array de prêmios com propriedade probability
 * @param tolerance - Tolerância para considerar válido (padrão: 0.01)
 * @returns true se as probabilidades somam ~1.0
 */
export const validateProbabilities = <T extends PrizeWithProbability>(
  prizes: T[],
  tolerance: number = 0.01
): boolean => {
  const total = prizes.reduce((sum, prize) => sum + prize.probability, 0);
  return Math.abs(total - 1.0) <= tolerance;
};

/**
 * Normaliza probabilidades para somarem exatamente 1.0
 * 
 * @param prizes - Array de prêmios com propriedade probability
 * @returns Array com probabilidades normalizadas
 */
export const normalizeProbabilities = <T extends PrizeWithProbability>(
  prizes: T[]
): T[] => {
  const total = prizes.reduce((sum, prize) => sum + prize.probability, 0);
  
  if (total === 0) {
    // Distribui igualmente se todas as probabilidades forem 0
    const equalProbability = 1.0 / prizes.length;
    return prizes.map(prize => ({ ...prize, probability: equalProbability }));
  }

  // Normaliza mantendo proporções
  return prizes.map(prize => ({
    ...prize,
    probability: prize.probability / total,
  }));
};

