import React, { useState } from 'react';
import { useTenantStore } from '../../stores/tenantStore';
import { Prize, QuizQuestion, QuizPrizeRule, ScratchCardPrize } from '../../types';

const GamesConfiguration: React.FC = () => {
  const { tenantConfig, setGamesConfig } = useTenantStore();
  const [activeTab, setActiveTab] = useState<'wheel' | 'scratch' | 'quiz'>('wheel');

  if (!tenantConfig) return null;

  // Estado local para Prize Wheel
  const [wheelPrizes, setWheelPrizes] = useState<Prize[]>(
    tenantConfig.games_config.prize_wheel.prizes.map(p => ({
      ...p,
      quantity_available: p.quantity_available ?? 100,
      quantity_total: p.quantity_total ?? 100,
      times_won: p.times_won ?? 0
    }))
  );

  // Estado local para Scratch Card
  const [scratchPrizes, setScratchPrizes] = useState<ScratchCardPrize[]>(
    (tenantConfig.games_config.scratch_card.prizes as any[]).map((p, i) => 
      typeof p === 'string' 
        ? {
            id: `scratch_${i}`,
            name: p,
            probability: 25,
            quantity_available: 50,
            quantity_total: 50,
            times_won: 0
          }
        : {
            ...p,
            quantity_available: p.quantity_available ?? 50,
            quantity_total: p.quantity_total ?? 50,
            times_won: p.times_won ?? 0
          }
    )
  );

  // Estado local para Quiz
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(
    tenantConfig.games_config.quiz.questions.map((q, i) => ({
      id: q.id || `q${i}`,
      ...q
    }))
  );

  const [quizPrizeRules, setQuizPrizeRules] = useState<QuizPrizeRule[]>(
    tenantConfig.games_config.quiz.prize_rules || [
      { min_correct: 0, max_correct: 1, prize_name: 'Participação', quantity_available: 100 },
      { min_correct: 2, max_correct: 2, prize_name: 'Brinde', quantity_available: 50 },
      { min_correct: 3, max_correct: 3, prize_name: 'Prêmio Especial', quantity_available: 10 }
    ]
  );

  // Funções para Prize Wheel
  const updateWheelPrize = (index: number, field: keyof Prize, value: any) => {
    const updated = [...wheelPrizes];
    (updated[index] as any)[field] = value;
    setWheelPrizes(updated);
  };

  const addWheelPrize = () => {
    setWheelPrizes([...wheelPrizes, {
      id: `p${Date.now()}`,
      label: 'Novo',
      name: 'Novo Prêmio',
      probability: 10,
      color: '#cccccc',
      quantity_available: 100,
      quantity_total: 100,
      times_won: 0
    }]);
  };

  const removeWheelPrize = (index: number) => {
    setWheelPrizes(wheelPrizes.filter((_, i) => i !== index));
  };

  // Funções para Scratch Card
  const updateScratchPrize = (index: number, field: keyof ScratchCardPrize, value: any) => {
    const updated = [...scratchPrizes];
    (updated[index] as any)[field] = value;
    setScratchPrizes(updated);
  };

  const addScratchPrize = () => {
    setScratchPrizes([...scratchPrizes, {
      id: `scratch_${Date.now()}`,
      name: 'Novo Prêmio',
      probability: 10,
      quantity_available: 50,
      quantity_total: 50,
      times_won: 0
    }]);
  };

  const removeScratchPrize = (index: number) => {
    setScratchPrizes(scratchPrizes.filter((_, i) => i !== index));
  };

  // Funções para Quiz
  const updateQuizQuestion = (index: number, field: keyof QuizQuestion, value: any) => {
    const updated = [...quizQuestions];
    (updated[index] as any)[field] = value;
    setQuizQuestions(updated);
  };

  const updateQuizOption = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...quizQuestions];
    updated[qIndex].options[optIndex] = value;
    setQuizQuestions(updated);
  };

  const addQuizQuestion = () => {
    setQuizQuestions([...quizQuestions, {
      id: `q${Date.now()}`,
      question: 'Nova pergunta?',
      options: ['Opção 1', 'Opção 2', 'Opção 3', 'Opção 4'],
      correct: 0
    }]);
  };

  const removeQuizQuestion = (index: number) => {
    setQuizQuestions(quizQuestions.filter((_, i) => i !== index));
  };

  const updatePrizeRule = (index: number, field: keyof QuizPrizeRule, value: any) => {
    const updated = [...quizPrizeRules];
    (updated[index] as any)[field] = value;
    setQuizPrizeRules(updated);
  };

  const addPrizeRule = () => {
    setQuizPrizeRules([...quizPrizeRules, {
      min_correct: 0,
      max_correct: 0,
      prize_name: 'Nova Regra',
      quantity_available: 10
    }]);
  };

  const removePrizeRule = (index: number) => {
    setQuizPrizeRules(quizPrizeRules.filter((_, i) => i !== index));
  };

  // Salvar todas as configurações
  const handleSave = () => {
    const newGamesConfig = {
      ...tenantConfig.games_config,
      prize_wheel: { prizes: wheelPrizes },
      scratch_card: {
        overlay_color: tenantConfig.games_config.scratch_card.overlay_color,
        prizes: scratchPrizes
      },
      quiz: {
        questions: quizQuestions,
        prize_rules: quizPrizeRules
      }
    };
    
    setGamesConfig(newGamesConfig);
    alert('✅ Configurações de jogos salvas com sucesso!');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">⚙️ Configuração dos Jogos</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b-2">
        <button
          onClick={() => setActiveTab('wheel')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'wheel'
              ? 'border-b-4 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-blue-500'
          }`}
        >
          🎡 Roda da Fortuna
        </button>
        <button
          onClick={() => setActiveTab('scratch')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'scratch'
              ? 'border-b-4 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-blue-500'
          }`}
        >
          🎫 Raspadinha
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'quiz'
              ? 'border-b-4 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-blue-500'
          }`}
        >
          🧠 Quiz
        </button>
      </div>

      {/* Content */}
      {activeTab === 'wheel' && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Prêmios da Roda</h2>
          <p className="text-gray-600 mb-4">
            Configure os prêmios, probabilidades e estoque disponível
          </p>

          {wheelPrizes.map((prize, index) => (
            <div key={prize.id} className="bg-white p-6 rounded-lg shadow mb-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rótulo</label>
                  <input
                    type="text"
                    value={prize.label}
                    onChange={(e) => updateWheelPrize(index, 'label', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                  <input
                    type="text"
                    value={prize.name}
                    onChange={(e) => updateWheelPrize(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Probabilidade (%)</label>
                  <input
                    type="number"
                    value={prize.probability}
                    onChange={(e) => updateWheelPrize(index, 'probability', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cor</label>
                  <input
                    type="color"
                    value={prize.color}
                    onChange={(e) => updateWheelPrize(index, 'color', e.target.value)}
                    className="w-full h-10 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estoque Total
                  </label>
                  <input
                    type="number"
                    value={prize.quantity_total}
                    onChange={(e) => updateWheelPrize(index, 'quantity_total', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Disponível
                  </label>
                  <input
                    type="number"
                    value={prize.quantity_available}
                    onChange={(e) => updateWheelPrize(index, 'quantity_available', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vezes Ganho
                  </label>
                  <input
                    type="number"
                    value={prize.times_won}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => removeWheelPrize(index)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addWheelPrize}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded transition-colors"
          >
            + Adicionar Prêmio
          </button>
        </div>
      )}

      {activeTab === 'scratch' && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Prêmios da Raspadinha</h2>
          <p className="text-gray-600 mb-4">
            Configure os prêmios, probabilidades e quantidades
          </p>

          {scratchPrizes.map((prize, index) => (
            <div key={prize.id} className="bg-white p-6 rounded-lg shadow mb-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Prêmio</label>
                  <input
                    type="text"
                    value={prize.name}
                    onChange={(e) => updateScratchPrize(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Probabilidade (%)</label>
                  <input
                    type="number"
                    value={prize.probability}
                    onChange={(e) => updateScratchPrize(index, 'probability', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                  <input
                    type="number"
                    value={prize.quantity_total}
                    onChange={(e) => updateScratchPrize(index, 'quantity_total', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Disponível</label>
                  <input
                    type="number"
                    value={prize.quantity_available}
                    onChange={(e) => updateScratchPrize(index, 'quantity_available', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => removeScratchPrize(index)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addScratchPrize}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded transition-colors"
          >
            + Adicionar Prêmio
          </button>
        </div>
      )}

      {activeTab === 'quiz' && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Perguntas do Quiz</h2>
          <p className="text-gray-600 mb-4">
            Configure as perguntas, respostas corretas e regras de premiação
          </p>

          {/* Perguntas */}
          {quizQuestions.map((question, qIndex) => (
            <div key={question.id} className="bg-white p-6 rounded-lg shadow mb-4">
              <h3 className="text-lg font-semibold mb-3">Pergunta {qIndex + 1}</h3>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Pergunta</label>
                <input
                  type="text"
                  value={question.question}
                  onChange={(e) => updateQuizQuestion(qIndex, 'question', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                {question.options.map((option, optIndex) => (
                  <div key={optIndex}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Opção {optIndex + 1}
                      {question.correct === optIndex && (
                        <span className="text-green-600 ml-2">✓ Correta</span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateQuizOption(qIndex, optIndex, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resposta Correta</label>
                  <select
                    value={question.correct}
                    onChange={(e) => updateQuizQuestion(qIndex, 'correct', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  >
                    {question.options.map((_, i) => (
                      <option key={i} value={i}>Opção {i + 1}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => removeQuizQuestion(qIndex)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addQuizQuestion}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded transition-colors mb-8"
          >
            + Adicionar Pergunta
          </button>

          {/* Regras de Premiação */}
          <h2 className="text-2xl font-bold mb-4 text-gray-700 mt-8">Regras de Premiação</h2>
          <p className="text-gray-600 mb-4">
            Defina os prêmios baseados no número de acertos
          </p>

          {quizPrizeRules.map((rule, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow mb-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min. Acertos</label>
                  <input
                    type="number"
                    value={rule.min_correct}
                    onChange={(e) => updatePrizeRule(index, 'min_correct', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max. Acertos</label>
                  <input
                    type="number"
                    value={rule.max_correct}
                    onChange={(e) => updatePrizeRule(index, 'max_correct', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prêmio</label>
                  <input
                    type="text"
                    value={rule.prize_name}
                    onChange={(e) => updatePrizeRule(index, 'prize_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => removePrizeRule(index)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addPrizeRule}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded transition-colors"
          >
            + Adicionar Regra
          </button>
        </div>
      )}

      {/* Botão Salvar */}
      <div className="mt-8 pt-6 border-t">
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
        >
          💾 Salvar Configurações
        </button>
      </div>
    </div>
  );
};

export default GamesConfiguration;

