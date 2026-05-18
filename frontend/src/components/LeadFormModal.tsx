import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { Lead, CreateLeadInput } from '@/types';
import { useCreateLead, useUpdateLead } from '@/hooks/useLeads';
import { Spinner } from './Spinner';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']),
  source: z.enum(['Website', 'Instagram', 'Referral']),
  notes: z.string().max(500, 'Max 500 characters').optional(),
});

type FormData = z.infer<typeof schema>;

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: Lead | null;
}

export const LeadFormModal = ({ isOpen, onClose, lead }: LeadFormModalProps) => {
  const isEdit = !!lead;
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: 'New',
      source: 'Website',
    },
  });

  useEffect(() => {
    if (isOpen && lead) {
      reset({
        name: lead.name,
        email: lead.email,
        status: lead.status,
        source: lead.source,
        notes: lead.notes || '',
      });
    } else if (isOpen && !lead) {
      reset({ name: '', email: '', status: 'New', source: 'Website', notes: '' });
    }
  }, [isOpen, lead, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      if (isEdit && lead) {
        await updateLead.mutateAsync({ id: lead._id, data });
      } else {
        await createLead.mutateAsync(data as CreateLeadInput);
      }
      onClose();
    } catch {
      // handled in hook
    }
  };

  if (!isOpen) return null;

  const isPending = createLead.isPending || updateLead.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative card w-full max-w-lg animate-slide-up shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">
            {isEdit ? 'Edit Lead' : 'New Lead'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--bg-muted)] text-[var(--text-muted)]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Full Name *
              </label>
              <input
                {...register('name')}
                className="input-base"
                placeholder="e.g. Rahul Sharma"
                disabled={isPending}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Email Address *
              </label>
              <input
                {...register('email')}
                type="email"
                className="input-base"
                placeholder="rahul@example.com"
                disabled={isPending}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Status
              </label>
              <select {...register('status')} className="input-base" disabled={isPending}>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Source *
              </label>
              <select {...register('source')} className="input-base" disabled={isPending}>
                <option value="Website">Website</option>
                <option value="Instagram">Instagram</option>
                <option value="Referral">Referral</option>
              </select>
              {errors.source && (
                <p className="mt-1 text-xs text-red-400">{errors.source.message}</p>
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Notes
                <span className="ml-1 text-[var(--text-muted)] font-normal">(optional)</span>
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="input-base resize-none"
                placeholder="Any additional notes..."
                disabled={isPending}
              />
              {errors.notes && (
                <p className="mt-1 text-xs text-red-400">{errors.notes.message}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || isSubmitting}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {isPending && <Spinner size="sm" />}
              {isEdit ? 'Save Changes' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
