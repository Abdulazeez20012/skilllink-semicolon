
import React from 'react';
import { AssignmentStatus } from '../../types';

interface BadgeProps {
  status: AssignmentStatus;
  children?: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ status, children, className = '' }) => {
  const statusColors: Record<AssignmentStatus, string> = {
    [AssignmentStatus.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    [AssignmentStatus.SUBMITTED]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    [AssignmentStatus.GRADED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    [AssignmentStatus.LATE]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusColors[status]} ${className}`}
    >
      {children || status}
    </span>
  );
};

export default Badge;
