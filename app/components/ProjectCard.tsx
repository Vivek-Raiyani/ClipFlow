import React from 'react';
import { ChevronRight, Calendar, Lock, Globe } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  avatarChar: string;
  date: string;
  visibility: 'Private' | 'Public';
  statusLabel?: string;
  statusValue: string;
  statusActive?: boolean;
  archived?: boolean;
}

export function ProjectCard({
  title,
  avatarChar,
  date,
  visibility,
  statusLabel = 'Pipeline Status',
  statusValue,
  statusActive = false,
  archived = false
}: ProjectCardProps) {
  return (
    <div className="project-card" style={archived ? { opacity: 0.5 } : {}}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
        <div className="project-avatar">{avatarChar}</div>
        <div>
          <div className="project-title">{title}</div>
          <div className="project-meta">
            <div className="project-meta-item">
              <Calendar size={12} strokeWidth={2} />
              {date}
            </div>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--ui-border2)' }}></div>
            <div className="project-meta-item">
              {visibility === 'Private' ? (
                <Lock size={12} strokeWidth={2} />
              ) : (
                <Globe size={12} strokeWidth={2} />
              )}
              {visibility}
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div className="project-status">
          <div className="project-status-label">{statusLabel}</div>
          <div className={`project-status-value ${statusActive ? 'status-active' : ''}`} style={!statusActive ? { color: 'var(--ui-fg3)' } : {}}>
            <span>{statusValue}</span>
            {statusActive && <span className="status-dot"></span>}
          </div>
        </div>
        <div className="chevron">
          <ChevronRight size={16} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}
