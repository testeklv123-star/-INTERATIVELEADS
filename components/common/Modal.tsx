import React from 'react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div 
        className="p-8 shadow-2xl w-full max-w-2xl mx-4 flex flex-col items-center text-center modal-content-animated"
        style={{ 
          backgroundColor: 'var(--color-background)',
          borderRadius: 'var(--border-radius)',
          border: '2px solid var(--color-primary)'
        }}
      >
        <h2 
          className="text-4xl font-bold mb-4"
          style={{ 
            color: 'var(--color-primary)',
            fontSize: 'var(--font-size-h2)' 
          }}
        >
          {title}
        </h2>
        <div className="text-2xl my-6 text-[var(--color-text)]">
          {children}
        </div>
        <Button onClick={onClose}>
          CONTINUAR
        </Button>
      </div>
    </div>
  );
};

export default Modal;