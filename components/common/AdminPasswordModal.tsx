import React, { useState, useRef, useEffect } from 'react';

interface AdminPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  correctPassword: string;
}

const AdminPasswordModal: React.FC<AdminPasswordModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  correctPassword 
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError('');
      inputRefs[0].current?.focus();
    }
  }, [isOpen]);

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Apenas números

    const newPassword = password.split('');
    newPassword[index] = value;
    const updatedPassword = newPassword.join('');
    setPassword(updatedPassword);
    setError('');

    // Auto-focus no próximo campo
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    // Verificar senha quando completar 4 dígitos
    if (updatedPassword.length === 4) {
      setTimeout(() => {
        if (updatedPassword === correctPassword) {
          onSuccess();
        } else {
          setError('Senha incorreta!');
          setPassword('');
          inputRefs[0].current?.focus();
        }
      }, 100);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !password[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4);
    if (/^\d{1,4}$/.test(pastedData)) {
      setPassword(pastedData);
      if (pastedData.length === 4) {
        if (pastedData === correctPassword) {
          onSuccess();
        } else {
          setError('Senha incorreta!');
          setPassword('');
          inputRefs[0].current?.focus();
        }
      } else {
        inputRefs[pastedData.length].current?.focus();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
          🔒 Acesso Administrativo
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Digite a senha de 4 dígitos
        </p>

        <div className="flex justify-center gap-3 mb-4">
          {[0, 1, 2, 3].map((index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={password[index] || ''}
              onChange={(e) => handleDigitChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-16 h-20 text-3xl text-center font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-center mb-4 font-semibold">
            ❌ {error}
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => {
              setPassword('');
              setError('');
              inputRefs[0].current?.focus();
            }}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
          >
            Limpar
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Cancelar
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center mt-4">
          Senha padrão: 1234
        </p>
      </div>
    </div>
  );
};

export default AdminPasswordModal;

