
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  wrapperClassName?: string;
}

const Input: React.FC<InputProps> = ({ label, id, icon, className = '', wrapperClassName = '', ...props }) => {
  return (
    <div className={`w-full ${wrapperClassName}`}>
      {label && <label htmlFor={id} className="block text-sm font-medium text-neutral-gray-light mb-1">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-gray-light">{icon}</div>}
        <input
          id={id}
          className={`w-full px-4 py-2 rounded-lg bg-neutral-light-gray dark:bg-neutral-gray-medium border border-transparent 
            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
            dark:text-secondary placeholder:text-neutral-gray-light transition-colors duration-200 ${icon ? 'pl-10' : ''} ${className}`}
          {...props}
        />
      </div>
    </div>
  );
};

export default Input;
