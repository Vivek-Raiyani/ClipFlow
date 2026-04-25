import React, { useState } from 'react';
import { Button } from './Button';
import { Cloud } from 'lucide-react';

interface UploadZoneProps {
  tabs?: string[];
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onImportClick?: () => void;
}

export function UploadZone({
  tabs = ['Raw', 'Draft', 'Final'],
  title = 'Beam Data to R2',
  subtitle = 'Zero Egress Publication Protocol',
  icon = '🛰️',
  onImportClick
}: UploadZoneProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]);

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
      
      <Button 
        variant="ghost" 
        style={{ width: '100%', justifyContent: 'center', marginTop: '12px', borderRadius: '14px', padding: '14px' }}
        icon={<Cloud size={14} strokeWidth={2} />}
        onClick={onImportClick}
      >
        Import from Google Drive
      </Button>
    </div>
  );
}
