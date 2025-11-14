import React, { useRef, useState } from 'react';
import Button from './ui/Button';
import Spinner from './ui/Spinner';

interface FileUploadProps {
  onUpload: (fileUrl: string, fileName: string) => void;
  type?: 'avatar' | 'assignment' | 'chat' | 'resource';
  accept?: string;
  maxSize?: number; // in MB
  label?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  type = 'assignment',
  accept = '*/*',
  maxSize = 10,
  label = 'Upload File'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append(type, file);

      const token = localStorage.getItem('skilllink_token');
      const response = await fetch(`http://localhost:5000/api/upload/${type}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onUpload(data.fileUrl || data.avatarUrl, data.fileName || file.name);
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <Button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        variant="secondary"
      >
        {uploading ? (
          <>
            <Spinner size="sm" color="primary" />
            <span className="ml-2">Uploading...</span>
          </>
        ) : (
          <>
            📎 {label}
          </>
        )}
      </Button>
      
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;
