import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import BellIcon from '../icons/BellIcon';
import SearchIcon from '../icons/SearchIcon';
import ChevronDownIcon from '../icons/ChevronDownIcon';
import LogOutIcon from '../icons/LogOutIcon';
import Input from '../ui/Input';
import MenuIcon from '../icons/MenuIcon';
import ThemeToggle from '../ui/ThemeToggle';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex-shrink-0 bg-secondary/80 dark:bg-neutral-gray-dark/80 backdrop-blur-lg border-b border-neutral-light-gray dark:border-neutral-gray-medium">
      <div className="flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
        <button onClick={toggleSidebar} className="lg:hidden text-neutral-gray-light">
            <MenuIcon/>
        </button>

        <div className="hidden md:block w-full max-w-xs">
          <Input 
            icon={<SearchIcon className="w-5 h-5"/>} 
            placeholder="Search for assignments..."
            className="rounded-full"
          />
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          <div className="relative">
            <button className="p-2 rounded-full text-neutral-gray-light hover:bg-neutral-light-gray dark:hover:bg-neutral-gray-medium transition-colors duration-200">
              <BellIcon />
            </button>
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-primary ring-2 ring-secondary dark:ring-neutral-gray-dark"></span>
          </div>

          <div className="relative">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2">
              <img src={user?.avatarUrl} alt="User Avatar" className="w-10 h-10 rounded-full" />
              <div className="hidden md:flex items-center">
                <span className="text-neutral-soft-black dark:text-secondary font-medium">{user?.name}</span>
                <ChevronDownIcon className="w-5 h-5 text-neutral-gray-light" />
              </div>
            </button>
            {dropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-secondary dark:bg-neutral-gray-medium rounded-lg shadow-xl py-1 animate-fade-in"
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <a href="#/app/profile" className="block px-4 py-2 text-sm text-neutral-soft-black dark:text-secondary hover:bg-neutral-light-gray dark:hover:bg-neutral-gray-dark">
                  My Profile
                </a>
                <button onClick={logout} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-500 hover:bg-neutral-light-gray dark:hover:bg-neutral-gray-dark">
                  <LogOutIcon className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;