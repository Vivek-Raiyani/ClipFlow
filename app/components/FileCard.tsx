import React from 'react';
import { Badge } from './Badge';
import { Button } from './Button';

interface FileCardProps {
  fileName: string;
  fileDetail: string;
  duration?: string;
  statusText?: string;
  statusVariant?: 'default' | 'black' | 'green' | 'amber' | 'red';
  uploadedAt?: string;
  onReject?: () => void;
  onApprove?: () => void;
}

export function FileCard({ 
  fileName, 
  fileDetail, 
  duration, 
  statusText = 'Needs Review',
  statusVariant = 'amber',
  uploadedAt,
  onReject,
  onApprove
}: FileCardProps) {
  return (
    <div className="file-card">
      <div className="thumbnail">
        <div className="thumb-inner"></div>
        <div className="thumb-play">
          <svg width="8" height="9" viewBox="0 0 10 12" fill="#0a0a0a">
            <polygon points="0,0 10,6 0,12" />
          </svg>
        </div>
        {duration && <div className="thumb-duration">{duration}</div>}
      </div>
      
      <div className="file-meta">
        <div className="file-badges">
          <Badge variant={statusVariant} dot style={{ fontSize: '9px' }}>
            {statusText}
          </Badge>
          {uploadedAt && (
            <span style={{ fontFamily: 'var(--ui-mono)', fontSize: '9px', color: 'var(--ui-fg3)' }}>
              {uploadedAt}
            </span>
          )}
        </div>
        <div className="file-name" title={fileName}>{fileName}</div>
        <div className="file-detail">{fileDetail}</div>
      </div>
      
      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
        <Button variant="danger" onClick={onReject}>Reject</Button>
        <Button variant="success" onClick={onApprove}>Approve</Button>
      </div>
    </div>
  );
}
