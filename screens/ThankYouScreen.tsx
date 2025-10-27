
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenantStore } from '../stores/tenantStore';
import DynamicLogo from '../components/common/DynamicLogo';

const ThankYouScreen: React.FC = () => {
  const navigate = useNavigate();
  const tenantConfig = useTenantStore((state) => state.tenantConfig);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000); // Redirect after 5 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  if (!tenantConfig) return null;

  return (
    <div 
      className="w-full h-screen flex flex-col justify-center items-center text-center p-8"
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)'
      }}
    >
      <div className="animate-fade-in-pulse">
        <DynamicLogo type="center" className="w-48 h-48 mx-auto mb-8" />
        <h1 
          className="font-bold mb-4"
          style={{ 
            color: 'var(--color-primary)',
            fontSize: 'var(--font-size-h1)'
          }}
        >
          {tenantConfig.content.thank_you_message.split('!')[0]}!
        </h1>
        <p className="text-3xl" style={{color: 'var(--color-text-secondary)'}}>
          {tenantConfig.content.thank_you_message.split('!').slice(1).join('!')}
        </p>
        <p className="text-xl mt-12 text-gray-400">
            Você será redirecionado em breve...
        </p>
      </div>
       <style>{`
        @keyframes fade-in-pulse {
          0% { opacity: 0; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-pulse {
          animation: fade-in-pulse 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ThankYouScreen;
