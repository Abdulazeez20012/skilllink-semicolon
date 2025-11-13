import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { realApi } from '../services/realApi';
import { Cohort, Assignment, UserRole, AssignmentStatus, CurriculumItem } from '../types';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import Button from '../components/ui/Button';
import QrCodeIcon from '../components/icons/QrCodeIcon';
import Input from '../components/ui/Input';

// Define AttendanceRecord interface locally since it's not exported from types.ts
interface AttendanceRecord {
  id: string;
  sessionDate: string;
  students: {
    student: {
      id: string;
      name: string;
      email: string;
    };
    timestamp: string;
  }[];
  geofenceEnabled?: boolean;
}

const CurriculumRoadmap: React.FC<{ curriculum: CurriculumItem[] }> = ({ curriculum }) => {
  return (
    <div className="space-y-6">
      {curriculum.map((item, index) => (
        <div key={index} className="border-l-2 border-primary pl-4 py-2">
          <div className="flex items-center mb-2">
            <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">W{item.week}</span>
            <h4 className="font-bold">Week {item.week}</h4>
          </div>
          <div className="ml-11">
            <p className="text-sm text-neutral-gray-light mb-2">Topics:</p>
            <ul className="list-disc list-inside space-y-1">
              {item.topics.map((topic, topicIndex) => (
                <li key={topicIndex} className="text-sm">{topic}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

const AttendanceSection: React.FC<{ 
  cohortId: string; 
  onGenerateQR: () => void;
  attendanceRecords: AttendanceRecord[];
}> = ({ cohortId, onGenerateQR, attendanceRecords }) => {
  const [showGeofenceForm, setShowGeofenceForm] = useState(false);
  const [geofenceData, setGeofenceData] = useState({
    latitude: '',
    longitude: '',
    radius: '100'
  });

  const handleGeofenceSubmit = async () => {
    if (!cohortId) return;
    
    try {
      const token = localStorage.getItem('skilllink_token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const result = await realApi.generateQRCode(
        cohortId, 
        token, 
        true, 
        {
          latitude: parseFloat(geofenceData.latitude),
          longitude: parseFloat(geofenceData.longitude),
          radius: parseInt(geofenceData.radius)
        }
      );
      
      // In a real implementation, we would redirect to the QR code page
      alert(`Geofenced QR Code generated! Share this link with students: ${window.location.origin}/attendance/${result.qrCodeId}`);
      
      // Refresh attendance records
      const attendanceData = await realApi.getAttendanceByCohort(cohortId, token);
      // Update attendance records in parent component if needed
      
      // Reset form
      setShowGeofenceForm(false);
      setGeofenceData({
        latitude: '',
        longitude: '',
        radius: '100'
      });
    } catch (error: any) {
      console.error("Failed to generate geofenced QR code", error);
      alert(`Failed to generate geofenced QR code: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold font-heading">Attendance</h3>
        <div className="flex space-x-2">
          <Button 
            variant="secondary" 
            onClick={() => setShowGeofenceForm(!showGeofenceForm)}
          >
            {showGeofenceForm ? 'Cancel Geofence' : 'Add Geofence'}
          </Button>
          <Button onClick={onGenerateQR} leftIcon={<QrCodeIcon />}>Generate QR Code</Button>
        </div>
      </div>
      
      {showGeofenceForm && (
        <Card className="mb-6 p-4">
          <h4 className="font-bold mb-3">Set Geofence Location</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              type="text"
              placeholder="Latitude"
              value={geofenceData.latitude}
              onChange={(e) => setGeofenceData({...geofenceData, latitude: e.target.value})}
            />
            <Input
              type="text"
              placeholder="Longitude"
              value={geofenceData.longitude}
              onChange={(e) => setGeofenceData({...geofenceData, longitude: e.target.value})}
            />
            <Input
              type="number"
              placeholder="Radius (meters)"
              value={geofenceData.radius}
              onChange={(e) => setGeofenceData({...geofenceData, radius: e.target.value})}
            />
          </div>
          <Button 
            className="mt-3" 
            onClick={handleGeofenceSubmit}
            disabled={!geofenceData.latitude || !geofenceData.longitude}
          >
            Generate Geofenced QR Code
          </Button>
        </Card>
      )}
      
      {attendanceRecords.length > 0 ? (
        <div className="space-y-4">
          {attendanceRecords.map((record) => (
            <Card key={record.id} className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold">{new Date(record.sessionDate).toLocaleDateString()}</h4>
                <span className="text-sm text-neutral-gray-light">{record.students.length} students</span>
              </div>
              <div className="flex items-center">
                <div className="text-sm text-neutral-gray-light flex-1">
                  {record.students.slice(0, 5).map(s => s.student.name).join(', ')}
                  {record.students.length > 5 && ` and ${record.students.length - 5} more`}
                </div>
                {record.geofenceEnabled && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Geofenced</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-neutral-gray-light">No attendance records yet. Generate a QR code to start tracking attendance.</p>
        </Card>
      )}
    </div>
  );
};

const CohortDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [cohort, setCohort] = useState<Cohort | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('assignments');
  
  useEffect(() => {
    const fetchCohortData = async () => {
      if (!id || !user) return;
      try {
        setLoading(true);
        const token = localStorage.getItem('skilllink_token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        const [cohortData, assignmentsData] = await Promise.all([
          realApi.getCohortById(id, token),
          realApi.getAssignmentsByCohort(id, token)
        ]);
        setCohort(cohortData || null);
        setAssignments(assignmentsData);
        
        // Fetch attendance records for facilitators
        if (user.role === UserRole.FACILITATOR) {
          const attendanceData = await realApi.getAttendanceByCohort(id, token);
          setAttendanceRecords(attendanceData);
        }
      } catch (error) {
        console.error("Failed to fetch cohort data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCohortData();
  }, [id, user]);
  
  const handleGenerateQR = async () => {
    if (!id || !user) return;
    
    try {
      const token = localStorage.getItem('skilllink_token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const result = await realApi.generateQRCode(id, token);
      // In a real implementation, we would redirect to the QR code page
      alert(`QR Code generated! Share this link with students: ${window.location.origin}/attendance/${result.qrCodeId}`);
      
      // Refresh attendance records
      const attendanceData = await realApi.getAttendanceByCohort(id, token);
      setAttendanceRecords(attendanceData);
    } catch (error: any) {
      console.error("Failed to generate QR code", error);
      alert(`Failed to generate QR code: ${error.message || 'Unknown error'}`);
    }
  };
  
  if (loading) return <div className="flex justify-center items-center h-full"><Spinner size="lg" /></div>;
  if (!cohort) return <div className="text-center">Cohort not found.</div>;

  const tabs = [
    { id: 'assignments', label: 'Assignments' },
    { id: 'curriculum', label: 'Curriculum' },
  ];
  
  // Add attendance tab for facilitators
  if (user?.role === UserRole.FACILITATOR) {
    tabs.push({ id: 'attendance', label: 'Attendance' });
  }
  
  tabs.push({ id: 'students', label: 'Students' });
  
  if (user?.role === UserRole.STUDENT) {
    tabs.push({ id: 'progress', label: 'My Progress' });
  }
  
  const submittedCount = assignments.filter(a => a.status === AssignmentStatus.SUBMITTED || a.status === AssignmentStatus.GRADED).length;

  return (
    <div>
      {/* Header */}
      <Card className="mb-8 p-6 animate-fade-in-up">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold font-heading">{cohort.name}</h1>
            <p className="text-neutral-gray-light mt-2 max-w-3xl">{cohort.description}</p>
            <div className="flex items-center mt-4 space-x-4">
              <span className="text-sm bg-primary/10 text-primary font-semibold px-2 py-1 rounded">
                {cohort.curriculumTrack}
              </span>
              <span className="text-sm text-neutral-gray-light">
                {new Date(cohort.startDate || '').toLocaleDateString()} - {new Date(cohort.endDate || '').toLocaleDateString()}
              </span>
            </div>
          </div>
          {user?.role === UserRole.STUDENT && cohort.inviteCode && (
            <div className="bg-secondary dark:bg-neutral-gray-medium p-3 rounded-lg">
              <p className="text-xs text-neutral-gray-light">Invite Code</p>
              <p className="font-mono font-bold">{cohort.inviteCode}</p>
            </div>
          )}
        </div>
        <div className="flex items-center mt-6 -space-x-2">
            {cohort.facilitators.map(f => (
                <img key={f.id} src={f.avatarUrl} title={`Facilitator: ${f.name}`} className="w-10 h-10 rounded-full ring-2 ring-secondary dark:ring-neutral-gray-dark"/>
            ))}
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-neutral-light-gray dark:border-neutral-gray-medium mb-8 animate-fade-in-up" style={{animationDelay: '100ms'}}>
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-neutral-gray-light hover:text-neutral-soft-black dark:hover:text-secondary hover:border-neutral-gray-light'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in-up" style={{animationDelay: '200ms'}}>
        {activeTab === 'assignments' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment, index) => (
                <div key={assignment.id} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms`}}>
                    <Link to={`/app/assignments/${assignment.id}`}>
                        <Card className="p-6 h-full" onClick={() => {}}>
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold font-heading text-lg mb-2 flex-1 pr-4 group-hover:text-primary transition-colors">{assignment.title}</h4>
                                <Badge status={assignment.status} />
                            </div>
                            <p className="text-sm text-neutral-gray-light">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                        </Card>
                    </Link>
                </div>
            ))}
          </div>
        )}
        
        {activeTab === 'curriculum' && (
          <Card className="p-6">
            <h3 className="text-2xl font-bold font-heading mb-6">Curriculum Roadmap</h3>
            {cohort.curriculum && cohort.curriculum.length > 0 ? (
              <CurriculumRoadmap curriculum={cohort.curriculum} />
            ) : (
              <p className="text-neutral-gray-light">No curriculum roadmap available for this cohort.</p>
            )}
          </Card>
        )}
        
        {activeTab === 'attendance' && user?.role === UserRole.FACILITATOR && (
          <Card className="p-6">
            <AttendanceSection 
              cohortId={id || ''} 
              onGenerateQR={handleGenerateQR} 
              attendanceRecords={attendanceRecords} 
            />
          </Card>
        )}
        
        {activeTab === 'students' && (
            <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold font-heading">Enrolled Students ({cohort.students.length})</h3>
                  {user?.role === UserRole.FACILITATOR && cohort.inviteCode && (
                    <div className="bg-secondary dark:bg-neutral-gray-medium p-2 rounded">
                      <p className="text-xs text-neutral-gray-light">Invite Code</p>
                      <p className="font-mono font-bold text-sm">{cohort.inviteCode}</p>
                    </div>
                  )}
                </div>
                <ul className="divide-y divide-neutral-light-gray dark:divide-neutral-gray-medium">
                    {cohort.students.map((student, index) => (
                        <li key={student.id} className="py-3 flex items-center opacity-0 animate-fade-in-up" style={{ animationDelay: `${index * 50}ms`}}>
                            <img src={student.avatarUrl} alt={student.name} className="w-10 h-10 rounded-full mr-4" />
                            <span className="font-medium">{student.name}</span>
                        </li>
                    ))}
                </ul>
            </Card>
        )}

        {activeTab === 'progress' && user?.role === UserRole.STUDENT && (
            <Card className="p-8">
                <h3 className="text-2xl font-bold font-heading mb-6">Your Progress Tracker</h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                           <span className="font-medium">Assignments Submitted</span>
                           <span className="font-bold text-primary">{submittedCount} / {assignments.length}</span>
                        </div>
                        <ProgressBar value={submittedCount} max={assignments.length} />
                    </div>
                     <p className="text-sm text-neutral-gray-light pt-2">Keep up the great work! Complete the remaining assignments to finish the cohort.</p>
                </div>
            </Card>
        )}
      </div>
    </div>
  );
};

export default CohortDetailPage;