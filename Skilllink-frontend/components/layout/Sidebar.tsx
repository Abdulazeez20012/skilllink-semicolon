import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../Logo';
import CloseIcon from '../icons/CloseIcon';
import DashboardIcon from '../icons/DashboardIcon';
import AssignmentsIcon from '../icons/AssignmentsIcon';
import CohortsIcon from '../icons/CohortsIcon';
import DiscussionsIcon from '../icons/DiscussionsIcon';
import ResourcesIcon from '../icons/ResourcesIcon';
import UserIcon from '../icons/UserIcon';
import { ROUTES } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';
import ChartIcon from '../icons/ChartIcon';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const baseNavLinks = [
  { to: ROUTES.DASHBOARD, icon: DashboardIcon, label: 'Dashboard' },
  { to: ROUTES.ASSIGNMENTS, icon: AssignmentsIcon, label: 'Assignments' },
  { to: ROUTES.COHORTS, icon: CohortsIcon, label: 'Cohorts' },
  { to: ROUTES.DISCUSSIONS, icon: DiscussionsIcon, label: 'Discussions' },
  { to: ROUTES.RESOURCES, icon: ResourcesIcon, label: 'Resources' },
];

const adminNavLinks = [
  { to: '/app/alerts', icon: ChartIcon, label: 'Predictive Alerts', adminOnly: true },
];

const communityNavLinks = [
  { to: '/app/leaderboard', icon: ChartIcon, label: 'Leaderboard' },
  { to: '/app/showcase', icon: ChartIcon, label: 'Project Showcase' },
  { to: '/app/chat', icon: DiscussionsIcon, label: 'Chat' },
];

const profileLink = { to: ROUTES.PROFILE, icon: UserIcon, label: 'Profile' };

const NavItem: React.FC<{ to: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; label: string }> = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
        isActive 
          ? 'bg-primary text-white shadow' 
          : 'text-neutral-gray-light hover:bg-neutral-light-gray dark:hover:bg-neutral-gray-medium'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="ml-3 font-medium">{label}</span>
    </Link>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth();
  
  // Build navigation links based on user role
  const navLinks = [
    ...baseNavLinks,
    ...communityNavLinks,
    ...(user?.role === UserRole.ADMIN ? adminNavLinks : []),
    profileLink
  ];
  
  return (
    <>
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-secondary dark:bg-neutral-gray-dark border-r border-neutral-light-gray dark:border-neutral-gray-medium transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col`}
      >
        <div className="flex items-center justify-between h-20 px-6 border-b border-neutral-light-gray dark:border-neutral-gray-medium">
          <div className="flex items-center">
            <Logo className="text-primary dark:text-white" size={32} />
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
        {user && (
          <div className="p-4 border-t border-neutral-light-gray dark:border-neutral-gray-medium">
            <div className="flex items-center">
              <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
              <div className="ml-3">
                <p className="text-sm font-medium text-neutral-soft-black dark:text-secondary">{user.name}</p>
                <p className="text-xs text-neutral-gray-light capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        )}
      </aside>
      {isOpen && <div onClick={toggleSidebar} className="fixed inset-0 z-30 bg-black/50 lg:hidden"></div>}
    </>
  );
};

export default Sidebar;