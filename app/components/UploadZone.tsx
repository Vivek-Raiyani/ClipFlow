import React, { useState } from 'react';
import { Button } from './Button';
import { Cloud } from 'lucide-react';

interface UploadZoneProps {
  tabs?: string[];
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onImportClick?: () => void;
  onLocalUpload?: (file: File, type: string) => void;
  uploading?: boolean;
}

export function UploadZone({
  tabs = ['Raw', 'Draft', 'Final'],
  title = 'Beam Data to R2',
  subtitle = 'Zero Egress Publication Protocol',
  icon = '🛰️',
  onImportClick,
  onLocalUpload,
  uploading = false
}: UploadZoneProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onLocalUpload) {
      onLocalUpload(e.target.files[0], activeTab ? activeTab.toLowerCase() : 'raw');
    }
  };

  return (
    <div style={{ maxWidth: '480px' }}>
      {tabs.length > 0 && (
        <div className="type-tabs">
          {tabs.map(tab => (
            <button 
              key={tab} 
              className={`type-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      )}
      
      <div className="upload-zone">
        <div className="upload-icon">{icon}</div>
        <div className="upload-title">{title}</div>
        <div className="upload-sub" style={{ marginTop: '4px' }}>{subtitle}</div>
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileChange} 
      />
      
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <Button 
          variant="primary" 
          style={{ flex: 1, justifyContent: 'center', borderRadius: '14px', padding: '14px' }}
          icon={<Cloud size={14} strokeWidth={2} />}
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </Button>
        <Button 
          variant="ghost" 
          style={{ flex: 1, justifyContent: 'center', borderRadius: '14px', padding: '14px' }}
          icon={<Cloud size={14} strokeWidth={2} />}
          onClick={onImportClick}
          disabled={uploading}
        >
          Google Drive
        </Button>
      </div>
    </div>
  );
}
