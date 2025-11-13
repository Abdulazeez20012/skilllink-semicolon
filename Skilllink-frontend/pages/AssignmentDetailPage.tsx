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
import SendIcon from '../components/icons/SendIcon';

// Create simple icon components since they don't exist
const ChevronUpIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m6 15 6-6 6 6" />
  </svg>
);

const CheckIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const StarIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

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

    const handlePostMessage = async () => {
        if (!newMessage.trim() || !id) return;
        
        try {
            const token = localStorage.getItem('skilllink_token');
            if (!token) {
                showToast('Authentication required.', 'error');
                return;
            }
            
            // Create a minimal user object for the message
            const currentUser = {
                id: user?.id || '',
                name: user?.name || 'Anonymous',
                avatarUrl: user?.avatarUrl || ''
            };
            
            const message = await realApi.postDiscussionMessage(id, { 
                content: newMessage, 
                user: currentUser,
                timestamp: new Date().toISOString()
            }, token);
            setMessages(prev => [...prev, message]);
            setNewMessage('');
        } catch (error) {
            showToast('Failed to post message.', 'error');
        }
    };

    const handleUpvoteMessage = async (messageId: string) => {
        if (!id) return;
        
        try {
            const token = localStorage.getItem('skilllink_token');
            if (!token) {
                showToast('Authentication required.', 'error');
                return;
            }
            
            const result = await realApi.upvoteDiscussionMessage(id, messageId, token);
            setMessages(prev => prev.map(msg => 
                msg.id === messageId ? { ...msg, upvotes: result.upvotes } : msg
            ));
        } catch (error) {
            showToast('Failed to upvote message.', 'error');
        }
    };

    const handleAcceptAnswer = async (messageId: string) => {
        if (!id) return;
        
        try {
            const token = localStorage.getItem('skilllink_token');
            if (!token) {
                showToast('Authentication required.', 'error');
                return;
            }
            
            await realApi.acceptDiscussionAnswer(id, messageId, token);
            setMessages(prev => prev.map(msg => 
                msg.id === messageId ? { ...msg, isAcceptedAnswer: true } : msg
            ));
            showToast('Answer accepted!', 'success');
        } catch (error) {
            showToast('Failed to accept answer.', 'error');
        }
    };

    const handleEndorseMessage = async (messageId: string) => {
        if (!id) return;
        
        try {
            const token = localStorage.getItem('skilllink_token');
            if (!token) {
                showToast('Authentication required.', 'error');
                return;
            }
            
            await realApi.endorseDiscussionMessage(id, messageId, token);
            setMessages(prev => prev.map(msg => 
                msg.id === messageId ? { ...msg, isEndorsed: true } : msg
            ));
            showToast('Message endorsed!', 'success');
        } catch (error) {
            showToast('Failed to endorse message.', 'error');
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
            
            {/* Q&A Forum */}
            <Card className="p-6">
                <h2 className="text-2xl font-bold font-heading mb-4">Q&A Forum</h2>
                
                {/* Post new question */}
                <div className="mb-6">
                    <h3 className="font-medium mb-2">Ask a question</h3>
                    <div className="flex gap-2">
                        <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your question here..."
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handlePostMessage();
                                }
                            }}
                        />
                        <Button onClick={handlePostMessage} disabled={!newMessage.trim()}>
                            <SendIcon />
                        </Button>
                    </div>
                </div>
                
                {/* Discussion messages */}
                <div className="space-y-4">
                    {messages.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No questions yet. Be the first to ask!</p>
                    ) : (
                        [...messages]
                            .sort((a, b) => {
                                // Sort accepted answers first, then by upvotes, then by timestamp
                                if (a.isAcceptedAnswer && !b.isAcceptedAnswer) return -1;
                                if (!a.isAcceptedAnswer && b.isAcceptedAnswer) return 1;
                                if (a.upvotes !== b.upvotes) return (b.upvotes || 0) - (a.upvotes || 0);
                                return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
                            })
                            .map((message) => (
                                <Card key={message.id} className="p-4">
                                    <div className="flex items-start gap-3">
                                        <img 
                                            src={message.user.avatarUrl} 
                                            alt={message.user.name} 
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium">{message.user.name}</span>
                                                {message.isAcceptedAnswer && (
                                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                                        <CheckIcon size={12} />
                                                        Accepted
                                                    </span>
                                                )}
                                                {message.isEndorsed && (
                                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                                        <StarIcon size={12} />
                                                        Endorsed
                                                    </span>
                                                )}
                                                <span className="text-xs text-gray-500">
                                                    {new Date(message.timestamp).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 dark:text-gray-300">{message.content}</p>
                                            
                                            <div className="flex items-center gap-4 mt-3">
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm"
                                                    onClick={() => handleUpvoteMessage(message.id)}
                                                    className="flex items-center gap-1"
                                                >
                                                    <ChevronUpIcon size={16} />
                                                    {message.upvotes || 0}
                                                </Button>
                                                
                                                {user?.id === messages[0]?.user.id && !message.isAcceptedAnswer && (
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm"
                                                        onClick={() => handleAcceptAnswer(message.id)}
                                                        className="text-green-600 hover:text-green-700"
                                                    >
                                                        Accept Answer
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))
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
            
            {/* Q&A Forum */}
            <Card className="p-6">
                <h2 className="text-2xl font-bold font-heading mb-4">Q&A Forum</h2>
                
                {/* Post new question */}
                <div className="mb-6">
                    <h3 className="font-medium mb-2">Ask a question</h3>
                    <div className="flex gap-2">
                        <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your question here..."
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handlePostMessage();
                                }
                            }}
                        />
                        <Button onClick={handlePostMessage} disabled={!newMessage.trim()}>
                            <SendIcon />
                        </Button>
                    </div>
                </div>
                
                {/* Discussion messages */}
                <div className="space-y-4">
                    {messages.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No questions yet. Be the first to ask!</p>
                    ) : (
                        [...messages]
                            .sort((a, b) => {
                                // Sort accepted answers first, then by upvotes, then by timestamp
                                if (a.isAcceptedAnswer && !b.isAcceptedAnswer) return -1;
                                if (!a.isAcceptedAnswer && b.isAcceptedAnswer) return 1;
                                if (a.upvotes !== b.upvotes) return (b.upvotes || 0) - (a.upvotes || 0);
                                return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
                            })
                            .map((message) => (
                                <Card key={message.id} className="p-4">
                                    <div className="flex items-start gap-3">
                                        <img 
                                            src={message.user.avatarUrl} 
                                            alt={message.user.name} 
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium">{message.user.name}</span>
                                                {message.isAcceptedAnswer && (
                                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                                        <CheckIcon size={12} />
                                                        Accepted
                                                    </span>
                                                )}
                                                {message.isEndorsed && (
                                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                                        <StarIcon size={12} />
                                                        Endorsed
                                                    </span>
                                                )}
                                                <span className="text-xs text-gray-500">
                                                    {new Date(message.timestamp).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 dark:text-gray-300">{message.content}</p>
                                            
                                            <div className="flex items-center gap-4 mt-3">
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm"
                                                    onClick={() => handleUpvoteMessage(message.id)}
                                                    className="flex items-center gap-1"
                                                >
                                                    <ChevronUpIcon size={16} />
                                                    {message.upvotes || 0}
                                                </Button>
                                                
                                                {user?.id === messages[0]?.user.id && !message.isAcceptedAnswer && (
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm"
                                                        onClick={() => handleAcceptAnswer(message.id)}
                                                        className="text-green-600 hover:text-green-700"
                                                    >
                                                        Accept Answer
                                                    </Button>
                                                )}
                                                
                                                {!message.isEndorsed && (
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm"
                                                        onClick={() => handleEndorseMessage(message.id)}
                                                        className="text-blue-600 hover:text-blue-700"
                                                    >
                                                        Endorse
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))
                    )}
                </div>
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