import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Assignment, Submission, DiscussionMessage, UserRole } from '../types';
import { realApi } from '../services/realApi';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useToast } from '../hooks/useToast';
import FileIcon from '../components/icons/FileIcon';
import SendIcon from '../components/icons/SendIcon';
import ExternalLinkIcon from '../components/icons/ExternalLinkIcon';
import Modal from '../components/ui/Modal';
import Textarea from '../components/ui/Textarea';
import TrashIcon from '../components/icons/TrashIcon';


const GradeForm: React.FC<{ submission: Submission; onSave: (grade: number, feedback: string) => void; onCancel: () => void; }> = ({ submission, onSave, onCancel }) => {
    const [grade, setGrade] = useState<string>(submission.grade?.toString() || '');
    const [feedback, setFeedback] = useState(submission.feedback || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(parseInt(grade), feedback);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Grade (0-100)" type="number" min="0" max="100" value={grade} onChange={e => setGrade(e.target.value)} required />
            <Textarea label="Feedback" value={feedback} onChange={e => setFeedback(e.target.value)} required />
            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Submit Grade</Button>
            </div>
        </form>
    );
};

const AssignmentDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const { showToast, ToastComponent } = useToast();

    const [assignment, setAssignment] = useState<Assignment | null>(null);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [messages, setMessages] = useState<DiscussionMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [projectLink, setProjectLink] = useState('');

    const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
    const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);

    const fetchData = useCallback(async () => {
        if (!id || !user) return;
        try {
            setLoading(true);
            const token = localStorage.getItem('skilllink_token');
            if (!token) {
                showToast('Authentication required.', 'error');
                return;
            }
            
            const assignmentData = await realApi.getAssignmentById(id, token);
            setAssignment(assignmentData);
            
            if (user?.role === UserRole.FACILITATOR) {
                const submissionsData = await realApi.getSubmissionsForAssignment(id, token);
                setSubmissions(submissionsData);
            }
            
            const messagesData = await realApi.getDiscussionMessages(id, token);
            setMessages(messagesData);
        } catch (error) {
            console.error("Failed to fetch assignment details", error);
            showToast('Error loading assignment details.', 'error');
        } finally {
            setLoading(false);
        }
    }, [id, user?.role, showToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleMessageSend = async () => {
        if (!newMessage.trim() || !user || !id) return;
        try {
            const token = localStorage.getItem('skilllink_token');
            if (!token) {
                showToast('Authentication required.', 'error');
                return;
            }
            
            const sentMessage = { 
                user: { id: user.id, name: user.name, avatarUrl: user.avatarUrl }, 
                content: newMessage 
            };
            
            await realApi.postDiscussionMessage(id, sentMessage, token);
            setNewMessage('');
            
            // Refresh messages
            const messagesData = await realApi.getDiscussionMessages(id, token);
            setMessages(messagesData);
        } catch (error) {
            showToast('Failed to send message.', 'error');
        }
    };
    
    const handleMessageDelete = async (messageId: string) => {
        if (window.confirm("Are you sure you want to delete this comment?")) {
            try {
                const token = localStorage.getItem('skilllink_token');
                if (!token) {
                    showToast('Authentication required.', 'error');
                    return;
                }
                
                await realApi.deleteDiscussionMessage(id!, messageId, token);
                setMessages(prev => prev.filter(m => m.id !== messageId));
                showToast('Comment deleted.', 'success');
            } catch(e) {
                showToast('Failed to delete comment.', 'error');
            }
        }
    }
    
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
            
            await realApi.submitAssignment(id, { projectLink }, token);
            showToast('Assignment submitted successfully!', 'success');
            fetchData();
        } catch (error) {
            showToast('Failed to submit assignment.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleGrade = (submission: Submission) => {
        setGradingSubmission(submission);
        setIsGradeModalOpen(true);
    }
    
    const handleSaveGrade = async (grade: number, feedback: string) => {
        if (!gradingSubmission || !id) return;
        try {
            const token = localStorage.getItem('skilllink_token');
            if (!token) {
                showToast('Authentication required.', 'error');
                return;
            }
            
            await realApi.gradeSubmission(gradingSubmission.id, grade, feedback, token);
            showToast("Grade submitted successfully.", "success");
            fetchData();
        } catch(e) {
            showToast("Failed to submit grade.", "error");
        } finally {
            setIsGradeModalOpen(false);
            setGradingSubmission(null);
        }
    }

    if (loading) return <div className="flex justify-center items-center h-full"><Spinner size="lg" /></div>;
    if (!assignment) return <div className="text-center">Assignment not found.</div>;

    const StudentView = () => (
        <Card className="p-6 opacity-0 animate-fade-in-up" style={{animationDelay: '300ms'}}>
            <h2 className="text-2xl font-bold font-heading mb-4">Submit Your Work</h2>
            <div className="space-y-4">
                <Input label="Project URL" placeholder="https://github.com/your-repo" value={projectLink} onChange={e => setProjectLink(e.target.value)} />
            </div>
            <Button onClick={handleSubmitAssignment} className="mt-6 w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? <Spinner size="sm" color="white" /> : 'Submit Assignment'}
            </Button>
        </Card>
    );

    const FacilitatorView = () => (
        <Card className="p-6 opacity-0 animate-fade-in-up" style={{animationDelay: '100ms'}}>
            <h2 className="text-2xl font-bold font-heading mb-4">Submissions</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead><tr className="border-b dark:border-neutral-gray-medium"><th className="p-2">Student</th><th className="p-2">Submitted</th><th className="p-2">Status</th><th className="p-2">Actions</th></tr></thead>
                    <tbody>
                        {submissions.map(sub => (
                            <tr key={sub.id} className="border-b dark:border-neutral-gray-medium hover:bg-neutral-light-gray/50 dark:hover:bg-neutral-gray-medium/50">
                                <td className="p-2 flex items-center"><img src={sub.student.avatarUrl} className="w-8 h-8 rounded-full mr-3"/>{sub.student.name}</td>
                                <td className="p-2">{new Date(sub.submittedAt).toLocaleString()}</td>
                                <td className="p-2"><Badge status={sub.status} /></td>
                                <td className="p-2"><Button size="sm" variant="secondary" onClick={() => handleGrade(sub)}>Grade</Button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );

    return (
        <div>
            <ToastComponent />
            <Modal isOpen={isGradeModalOpen} onClose={() => setIsGradeModalOpen(false)} title={`Grade Submission: ${gradingSubmission?.student.name}`}>
                {gradingSubmission && <GradeForm submission={gradingSubmission} onSave={handleSaveGrade} onCancel={() => setIsGradeModalOpen(false)} />}
            </Modal>

            <div className="mb-8 animate-fade-in-up"><div className="flex justify-between items-start"><h1 className="text-4xl font-bold font-heading">{assignment.title}</h1><Badge status={assignment.status} /></div><p className="text-neutral-gray-light mt-2">Due: {new Date(assignment.dueDate).toLocaleString()}</p></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card className="p-6 opacity-0 animate-fade-in-up" style={{animationDelay: '100ms'}}><h2 className="text-2xl font-bold font-heading mb-4">Description</h2><p className="whitespace-pre-wrap">{assignment.description}</p></Card>
                    {assignment.resources.length > 0 && (<Card className="p-6 opacity-0 animate-fade-in-up" style={{animationDelay: '200ms'}}><h2 className="text-2xl font-bold font-heading mb-4">Resources</h2><ul className="space-y-3">{assignment.resources.map(res => (<li key={res.id} className="flex items-center"><ExternalLinkIcon className="w-5 h-5 mr-3 text-primary"/><a href={res.url} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">{res.title} ({res.type})</a></li>))}</ul></Card>)}
                    {user?.role === UserRole.FACILITATOR && <FacilitatorView />}
                </div>

                <div className="space-y-8">
                    {user?.role === UserRole.STUDENT && <StudentView />}
                    
                    <Card className="p-6 flex flex-col h-[32rem] opacity-0 animate-fade-in-up" style={{animationDelay: user?.role === UserRole.STUDENT ? '400ms' : '100ms'}}>
                        <h2 className="text-2xl font-bold font-heading mb-4">Discussion</h2>
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                           {messages.map(msg => (
                               <div key={msg.id} className={`flex items-start gap-3 group ${msg.user.id === user?.id ? 'flex-row-reverse' : ''}`}>
                                   <img src={msg.user.avatarUrl} className="w-8 h-8 rounded-full" alt={msg.user.name} />
                                   <div className={`p-3 rounded-lg max-w-xs relative ${msg.user.id === user?.id ? 'bg-primary text-white' : 'bg-neutral-light-gray dark:bg-neutral-gray-medium'}`}>
                                       <p className="text-sm">{msg.content}</p>
                                       <p className={`text-xs mt-1 opacity-70 ${msg.user.id === user?.id ? 'text-right' : 'text-left'}`}>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                   </div>
                                   {msg.user.id === user?.id && (
                                       <button onClick={() => handleMessageDelete(msg.id)} className="p-1 rounded-full text-neutral-gray-light hover:bg-red-500/20 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                           <TrashIcon className="w-4 h-4" />
                                       </button>
                                   )}
                               </div>
                           ))}
                        </div>
                         <div className="mt-4 flex gap-2 border-t border-neutral-light-gray dark:border-neutral-gray-medium pt-4">
                            <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-1" onKeyDown={(e) => e.key === 'Enter' && handleMessageSend()}/>
                            <Button onClick={handleMessageSend} className="aspect-square !p-2"><SendIcon /></Button>
                         </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AssignmentDetailPage;