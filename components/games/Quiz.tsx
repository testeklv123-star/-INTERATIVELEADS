import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenantStore } from '../../stores/tenantStore';
import Button from '../common/Button';

const Quiz: React.FC = () => {
    const navigate = useNavigate();
    const tenantConfig = useTenantStore((state) => state.tenantConfig);
    const questions = tenantConfig?.games_config.quiz.questions || [];

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];

    const handleAnswerClick = (answerIndex: number) => {
        if (isAnswered) return;

        setSelectedAnswer(answerIndex);
        setIsAnswered(true);

        if (answerIndex === currentQuestion.correct) {
            setScore(prev => prev + 1);
        }
    };
    
    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else {
            setIsFinished(true);
        }
    };
    
    if (!tenantConfig || questions.length === 0) {
        return (
            <div className="w-full h-screen flex flex-col justify-center items-center p-8">
                <p>Nenhuma pergunta de quiz configurada.</p>
                <Button onClick={() => navigate('/')} className="mt-4">Voltar</Button>
            </div>
        );
    }

    if (isFinished) {
        return (
             <div className="w-full min-h-screen flex flex-col justify-center items-center text-center p-4 md:p-8 py-8 overflow-auto" style={{backgroundColor: 'var(--color-background)'}}>
                <h1 className="text-3xl md:text-5xl font-bold mb-4" style={{color: 'var(--color-primary)'}}>Quiz Concluído!</h1>
                <p className="text-2xl md:text-3xl mb-6 md:mb-8" style={{color: 'var(--color-text-secondary)'}}>
                    Sua pontuação final é:
                </p>
                <p className="text-6xl md:text-8xl font-bold mb-6 md:mb-8" style={{color: 'var(--color-accent)'}}>
                    {score}/{questions.length}
                </p>
                <Button onClick={() => navigate('/thank-you')} className="mt-6 md:mt-12 mb-8">
                    CONTINUAR
                </Button>
            </div>
        )
    }

    return (
        <div className="w-full min-h-screen flex flex-col justify-center items-center p-4 md:p-8 py-8 overflow-auto" style={{backgroundColor: 'var(--color-background)'}}>
            <div className="w-full max-w-4xl text-center">
                 <p className="text-xl md:text-2xl mb-3 md:mb-4" style={{color: 'var(--color-text-secondary)'}}>
                    Pergunta {currentQuestionIndex + 1} de {questions.length}
                </p>
                <h2 className="text-2xl md:text-4xl font-bold mb-6 md:mb-12" style={{color: 'var(--color-text)'}}>
                    {currentQuestion.question}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentQuestion.options.map((option, index) => {
                        let buttonClass = 'bg-[var(--color-secondary)] text-[var(--color-button-secondary-text)]';
                        if (isAnswered) {
                            if (index === currentQuestion.correct) {
                                buttonClass = 'bg-[var(--color-success)] text-white'; // Correct answer
                            } else if (index === selectedAnswer) {
                                buttonClass = 'bg-[var(--color-error)] text-white'; // Incorrect selection
                            } else {
                                buttonClass = 'bg-gray-400 text-white'
                            }
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => handleAnswerClick(index)}
                                disabled={isAnswered}
                                className={`p-8 text-2xl font-semibold rounded-lg transition-transform duration-200 ease-in-out disabled:cursor-not-allowed ${!isAnswered ? 'hover:scale-105 active:scale-95' : ''} ${buttonClass}`}
                                style={{borderRadius: 'var(--border-radius)'}}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>

                {isAnswered && (
                     <div className="mt-6 md:mt-12 mb-8 animate-fade-in">
                        <Button onClick={handleNext}>
                            {currentQuestionIndex < questions.length - 1 ? 'PRÓXIMA PERGUNTA' : 'FINALIZAR QUIZ'}
                        </Button>
                    </div>
                )}
            </div>
            <style>{`
                @keyframes fade-in {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default Quiz;
