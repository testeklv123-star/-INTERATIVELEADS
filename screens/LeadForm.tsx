import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTenantStore } from '../stores/tenantStore';
import DynamicLogo from '../components/common/DynamicLogo';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { saveLead } from '../services/apiService';
import electronService from '../services/electronService';

type Inputs = {
  name: string;
  email: string;
  phone: string;
  consent: boolean;
  custom_field?: string;
};

const LeadForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tenantConfig = useTenantStore((state) => state.tenantConfig);
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!tenantConfig) return null;
  
  const game = new URLSearchParams(location.search).get('game');

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsSubmitting(true);
    const leadData = {
        ...data,
        tenant_id: tenantConfig.tenant_id,
        game_selected: game,
        timestamp: new Date().toISOString()
    };
    
    try {
        // Salvar no Electron se disponível, caso contrário usar API
        if (electronService.isRunningInElectron()) {
          console.log('💾 Salvando lead no Electron...');
          const result = await electronService.saveLead(leadData);
          if (!result.success) {
            throw new Error(result.error || 'Erro ao salvar lead');
          }
          console.log('✅ Lead salvo no Electron!');
        } else {
          console.log('📡 Salvando lead na API...');
          await saveLead(leadData);
        }
        navigate(`/game/${game}`);
    } catch(error) {
        console.error("Failed to save lead:", error);
        alert('Erro ao salvar seus dados. Por favor, tente novamente.');
        setIsSubmitting(false);
    }
  };

  const formConfig = tenantConfig.form_fields;

  return (
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
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'ENVIANDO...' : 'JOGAR AGORA'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;