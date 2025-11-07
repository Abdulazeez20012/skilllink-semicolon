import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Assignment, Cohort, UserRole } from '../types';
import { realApi } from '../services/realApi';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import PlusIcon from '../components/icons/PlusIcon';
import Dropdown, { DropdownItem } from '../components/ui/Dropdown';
import EditIcon from '../components/icons/EditIcon';
import TrashIcon from '../components/icons/TrashIcon';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import { useToast } from '../hooks/useToast';


const AssignmentForm: React.FC<{
  assignment?: Assignment | null;
  cohorts: Cohort[];
  onSave: (data: any) => void;
  onCancel: () => void;
}> = ({ assignment, cohorts, onSave, onCancel }) => {
    const [title, setTitle] = useState(assignment?.title || '');
    const [description, setDescription] = useState(assignment?.description || '');
    const [dueDate, setDueDate] = useState(assignment ? new Date(assignment.dueDate).toISOString().substring(0, 10) : '');
    const [cohortId, setCohortId] = useState(assignment?.cohortId || (cohorts[0]?.id ?? ''));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ title, description, dueDate, cohortId });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Assignment Title" value={title} onChange={e => setTitle(e.target.value)} required />
            <Textarea label="Description" value={description} onChange={e => setDescription(e.target.value)} required />
            <Input label="Due Date" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required />
            <Select label="Cohort" value={cohortId} onChange={e => setCohortId(e.target.value)} required>
                {cohorts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Save Assignment</Button>
            </div>
        </form>
    );
};


const AssignmentCard: React.FC<{ assignment: Assignment; cohortName?: string; onEdit: (a: Assignment) => void; onDelete: (id: string) => void; }> = ({ assignment, cohortName, onEdit, onDelete }) => {
    const { user } = useAuth();
    return (
        <Card className="p-6 h-full flex flex-col relative">
            {user?.role === UserRole.FACILITATOR && (
                <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Dropdown>
                        <DropdownItem onClick={() => onEdit(assignment)}><EditIcon className="w-4 h-4 mr-2" /> Edit</DropdownItem>
                        <DropdownItem onClick={() => onDelete(assignment.id)} className="text-red-500"><TrashIcon className="w-4 h-4 mr-2" /> Delete</DropdownItem>
                    </Dropdown>
                </div>
            )}
            <Link to={`/app/assignments/${assignment.id}`} className="flex flex-col h-full">
                <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold font-heading mb-2 pr-4 group-hover:text-primary transition-colors">{assignment.title}</h3>
                        <Badge status={assignment.status} />
                    </div>
                    {cohortName && <p className="text-xs font-semibold text-primary mb-2">{cohortName}</p>}
                    <p className="text-neutral-gray-light text-sm mb-4 line-clamp-2">{assignment.description}</p>
                </div>
                <div>
                    <div className="border-t border-neutral-light-gray dark:border-neutral-gray-medium my-4"></div>
                    <div className="flex justify-between items-center text-sm text-neutral-gray-light">
                        <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                        <div className="flex items-center">
                            <img src={assignment.facilitator.avatarUrl} alt={assignment.facilitator.name} className="w-6 h-6 rounded-full mr-2" />
                            <span>{assignment.facilitator.name}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </Card>
    )
};


const AssignmentsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast, ToastComponent } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [cohortMap, setCohortMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('skilllink_token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const [assignmentsData, cohortsData] = await Promise.all([
        realApi.getAssignments(token),
        realApi.getCohorts(token)
      ]);
      
      const newCohortMap: Record<string, string> = {};
      cohortsData.forEach(c => { newCohortMap[c.id] = c.name; });

      setAssignments(assignmentsData);
      setCohorts(cohortsData);
      setCohortMap(newCohortMap);
    } catch (error) {
      console.error('Failed to fetch data', error);
      showToast("Failed to load assignments.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
      setEditingAssignment(null);
      setIsModalOpen(true);
  }

  const handleEdit = (assignment: Assignment) => {
      setEditingAssignment(assignment);
      setIsModalOpen(true);
  }

  const handleDelete = async (id: string) => {
      if (window.confirm("Are you sure you want to delete this assignment?")) {
          try {
              const token = localStorage.getItem('skilllink_token');
              if (!token) {
                throw new Error('No authentication token found');
              }
              // Note: There's no deleteAssignment in realApi yet, so we'll just show a message
              showToast("Delete functionality not implemented yet.", "info");
              // await realApi.deleteAssignment(id, token);
              // showToast("Assignment deleted.", "success");
              // fetchData();
          } catch(e) {
              showToast("Failed to delete assignment.", "error");
          }
      }
  }

  const handleSave = async (data: any) => {
      try {
          const token = localStorage.getItem('skilllink_token');
          if (!token) {
            throw new Error('No authentication token found');
          }
          
          if (editingAssignment) {
              // Note: There's no updateAssignment in realApi yet, so we'll just show a message
              showToast("Update functionality not implemented yet.", "info");
              // await realApi.updateAssignment(editingAssignment.id, data, token);
              // showToast("Assignment updated.", "success");
          } else {
              // Note: There's no createAssignment in realApi yet, so we'll just show a message
              showToast("Create functionality not implemented yet.", "info");
              // await realApi.createAssignment(data, token);
              // showToast("Assignment created.", "success");
          }
          fetchData();
      } catch (e) {
          showToast(`Failed to save assignment.`, "error");
      } finally {
          setIsModalOpen(false);
      }
  }

  return (
    <div>
      <ToastComponent />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingAssignment ? "Edit Assignment" : "Create Assignment"}>
          <AssignmentForm assignment={editingAssignment} cohorts={cohorts} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <div className="flex justify-between items-center mb-8 animate-fade-in-up">
        <h1 className="text-4xl font-bold font-heading">All Assignments</h1>
         {user?.role === UserRole.FACILITATOR && (
            <Button onClick={handleCreate} leftIcon={<PlusIcon />}>Create Assignment</Button>
        )}
      </div>

      <div className="flex space-x-4 mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <Button variant="secondary" size="sm">All</Button>
        <Button variant="ghost" size="sm">Pending</Button>
        <Button variant="ghost" size="sm">Submitted</Button>
        <Button variant="ghost" size="sm">Graded</Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assignment, index) => (
            <div key={assignment.id} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${200 + index * 100}ms`}}>
                <AssignmentCard 
                  assignment={assignment} 
                  cohortName={cohortMap[assignment.cohortId]}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignmentsPage;