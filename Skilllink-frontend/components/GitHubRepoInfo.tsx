import React from 'react';
import Card from './ui/Card';
import { Submission } from '../types';

interface GitHubRepoInfoProps {
  submission: Submission;
}

const GitHubRepoInfo: React.FC<GitHubRepoInfoProps> = ({ submission }) => {
  // Check if GitHub data is available
  if (!submission.githubRepoUrl) {
    return null;
  }

  return (
    <Card className="p-6 mt-6">
      <h3 className="text-xl font-bold font-heading mb-4">GitHub Repository Information</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Repository</h4>
          <p className="mt-1">
            <a 
              href={submission.githubRepoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {submission.githubRepoUrl}
            </a>
          </p>
        </div>
        
        {submission.githubCommitMessage && (
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300">Latest Commit</h4>
            <p className="mt-1 text-gray-600 dark:text-gray-400">{submission.githubCommitMessage}</p>
            {submission.githubLastCommitDate && (
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Committed on {new Date(submission.githubLastCommitDate).toLocaleString()}
              </p>
            )}
          </div>
        )}
        
        {submission.githubReadme && (
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300">README Preview</h4>
            <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg max-h-40 overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap">{submission.githubReadme.substring(0, 500)}...</pre>
              {submission.githubReadme.length > 500 && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  Showing first 500 characters. View full README on GitHub.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default GitHubRepoInfo;