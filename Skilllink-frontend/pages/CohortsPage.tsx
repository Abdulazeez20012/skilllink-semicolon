import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { realApi } from '../services/realApi';
import { Cohort, UserRole, CurriculumItem } from '../types';
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
import Select from '../components/ui/Select';
import { useToast } from '../hooks/useToast';

const JoinCohortForm: React.FC<{ onJoin: (inviteCode: string) => void; onCancel: () => void; }> = ({ onJoin, onCancel }) => {
    const [inviteCode, setInviteCode] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onJoin(inviteCode);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
                label="Invite Code" 
                value={inviteCode} 
                onChange={e => setInviteCode(e.target.value)} 
                placeholder="Enter your invite code" 
                required 
            />
            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Join Cohort</Button>
            </div>
        </form>
    );
};

const CohortForm: React.FC<{ cohort?: Cohort | null; onSave: (data: any) => void; onCancel: () => void; }> = ({ cohort, onSave, onCancel }) => {
    const [name, setName] = useState(cohort?.name || '');
    const [description, setDescription] = useState(cohort?.description || '');
    const [tags, setTags] = useState(cohort?.tags?.join(', ') || '');
    const [startDate, setStartDate] = useState(cohort?.startDate || '');
    const [endDate, setEndDate] = useState(cohort?.endDate || '');
    const [curriculumTrack, setCurriculumTrack] = useState(cohort?.curriculumTrack || 'Full-Stack');
    const [curriculum, setCurriculum] = useState<CurriculumItem[]>(cohort?.curriculum || []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ 
            name, 
            description, 
            programmingLanguage: tags.split(',').map(t => t.trim()).filter(Boolean)[0] || 'General',
            startDate,
            endDate,
            curriculumTrack,
            curriculum
        });
    };

    // Function to add a new curriculum item
    const addCurriculumItem = () => {
        setCurriculum([
            ...curriculum,
            {
                week: curriculum.length + 1,
                topics: [],
                assignments: []
            }
        ]);
    };

    // Function to update a curriculum item
    const updateCurriculumItem = (index: number, field: keyof CurriculumItem, value: any) => {
        const updatedCurriculum = [...curriculum];
        updatedCurriculum[index] = {
            ...updatedCurriculum[index],
            [field]: value
        };
        setCurriculum(updatedCurriculum);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Cohort Name" value={name} onChange={e => setName(e.target.value)} required />
            <Textarea label="Description" value={description} onChange={e => setDescription(e.target.value)} required />
            <Input label="Start Date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
            <Input label="End Date" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
            <Select label="Curriculum Track" value={curriculumTrack} onChange={e => setCurriculumTrack(e.target.value)} required>
                <option value="Full-Stack">Full-Stack</option>
                <option value="Data Science">Data Science</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="DevOps">DevOps</option>
                <option value="Cybersecurity">Cybersecurity</option>
            </Select>
            <Input label="Primary Tag (Programming Language)" value={tags} onChange={e => setTags(e.target.value)} placeholder="e.g. JavaScript, Python, Java" required />
            
            <div className="border-t border-neutral-light-gray dark:border-neutral-gray-medium pt-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Curriculum Roadmap</h3>
                    <Button type="button" variant="secondary" size="sm" onClick={addCurriculumItem}>Add Week</Button>
                </div>
                
                {curriculum.map((item, index) => (
                    <div key={index} className="mb-4 p-4 border border-neutral-light-gray dark:border-neutral-gray-medium rounded">
                        <h4 className="font-bold mb-2">Week {item.week}</h4>
                        <Input 
                            label="Topics (comma separated)" 
                            value={item.topics.join(', ')} 
                            onChange={e => updateCurriculumItem(index, 'topics', e.target.value.split(',').map(t => t.trim()).filter(Boolean))} 
                        />
                    </div>
                ))}
            </div>
            
            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Save Cohort</Button>
            </div>
        </form>
    );
};


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

const CohortsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast, ToastComponent } = useToast();
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
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
              await realApi.deleteCohort(id, token);
              showToast("Cohort deleted successfully.", "success");
              fetchCohorts(); // Refetch
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
              await realApi.updateCohort(editingCohort.id, data, token);
              showToast("Cohort updated successfully.", "success");
          } else {
              // Convert tags to programmingLanguage for cohort creation
              const cohortData = {
                  name: data.name,
                  description: data.description,
                  programmingLanguage: data.programmingLanguage,
                  startDate: data.startDate,
                  endDate: data.endDate,
                  curriculumTrack: data.curriculumTrack,
                  curriculum: data.curriculum
              };
              await realApi.createCohort(cohortData, token);
              showToast("Cohort created successfully.", "success");
          }
          fetchCohorts();
      } catch (e: any) {
          console.error('Error saving cohort:', e);
          showToast(`Failed to save cohort: ${e.message || 'Unknown error'}`, "error");
      } finally {
          setIsModalOpen(false);
      }
  }

  const handleJoinCohort = async (inviteCode: string) => {
      try {
          const token = localStorage.getItem('skilllink_token');
          if (!token) {
            throw new Error('No authentication token found');
          }
          
          const result = await realApi.joinCohortByInviteCode(inviteCode, token);
          showToast(result.message, "success");
          fetchCohorts();
      } catch (e: any) {
          console.error('Error joining cohort:', e);
          showToast(`Failed to join cohort: ${e.message || 'Unknown error'}`, "error");
      } finally {
          setIsJoinModalOpen(false);
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
      
      <Modal isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} title="Join Cohort">
          <JoinCohortForm onJoin={handleJoinCohort} onCancel={() => setIsJoinModalOpen(false)} />
      </Modal>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-4xl font-bold font-heading">Cohorts</h1>
          <p className="text-neutral-gray-light mt-1">
            {user?.role === UserRole.FACILITATOR ? "Manage your cohorts or create a new one." : "Your learning groups and assignments."}
          </p>
        </div>
        <div className="flex gap-2">
          {user?.role === UserRole.STUDENT && (
            <Button variant="secondary" onClick={() => setIsJoinModalOpen(true)}>Join with Code</Button>
          )}
          {user?.role === UserRole.FACILITATOR && (
            <Button onClick={handleCreate} leftIcon={<PlusIcon />}>Create Cohort</Button>
          )}
        </div>
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