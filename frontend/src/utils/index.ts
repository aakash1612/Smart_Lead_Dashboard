import { type ClassValue, clsx } from 'clsx';
import { LeadStatus, LeadSource } from '@/types';

export const cn = (...inputs: ClassValue[]) => clsx(inputs);

export const STATUS_CONFIG: Record<
  LeadStatus,
  { label: string; className: string; dot: string }
> = {
  New: {
    label: 'New',
    className: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    dot: 'bg-blue-400',
  },
  Contacted: {
    label: 'Contacted',
    className: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    dot: 'bg-yellow-400',
  },
  Qualified: {
    label: 'Qualified',
    className: 'bg-green-500/10 text-green-400 border border-green-500/20',
    dot: 'bg-green-400',
  },
  Lost: {
    label: 'Lost',
    className: 'bg-red-500/10 text-red-400 border border-red-500/20',
    dot: 'bg-red-400',
  },
};

export const SOURCE_CONFIG: Record<
  LeadSource,
  { label: string; className: string }
> = {
  Website: {
    label: 'Website',
    className: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  },
  Instagram: {
    label: 'Instagram',
    className: 'bg-pink-500/10 text-pink-400 border border-pink-500/20',
  },
  Referral: {
    label: 'Referral',
    className: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
  },
};

export const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatRelativeTime = (dateStr: string): string => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return 'just now';
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
};
