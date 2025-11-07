import React from 'react';
import ChevronDownIcon from '../icons/ChevronDownIcon';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  wrapperClassName?: string;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ label, id, className = '', wrapperClassName = '', children, ...props }) => {
  return (
    <div className={`w-full ${wrapperClassName}`}>
      {label && <label htmlFor={id} className="block text-sm font-medium text-neutral-gray-light mb-1">{label}</label>}
      <div className="relative">
        <select
          id={id}
          className={`w-full appearance-none px-4 py-2 rounded-lg bg-neutral-light-gray dark:bg-neutral-gray-medium border border-transparent 
            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
            dark:text-secondary placeholder:text-neutral-gray-light transition-colors duration-200 pr-10 ${className}`}
          {...props}
        >
          {children}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <ChevronDownIcon className="w-5 h-5 text-neutral-gray-light" />
        </div>
      </div>
    </div>
  );
};

export default Select;