import React, { useState } from 'react';
import { useTenantStore } from '../../stores/tenantStore';
import { Prize, QuizQuestion, QuizPrizeRule, ScratchCardPrize } from '../../types';

const GamesConfiguration: React.FC = () => {
  const { tenantConfig, setGamesConfig } = useTenantStore();
  const [activeTab, setActiveTab] = useState<'wheel' | 'scratch' | 'quiz'>('wheel');

  if (!tenantConfig) return null;

  // Estado para jogos habilitados
  const [enabledGames, setEnabledGames] = useState<string[]>(
    tenantConfig.games_config.enabled_games || []
  );

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
    setWheelPrizes(prev => {
      const updated = [...prev];
      (updated[index] as any)[field] = value;
      return updated;
    });
  };

  const addWheelPrize = () => {
    const newPrize = {
      id: `p${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      label: 'Novo',
      name: 'Novo Prêmio',
      probability: 10,
      color: '#cccccc',
      quantity_available: 100,
      quantity_total: 100,
      times_won: 0
    };
    setWheelPrizes([...wheelPrizes, newPrize]);
  };

  const removeWheelPrize = (index: number) => {
    setWheelPrizes(wheelPrizes.filter((_, i) => i !== index));
  };

  // Funções para Scratch Card
  const updateScratchPrize = (index: number, field: keyof ScratchCardPrize, value: any) => {
    setScratchPrizes(prev => {
      const updated = [...prev];
      (updated[index] as any)[field] = value;
      return updated;
    });
  };

  const addScratchPrize = () => {
    const newPrize = {
      id: `scratch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: 'Novo Prêmio',
      probability: 10,
      quantity_available: 50,
      quantity_total: 50,
      times_won: 0
    };
    setScratchPrizes([...scratchPrizes, newPrize]);
  };

  const removeScratchPrize = (index: number) => {
    setScratchPrizes(scratchPrizes.filter((_, i) => i !== index));
  };

  // Funções para Quiz
  const updateQuizQuestion = (index: number, field: keyof QuizQuestion, value: any) => {
    setQuizQuestions(prev => {
      const updated = [...prev];
      (updated[index] as any)[field] = value;
      return updated;
    });
  };

  const updateQuizOption = (qIndex: number, optIndex: number, value: string) => {
    setQuizQuestions(prev => {
      const updated = [...prev];
      updated[qIndex].options = [...updated[qIndex].options];
      updated[qIndex].options[optIndex] = value;
      return updated;
    });
  };

  const addQuizQuestion = () => {
    const newQuestion = {
      id: `q${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      question: 'Nova pergunta?',
      options: ['Opção 1', 'Opção 2', 'Opção 3', 'Opção 4'],
      correct: 0
    };
    setQuizQuestions([...quizQuestions, newQuestion]);
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

  // Toggle jogo habilitado/desabilitado
  const toggleGame = (gameKey: string) => {
    setEnabledGames(prev => 
      prev.includes(gameKey)
        ? prev.filter(g => g !== gameKey)
        : [...prev, gameKey]
    );
  };

  // Salvar todas as configurações
  const handleSave = () => {
    const newGamesConfig = {
      ...tenantConfig.games_config,
      enabled_games: enabledGames,
      prize_wheel: { prizes: wheelPrizes },
      scratch_card: {
        overlay_color: tenantConfig.games_config.scratch_card.overlay_color,
        background_image: tenantConfig.games_config.scratch_card.background_image,
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

      {/* Seção de Jogos Habilitados */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-700">Jogos Habilitados</h2>
        <p className="text-gray-600 mb-4">Selecione quais jogos estarão disponíveis para os usuários</p>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-3 cursor-pointer bg-gray-50 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-colors">
            <input
              type="checkbox"
              checked={enabledGames.includes('prize_wheel')}
              onChange={() => toggleGame('prize_wheel')}
              className="w-5 h-5"
            />
            <span className="text-lg">🎡 Roda da Fortuna</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer bg-gray-50 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-colors">
            <input
              type="checkbox"
              checked={enabledGames.includes('scratch_card')}
              onChange={() => toggleGame('scratch_card')}
              className="w-5 h-5"
            />
            <span className="text-lg">🎫 Raspadinha</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer bg-gray-50 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-colors">
            <input
              type="checkbox"
              checked={enabledGames.includes('quiz')}
              onChange={() => toggleGame('quiz')}
              className="w-5 h-5"
            />
            <span className="text-lg">🧠 Quiz</span>
          </label>
        </div>
      </div>

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
                  <label htmlFor={`wheel-label-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Rótulo</label>
                  <input
                    id={`wheel-label-${index}`}
                    type="text"
                    value={prize.label}
                    onChange={(e) => updateWheelPrize(index, 'label', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label htmlFor={`wheel-name-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                  <input
                    id={`wheel-name-${index}`}
                    type="text"
                    value={prize.name}
                    onChange={(e) => updateWheelPrize(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label htmlFor={`wheel-probability-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Probabilidade (%)</label>
                  <input
                    id={`wheel-probability-${index}`}
                    type="number"
                    value={prize.probability}
                    onChange={(e) => updateWheelPrize(index, 'probability', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label htmlFor={`wheel-color-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Cor</label>
                  <input
                    id={`wheel-color-${index}`}
                    type="color"
                    value={prize.color}
                    onChange={(e) => updateWheelPrize(index, 'color', e.target.value)}
                    className="w-full h-10 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <label htmlFor={`wheel-qty-total-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Estoque Total
                  </label>
                  <input
                    id={`wheel-qty-total-${index}`}
                    type="number"
                    value={prize.quantity_total}
                    onChange={(e) => updateWheelPrize(index, 'quantity_total', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label htmlFor={`wheel-qty-available-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Disponível
                  </label>
                  <input
                    id={`wheel-qty-available-${index}`}
                    type="number"
                    value={prize.quantity_available}
                    onChange={(e) => updateWheelPrize(index, 'quantity_available', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label htmlFor={`wheel-times-won-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Vezes Ganho
                  </label>
                  <input
                    id={`wheel-times-won-${index}`}
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

          {/* Upload de Imagem de Fundo */}
          <div className="bg-blue-50 p-6 rounded-lg shadow mb-6 border-2 border-blue-200">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">🖼️ Imagem de Fundo (Opcional)</h3>
            <p className="text-sm text-gray-600 mb-3">
              Faça upload de uma imagem que será exibida atrás da camada de raspagem
            </p>
            <div className="flex gap-4 items-start">
              <div className="flex-1">
                <label htmlFor="scratch-bg-upload" className="block text-sm font-medium text-gray-700 mb-1">Imagem de Fundo</label>
                <input
                  id="scratch-bg-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const newGamesConfig = {
                          ...tenantConfig.games_config,
                          scratch_card: {
                            ...tenantConfig.games_config.scratch_card,
                            background_image: reader.result as string
                          }
                        };
                        setGamesConfig(newGamesConfig);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full text-sm"
                />
              </div>
              {tenantConfig.games_config.scratch_card.background_image && (
                <div className="w-32 h-32 border-2 border-gray-300 rounded overflow-hidden">
                  <img 
                    src={tenantConfig.games_config.scratch_card.background_image} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {scratchPrizes.map((prize, index) => (
            <div key={prize.id} className="bg-white p-6 rounded-lg shadow mb-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label htmlFor={`scratch-name-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Nome do Prêmio</label>
                  <input
                    id={`scratch-name-${index}`}
                    type="text"
                    value={prize.name}
                    onChange={(e) => updateScratchPrize(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label htmlFor={`scratch-prob-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Probabilidade (%)</label>
                  <input
                    id={`scratch-prob-${index}`}
                    type="number"
                    value={prize.probability}
                    onChange={(e) => updateScratchPrize(index, 'probability', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label htmlFor={`scratch-qty-total-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                  <input
                    id={`scratch-qty-total-${index}`}
                    type="number"
                    value={prize.quantity_total}
                    onChange={(e) => updateScratchPrize(index, 'quantity_total', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label htmlFor={`scratch-qty-available-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Disponível</label>
                  <input
                    id={`scratch-qty-available-${index}`}
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
                <label htmlFor={`quiz-question-${qIndex}`} className="block text-sm font-medium text-gray-700 mb-1">Pergunta</label>
                <input
                  id={`quiz-question-${qIndex}`}
                  type="text"
                  value={question.question}
                  onChange={(e) => updateQuizQuestion(qIndex, 'question', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                {question.options.map((option, optIndex) => (
                  <div key={optIndex}>
                    <label htmlFor={`quiz-option-${qIndex}-${optIndex}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Opção {optIndex + 1}
                      {question.correct === optIndex && (
                        <span className="text-green-600 ml-2">✓ Correta</span>
                      )}
                    </label>
                    <input
                      id={`quiz-option-${qIndex}-${optIndex}`}
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
                  <label htmlFor={`quiz-correct-${qIndex}`} className="block text-sm font-medium text-gray-700 mb-1">Resposta Correta</label>
                  <select
                    id={`quiz-correct-${qIndex}`}
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
                  <label htmlFor={`quiz-rule-min-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Min. Acertos</label>
                  <input
                    id={`quiz-rule-min-${index}`}
                    type="number"
                    value={rule.min_correct}
                    onChange={(e) => updatePrizeRule(index, 'min_correct', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label htmlFor={`quiz-rule-max-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Max. Acertos</label>
                  <input
                    id={`quiz-rule-max-${index}`}
                    type="number"
                    value={rule.max_correct}
                    onChange={(e) => updatePrizeRule(index, 'max_correct', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor={`quiz-rule-prize-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Prêmio</label>
                  <input
                    id={`quiz-rule-prize-${index}`}
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

