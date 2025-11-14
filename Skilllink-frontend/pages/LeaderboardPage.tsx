import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { realApi } from '../services/realApi';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { UserRole, AssignmentStatus } from '../types';

interface LeaderboardEntry {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  rank: number;
  totalScore: number;
  assignmentScore: number;
  attendanceScore: number;
  forumScore: number;
  assignmentsCompleted: number;
  averageGrade: number;
  attendanceRate: number;
  helpfulAnswers: number;
  currentStreak: number;
}

const LeaderboardPage: React.FC = () => {
  const { cohortId: paramCohortId } = useParams<{ cohortId: string }>();
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userPosition, setUserPosition] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  
  // Use cohortId from params or user's first cohort
  const cohortId = paramCohortId || user?.cohorts?.[0];

  useEffect(() => {
    fetchLeaderboard();
    if (user && cohortId) {
      fetchUserPosition();
    }
  }, [cohortId, user]);

  const fetchLeaderboard = async () => {
    if (!cohortId) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('skilllink_token');
      if (!token) throw new Error('No token');
      
      const response = await fetch(`http://localhost:5000/api/leaderboard/${cohortId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error('Failed to fetch leaderboard', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosition = async () => {
    if (!cohortId || !user) return;
    try {
      const token = localStorage.getItem('skilllink_token');
      if (!token) return;
      
      const response = await fetch(`http://localhost:5000/api/leaderboard/${cohortId}/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUserPosition(data);
      }
    } catch (error) {
      console.error('Failed to fetch user position', error);
    }
  };

  const handleCalculate = async () => {
    if (!cohortId) return;
    try {
      setCalculating(true);
      const token = localStorage.getItem('skilllink_token');
      if (!token) throw new Error('No token');
      
      await fetch(`http://localhost:5000/api/leaderboard/calculate/${cohortId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      await fetchLeaderboard();
      if (user) await fetchUserPosition();
    } catch (error) {
      console.error('Failed to calculate leaderboard', error);
    } finally {
      setCalculating(false);
    }
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-orange-600';
    return 'text-neutral-gray-light';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8 animate-fade-in-up">
        <div>
          <h1 className="text-4xl font-bold font-heading">Leaderboard</h1>
          <p className="text-neutral-gray-light mt-1">
            Top performers in your cohort
          </p>
        </div>
        {(user?.role === UserRole.FACILITATOR || user?.role === UserRole.ADMIN) && (
          <Button onClick={handleCalculate} disabled={calculating}>
            {calculating ? <Spinner size="sm" color="white" /> : 'Recalculate'}
          </Button>
        )}
      </div>

      {/* User's Position Card */}
      {userPosition && user?.role === UserRole.STUDENT && (
        <Card className="p-6 mb-8 bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`text-4xl font-bold ${getRankColor(userPosition.rank)}`}>
                {getRankIcon(userPosition.rank)}
              </div>
              <div>
                <h3 className="text-xl font-bold">Your Position</h3>
                <p className="text-neutral-gray-light">Rank #{userPosition.rank}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{userPosition.totalScore}</div>
              <p className="text-sm text-neutral-gray-light">Total Score</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-neutral-light-gray dark:border-neutral-gray-medium">
            <div className="text-center">
              <div className="text-lg font-bold">{userPosition.assignmentScore}</div>
              <div className="text-xs text-neutral-gray-light">Assignments</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{userPosition.attendanceScore}</div>
              <div className="text-xs text-neutral-gray-light">Attendance</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{userPosition.forumScore}</div>
              <div className="text-xs text-neutral-gray-light">Forum</div>
            </div>
          </div>
        </Card>
      )}

      {/* Leaderboard Table */}
      <Card className="overflow-hidden animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-light-gray dark:bg-neutral-gray-medium">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Rank</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Student</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Total Score</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Assignments</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Attendance</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Forum</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Streak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-light-gray dark:divide-neutral-gray-medium">
              {leaderboard.map((entry, index) => (
                <tr
                  key={entry._id}
                  className={`hover:bg-neutral-light-gray/50 dark:hover:bg-neutral-gray-medium/50 transition-colors ${
                    entry.user._id === user?.id ? 'bg-primary/5' : ''
                  }`}
                  style={{ animationDelay: `${200 + index * 50}ms` }}
                >
                  <td className="px-6 py-4">
                    <div className={`text-2xl font-bold ${getRankColor(entry.rank)}`}>
                      {getRankIcon(entry.rank)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={entry.user.avatar || `https://ui-avatars.com/api/?name=${entry.user.name}&background=random`}
                        alt={entry.user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="font-semibold">{entry.user.name}</div>
                        <div className="text-sm text-neutral-gray-light">
                          {entry.assignmentsCompleted} assignments • {entry.attendanceRate}% attendance
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="text-2xl font-bold text-primary">{entry.totalScore}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="font-semibold">{entry.assignmentScore}</div>
                    <div className="text-xs text-neutral-gray-light">Avg: {entry.averageGrade}%</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="font-semibold">{entry.attendanceScore}</div>
                    <div className="text-xs text-neutral-gray-light">{entry.attendanceRate}%</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="font-semibold">{entry.forumScore}</div>
                    <div className="text-xs text-neutral-gray-light">{entry.helpfulAnswers} helpful</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge status={entry.currentStreak > 5 ? AssignmentStatus.GRADED : AssignmentStatus.PENDING}>
                      🔥 {entry.currentStreak}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {leaderboard.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-neutral-gray-light mb-4">
            No leaderboard data yet. {(user?.role === UserRole.FACILITATOR || user?.role === UserRole.ADMIN) && 'Click "Recalculate" to generate the leaderboard.'}
          </p>
        </Card>
      )}
    </div>
  );
};

export default LeaderboardPage;
