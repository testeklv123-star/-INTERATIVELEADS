import React, { useState, useCallback } from 'react';
import { useTenantStore } from '../../stores/tenantStore';
import { Theme } from '../../types';
import { applyTheme } from '../../utils/themeApplier';
import AttractScreen from '../AttractScreen';

const BrandCustomization: React.FC = () => {
  const { tenantConfig, setTheme } = useTenantStore();
  const [theme, _setTheme] = useState<Theme>(tenantConfig!.theme);
  const [logoPreviews, setLogoPreviews] = useState<{ [key: string]: string }>({});
  const [showPreview, setShowPreview] = useState(false);

  const handleColorChange = (key: string, value: string) => {
    const newColors = { ...theme.colors, [key]: value };
    const newTheme = { ...theme, colors: newColors };
    _setTheme(newTheme);
    applyTheme(newTheme); // Live preview
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'main_logo_url' | 'center_logo_url' | 'watermark_url') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreviews(prev => ({ ...prev, [type]: result }));
        const newLogos = { ...theme.logos, [type]: result };
        _setTheme({ ...theme, logos: newLogos });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSaveChanges = () => {
    const finalTheme = { ...theme };
    // In a real app, you'd upload files and get back URLs. Here we use the base64 preview as the URL.
    if(logoPreviews.main_logo_url) finalTheme.logos.main_logo_url = logoPreviews.main_logo_url;
    if(logoPreviews.center_logo_url) finalTheme.logos.center_logo_url = logoPreviews.center_logo_url;
    if(logoPreviews.watermark_url) finalTheme.logos.watermark_url = logoPreviews.watermark_url;

    setTheme(finalTheme);
    alert('✅ Tema salvo com sucesso! As alterações serão aplicadas imediatamente.');
  };

  const colorKeys = Object.keys(theme.colors);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Customização da Marca</h1>
      
      <div className="bg-white p-8 rounded-lg shadow mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Paleta de Cores</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {colorKeys.map(key => (
            <div key={key}>
              <label htmlFor={`color-${key}`} className="capitalize text-gray-600">{key.replace(/_/g, ' ')}</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  id={`color-picker-${key}`}
                  type="color"
                  value={theme.colors[key]}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="w-10 h-10 p-0 border-none rounded cursor-pointer"
                  aria-label={`Seletor de cor ${key.replace(/_/g, ' ')}`}
                />
                <input
                  id={`color-${key}`}
                  type="text"
                  value={theme.colors[key]}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                  placeholder="#FFFFFF"
                  aria-label={`Código hexadecimal da cor ${key.replace(/_/g, ' ')}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Logos</h2>
        <div className="grid md:grid-cols-3 gap-8">
            {Object.keys(theme.logos).map(key => (
                <div key={key}>
                    <h3 className="text-lg font-semibold mb-2 capitalize text-gray-600">{key.replace(/_logo_url/g, '').replace(/_/g, ' ')}</h3>
                    <div className="w-full h-40 bg-gray-200 rounded flex items-center justify-center mb-2">
                        <img src={logoPreviews[key] || theme.logos[key as keyof typeof theme.logos]} alt="Preview" className="max-h-full max-w-full" />
                    </div>
                    <label htmlFor={`logo-upload-${key}`} className="sr-only">Upload {key.replace(/_logo_url/g, '').replace(/_/g, ' ')}</label>
                    <input 
                      id={`logo-upload-${key}`}
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleLogoUpload(e, key as any)} 
                      className="text-sm"
                      aria-label={`Upload de logo ${key.replace(/_logo_url/g, '').replace(/_/g, ' ')}`}
                    />
                </div>
            ))}
        </div>
      </div>
      
      <div className="flex gap-4">
        <button 
          onClick={() => setShowPreview(!showPreview)} 
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
        >
          {showPreview ? 'Esconder Preview' : 'Mostrar Preview'}
        </button>
        <button onClick={handleSaveChanges} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors">
          Salvar Alterações
        </button>
      </div>

      {/* Modal de Preview em Tempo Real */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setShowPreview(false)}>
          <div className="relative w-[480px] h-[853px] bg-white rounded-lg shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-2 right-2 z-10">
              <button 
                onClick={() => setShowPreview(false)}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl"
              >
                ×
              </button>
            </div>
            <div className="w-full h-full scale-[0.5] origin-top-left" style={{ width: '960px', height: '1706px' }}>
              <AttractScreen />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandCustomization;