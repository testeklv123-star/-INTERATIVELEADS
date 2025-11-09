import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTenantStore } from '../stores/tenantStore';
import DynamicLogo from '../components/common/DynamicLogo';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { saveLead } from '../services/apiService';
import electronService from '../services/electronService';
import useLeadSessionStore from '../stores/leadSessionStore';
import Roulette from '../components/games/Roulette';
import { LeadData } from '../types';

type Inputs = {
  name: string;
  email: string;
  phone: string;
  consent: boolean;
  custom_field?: string;
};

interface Prize {
  id: number;
  name: string;
  image_url: string;
  color: string;
  probability: number;
}

const LeadForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tenantConfig = useTenantStore((state) => state.tenantConfig);
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
  const startSession = useLeadSessionStore((state) => state.startSession);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados da roleta
  const [showRoulette, setShowRoulette] = useState(false);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [winningPrize, setWinningPrize] = useState<Prize | null>(null);
  const [currentLeadId, setCurrentLeadId] = useState<number | null>(null);
  const [lastLeadData, setLastLeadData] = useState<LeadData | null>(null);

  if (!tenantConfig) return null;
  
  const game = new URLSearchParams(location.search).get('game');

  // Carrega os prêmios da roleta ao montar o componente
  useEffect(() => {
    const loadPrizes = async () => {
      if (electronService.isRunningInElectron()) {
        try {
          const result = await electronService.getRoulettePrizes();
          if (result.success && result.data) {
            setPrizes(result.data);
            console.log('✅ Prêmios da roleta carregados:', result.data);
          }
        } catch (error) {
          console.error('❌ Erro ao carregar prêmios:', error);
        }
      }
    };

    loadPrizes();
  }, []);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsSubmitting(true);
    const leadData = {
      ...data,
      tenant_id: tenantConfig.tenant_id,
      game_selected: game,
      timestamp: new Date().toISOString(),
      consent: data.consent,
    };
    
    try {
        // Salvar no Electron se disponível, caso contrário usar API
        let leadId: number | string = Date.now();

        if (electronService.isRunningInElectron()) {
          console.log('💾 Salvando lead no Electron...');
          const result = await electronService.saveLead(leadData);
          if (!result.success || !result.data) {
            throw new Error(result.error || 'Erro ao salvar lead');
          }
          leadId = result.data.id ?? leadId;
          console.log('✅ Lead salvo no Electron! ID:', leadId);
          setLastLeadData(leadData as LeadData);
          
          // Sorteia um prêmio
          console.log('🎲 Sorteando prêmio...');
          const prizeResult = await electronService.getRandomPrize();
          if (prizeResult.success && prizeResult.data) {
            setWinningPrize(prizeResult.data);
            setCurrentLeadId(leadId as number);
            console.log('✅ Prêmio sorteado:', prizeResult.data.name);
            
            // Mostra a roleta
            setIsSubmitting(false);
            setShowRoulette(true);
          } else {
            throw new Error('Erro ao sortear prêmio');
          }
        } else {
          console.log('📡 Salvando lead na API...');
          await saveLead(leadData);
          startSession(leadId, leadData);
          navigate(`/game/${game}`);
        }
    } catch(error) {
        console.error("Failed to save lead:", error);
        alert('Erro ao salvar seus dados. Por favor, tente novamente.');
        setIsSubmitting(false);
    }
  };

  // Callback quando a roleta terminar de girar
  const handleSpinComplete = async (prize: Prize) => {
    console.log('🎉 Giro completo! Prêmio:', prize.name);
    
    if (currentLeadId && electronService.isRunningInElectron()) {
      try {
        // Salva o resultado do giro no banco
        await electronService.saveSpinResult(currentLeadId, prize.id);
        console.log('✅ Resultado do giro salvo!');
      } catch (error) {
        console.error('❌ Erro ao salvar resultado do giro:', error);
      }
    }
  };

  // Callback quando fechar a roleta
  const handleCloseRoulette = () => {
    setShowRoulette(false);
    
    // Navega para o jogo
    if (currentLeadId) {
      if (lastLeadData) {
        startSession(currentLeadId, lastLeadData);
      }
      navigate(`/game/${game}`);
    }
  };

  const formConfig = tenantConfig.form_fields;

  return (
    <>
      {/* Modal da Roleta */}
      <Roulette
        isOpen={showRoulette}
        onClose={handleCloseRoulette}
        onSpinComplete={handleSpinComplete}
        prizes={prizes}
        winningPrize={winningPrize}
      />

      {/* Formulário */}
      <div className="w-full h-screen flex flex-col justify-center items-center p-8" style={{backgroundColor: 'var(--color-background)'}}>
        <div className="w-full max-w-2xl bg-white p-10 rounded-lg shadow-xl border-t-8" style={{borderColor: 'var(--color-primary)'}}>
        <DynamicLogo type="center" className="w-32 h-32 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-center mb-2" style={{color: 'var(--color-text)'}}>{tenantConfig.content.form_title}</h2>
        <p className="text-lg text-center mb-8" style={{color: 'var(--color-text-secondary)'}}>{tenantConfig.content.form_subtitle}</p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {formConfig.required.includes('name') && (
            <Input
              label="Nome Completo *"
              type="text"
              registration={register('name', { required: 'Nome é obrigatório', minLength: { value: 3, message: 'Nome muito curto'} })}
              error={errors.name?.message}
            />
          )}
          {formConfig.required.includes('email') && (
            <Input
              label="Email *"
              type="email"
              registration={register('email', { required: 'Email é obrigatório', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email inválido'} })}
              error={errors.email?.message}
            />
          )}
           {formConfig.required.includes('phone') && (
            <Input
              label="Telefone *"
              type="tel"
              registration={register('phone', { required: 'Telefone é obrigatório' })}
              error={errors.phone?.message}
            />
          )}

          {/* Campo Customizado Dinâmico */}
          {formConfig.custom_field?.enabled && (
            <div className="w-full">
              <label className="block text-lg mb-2 text-[var(--color-text-secondary)]" style={{ fontFamily: 'var(--font-secondary)' }}>
                {formConfig.custom_field.label}
              </label>
              {formConfig.custom_field.type === 'select' ? (
                <select
                  {...register('custom_field')}
                  className="w-full text-xl p-4 border-2 focus:outline-none transition-colors duration-300"
                  style={{
                    borderColor: 'var(--color-text-secondary)',
                    borderRadius: 'var(--border-radius)',
                    fontFamily: 'var(--font-secondary)',
                    color: 'var(--color-text)',
                    backgroundColor: 'var(--color-background)',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--color-text-secondary)'}
                >
                  <option value="">Selecione...</option>
                  {formConfig.custom_field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  label=""
                  type="text"
                  registration={register('custom_field')}
                  placeholder={formConfig.custom_field.label}
                />
              )}
            </div>
          )}

          {formConfig.optional.includes('email') && !formConfig.required.includes('email') && (
            <Input
              label="Email"
              type="email"
              registration={register('email')}
              error={errors.email?.message}
            />
          )}

          {formConfig.optional.includes('phone') && !formConfig.required.includes('phone') && (
            <Input
              label="Telefone"
              type="tel"
              registration={register('phone')}
              error={errors.phone?.message}
            />
          )}

          <div className="flex items-start">
            <input 
              id="consent"
              type="checkbox" 
              {...register('consent', { required: true })}
              className="h-6 w-6 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mt-1"
            />
            <label htmlFor="consent" className="ml-3 text-base" style={{color: 'var(--color-text-secondary)'}}>
              {tenantConfig.content.privacy_notice}
              {errors.consent && <span className="text-red-500 block">Você deve aceitar para continuar.</span>}
            </label>
          </div>
          
          <div className="flex gap-4">
            <Button 
              type="button" 
              variant="secondary"
              onClick={() => navigate('/')}
              className="flex-1"
              disabled={isSubmitting}
            >
              SAIR
            </Button>
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'ENVIANDO...' : 'JOGAR AGORA'}
            </Button>
          </div>
        </form>
        </div>
      </div>
    </>
  );
};

export default LeadForm;