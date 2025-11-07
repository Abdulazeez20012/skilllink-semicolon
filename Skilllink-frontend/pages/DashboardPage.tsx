import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Assignment, UserRole, AssignmentStatus } from '../types';
import { api } from '../services/api';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import PlusIcon from '../components/icons/PlusIcon';
import UsersIcon from '../components/icons/UsersIcon';
import FileClockIcon from '../components/icons/FileClockIcon';
import ClipboardCheckIcon from '../components/icons/ClipboardCheckIcon';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!user) return;
      try {
        const data = await api.getAssignments(user);
        setAssignments(data);
      } catch (error) {
        console.error('Failed to fetch assignments', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchAssignments();
    }
  }, [user]);
  
  const PageHeader = () => (
     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 animate-fade-in-up">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-neutral-soft-black dark:text-secondary">
            Welcome back, {user?.name.split(' ')[0]}!
          </h1>
          <p className="text-neutral-gray-light mt-1">Here's your overview for today.</p>
        </div>
        {user?.role === UserRole.FACILITATOR && (
            <Button className="mt-4 sm:mt-0" leftIcon={<PlusIcon />}>Create Assignment</Button>
        )}
      </div>
  );
  
  const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; delay: number }> = ({ icon, label, value, delay }) => (
      <Card className="p-6 opacity-0 animate-fade-in-up" style={{ animationDelay: `${delay}ms`}}>
          <div className="flex items-center gap-4">
              <div className="bg-primary/10 text-primary rounded-lg p-3">
                  {icon}
              </div>
              <div>
                  <p className="text-3xl font-bold">{value}</p>
                  <p className="text-neutral-gray-light text-sm">{label}</p>
              </div>
          </div>
      </Card>
  );

  const StudentDashboard = () => {
    const upcomingAssignments = assignments
      .filter(a => a.status === AssignmentStatus.PENDING)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);
      
    const recentSubmissions = assignments
      .filter(a => a.status === AssignmentStatus.SUBMITTED || a.status === AssignmentStatus.GRADED)
      .slice(0, 5);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold font-heading mb-4 opacity-0 animate-fade-in-up" style={{animationDelay: '100ms'}}>Upcoming Assignments</h2>
                <Card className="p-6 opacity-0 animate-fade-in-up" style={{animationDelay: '200ms'}}>
                  {upcomingAssignments.length > 0 ? (
                    <ul className="space-y-2">
                      {upcomingAssignments.map((a, i) => (
                        <li key={a.id} className="opacity-0 animate-fade-in-up" style={{animationDelay: `${300 + i * 100}ms`}}>
                            <Link to={`/app/assignments/${a.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-light-gray/50 dark:hover:bg-neutral-gray-medium/50 transition-colors">
                                <div>
                                    <p className="font-semibold">{a.title}</p>
                                    <p className="text-sm text-neutral-gray-light">Due: {new Date(a.dueDate).toLocaleDateString()}</p>
                                </div>
                                <Badge status={a.status} />
                            </Link>
                        </li>
                      ))}
                    </ul>
                  ) : <p className="text-neutral-gray-light p-3">No upcoming assignments. Great job!</p>}
                </Card>
            </div>
            <div>
                <h2 className="text-2xl font-bold font-heading mb-4 opacity-0 animate-fade-in-up" style={{animationDelay: '300ms'}}>Recent Activity</h2>
                <Card className="p-6 opacity-0 animate-fade-in-up" style={{animationDelay: '400ms'}}>
                  {recentSubmissions.length > 0 ? (
                    <ul className="space-y-4">
                      {recentSubmissions.map((a, i) => (
                        <li key={a.id} className="flex items-center justify-between opacity-0 animate-fade-in-up" style={{animationDelay: `${500 + i * 100}ms`}}>
                            <span className="text-sm">{a.title}</span>
                            <Badge status={a.status} />
                        </li>
                      ))}
                    </ul>
                  ) : <p className="text-neutral-gray-light">No recent submissions.</p>}
                </Card>
            </div>
        </div>
    );
  };
  
  const FacilitatorDashboard = () => {
      return (
          <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard icon={<UsersIcon />} label="Total Students" value={34} delay={100}/>
                <StatCard icon={<FileClockIcon />} label="Pending Submissions" value={12} delay={200}/>
                <StatCard icon={<ClipboardCheckIcon />} label="Graded this week" value={28} delay={300}/>
              </div>
              <h2 className="text-2xl font-bold font-heading my-8 opacity-0 animate-fade-in-up" style={{animationDelay: '400ms'}}>Recent Activity</h2>
              <Card className="p-6 opacity-0 animate-fade-in-up" style={{animationDelay: '500ms'}}>
                  <p className="text-neutral-gray-light">Activity feed coming soon.</p>
              </Card>
          </div>
      );
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Spinner size="lg" /></div>;
  }

  return (
    <div>
      <PageHeader />
      {user?.role === UserRole.STUDENT ? <StudentDashboard /> : <FacilitatorDashboard />}
    </div>
  );
};

export default DashboardPage;