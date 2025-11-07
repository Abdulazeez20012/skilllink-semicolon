import React, { useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { realApi } from '../services/realApi';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useToast } from '../hooks/useToast';
import Spinner from '../components/ui/Spinner';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showToast, ToastComponent } = useToast();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Upload avatar file
      handleAvatarUpload(file);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      const token = localStorage.getItem('skilllink_token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Upload the file to get a URL
      const avatarUrl = await realApi.uploadAvatar(file, token);
      
      // Update user with new avatar URL
      await updateUser({
        avatarUrl,
      });
      
      showToast('Avatar updated successfully!', 'success');
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      showToast('Failed to upload avatar.', 'error');
      // Reset preview on error
      setAvatarPreview(user?.avatarUrl || null);
    }
  };

  const handleProfileUpdate = async () => {
    if (!user) return;
    setIsUpdating(true);
    try {
      await updateUser({
        name,
        email,
        // avatarUrl is handled separately during file upload
      });

      showToast('Profile updated successfully!', 'success');
    } catch (error) {
      showToast('Failed to update profile.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordUpdate = () => {
    // Mock update
    showToast('Password changed successfully!', 'success');
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <ToastComponent />
      <h1 className="text-4xl font-bold font-heading mb-8 animate-fade-in-up">Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-8">
            <Card className="p-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <h2 className="text-2xl font-bold font-heading mb-6">Personal Information</h2>
              <div className="space-y-6">
                <Input label="Full Name" id="name" value={name} onChange={e => setName(e.target.value)} />
                <Input label="Email Address" id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <Button onClick={handleProfileUpdate} className="mt-8" disabled={isUpdating}>
                {isUpdating ? <Spinner size="sm" color="white" /> : 'Save Changes'}
              </Button>
            </Card>

             <Card className="p-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <h2 className="text-2xl font-bold font-heading mb-6">Change Password</h2>
              <div className="space-y-6">
                <Input label="Current Password" id="current-password" type="password" />
                <Input label="New Password" id="new-password" type="password" />
                <Input label="Confirm New Password" id="confirm-password" type="password" />
              </div>
              <Button onClick={handlePasswordUpdate} className="mt-8">Update Password</Button>
            </Card>
        </div>
        
        {/* Avatar and Info */}
        <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <Card className="p-8 flex flex-col items-center text-center">
            <div className="relative group">
                <img src={avatarPreview || user.avatarUrl} alt="User Avatar" className="w-32 h-32 rounded-full mb-4 ring-4 ring-primary/20 object-cover group-hover:ring-primary/40 transition-all duration-300" />
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => fileInputRef.current?.click()}>
                    <span className="text-white font-semibold">Change</span>
                </div>
            </div>
            <h3 className="text-2xl font-bold font-heading">{user.name}</h3>
            <p className="text-neutral-gray-light capitalize">{user.role}</p>
            <p className="text-sm text-neutral-gray-light mt-2">Member since {new Date(user.joinDate).toLocaleDateString()}</p>
            <input 
              id="avatar-upload"
              ref={fileInputRef}
              type="file" 
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;