import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Assignment, UserRole, AssignmentStatus } from '../types';
import { realApi } from '../services/realApi';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import PlusIcon from '../components/icons/PlusIcon';
import UsersIcon from '../components/icons/UsersIcon';
import FileClockIcon from '../components/icons/FileClockIcon';
import ClipboardCheckIcon from '../components/icons/ClipboardCheckIcon';
import ChartIcon from '../components/icons/ChartIcon';
import ProgressTracker from '../components/ProgressTracker';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const token = localStorage.getItem('skilllink_token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        // Fetch assignments
        const assignmentsData = await realApi.getAssignments(token);
        setAssignments(assignmentsData);
        
        // For admins, also fetch cohort data for analytics
        if (user.role === UserRole.ADMIN) {
          const cohortsData = await realApi.getCohorts(token);
          setCohorts(cohortsData);
        }
        
        // For students, fetch attendance data
        if (user.role === UserRole.STUDENT && assignmentsData.length > 0) {
          // Get the first cohort for now (in a real app, we'd handle multiple cohorts)
          const cohortId = assignmentsData[0].cohortId;
          if (cohortId) {
            const attendanceData = await realApi.getStudentAttendance(cohortId, token);
            setAttendance(attendanceData);
          }
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchData();
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
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold font-heading mb-4 opacity-0 animate-fade-in-up" style={{animationDelay: '300ms'}}>Progress Tracker</h2>
                    <ProgressTracker 
                      assignments={assignments} 
                      currentStreak={attendance?.currentStreak}
                      longestStreak={attendance?.longestStreak}
                    />
                </div>
                <div>
                    <h2 className="text-2xl font-bold font-heading mb-4 opacity-0 animate-fade-in-up" style={{animationDelay: '500ms'}}>Recent Activity</h2>
                    <Card className="p-6 opacity-0 animate-fade-in-up" style={{animationDelay: '600ms'}}>
                      {recentSubmissions.length > 0 ? (
                        <ul className="space-y-4">
                          {recentSubmissions.map((a, i) => (
                            <li key={a.id} className="flex items-center justify-between opacity-0 animate-fade-in-up" style={{animationDelay: `${700 + i * 100}ms`}}>
                                <span className="text-sm">{a.title}</span>
                                <Badge status={a.status} />
                            </li>
                          ))}
                        </ul>
                      ) : <p className="text-neutral-gray-light">No recent submissions.</p>}
                    </Card>
                </div>
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
  
  // New state for cohort health data
  const [cohortHealthData, setCohortHealthData] = useState<any>(null);
  const [loadingHealth, setLoadingHealth] = useState<boolean>(false);

  // Function to fetch cohort health data
  const fetchCohortHealth = async (cohortId: string) => {
    if (!user) return;
    
    try {
      setLoadingHealth(true);
      const token = localStorage.getItem('skilllink_token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const healthData = await realApi.getCohortHealthScore(cohortId, token);
      setCohortHealthData(healthData);
    } catch (error) {
      console.error('Failed to fetch cohort health data', error);
    } finally {
      setLoadingHealth(false);
    }
  };

  const AdminDashboard = () => {
    // Calculate analytics
    const totalStudents = cohorts.reduce((sum, cohort) => sum + cohort.students.length, 0);
    const totalFacilitators = cohorts.reduce((sum, cohort) => sum + cohort.facilitators.length, 0);
    const totalCohorts = cohorts.length;
    
    // Calculate assignment stats
    const totalAssignments = assignments.length;
    const pendingAssignments = assignments.filter(a => a.status === AssignmentStatus.PENDING).length;
    const submittedAssignments = assignments.filter(a => a.status === AssignmentStatus.SUBMITTED).length;
    const gradedAssignments = assignments.filter(a => a.status === AssignmentStatus.GRADED).length;
    
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard icon={<UsersIcon />} label="Total Students" value={totalStudents} delay={100}/>
              <StatCard icon={<ClipboardCheckIcon />} label="Total Facilitators" value={totalFacilitators} delay={200}/>
              <StatCard icon={<FileClockIcon />} label="Active Cohorts" value={totalCohorts} delay={300}/>
              <StatCard icon={<ChartIcon />} label="Total Assignments" value={totalAssignments} delay={400}/>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Cohort Health Score Visualization */}
              <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold font-heading">Cohort Health Overview</h3>
                  <select 
                    onChange={(e) => fetchCohortHealth(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                  >
                    <option value="">Select a cohort</option>
                    {cohorts.map(cohort => (
                      <option key={cohort.id} value={cohort.id}>{cohort.name}</option>
                    ))}
                  </select>
                </div>
                
                {loadingHealth ? (
                  <div className="flex justify-center items-center h-40">
                    <Spinner size="lg" />
                  </div>
                ) : cohortHealthData ? (
                  <div className="space-y-6">
                    {/* Health Score Visualization */}
                    <div className="text-center">
                      <div className="relative inline-block">
                        <svg className="w-32 h-32">
                          <circle
                            className="text-gray-200"
                            strokeWidth="8"
                            stroke="currentColor"
                            fill="transparent"
                            r="50"
                            cx="64"
                            cy="64"
                          />
                          <circle
                            className={`${
                              cohortHealthData.healthScore >= 75 
                                ? 'text-green-500' 
                                : cohortHealthData.healthScore >= 50 
                                  ? 'text-yellow-500' 
                                  : 'text-red-500'
                            }`}
                            strokeWidth="8"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="50"
                            cx="64"
                            cy="64"
                            strokeDasharray={`${cohortHealthData.healthScore} ${100 - cohortHealthData.healthScore}`}
                            strokeDashoffset="25"
                            transform="rotate(-90 64 64)"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-bold">{cohortHealthData.healthScore}</span>
                          <span className="text-sm text-gray-500">Score</span>
                        </div>
                      </div>
                      <p className={`mt-2 font-semibold ${
                        cohortHealthData.healthStatus === 'Healthy' 
                          ? 'text-green-600' 
                          : cohortHealthData.healthStatus === 'Needs Attention' 
                            ? 'text-yellow-600' 
                            : 'text-red-600'
                      }`}>
                        {cohortHealthData.healthStatus}
                      </p>
                    </div>
                    
                    {/* Metrics Breakdown */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-lg font-bold">{cohortHealthData.metrics.attendance.score}%</p>
                        <p className="text-xs text-gray-600">Attendance</p>
                        <p className="text-xs text-gray-500">{cohortHealthData.metrics.attendance.weight}</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-lg font-bold">{cohortHealthData.metrics.completion.score}%</p>
                        <p className="text-xs text-gray-600">Completion</p>
                        <p className="text-xs text-gray-500">{cohortHealthData.metrics.completion.weight}</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-lg font-bold">{cohortHealthData.metrics.forumActivity.score}%</p>
                        <p className="text-xs text-gray-600">Forum Activity</p>
                        <p className="text-xs text-gray-500">{cohortHealthData.metrics.forumActivity.weight}</p>
                      </div>
                    </div>
                    
                    {/* Statistics */}
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="font-medium mb-2">Statistics</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Students:</span>
                          <span className="font-medium">{cohortHealthData.statistics.totalStudents}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sessions:</span>
                          <span className="font-medium">{cohortHealthData.statistics.totalSessions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Assignments:</span>
                          <span className="font-medium">{cohortHealthData.statistics.totalAssignments}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Submissions:</span>
                          <span className="font-medium">{cohortHealthData.statistics.totalSubmissions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Comments:</span>
                          <span className="font-medium">{cohortHealthData.statistics.totalComments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Select a cohort to view health metrics</p>
                  </div>
                )}
              </Card>
              
              <div>
                <Card className="p-6">
                  <h3 className="text-2xl font-bold font-heading mb-6">Cohort Distribution</h3>
                  <div className="space-y-4">
                    {cohorts.map((cohort, index) => (
                      <div key={cohort.id} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${100 + index * 50}ms`}}>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{cohort.name}</span>
                          <span className="text-sm">{cohort.students.length} students</span>
                        </div>
                        <div className="w-full bg-neutral-light-gray dark:bg-neutral-gray-medium rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${Math.min(100, (cohort.students.length / 50) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
                
                <Card className="p-6 mt-8">
                  <h3 className="text-2xl font-bold font-heading mb-6">Assignment Status</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">Pending</span>
                        <span className="text-sm">{pendingAssignments}</span>
                      </div>
                      <div className="w-full bg-neutral-light-gray dark:bg-neutral-gray-medium rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full" 
                          style={{ width: `${(pendingAssignments / Math.max(1, totalAssignments)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">Submitted</span>
                        <span className="text-sm">{submittedAssignments}</span>
                      </div>
                      <div className="w-full bg-neutral-light-gray dark:bg-neutral-gray-medium rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(submittedAssignments / Math.max(1, totalAssignments)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">Graded</span>
                        <span className="text-sm">{gradedAssignments}</span>
                      </div>
                      <div className="w-full bg-neutral-light-gray dark:bg-neutral-gray-medium rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${(gradedAssignments / Math.max(1, totalAssignments)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
        </div>
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Spinner size="lg" /></div>;
  }

  return (
    <div>
      <PageHeader />
      {user?.role === UserRole.STUDENT && <StudentDashboard />}
      {user?.role === UserRole.FACILITATOR && <FacilitatorDashboard />}
      {user?.role === UserRole.ADMIN && <AdminDashboard />}
    </div>
  );
};

export default DashboardPage;