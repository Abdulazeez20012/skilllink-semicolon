import React, { useState, useRef, useEffect, ReactNode } from 'react';
import MoreVerticalIcon from '../icons/MoreVerticalIcon';

interface DropdownProps {
  children: ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsOpen(!isOpen);
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="p-2 rounded-full hover:bg-neutral-light-gray dark:hover:bg-neutral-gray-medium text-neutral-gray-light"
      >
        <MoreVerticalIcon className="w-5 h-5" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-secondary dark:bg-neutral-gray-medium rounded-lg shadow-xl py-1 z-10 animate-fade-in">
          {/* Fix: Use generic with React.isValidElement to correctly type child props */}
          {React.Children.map(children, child => 
            React.isValidElement<{ onClick?: (e: React.MouseEvent) => void }>(child) ? React.cloneElement(child, { onClick: (e: React.MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                if (child.props.onClick) child.props.onClick(e);
                setIsOpen(false);
            }}) : child
          )}
        </div>
      )}
    </div>
  );
};

export const DropdownItem: React.FC<{ children: ReactNode, onClick?: (e: React.MouseEvent) => void, className?: string }> = ({ children, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`w-full text-left flex items-center px-4 py-2 text-sm text-neutral-soft-black dark:text-secondary hover:bg-neutral-light-gray dark:hover:bg-neutral-gray-dark ${className}`}
  >
    {children}
  </button>
);

export default Dropdown;