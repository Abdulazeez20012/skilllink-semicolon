import React, { ReactNode, useEffect } from 'react';
import ReactDOM from 'react-dom';
import CloseIcon from '../icons/CloseIcon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0"
        aria-hidden="true"
        onClick={onClose}
      ></div>

      <div className="relative bg-secondary dark:bg-neutral-gray-dark rounded-2xl shadow-xl w-full max-w-lg mx-4 animate-fade-in-zoom">
        <div className="flex items-center justify-between p-6 border-b border-neutral-light-gray dark:border-neutral-gray-medium">
          <h3 id="modal-title" className="text-2xl font-bold font-heading text-neutral-soft-black dark:text-secondary">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-neutral-gray-light hover:text-primary dark:hover:text-red-400 transition-colors"
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;