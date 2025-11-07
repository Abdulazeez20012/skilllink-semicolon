import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  // Fix: Add style prop to allow passing inline styles for animations.
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick, style }) => {
  const baseStyles =
    'bg-secondary dark:bg-neutral-gray-dark border border-neutral-light-gray dark:border-neutral-gray-medium rounded-2xl shadow-sm transition-all duration-300';
  const interactiveStyles = onClick ? 'cursor-pointer group hover:shadow-lg hover:-translate-y-1 hover:border-primary/30 dark:hover:shadow-primary/10' : '';

  return (
    <div className={`${baseStyles} ${interactiveStyles} ${className}`} onClick={onClick} style={style}>
      {children}
    </div>
  );
};

export default Card;