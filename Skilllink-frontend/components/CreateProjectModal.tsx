import React, { useState, useCallback } from 'react';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Button from './ui/Button';
import Spinner from './ui/Spinner';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  cohortId: string;
  onSuccess: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  cohortId,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectUrl: '',
    githubUrl: '',
    liveUrl: '',
    imageUrl: '',
    technologies: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.projectUrl) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('skilllink_token');
      if (!token) throw new Error('No token');

      const payload = {
        ...formData,
        cohort: cohortId,
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(t => t)
      };

      const response = await fetch('http://localhost:5000/api/showcase', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        onSuccess();
        onClose();
        setFormData({
          title: '',
          description: '',
          projectUrl: '',
          githubUrl: '',
          liveUrl: '',
          imageUrl: '',
          technologies: ''
        });
      }
    } catch (error) {
      console.error('Failed to create project', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, title: e.target.value }));
  }, []);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, description: e.target.value }));
  }, []);

  const handleProjectUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, projectUrl: e.target.value }));
  }, []);

  const handleGithubUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, githubUrl: e.target.value }));
  }, []);

  const handleLiveUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, liveUrl: e.target.value }));
  }, []);

  const handleImageUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, imageUrl: e.target.value }));
  }, []);

  const handleTechnologiesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, technologies: e.target.value }));
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Project to Showcase">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Project Title"
          value={formData.title}
          onChange={handleTitleChange}
          required
          placeholder="My Awesome Project"
        />

        <Textarea
          label="Description"
          value={formData.description}
          onChange={handleDescriptionChange}
          required
          placeholder="Describe your project..."
          rows={3}
        />

        <Input
          label="Project URL"
          value={formData.projectUrl}
          onChange={handleProjectUrlChange}
          required
          placeholder="https://github.com/username/project"
        />

        <Input
          label="GitHub URL (Optional)"
          value={formData.githubUrl}
          onChange={handleGithubUrlChange}
          placeholder="https://github.com/username/project"
        />

        <Input
          label="Live Demo URL (Optional)"
          value={formData.liveUrl}
          onChange={handleLiveUrlChange}
          placeholder="https://myproject.com"
        />

        <Input
          label="Screenshot URL (Optional)"
          value={formData.imageUrl}
          onChange={handleImageUrlChange}
          placeholder="https://example.com/screenshot.png"
        />

        <Input
          label="Technologies (comma-separated)"
          value={formData.technologies}
          onChange={handleTechnologiesChange}
          placeholder="React, Node.js, MongoDB"
        />

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading || !formData.title || !formData.description || !formData.projectUrl}>
            {loading ? <Spinner size="sm" color="white" /> : 'Add Project'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;
