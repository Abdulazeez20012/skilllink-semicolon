import React from 'react';
import Card from './ui/Card';
import Badge from './ui/Badge';
import { Assignment, AssignmentStatus } from '../types';
import StreakCounter from './StreakCounter';

interface ProgressTrackerProps {
  assignments: Assignment[];
  currentStreak?: number;
  longestStreak?: number;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ 
  assignments, 
  currentStreak = 0, 
  longestStreak = 0 
}) => {
  // Calculate progress statistics
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => 
    a.status === AssignmentStatus.SUBMITTED || a.status === AssignmentStatus.GRADED
  ).length;
  const pendingAssignments = assignments.filter(a => a.status === AssignmentStatus.PENDING).length;
  
  const completionPercentage = totalAssignments > 0 
    ? Math.round((completedAssignments / totalAssignments) * 100) 
    : 0;

  // Get upcoming deadlines (next 7 days)
  const upcomingDeadlines = assignments
    .filter(a => a.status === AssignmentStatus.PENDING)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Attendance Streak */}
      {(currentStreak !== undefined || longestStreak !== undefined) && (
        <StreakCounter currentStreak={currentStreak} longestStreak={longestStreak} />
      )}
      
      {/* Overall Progress */}
      <Card className="p-6">
        <h3 className="text-xl font-bold font-heading mb-4">Course Progress</h3>
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#eee"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#4CAF50"
                strokeWidth="3"
                strokeDasharray={`${completionPercentage}, 100`}
              />
              <text x="18" y="20.5" textAnchor="middle" fill="#4CAF50" fontSize="8" fontWeight="bold">{completionPercentage}%</text>
            </svg>
          </div>
          <p className="text-neutral-gray-light">
            {completedAssignments} of {totalAssignments} assignments completed
          </p>
        </div>
      </Card>

      {/* Upcoming Deadlines */}
      <Card className="p-6">
        <h3 className="text-xl font-bold font-heading mb-4">Upcoming Deadlines</h3>
        {upcomingDeadlines.length > 0 ? (
          <ul className="space-y-3">
            {upcomingDeadlines.map((assignment) => (
              <li key={assignment.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-neutral-light-gray/50 dark:hover:bg-neutral-gray-medium/50 transition-colors">
                <div>
                  <p className="font-medium">{assignment.title}</p>
                  <p className="text-sm text-neutral-gray-light">
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <Badge status={assignment.status} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-neutral-gray-light text-center py-4">No upcoming deadlines</p>
        )}
      </Card>
    </div>
  );
};

export default ProgressTracker;