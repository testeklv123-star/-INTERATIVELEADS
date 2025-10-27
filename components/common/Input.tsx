
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  // This allows us to pass react-hook-form's register function
  registration?: any; 
}

const Input: React.FC<InputProps> = ({ label, error, registration, ...props }) => {
  return (
    <div className="w-full">
      <label className="block text-lg mb-2 text-[var(--color-text-secondary)]" style={{ fontFamily: 'var(--font-secondary)' }}>
        {label}
      </label>
      <input
        className="w-full text-xl p-4 border-2 focus:outline-none transition-colors duration-300"
        style={{
          borderColor: error ? 'var(--color-error)' : 'var(--color-text-secondary)',
          borderRadius: 'var(--border-radius)',
          fontFamily: 'var(--font-secondary)',
          color: 'var(--color-text)',
          backgroundColor: 'var(--color-background)',
        }}
        onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
        onBlur={(e) => e.target.style.borderColor = error ? 'var(--color-error)' : 'var(--color-text-secondary)'}
        {...registration}
        {...props}
      />
      {error && <span className="text-red-500 mt-1 text-sm">{error}</span>}
    </div>
  );
};

export default Input;
