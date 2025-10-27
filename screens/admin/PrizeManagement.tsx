import React, { useState } from 'react';
import { useTenantStore } from '../../stores/tenantStore';
import { Prize } from '../../types';

const PrizeManagement: React.FC = () => {
  const { tenantConfig, setGamesConfig } = useTenantStore();
  const [prizes, setPrizes] = useState<Prize[]>(tenantConfig!.games_config.prize_wheel.prizes);

  const handlePrizeChange = (index: number, field: keyof Prize, value: string | number) => {
    const newPrizes = [...prizes];
    (newPrizes[index] as any)[field] = value;
    setPrizes(newPrizes);
  };
  
  const addPrize = () => {
    setPrizes([...prizes, {
        id: `p${Date.now()}`,
        label: 'Novo',
        name: 'Novo Prêmio',
        probability: 0,
        color: '#cccccc'
    }]);
  };

  const removePrize = (index: number) => {
    setPrizes(prizes.filter((_, i) => i !== index));
  };
  
  const handleSaveChanges = () => {
    const totalProb = prizes.reduce((sum, p) => sum + Number(p.probability), 0);
    // Use a tolerance check for floating point inaccuracies
    if (Math.abs(totalProb - 100) > 0.01) {
        alert('A soma das probabilidades deve ser exatamente 100%.');
        return;
    }
    const newGamesConfig = { ...tenantConfig!.games_config, prize_wheel: { prizes } };
    setGamesConfig(newGamesConfig);
    alert('Prêmios salvos com sucesso!');
  };

  const totalProbability = prizes.reduce((sum, p) => sum + Number(p.probability), 0);
  const isProbabilityValid = Math.abs(totalProbability - 100) < 0.01;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Gerenciamento de Prêmios (Roda da Fortuna)</h1>
      <div className="space-y-6">
        {prizes.map((prize, index) => (
          <div key={prize.id} className="bg-white p-6 rounded-lg shadow grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">Rótulo (na roda)</label>
                  <input type="text" value={prize.label} onChange={(e) => handlePrizeChange(index, 'label', e.target.value)} className="mt-1 w-full px-2 py-1 border border-gray-300 rounded"/>
              </div>
               <div className="md:col-span-4">
                  <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                  <input type="text" value={prize.name} onChange={(e) => handlePrizeChange(index, 'name', e.target.value)} className="mt-1 w-full px-2 py-1 border border-gray-300 rounded"/>
              </div>
               <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Probabilidade (%)</label>
                  <input type="number" value={prize.probability} onChange={(e) => handlePrizeChange(index, 'probability', Number(e.target.value))} className="mt-1 w-full px-2 py-1 border border-gray-300 rounded"/>
              </div>
              <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700">Cor</label>
                  <input type="color" value={prize.color} onChange={(e) => handlePrizeChange(index, 'color', e.target.value)} className="mt-1 w-full h-8 p-0 border-none rounded cursor-pointer"/>
              </div>
              <div className="md:col-span-2 flex items-end">
                <button onClick={() => removePrize(index)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-full transition-colors">
                    Remover
                </button>
              </div>
          </div>
        ))}
      </div>

       <div className="mt-6 flex items-center justify-between">
           <button onClick={addPrize} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors">
              + Adicionar Prêmio
           </button>
           <div className={`text-lg font-bold p-2 rounded ${isProbabilityValid ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
              Total: {totalProbability.toFixed(2)}%
           </div>
       </div>

       <div className="mt-8">
            <button onClick={handleSaveChanges} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors">
                Salvar Prêmios
            </button>
       </div>
    </div>
  );
};

export default PrizeManagement;