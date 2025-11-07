import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  wrapperClassName?: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, id, className = '', wrapperClassName = '', ...props }) => {
  return (
    <div className={`w-full ${wrapperClassName}`}>
      {label && <label htmlFor={id} className="block text-sm font-medium text-neutral-gray-light mb-1">{label}</label>}
      <textarea
        id={id}
        className={`w-full px-4 py-2 rounded-lg bg-neutral-light-gray dark:bg-neutral-gray-medium border border-transparent 
          focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
          dark:text-secondary placeholder:text-neutral-gray-light transition-colors duration-200 ${className}`}
        rows={4}
        {...props}
      />
    </div>
  );
};

export default Textarea;