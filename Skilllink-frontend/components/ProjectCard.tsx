import React, { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { UserRole, AssignmentStatus } from '../types';

interface Project {
  _id: string;
  title: string;
  description: string;
  student: { _id: string; name: string; avatar?: string };
  projectUrl: string;
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  technologies: string[];
  likes: number;
  likedBy: string[];
  comments: Array<{ userId: { _id: string; name: string; avatar?: string }; comment: string; createdAt: string }>;
  featured: boolean;
  createdAt: string;
}

interface ProjectCardProps {
  project: Project;
  onLike: (projectId: string) => void;
  user: any;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onLike, user }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);

  const isLiked = project.likedBy.includes(user?.id || '');

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      setAddingComment(true);
      const token = localStorage.getItem('skilllink_token');
      if (!token) return;
      
      await fetch(`http://localhost:5000/api/showcase/${project._id}/comment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ comment: newComment })
      });
      
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment', error);
    } finally {
      setAddingComment(false);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {project.featured && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 text-sm font-semibold">
          ⭐ Featured Project
        </div>
      )}
      
      {project.imageUrl && (
        <img
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-48 object-cover"
        />
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">{project.title}</h3>
            <p className="text-neutral-gray-light text-sm mb-3">{project.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <img
            src={project.student.avatar || `https://ui-avatars.com/api/?name=${project.student.name}&background=random`}
            alt={project.student.name}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm font-medium">{project.student.name}</span>
        </div>

        {project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech, index) => (
              <Badge key={index} status={AssignmentStatus.SUBMITTED}>
                {tech}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex gap-2 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(project.projectUrl, '_blank')}
          >
            View Project
          </Button>
          {project.githubUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(project.githubUrl, '_blank')}
            >
              GitHub
            </Button>
          )}
          {project.liveUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(project.liveUrl, '_blank')}
            >
              Live Demo
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-neutral-light-gray dark:border-neutral-gray-medium">
          <button
            onClick={() => onLike(project._id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              isLiked
                ? 'bg-red-100 text-red-600 dark:bg-red-900/20'
                : 'hover:bg-neutral-light-gray dark:hover:bg-neutral-gray-medium'
            }`}
          >
            <span className={isLiked ? '❤️' : '🤍'}></span>
            <span className="text-sm font-medium">{project.likes}</span>
          </button>
          
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-light-gray dark:hover:bg-neutral-gray-medium transition-colors"
          >
            <span>💬</span>
            <span className="text-sm font-medium">{project.comments.length}</span>
          </button>
        </div>

        {showComments && (
          <div className="mt-4 pt-4 border-t border-neutral-light-gray dark:border-neutral-gray-medium">
            <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
              {project.comments.map((comment, index) => (
                <div key={index} className="flex gap-3">
                  <img
                    src={comment.userId.avatar || `https://ui-avatars.com/api/?name=${comment.userId.name}&background=random`}
                    alt={comment.userId.name}
                    className="w-6 h-6 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{comment.userId.name}</div>
                    <div className="text-sm text-neutral-gray-light">{comment.comment}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 border border-neutral-light-gray dark:border-neutral-gray-medium rounded-lg text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <Button
                size="sm"
                onClick={handleAddComment}
                disabled={!newComment.trim() || addingComment}
              >
                Post
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProjectCard;
