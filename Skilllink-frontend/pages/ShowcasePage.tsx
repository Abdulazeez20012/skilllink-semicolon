import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import { UserRole } from '../types';
import PlusIcon from '../components/icons/PlusIcon';
import ProjectCard from '../components/ProjectCard';
import CreateProjectModal from '../components/CreateProjectModal';

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

const ShowcasePage: React.FC = () => {
  const { cohortId: paramCohortId } = useParams<{ cohortId: string }>();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
  const [showFeatured, setShowFeatured] = useState(false);
  
  // Use cohortId from params or user's first cohort
  const cohortId = paramCohortId || user?.cohorts?.[0];

  useEffect(() => {
    fetchProjects();
  }, [cohortId, sortBy, showFeatured]);

  const fetchProjects = async () => {
    if (!cohortId) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('skilllink_token');
      if (!token) throw new Error('No token');
      
      const url = `http://localhost:5000/api/showcase/cohort/${cohortId}?sortBy=${sortBy}${showFeatured ? '&featured=true' : ''}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (projectId: string) => {
    try {
      const token = localStorage.getItem('skilllink_token');
      if (!token) return;
      
      await fetch(`http://localhost:5000/api/showcase/${projectId}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchProjects();
    } catch (error) {
      console.error('Failed to like project', error);
    }
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold font-heading">Project Showcase</h1>
          <p className="text-neutral-gray-light mt-1">Amazing projects from your cohort</p>
        </div>
        {user?.role === UserRole.STUDENT && (
          <Button onClick={() => setIsModalOpen(true)}>
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Project
          </Button>
        )}
      </div>

      <div className="flex gap-4 mb-6">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'recent' | 'popular')}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="recent">Most Recent</option>
          <option value="popular">Most Popular</option>
        </select>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showFeatured}
            onChange={(e) => setShowFeatured(e.target.checked)}
          />
          Featured Only
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} onLike={handleLike} user={user} />
        ))}
      </div>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cohortId={cohortId!}
        onSuccess={fetchProjects}
      />
    </div>
  );
};

export default ShowcasePage;
