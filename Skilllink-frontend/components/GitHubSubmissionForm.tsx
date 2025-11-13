import React, { useState } from 'react';
import { realApi } from '../services/realApi';
import { useToast } from '../hooks/useToast';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Spinner from './ui/Spinner';

interface GitHubSubmissionFormProps {
  assignmentId: string;
  onSubmissionSuccess: () => void;
}

const GitHubSubmissionForm: React.FC<GitHubSubmissionFormProps> = ({ 
  assignmentId, 
  onSubmissionSuccess 
}) => {
  const { showToast } = useToast();
  const [projectLink, setProjectLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!projectLink.trim()) {
      showToast('Please provide a GitHub project link.', 'info');
      return;
    }

    // Validate GitHub URL format
    if (!projectLink.includes('github.com')) {
      showToast('Please provide a valid GitHub repository URL.', 'info');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('skilllink_token');
      if (!token) {
        showToast('Authentication required.', 'error');
        return;
      }

      // Prepare submission data
      const submissionData = {
        projectLink
      };

      const newSubmission = await realApi.submitAssignment(assignmentId, submissionData, token);
      onSubmissionSuccess();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000); // Hide success message after 3 seconds
      showToast('Assignment submitted successfully!', 'success');
      setProjectLink('');
    } catch (error) {
      console.error('Submission error:', error);
      showToast('Failed to submit assignment.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold font-heading mb-4">Submit Your Work</h2>
      
      {showSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Success! </strong>
          <span className="block sm:inline">Your assignment has been submitted successfully.</span>
        </div>
      )}
      
      <div className="space-y-4">
        <Input 
          label="GitHub Repository URL" 
          placeholder="https://github.com/username/repository" 
          value={projectLink} 
          onChange={e => setProjectLink(e.target.value)} 
        />
      </div>
      
      <Button 
        onClick={handleSubmit} 
        className="mt-6 w-full" 
        size="lg" 
        disabled={isSubmitting}
      >
        {isSubmitting ? <Spinner size="sm" color="white" /> : 'Submit Assignment'}
      </Button>
      
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Note: When you submit a GitHub repository URL, we'll automatically fetch information about your repository including the latest commit and README file.
      </p>
    </Card>
  );
};

export default GitHubSubmissionForm;