import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../constants';
import LogoIcon from '../icons/LogoIcon';
import DashboardIcon from '../icons/DashboardIcon';
import AssignmentsIcon from '../icons/AssignmentsIcon';
import DiscussionsIcon from '../icons/DiscussionsIcon';
import ResourcesIcon from '../icons/ResourcesIcon';
import UserIcon from '../icons/UserIcon';
import CloseIcon from '../icons/CloseIcon';
import CohortsIcon from '../icons/CohortsIcon';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const navLinks = [
  { to: ROUTES.DASHBOARD, text: 'Dashboard', icon: <DashboardIcon /> },
  { to: ROUTES.COHORTS, text: 'Cohorts', icon: <CohortsIcon /> },
  { to: ROUTES.ASSIGNMENTS, text: 'Assignments', icon: <AssignmentsIcon /> },
  { to: ROUTES.DISCUSSIONS, text: 'Discussions', icon: <DiscussionsIcon /> },
  { to: ROUTES.RESOURCES, text: 'Resources', icon: <ResourcesIcon /> },
  { to: ROUTES.PROFILE, text: 'Profile', icon: <UserIcon /> },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const NavItem: React.FC<{ to: string, text: string, icon: React.ReactNode }> = ({ to, text, icon }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 text-lg font-medium rounded-lg transition-colors duration-200 ${
          isActive
            ? 'bg-primary/10 text-primary dark:text-red-400'
            : 'text-neutral-gray-light hover:bg-neutral-light-gray dark:hover:bg-neutral-gray-medium'
        }`
      }
      onClick={() => { if(isOpen) toggleSidebar() }}
    >
      <span className="mr-4">{icon}</span>
      <span className="lg:block">{text}</span>
    </NavLink>
  );

  return (
    <>
      <aside
        className={`fixed lg:relative z-40 lg:z-auto w-64 h-full bg-secondary dark:bg-neutral-gray-dark border-r border-neutral-light-gray dark:border-neutral-gray-medium 
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 
        transition-transform duration-300 ease-in-out flex flex-col`}
      >
        <div className="flex items-center justify-between h-20 px-6 border-b border-neutral-light-gray dark:border-neutral-gray-medium">
          <div className="flex items-center">
            <LogoIcon className="text-primary dark:text-white" size={32} />
            <span className="ml-3 text-2xl font-heading font-bold text-neutral-soft-black dark:text-secondary">SkillLink</span>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden text-neutral-gray-light">
            <CloseIcon />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navLinks.map((link) => (
            <NavItem key={link.to} {...link} />
          ))}
        </nav>
      </aside>
      {isOpen && <div onClick={toggleSidebar} className="fixed inset-0 z-30 bg-black/50 lg:hidden"></div>}
    </>
  );
};

export default Sidebar;