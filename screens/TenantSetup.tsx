import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useTenantStore } from '../stores/tenantStore';
import tenantService, { CreateTenantParams } from '../services/tenantService';
import Button from '../components/common/Button';
import { FiAlertCircle, FiCheckCircle, FiLoader } from 'react-icons/fi';

type FormData = {
  tenant_id: string;
  brand_name: string;
  admin_password: string;
  confirm_password: string;
};

const TenantSetup: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { isConfigured } = useTenantStore();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  
  const watchPassword = watch('admin_password', '');

  // Redirecionar automaticamente quando configuração for bem-sucedida
  useEffect(() => {
    if (isConfigured) {
      console.log('🚀 [Setup] Tenant configurado! Redirecionando para home...');
      navigate('/', { replace: true });
    }
  }, [isConfigured, navigate]);

  const onSubmit = async (data: FormData) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Importa o serviço aqui para evitar dependência circular
      const tenantService = await import('../services/tenantService').then(m => m.default);
      
      const result = await tenantService.createTenant({
        tenantId: data.tenant_id,
        brandName: data.brand_name,
        adminPassword: data.admin_password
      });
      
      if (result.success && result.tenant) {
        setSubmitSuccess(true);
        // Atualiza o estado global com o novo tenant
        useTenantStore.getState().loadTenant(data.tenant_id);
      } else {
        throw new Error(result.error || 'Falha ao criar o tenant');
      }
    } catch (error) {
      console.error('❌ Erro ao criar tenant:', error);
      setSubmitError(error instanceof Error ? error.message : 'Ocorreu um erro inesperado');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const validatePasswordMatch = (value: string) => {
    return value === watchPassword || 'As senhas não conferem';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Configuração Inicial
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Preencha os dados para configurar o sistema
          </p>
        </div>

        {submitSuccess ? (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiCheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Configuração concluída com sucesso! Redirecionando...
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="tenant_id" className="block text-sm font-medium text-gray-700 mb-1">
                  ID do Cliente <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="tenant_id"
                    type="text"
                    autoComplete="off"
                    className={`appearance-none relative block w-full px-3 py-2 border ${
                      errors.tenant_id ? 'border-red-300' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                    placeholder="ex: loja_abc_001"
                    {...register('tenant_id', {
                      required: 'O ID do cliente é obrigatório',
                      pattern: {
                        value: /^[a-z0-9_]+$/,
                        message: 'Use apenas letras minúsculas, números e sublinhados'
                      }
                    })}
                  />
                  {errors.tenant_id && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <FiAlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.tenant_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.tenant_id.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Use apenas letras minúsculas, números e sublinhados
                </p>
              </div>

              <div>
                <label htmlFor="brand_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Marca <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="brand_name"
                    type="text"
                    autoComplete="off"
                    className={`appearance-none relative block w-full px-3 py-2 border ${
                      errors.brand_name ? 'border-red-300' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                    placeholder="ex: Minha Loja"
                    {...register('brand_name', {
                      required: 'O nome da marca é obrigatório',
                      minLength: {
                        value: 3,
                        message: 'O nome deve ter pelo menos 3 caracteres'
                      }
                    })}
                  />
                  {errors.brand_name && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <FiAlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.brand_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.brand_name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="admin_password" className="block text-sm font-medium text-gray-700 mb-1">
                  Senha do Administrador <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="admin_password"
                    type="password"
                    autoComplete="new-password"
                    className={`appearance-none relative block w-full px-3 py-2 border ${
                      errors.admin_password ? 'border-red-300' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                    placeholder="••••"
                    {...register('admin_password', {
                      required: 'A senha é obrigatória',
                      minLength: {
                        value: 4,
                        message: 'A senha deve ter pelo menos 4 caracteres'
                      },
                      maxLength: {
                        value: 4,
                        message: 'A senha deve ter no máximo 4 caracteres'
                      },
                      pattern: {
                        value: /^\d+$/,
                        message: 'Use apenas números'
                      }
                    })}
                  />
                  {errors.admin_password && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <FiAlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.admin_password && (
                  <p className="mt-1 text-sm text-red-600">{errors.admin_password.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Use 4 dígitos numéricos
                </p>
              </div>

              <div>
                <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirme a Senha <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirm_password"
                    type="password"
                    autoComplete="new-password"
                    className={`appearance-none relative block w-full px-3 py-2 border ${
                      errors.confirm_password ? 'border-red-300' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                    placeholder="••••"
                    {...register('confirm_password', {
                      required: 'Confirme a senha',
                      validate: validatePasswordMatch
                    })}
                  />
                  {errors.confirm_password && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <FiAlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.confirm_password && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirm_password.message}</p>
                )}
              </div>
            </div>

            {submitError && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FiAlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {submitError}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Button
                type="submit"
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                    Criando...
                  </>
                ) : (
                  'Criar e Iniciar'
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TenantSetup;
