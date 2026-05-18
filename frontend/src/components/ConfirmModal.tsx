import { AlertTriangle, X } from 'lucide-react';
import { Spinner } from './Spinner';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
  isLoading,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative card p-6 w-full max-w-md animate-slide-up shadow-2xl">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-[var(--bg-muted)] text-[var(--text-muted)]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
        </div>

        <p className="text-[var(--text-secondary)] text-sm mb-6">{message}</p>

        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="btn-ghost">Cancel</button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {isLoading && <Spinner size="sm" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
