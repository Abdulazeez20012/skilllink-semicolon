import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import SunIcon from '../icons/SunIcon';
import MoonIcon from '../icons/MoonIcon';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-10 h-10 rounded-full text-neutral-gray-light hover:bg-neutral-light-gray dark:hover:bg-neutral-gray-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-secondary dark:focus:ring-offset-neutral-gray-dark"
      aria-label={isDark ? 'Activate light mode' : 'Activate dark mode'}
      role="switch"
      aria-checked={isDark}
    >
      <span className="sr-only">Toggle theme</span>
      
      {/* Sun Icon: Rotates out when dark mode is active */}
      <SunIcon 
        className={`
          w-6 h-6 text-yellow-500 transform transition-all duration-500 ease-in-out
          ${isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}
        `}
      />
      
      {/* Moon Icon: Rotates in when dark mode is active */}
      <MoonIcon 
        className={`
          absolute w-6 h-6 text-blue-400 transform transition-all duration-500 ease-in-out
          ${isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}
        `}
      />
    </button>
  );
};

export default ThemeToggle;
