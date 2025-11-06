import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { TenantConfig, Theme } from '../types';
import { useTenantStore } from '../stores/tenantStore';

type FormData = {
  tenantId: string;
  brandName: string;
  adminPassword: string;
  confirmPassword: string;
};

export default function SetupScreen() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  const { loadTenant } = useTenantStore();

  const onSubmit = async (data: FormData) => {
    if (data.adminPassword !== data.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create default theme
      const defaultTheme: Theme = {
        colors: {
          primary: '#3b82f6',
          secondary: '#10b981',
          accent: '#8b5cf6',
          background: '#ffffff',
          text: '#1f2937',
          text_secondary: '#6b7280',
          success: '#10b981',
          error: '#ef4444',
          button_primary_bg: '#3b82f6',
          button_primary_text: '#ffffff',
          button_secondary_bg: '#e5e7eb',
          button_secondary_text: '#1f2937',
        },
        typography: {
          font_primary: 'Inter',
          font_secondary: 'sans-serif',
          heading_weight: '700',
          body_weight: '400',
        },
        logos: {
          main_logo_url: '',
          center_logo_url: '',
          watermark_url: '',
        },
        spacing: {
          border_radius: '0.5rem',
          padding_base: '1rem',
        },
      };

      const newTenant: TenantConfig = {
        tenant_id: data.tenantId.trim(),
        brand_name: data.brandName.trim(),
        theme: defaultTheme,
        content: {
          welcome_title: `Bem-vindo ao ${data.brandName}`,
          welcome_subtitle: 'Participe e concorra a prêmios incríveis!',
          form_title: 'Cadastre-se',
          form_subtitle: 'Preencha seus dados para participar',
          thank_you_message: 'Obrigado por participar!',
          privacy_notice: 'Seus dados estão seguros conosco.',
        },
        games_config: {
          enabled_games: ['prize_wheel'],
          prize_wheel: {
            prizes: [
              {
                id: 'p1',
                label: '10% OFF',
                name: 'Cupom de 10% de desconto',
                probability: 100,
                color: '#3b82f6',
                quantity_available: 1000,
                quantity_total: 1000,
                times_won: 0,
              },
            ],
          },
          scratch_card: {
            overlay_color: '#C0C0C0',
            prizes: [],
          },
          quiz: {
            questions: [],
            prize_rules: [],
          },
        },
        form_fields: {
          required: ['name', 'email', 'phone'],
          optional: [],
          custom_field: { enabled: false, label: '', type: 'select', options: [] },
        },
        behavior: {
          inactivity_timeout: 300,
          auto_return_home: true,
          show_lead_count: false,
          collect_photo: false,
          admin_password: data.adminPassword,
        },
      };

      // Save the new tenant
      await window.electronAPI.saveTenant(newTenant);
      
      // Set as active tenant
      await window.electronAPI.setSetting('activeTenantId', newTenant.tenant_id);
      
      // Load the tenant in the store
      await loadTenant(newTenant.tenant_id);
      
      // Redirect to main app
      navigate('/');
    } catch (err) {
      console.error('Error creating tenant:', err);
      setError('Erro ao criar configuração. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Configuração Inicial
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Preencha os dados para configurar sua instalação
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="tenantId" className="block text-sm font-medium text-gray-700">
                ID do Tenant
              </label>
              <div className="mt-1">
                <input
                  id="tenantId"
                  type="text"
                  autoComplete="off"
                  className={`appearance-none block w-full px-3 py-2 border ${errors.tenantId ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  {...register('tenantId', { 
                    required: 'ID do tenant é obrigatório',
                    pattern: {
                      value: /^[a-z0-9_\-]+$/i,
                      message: 'Use apenas letras, números, hífens ou underscores'
                    }
                  })}
                />
                {errors.tenantId && (
                  <p className="mt-1 text-sm text-red-600">{errors.tenantId.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="brandName" className="block text-sm font-medium text-gray-700">
                Nome da Marca
              </label>
              <div className="mt-1">
                <input
                  id="brandName"
                  type="text"
                  autoComplete="off"
                  className={`appearance-none block w-full px-3 py-2 border ${errors.brandName ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  {...register('brandName', { 
                    required: 'Nome da marca é obrigatório',
                    minLength: {
                      value: 3,
                      message: 'O nome deve ter pelo menos 3 caracteres'
                    }
                  })}
                />
                {errors.brandName && (
                  <p className="mt-1 text-sm text-red-600">{errors.brandName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700">
                Senha do Administrador
              </label>
              <div className="mt-1">
                <input
                  id="adminPassword"
                  type="password"
                  autoComplete="new-password"
                  className={`appearance-none block w-full px-3 py-2 border ${errors.adminPassword ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  {...register('adminPassword', { 
                    required: 'Senha é obrigatória',
                    minLength: {
                      value: 4,
                      message: 'A senha deve ter pelo menos 4 dígitos'
                    },
                    maxLength: {
                      value: 4,
                      message: 'A senha deve ter no máximo 4 dígitos'
                    },
                    pattern: {
                      value: /^\d+$/,
                      message: 'A senha deve conter apenas números'
                    }
                  })}
                />
                {errors.adminPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.adminPassword.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirme a Senha
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  className={`appearance-none block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  {...register('confirmPassword', { 
                    required: 'Confirmação de senha é obrigatória',
                    validate: value => 
                      value === watch('adminPassword') || 'As senhas não coincidem'
                  })}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Configurando...
                  </>
                ) : 'Criar Configuração'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
