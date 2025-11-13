import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { realApi } from '../services/realApi';
import { PredictiveAlertsData, UserRole, AssignmentStatus } from '../types';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import { useNavigate } from 'react-router-dom';

const AdminAlertsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [selectedCohortId, setSelectedCohortId] = useState<string>('');
  const [alertsData, setAlertsData] = useState<PredictiveAlertsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingAlerts, setLoadingAlerts] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== UserRole.ADMIN) {
      navigate('/app/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchCohorts = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const token = localStorage.getItem('skilllink_token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        const cohortsData = await realApi.getCohorts(token);
        setCohorts(cohortsData);
        
        // Auto-select first cohort
        if (cohortsData.length > 0) {
          setSelectedCohortId(cohortsData[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch cohorts', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchCohorts();
    }
  }, [user]);

  useEffect(() => {
    const fetchAlerts = async () => {
      if (!selectedCohortId || !user) return;
      
      try {
        setLoadingAlerts(true);
        const token = localStorage.getItem('skilllink_token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        const data = await realApi.getPredictiveAlerts(selectedCohortId, token);
        setAlertsData(data);
      } catch (error) {
        console.error('Failed to fetch alerts', error);
      } finally {
        setLoadingAlerts(false);
      }
    };
    
    if (selectedCohortId) {
      fetchAlerts();
    }
  }, [selectedCohortId, user]);

  const getAlertLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRiskFactorColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
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
      <div className="flex justify-between items-center mb-8 animate-fade-in-up">
        <div>
          <h1 className="text-4xl font-bold font-heading">Predictive Alerts</h1>
          <p className="text-neutral-gray-light mt-1">
            Identify at-risk students and take proactive action
          </p>
        </div>
      </div>

      {/* Cohort Selector */}
      <Card className="p-6 mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center gap-4">
          <label className="font-medium">Select Cohort:</label>
          <Select
            value={selectedCohortId}
            onChange={(e) => setSelectedCohortId(e.target.value)}
            className="flex-1 max-w-md"
          >
            {cohorts.map((cohort) => (
              <option key={cohort.id} value={cohort.id}>
                {cohort.name}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {loadingAlerts ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : alertsData ? (
        <div className="space-y-6">
          {/* Summary Card */}
          <Card className="p-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">{alertsData.totalStudents}</p>
                <p className="text-neutral-gray-light mt-1">Total Students</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-red-600">{alertsData.atRiskStudents}</p>
                <p className="text-neutral-gray-light mt-1">At-Risk Students</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-green-600">
                  {alertsData.totalStudents - alertsData.atRiskStudents}
                </p>
                <p className="text-neutral-gray-light mt-1">On Track</p>
              </div>
            </div>
          </Card>

          {/* Alerts List */}
          <div className="space-y-4">
            {alertsData.alerts.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-neutral-gray-light">
                  No at-risk students detected. All students are performing well!
                </p>
              </Card>
            ) : (
              alertsData.alerts.map((alert, index) => (
                <Card
                  key={alert.student.id}
                  className={`p-6 border-2 ${getAlertLevelColor(alert.alertLevel)} opacity-0 animate-fade-in-up`}
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{alert.student.name}</h3>
                      <p className="text-sm text-neutral-gray-light">{alert.student.email}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Risk Score:</span>
                        <span className="text-2xl font-bold">{alert.riskScore}</span>
                      </div>
                      <Badge
                        status={
                          alert.alertLevel === 'high'
                            ? AssignmentStatus.LATE
                            : alert.alertLevel === 'medium'
                            ? AssignmentStatus.PENDING
                            : AssignmentStatus.SUBMITTED
                        }
                      />
                    </div>
                  </div>

                  {/* Streak Information */}
                  <div className="mb-4 p-3 bg-white dark:bg-neutral-gray-dark rounded">
                    <div className="flex justify-between text-sm">
                      <div>
                        <span className="text-neutral-gray-light">Current Streak:</span>
                        <span className="ml-2 font-bold">{alert.streak.current} days</span>
                      </div>
                      <div>
                        <span className="text-neutral-gray-light">Longest Streak:</span>
                        <span className="ml-2 font-bold">{alert.streak.longest} days</span>
                      </div>
                    </div>
                  </div>

                  {/* Risk Factors */}
                  <div>
                    <h4 className="font-bold mb-2">Risk Factors:</h4>
                    <ul className="space-y-2">
                      {alert.riskFactors.map((factor, factorIndex) => (
                        <li
                          key={factorIndex}
                          className="flex items-start gap-2 text-sm"
                        >
                          <span className={`font-medium ${getRiskFactorColor(factor.severity)}`}>
                            •
                          </span>
                          <div className="flex-1">
                            <span className="font-medium capitalize">{factor.type}:</span>{' '}
                            {factor.message}
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              factor.severity === 'high'
                                ? 'bg-red-100 text-red-800'
                                : factor.severity === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {factor.severity}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors text-sm">
                        Send Email
                      </button>
                      <button className="px-4 py-2 bg-secondary dark:bg-neutral-gray-medium rounded hover:bg-neutral-light-gray dark:hover:bg-neutral-gray-dark transition-colors text-sm">
                        Schedule Meeting
                      </button>
                      <button className="px-4 py-2 bg-secondary dark:bg-neutral-gray-medium rounded hover:bg-neutral-light-gray dark:hover:bg-neutral-gray-dark transition-colors text-sm">
                        View Profile
                      </button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-neutral-gray-light">Select a cohort to view predictive alerts</p>
        </Card>
      )}
    </div>
  );
};

export default AdminAlertsPage;
