import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = 'font-bold text-xl py-4 px-8 transition-all duration-200 ease-in-out active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed min-h-[70px] min-w-[250px] btn-hover-glow';
  
  const variantClasses = {
    primary: 'bg-[var(--color-button-primary-bg)] text-[var(--color-button-primary-text)]',
    secondary: 'bg-[var(--color-button-secondary-bg)] text-[var(--color-button-secondary-text)]',
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{
        borderRadius: 'var(--border-radius)',
        fontFamily: 'var(--font-primary)',
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;