import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Pencil, Trash2, Mail, Calendar, User,
  Tag, FileText, Clock, Shield, Lock,
} from 'lucide-react';
import { useLead, useDeleteLead } from '@/hooks/useLeads';
import { useAuthStore } from '@/store/authStore';
import { LeadFormModal } from '@/components/LeadFormModal';
import { ConfirmModal } from '@/components/ConfirmModal';
import { StatusBadge, SourceBadge } from '@/components/StatusBadge';
import { PageLoader } from '@/components/Spinner';
import { formatDate, formatRelativeTime } from '@/utils';
import { Lead } from '@/types';

export const LeadDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data, isLoading, isError } = useLead(id!);
  const deleteLead = useDeleteLead();

  if (isLoading) return <PageLoader />;

  if (isError || !data?.data) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="card p-12 text-center">
          <p className="text-4xl mb-4">🔍</p>
          <h2 className="font-display text-xl font-bold text-[var(--text-primary)] mb-2">Lead not found</h2>
          <p className="text-[var(--text-muted)] text-sm mb-6">
            This lead doesn't exist or you don't have access to it.
          </p>
          <Link to="/leads" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Leads
          </Link>
        </div>
      </div>
    );
  }

  const lead = data.data as Lead;
  const createdBy = typeof lead.createdBy === 'object' ? lead.createdBy : null;
  const isOwn = createdBy?._id === user?.id || lead.createdBy === user?.id;
  const canEdit = isAdmin || isOwn;

  const handleDelete = async () => {
    await deleteLead.mutateAsync(lead._id);
    navigate('/leads');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Back nav */}
      <Link
        to="/leads"
        className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Leads
      </Link>

      {/* Header card */}
      <div className="card p-6 mb-4 animate-slide-up">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--accent)]/15 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-display font-bold text-[var(--accent)]">
                {lead.name[0].toUpperCase()}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">{lead.name}</h1>
                {!isAdmin && isOwn && (
                  <span className="text-xs text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
                    your lead
                  </span>
                )}
              </div>
              <a href={`mailto:${lead.email}`}
                className="text-sm text-[var(--accent)] hover:underline flex items-center gap-1 mt-1">
                <Mail className="w-3.5 h-3.5" />
                {lead.email}
              </a>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {canEdit ? (
              <button
                onClick={() => setEditOpen(true)}
                className="btn-ghost flex items-center gap-2 border border-[var(--border)]"
              >
                <Pencil className="w-4 h-4" /> Edit
              </button>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-[var(--text-muted)] bg-[var(--bg-muted)] cursor-not-allowed">
                <Lock className="w-3.5 h-3.5" /> Edit (not yours)
              </div>
            )}

            {isAdmin ? (
              <button
                onClick={() => setDeleteOpen(true)}
                className="btn-danger flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-[var(--text-muted)] bg-[var(--bg-muted)] cursor-not-allowed border border-[var(--border)]">
                <Lock className="w-3.5 h-3.5" /> Admin only
              </div>
            )}
          </div>
        </div>

        {/* Badges row */}
        <div className="flex items-center gap-3 mt-5 pt-5 border-t border-[var(--border)]">
          <StatusBadge status={lead.status} />
          <SourceBadge source={lead.source} />
          <span className="text-xs text-[var(--text-muted)] ml-auto flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatRelativeTime(lead.createdAt)}
          </span>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        {/* Status */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-[var(--text-muted)]" />
            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Status</p>
          </div>
          <StatusBadge status={lead.status} />
          <p className="text-xs text-[var(--text-muted)] mt-2">
            {lead.status === 'New' && 'Lead has just been added — not yet contacted.'}
            {lead.status === 'Contacted' && 'Initial contact has been made with this lead.'}
            {lead.status === 'Qualified' && 'Lead has been qualified and is a good prospect.'}
            {lead.status === 'Lost' && 'Lead did not convert and has been marked as lost.'}
          </p>
        </div>

        {/* Source */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-[var(--text-muted)]" />
            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Source</p>
          </div>
          <SourceBadge source={lead.source} />
          <p className="text-xs text-[var(--text-muted)] mt-2">
            {lead.source === 'Website' && 'Lead came through the company website.'}
            {lead.source === 'Instagram' && 'Lead originated from Instagram outreach.'}
            {lead.source === 'Referral' && 'Lead was referred by an existing contact.'}
          </p>
        </div>

        {/* Created By */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            {isAdmin ? (
              <Shield className="w-4 h-4 text-purple-400" />
            ) : (
              <User className="w-4 h-4 text-[var(--text-muted)]" />
            )}
            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Created By</p>
          </div>
          {createdBy ? (
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                ${isAdmin ? 'bg-purple-500/15 text-purple-400' : 'bg-[var(--accent)]/15 text-[var(--accent)]'}`}>
                {createdBy.name[0].toUpperCase()}
              </div>
              <div>
                <p className={`text-sm font-medium ${isAdmin ? 'text-purple-300' : 'text-[var(--text-primary)]'}`}>
                  {createdBy.name}
                  {isOwn && <span className="ml-1 text-xs text-sky-400">(you)</span>}
                </p>
                <p className="text-xs text-[var(--text-muted)]">{createdBy.email}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">Unknown</p>
          )}
        </div>

        {/* Timestamps */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Timeline</p>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-[var(--text-muted)]">Created</p>
              <p className="text-sm text-[var(--text-primary)]">{formatDate(lead.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Last Updated</p>
              <p className="text-sm text-[var(--text-primary)]">{formatDate(lead.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="card p-5 animate-slide-up">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-4 h-4 text-[var(--text-muted)]" />
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Notes</p>
        </div>
        {lead.notes ? (
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
            {lead.notes}
          </p>
        ) : (
          <p className="text-sm text-[var(--text-muted)] italic">No notes added yet.</p>
        )}
      </div>

      {/* Permissions notice for sales */}
      {!isAdmin && !isOwn && (
        <div className="mt-4 flex items-center gap-2 px-4 py-3 rounded-lg bg-amber-500/8 border border-amber-500/20 text-xs text-amber-300">
          <Lock className="w-3.5 h-3.5 flex-shrink-0" />
          You're viewing this lead in read-only mode. Only its creator or an admin can edit it.
        </div>
      )}

      <LeadFormModal isOpen={editOpen} onClose={() => setEditOpen(false)} lead={lead} />
      <ConfirmModal
        isOpen={deleteOpen}
        title="Delete Lead"
        message={`Are you sure you want to permanently delete "${lead.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        isLoading={deleteLead.isPending}
      />
    </div>
  );
};
