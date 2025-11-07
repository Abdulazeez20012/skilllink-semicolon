import React, { useState, useEffect } from 'react';
import { Resource, ResourceType, UserRole } from '../types';
import { api } from '../services/api';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import ExternalLinkIcon from '../components/icons/ExternalLinkIcon';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import PlusIcon from '../components/icons/PlusIcon';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import { useToast } from '../hooks/useToast';

const ResourceForm: React.FC<{ onSave: (data: any) => void; onCancel: () => void; }> = ({ onSave, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [url, setUrl] = useState('');
    const [type, setType] = useState<ResourceType>(ResourceType.LINK);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ title, description, url, type });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Title" value={title} onChange={e => setTitle(e.target.value)} required />
            <Textarea label="Description" value={description} onChange={e => setDescription(e.target.value)} required />
            <Input label="URL" type="url" value={url} onChange={e => setUrl(e.target.value)} required />
            <Select label="Type" value={type} onChange={e => setType(e.target.value as ResourceType)} required>
                {Object.values(ResourceType).map(t => <option key={t} value={t}>{t}</option>)}
            </Select>
            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Save Resource</Button>
            </div>
        </form>
    );
};

const ResourceCard: React.FC<{ resource: Resource }> = ({ resource }) => {
  return (
      <Card className="p-6 h-full" onClick={() => window.open(resource.url, '_blank')}>
        <div className="flex items-start justify-between">
            <div className="pr-4">
                <h3 className="text-xl font-bold font-heading group-hover:text-primary transition-colors">{resource.title}</h3>
                <span className="text-sm font-medium text-primary">{resource.type}</span>
            </div>
            <ExternalLinkIcon className="w-6 h-6 text-neutral-gray-light group-hover:text-primary transition-colors"/>
        </div>
        <p className="text-neutral-gray-light mt-2 text-sm">{resource.description}</p>
      </Card>
  );
};

const ResourcesPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast, ToastComponent } = useToast();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
      try {
        setLoading(true);
        const data = await api.getResources();
        setResources(data);
      } catch (error) {
        console.error('Failed to fetch resources', error);
        showToast("Failed to load resources.", "error");
      } finally {
        setLoading(false);
      }
    };

  const handleSave = async (data: any) => {
      try {
          await api.createResource(data);
          showToast("Resource added.", "success");
          fetchResources();
      } catch (e) {
          showToast("Failed to add resource.", "error");
      } finally {
          setIsModalOpen(false);
      }
  }

  return (
    <div>
      <ToastComponent />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Resource">
          <ResourceForm onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <div className="flex justify-between items-center mb-8 animate-fade-in-up">
        <h1 className="text-4xl font-bold font-heading">Resources</h1>
         {user?.role === UserRole.FACILITATOR && (
            <Button onClick={() => setIsModalOpen(true)} leftIcon={<PlusIcon />}>Create Resource</Button>
        )}
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource, index) => (
             <div key={resource.id} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${100 + index * 100}ms`}}>
                <ResourceCard resource={resource} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourcesPage;