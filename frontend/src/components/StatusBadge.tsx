import { LeadStatus, LeadSource } from '@/types';
import { STATUS_CONFIG, SOURCE_CONFIG } from '@/utils';

interface StatusBadgeProps {
  status: LeadStatus;
}

interface SourceBadgeProps {
  source: LeadSource;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`badge ${config.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} mr-1.5`} />
      {config.label}
    </span>
  );
};

export const SourceBadge = ({ source }: SourceBadgeProps) => {
  const config = SOURCE_CONFIG[source];
  return <span className={`badge ${config.className}`}>{config.label}</span>;
};
