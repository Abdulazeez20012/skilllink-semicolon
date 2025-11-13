import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { realApi } from '../services/realApi';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import { useToast } from '../hooks/useToast';

const AttendancePage: React.FC = () => {
  const { qrCodeId } = useParams<{ qrCodeId: string }>();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [qrCodeImage, setQrCodeImage] = useState('');
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Get user's current location for geofencing
  useEffect(() => {
    if (user?.role === 'student') {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lon: position.coords.longitude
            });
            setLocationError(null);
          },
          (error) => {
            setLocationError('Unable to get your location. Some attendance features may not work.');
            console.error('Geolocation error:', error);
          }
        );
      } else {
        setLocationError('Geolocation is not supported by your browser.');
      }
    }
  }, [user]);

  useEffect(() => {
    const markAttendance = async () => {
      if (!qrCodeId || !user) return;
      
      try {
        setLoading(true);
        const token = localStorage.getItem('skilllink_token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        // Prepare student location data if available
        const studentLocation = location ? {
          studentLat: location.lat,
          studentLon: location.lon
        } : undefined;
        
        const result = await realApi.markAttendance(qrCodeId, token, studentLocation);
        showToast(result.message, 'success');
      } catch (error: any) {
        console.error('Failed to mark attendance', error);
        showToast(`Failed to mark attendance: ${error.message || 'Unknown error'}`, 'error');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'student') {
      markAttendance();
    }
  }, [qrCodeId, user, showToast, location]);

  useEffect(() => {
    const generateQRCode = async () => {
      if (!qrCodeId || !user) return;
      
      try {
        setLoading(true);
        const token = localStorage.getItem('skilllink_token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        // In a real implementation, we would fetch the QR code image from the backend
        // For now, we'll just show a placeholder
        setQrCodeImage('');
      } catch (error: any) {
        console.error('Failed to load QR code', error);
        showToast(`Failed to load QR code: ${error.message || 'Unknown error'}`, 'error');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'facilitator') {
      generateQRCode();
    }
  }, [qrCodeId, user, showToast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8 text-center">
        <h1 className="text-3xl font-bold font-heading mb-6">Attendance</h1>
        
        {user?.role === 'student' ? (
          <div>
            <p className="text-xl mb-4">Attendance marked successfully!</p>
            <p className="text-neutral-gray-light">You can now close this page.</p>
            {locationError && (
              <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded">
                <p className="text-sm">{locationError}</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="mb-6">Show this QR code to your students for attendance:</p>
            {qrCodeImage ? (
              <img src={qrCodeImage} alt="Attendance QR Code" className="mx-auto mb-6" />
            ) : (
              <div className="bg-neutral-light-gray dark:bg-neutral-gray-medium rounded-lg p-8 mb-6">
                <p className="text-neutral-gray-light">QR Code will appear here</p>
              </div>
            )}
            <Button onClick={() => window.location.reload()}>Refresh QR Code</Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AttendancePage;