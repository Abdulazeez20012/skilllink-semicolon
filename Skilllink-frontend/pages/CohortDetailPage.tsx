import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import { Cohort, Assignment, UserRole, AssignmentStatus } from '../types';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';

const CohortDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [cohort, setCohort] = useState<Cohort | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('assignments');
  
  useEffect(() => {
    const fetchCohortData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [cohortData, assignmentsData] = await Promise.all([
          api.getCohortById(id),
          api.getAssignmentsByCohort(id)
        ]);
        setCohort(cohortData || null);
        setAssignments(assignmentsData);
      } catch (error) {
        console.error("Failed to fetch cohort data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCohortData();
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-full"><Spinner size="lg" /></div>;
  if (!cohort) return <div className="text-center">Cohort not found.</div>;

  const tabs = [
    { id: 'assignments', label: 'Assignments' },
  ];
  if (user?.role === UserRole.FACILITATOR) {
    tabs.push({ id: 'students', label: 'Students' });
  } else {
    tabs.push({ id: 'progress', label: 'My Progress' });
  }
  
  const submittedCount = assignments.filter(a => a.status === AssignmentStatus.SUBMITTED || a.status === AssignmentStatus.GRADED).length;

  return (
    <div>
      {/* Header */}
      <Card className="mb-8 p-6 animate-fade-in-up">
        <h1 className="text-4xl font-bold font-heading">{cohort.name}</h1>
        <p className="text-neutral-gray-light mt-2 max-w-3xl">{cohort.description}</p>
        <div className="flex items-center mt-4 -space-x-2">
            {cohort.facilitators.map(f => (
                <img key={f.id} src={f.avatarUrl} title={`Facilitator: ${f.name}`} className="w-10 h-10 rounded-full ring-2 ring-secondary dark:ring-neutral-gray-dark"/>
            ))}
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-neutral-light-gray dark:border-neutral-gray-medium mb-8 animate-fade-in-up" style={{animationDelay: '100ms'}}>
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-neutral-gray-light hover:text-neutral-soft-black dark:hover:text-secondary hover:border-neutral-gray-light'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in-up" style={{animationDelay: '200ms'}}>
        {activeTab === 'assignments' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment, index) => (
                <div key={assignment.id} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms`}}>
                    <Link to={`/app/assignments/${assignment.id}`}>
                        <Card className="p-6 h-full" onClick={() => {}}>
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold font-heading text-lg mb-2 flex-1 pr-4 group-hover:text-primary transition-colors">{assignment.title}</h4>
                                <Badge status={assignment.status} />
                            </div>
                            <p className="text-sm text-neutral-gray-light">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                        </Card>
                    </Link>
                </div>
            ))}
          </div>
        )}
        
        {activeTab === 'students' && user?.role === UserRole.FACILITATOR && (
            <Card className="p-6">
                <h3 className="text-2xl font-bold font-heading mb-4">Enrolled Students ({cohort.students.length})</h3>
                <ul className="divide-y divide-neutral-light-gray dark:divide-neutral-gray-medium">
                    {cohort.students.map((student, index) => (
                        <li key={student.id} className="py-3 flex items-center opacity-0 animate-fade-in-up" style={{ animationDelay: `${index * 50}ms`}}>
                            <img src={student.avatarUrl} alt={student.name} className="w-10 h-10 rounded-full mr-4" />
                            <span className="font-medium">{student.name}</span>
                        </li>
                    ))}
                </ul>
            </Card>
        )}

        {activeTab === 'progress' && user?.role === UserRole.STUDENT && (
            <Card className="p-8">
                <h3 className="text-2xl font-bold font-heading mb-6">Your Progress Tracker</h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                           <span className="font-medium">Assignments Submitted</span>
                           <span className="font-bold text-primary">{submittedCount} / {assignments.length}</span>
                        </div>
                        <ProgressBar value={submittedCount} max={assignments.length} />
                    </div>
                     <p className="text-sm text-neutral-gray-light pt-2">Keep up the great work! Complete the remaining assignments to finish the cohort.</p>
                </div>
            </Card>
        )}
      </div>
    </div>
  );
};

export default CohortDetailPage;