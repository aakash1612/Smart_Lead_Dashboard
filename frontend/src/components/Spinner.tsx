import { cn } from '@/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner = ({ size = 'md', className }: SpinnerProps) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };
  return (
    <div
      className={cn(
        'border-2 border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin',
        sizes[size],
        className
      )}
    />
  );
};

export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center gap-3">
      <Spinner size="lg" />
      <p className="text-[var(--text-muted)] text-sm">Loading...</p>
    </div>
  </div>
);
