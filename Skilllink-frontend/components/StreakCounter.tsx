import React from 'react';
import Card from './ui/Card';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
}

const StreakCounter: React.FC<StreakCounterProps> = ({ currentStreak, longestStreak }) => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold font-heading mb-4">Attendance Streak</h3>
      <div className="flex justify-between items-center">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">{currentStreak}</div>
          <div className="text-sm text-neutral-gray-light">Current Streak</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-secondary">{longestStreak}</div>
          <div className="text-sm text-neutral-gray-light">Longest Streak</div>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center">
          {[...Array(7)].map((_, i) => (
            <div 
              key={i} 
              className={`w-8 h-8 rounded-full mx-1 flex items-center justify-center ${
                i < currentStreak 
                  ? 'bg-primary text-white' 
                  : 'bg-neutral-light-gray dark:bg-neutral-gray-medium text-neutral-gray-light'
              }`}
            >
              {i < currentStreak ? '🔥' : i + 1}
            </div>
          ))}
        </div>
        <p className="text-sm text-neutral-gray-light mt-2 text-center">
          {currentStreak > 0 
            ? `Keep it up! ${currentStreak}-day streak!` 
            : 'Start your streak today!'}
        </p>
      </div>
    </Card>
  );
};

export default StreakCounter;