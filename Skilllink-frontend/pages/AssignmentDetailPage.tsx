import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Assignment, Submission, DiscussionMessage, UserRole, AssignmentStatus } from '../types';
import { realApi } from '../services/realApi';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import GitHubRepoInfo from '../components/GitHubRepoInfo';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';

const AssignmentDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const { showToast } = useToast();
    
    const [assignment, setAssignment] = useState<Assignment | null>(null);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [messages, setMessages] = useState<DiscussionMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [projectLink, setProjectLink] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const fetchData = async () => {
        if (!id || !user) return;
        
        try {
            setLoading(true);
            const token = localStorage.getItem('skilllink_token');
            if (!token) {
                showToast('Authentication required.', 'error');
                return;
            }
            
            // Fetch assignment details
            const assignmentData = await realApi.getAssignmentById(id, token);
            setAssignment(assignmentData);
            
            // Fetch submissions for this assignment
            const submissionsData = await realApi.getSubmissionsForAssignment(id, token);
            setSubmissions(submissionsData);
            
            // Fetch discussion messages
            const messagesData = await realApi.getDiscussionMessages(id, token);
            setMessages(messagesData);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            showToast('Failed to load assignment details.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && user) {
            fetchData();
        }
    }, [id, user, authLoading]);

    const handleSubmitAssignment = async () => {
        if (!projectLink.trim() || !id) {
            showToast('Please provide a project link.', 'info');
            return;
        }
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('skilllink_token');
            if (!token) {
                showToast('Authentication required.', 'error');
                return;
            }
            
            const newSubmission = await realApi.submitAssignment(id, { projectLink }, token);
            setSubmissions(prev => [...prev, newSubmission]);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000); // Hide success message after 3 seconds
            showToast('Assignment submitted successfully!', 'success');
            setProjectLink('');
            // Update assignment status
            if (assignment) {
                setAssignment({ ...assignment, status: AssignmentStatus.SUBMITTED });
            }
        } catch (error) {
            showToast('Failed to submit assignment.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const StudentView = () => (
        <div className="space-y-6">
            {showSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Success! </strong>
                    <span className="block sm:inline">Your assignment has been submitted successfully.</span>
                </div>
            )}
            
            <Card className="p-6 opacity-0 animate-fade-in-up" style={{animationDelay: '300ms'}}>
                <h2 className="text-2xl font-bold font-heading mb-4">Submit Your Work</h2>
                <div className="space-y-4">
                    <Input 
                        label="Project URL" 
                        placeholder="https://github.com/your-repo" 
                        value={projectLink} 
                        onChange={e => setProjectLink(e.target.value)} 
                    />
                </div>
                <Button onClick={handleSubmitAssignment} className="mt-6 w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? <Spinner size="sm" color="white" /> : 'Submit Assignment'}
                </Button>
            </Card>
            
            {/* GitHub Repository Information */}
            {submissions.filter(s => s.student.id === user?.id).map(submission => (
                <GitHubRepoInfo key={submission.id} submission={submission} />
            ))}
            
            {/* Progress tracker */}
            <Card className="p-6 opacity-0 animate-fade-in-up" style={{animationDelay: '400ms'}}>
                <h2 className="text-2xl font-bold font-heading mb-4">Your Progress</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="font-medium">Assignment Status</span>
                        <Badge status={assignment?.status || AssignmentStatus.PENDING} />
                    </div>
                    
                    {assignment?.status === AssignmentStatus.GRADED && (
                        <div className="mt-4">
                            <div className="flex justify-between mb-1">
                                <span className="font-medium">Grade</span>
                                <span className="font-bold text-primary">
                                    {submissions.find(s => s.student.id === user?.id)?.grade || 'N/A'}/100
                                </span>
                            </div>
                            <div className="w-full bg-neutral-light-gray dark:bg-neutral-gray-medium rounded-full h-2">
                                <div 
                                    className="bg-primary h-2 rounded-full" 
                                    style={{ 
                                        width: `${submissions.find(s => s.student.id === user?.id)?.grade || 0}%` 
                                    }}
                                ></div>
                            </div>
                        </div>
                    )}
                    
                    {assignment?.status === AssignmentStatus.SUBMITTED && (
                        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-blue-800 dark:text-blue-200">Your assignment has been submitted and is awaiting grading.</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );

    const FacilitatorView = () => (
        <div className="space-y-6">
            <Card className="p-6">
                <h2 className="text-2xl font-bold font-heading mb-4">Student Submissions</h2>
                {submissions.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-400">No submissions yet.</p>
                ) : (
                    <div className="space-y-4">
                        {submissions.map((submission) => (
                            <Card key={submission.id} className="p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold">{submission.student.name}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Submitted on {new Date(submission.submittedAt).toLocaleString()}
                                        </p>
                                        {submission.projectLink && (
                                            <p className="mt-2">
                                                <a 
                                                    href={submission.projectLink} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline"
                                                >
                                                    Project Link
                                                </a>
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        {submission.grade !== null && submission.grade !== undefined ? (
                                            <div>
                                                <span className="font-bold text-primary">{submission.grade}/100</span>
                                                {submission.feedback && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                        {submission.feedback}
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <Badge status={AssignmentStatus.SUBMITTED} />
                                        )}
                                    </div>
                                </div>
                                
                                {/* GitHub Repository Information */}
                                <GitHubRepoInfo submission={submission} />
                            </Card>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );

    if (loading || authLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!assignment) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Assignment not found</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">The assignment you're looking for doesn't exist or you don't have access to it.</p>
                <Button onClick={() => navigate('/app/assignments')} className="mt-6">
                    Back to Assignments
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="mb-8">
                <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
                    ← Back
                </Button>
                <h1 className="text-3xl font-bold font-heading">{assignment.title}</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">{assignment.description}</p>
                <div className="mt-4 flex items-center space-x-4">
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </span>
                    <Badge status={assignment.status} />
                </div>
            </div>

            {user?.role === UserRole.STUDENT && <StudentView />}
            {user?.role === UserRole.FACILITATOR && <FacilitatorView />}
        </div>
    );
};

export default AssignmentDetailPage;