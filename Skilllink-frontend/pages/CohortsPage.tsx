import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { realApi } from '../services/realApi';
import { Cohort, UserRole } from '../types';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import PlusIcon from '../components/icons/PlusIcon';
import SearchIcon from '../components/icons/SearchIcon';
import UserIcon from '../components/icons/UserIcon';
import Dropdown, { DropdownItem } from '../components/ui/Dropdown';
import EditIcon from '../components/icons/EditIcon';
import TrashIcon from '../components/icons/TrashIcon';
import Modal from '../components/ui/Modal';
import Textarea from '../components/ui/Textarea';
import { useToast } from '../hooks/useToast';

const CohortCard: React.FC<{ cohort: Cohort; onEdit: (c: Cohort) => void; onDelete: (id: string) => void; }> = ({ cohort, onEdit, onDelete }) => {
    const { user } = useAuth();
    return (
        <Card className="overflow-hidden h-full flex flex-col group relative">
            {user?.role === UserRole.FACILITATOR && (
                <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Dropdown>
                        <DropdownItem onClick={() => onEdit(cohort)}><EditIcon className="w-4 h-4 mr-2" /> Edit</DropdownItem>
                        <DropdownItem onClick={() => onDelete(cohort.id)} className="text-red-500"><TrashIcon className="w-4 h-4 mr-2" /> Delete</DropdownItem>
                    </Dropdown>
                </div>
            )}
            <Link to={`/app/cohorts/${cohort.id}`} className="flex flex-col h-full">
                <div className="relative">
                    <img src={cohort.imageUrl} alt={cohort.name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-2xl font-bold font-heading mb-2 group-hover:text-primary transition-colors">{cohort.name}</h3>
                    <p className="text-neutral-gray-light text-sm mb-4 flex-1 line-clamp-2">{cohort.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {cohort.tags?.map(tag => <span key={tag} className="text-xs bg-primary/10 text-primary font-semibold px-2 py-1 rounded">{tag}</span>)}
                    </div>
                    <div className="border-t border-neutral-light-gray dark:border-neutral-gray-medium mt-auto pt-4 flex justify-between text-sm text-neutral-gray-light">
                        <div className="flex items-center"><UserIcon className="w-4 h-4 mr-2" /><span>{cohort.students.length} Students</span></div>
                    </div>
                </div>
            </Link>
        </Card>
    )
};

const CohortForm: React.FC<{ cohort?: Cohort | null; onSave: (data: any) => void; onCancel: () => void; }> = ({ cohort, onSave, onCancel }) => {
    const [name, setName] = useState(cohort?.name || '');
    const [description, setDescription] = useState(cohort?.description || '');
    const [tags, setTags] = useState(cohort?.tags?.join(', ') || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, description, tags: tags.split(',').map(t => t.trim()).filter(Boolean) });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Cohort Name" value={name} onChange={e => setName(e.target.value)} required />
            <Textarea label="Description" value={description} onChange={e => setDescription(e.target.value)} required />
            <Input label="Tags (comma-separated)" value={tags} onChange={e => setTags(e.target.value)} placeholder="e.g. Java, Backend" />
            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Save Cohort</Button>
            </div>
        </form>
    );
};


const CohortsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast, ToastComponent } = useToast();
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCohort, setEditingCohort] = useState<Cohort | null>(null);

  const allTags = useMemo(() => ['All', ...new Set(cohorts.flatMap(c => c.tags || []))], [cohorts]);

  useEffect(() => {
    fetchCohorts();
  }, [user]);

  const fetchCohorts = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('skilllink_token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const data = await realApi.getCohorts(token);
      setCohorts(data);
    } catch (error) {
      console.error("Failed to fetch cohorts", error);
      showToast("Could not load cohorts.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
      setEditingCohort(null);
      setIsModalOpen(true);
  }

  const handleEdit = (cohort: Cohort) => {
      setEditingCohort(cohort);
      setIsModalOpen(true);
  }
  
  const handleDelete = async (id: string) => {
      if (window.confirm("Are you sure you want to delete this cohort?")) {
          try {
              const token = localStorage.getItem('skilllink_token');
              if (!token) {
                throw new Error('No authentication token found');
              }
              // Note: There's no deleteCohort in realApi yet, so we'll just show a message
              showToast("Delete functionality not implemented yet.", "info");
              // await realApi.deleteCohort(id, token);
              // showToast("Cohort deleted successfully.", "success");
              // fetchCohorts(); // Refetch
          } catch(e) {
              showToast("Failed to delete cohort.", "error");
          }
      }
  }

  const handleSave = async (data: any) => {
      try {
          const token = localStorage.getItem('skilllink_token');
          if (!token) {
            throw new Error('No authentication token found');
          }
          
          if (editingCohort) {
              // Note: There's no updateCohort in realApi yet, so we'll just show a message
              showToast("Update functionality not implemented yet.", "info");
              // await realApi.updateCohort(editingCohort.id, data, token);
              // showToast("Cohort updated successfully.", "success");
          } else {
              // Note: There's no createCohort in realApi yet, so we'll just show a message
              showToast("Create functionality not implemented yet.", "info");
              // await realApi.createCohort(data, token);
              // showToast("Cohort created successfully.", "success");
          }
          fetchCohorts();
      } catch (e) {
          showToast(`Failed to save cohort.`, "error");
      } finally {
          setIsModalOpen(false);
      }
  }

  const filteredCohorts = useMemo(() => {
    return cohorts.filter(cohort => {
      const matchesSearch = cohort.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = activeTag === 'All' || (cohort.tags && cohort.tags.includes(activeTag));
      return matchesSearch && matchesTag;
    });
  }, [cohorts, searchTerm, activeTag]);

  return (
    <div>
      <ToastComponent />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCohort ? "Edit Cohort" : "Create Cohort"}>
          <CohortForm cohort={editingCohort} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-4xl font-bold font-heading">Cohorts</h1>
          <p className="text-neutral-gray-light mt-1">
            {user?.role === UserRole.FACILITATOR ? "Manage your cohorts or create a new one." : "Your learning groups and assignments."}
          </p>
        </div>
        {user?.role === UserRole.FACILITATOR && (<Button onClick={handleCreate} leftIcon={<PlusIcon />}>Create Cohort</Button>)}
      </div>
      
      <div className="mb-8 flex flex-col md:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <Input icon={<SearchIcon className="w-5 h-5"/>} placeholder="Search cohorts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} wrapperClassName="flex-grow" />
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {allTags.map(tag => (
                  <button key={tag} onClick={() => setActiveTag(tag)} className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-colors ${activeTag === tag ? 'bg-primary text-white' : 'bg-secondary dark:bg-neutral-gray-medium hover:bg-neutral-light-gray dark:hover:bg-neutral-gray-dark'}`}>
                      {tag}
                  </button>
              ))}
          </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCohorts.map((cohort, index) => (
             <div key={cohort.id} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${200 + index * 100}ms`}}>
                <CohortCard cohort={cohort} onEdit={handleEdit} onDelete={handleDelete} />
             </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CohortsPage;