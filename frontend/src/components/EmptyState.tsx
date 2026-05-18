import { Users, Search } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  hasSearch?: boolean;
}

export const EmptyState = ({ title, description, action, hasSearch }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
    <div className="w-16 h-16 rounded-2xl bg-[var(--bg-muted)] flex items-center justify-center mb-4">
      {hasSearch ? (
        <Search className="w-7 h-7 text-[var(--text-muted)]" />
      ) : (
        <Users className="w-7 h-7 text-[var(--text-muted)]" />
      )}
    </div>
    <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-1">{title}</h3>
    <p className="text-[var(--text-muted)] text-sm text-center max-w-xs mb-4">{description}</p>
    {action}
  </div>
);
