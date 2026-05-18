import { Pencil, Trash2, Lock, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Lead } from '@/types';
import { StatusBadge, SourceBadge } from '@/components/StatusBadge';
import { formatRelativeTime } from '@/utils';

interface LeadTableRowProps {
  lead: Lead;
  isAdmin: boolean;
  userId: string;
  index: number;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

export const LeadTableRow = ({ lead, isAdmin, userId, index, onEdit, onDelete }: LeadTableRowProps) => {
  const navigate = useNavigate();
  const createdBy = typeof lead.createdBy === 'object' ? lead.createdBy : null;
  const isOwn = createdBy?._id === userId || lead.createdBy === userId;
  const canEdit = isAdmin || isOwn;

  return (
    <tr
      className="hover:bg-[var(--bg-muted)]/40 transition-colors group animate-fade-in cursor-pointer"
      style={{ animationDelay: `${index * 30}ms` }}
      onClick={() => navigate(`/leads/${lead._id}`)}
    >
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-[var(--accent)]">{lead.name[0].toUpperCase()}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-[var(--text-primary)]">{lead.name}</p>
              {!isAdmin && isOwn && (
                <span className="text-[10px] text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20">
                  yours
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--text-muted)]">{lead.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4"><StatusBadge status={lead.status} /></td>
      <td className="px-4 py-4"><SourceBadge source={lead.source} /></td>
      {isAdmin ? (
        <td className="px-4 py-4">
          {createdBy ? (
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-purple-500/15 flex items-center justify-center">
                <span className="text-[10px] font-bold text-purple-400">{createdBy.name[0].toUpperCase()}</span>
              </div>
              <span className="text-xs text-purple-300">{createdBy.name}</span>
            </div>
          ) : (
            <span className="text-xs text-[var(--text-muted)]">—</span>
          )}
        </td>
      ) : (
        <td className="px-4 py-4">
          <span className="text-xs text-[var(--text-muted)]">{formatRelativeTime(lead.createdAt)}</span>
        </td>
      )}
      <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
          {canEdit ? (
            <button onClick={() => onEdit(lead)}
              className="p-1.5 rounded-lg hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              title="Edit lead">
              <Pencil className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="p-1.5 text-[var(--text-muted)]/30 cursor-not-allowed" title="You can only edit your own leads">
              <Lock className="w-3.5 h-3.5" />
            </span>
          )}
          {isAdmin ? (
            <button onClick={() => onDelete(lead._id)}
              className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400 transition-colors"
              title="Delete lead">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="p-1.5 text-[var(--text-muted)]/30 cursor-not-allowed" title="Only admins can delete leads">
              <Trash2 className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </td>
    </tr>
  );
};

interface LeadMobileCardProps {
  lead: Lead;
  isAdmin: boolean;
  userId: string;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

export const LeadMobileCard = ({ lead, isAdmin, userId, onEdit, onDelete }: LeadMobileCardProps) => {
  const navigate = useNavigate();
  const createdBy = typeof lead.createdBy === 'object' ? lead.createdBy : null;
  const isOwn = createdBy?._id === userId || lead.createdBy === userId;
  const canEdit = isAdmin || isOwn;

  return (
    <div className="p-4 hover:bg-[var(--bg-muted)]/30 transition-colors cursor-pointer"
      onClick={() => navigate(`/leads/${lead._id}`)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-full bg-[var(--accent)]/10 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-[var(--accent)]">{lead.name[0].toUpperCase()}</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-medium text-[var(--text-primary)] truncate">{lead.name}</p>
              {!isAdmin && isOwn && (
                <span className="text-[10px] text-sky-400 bg-sky-500/10 px-1 rounded border border-sky-500/20 flex-shrink-0">yours</span>
              )}
            </div>
            <p className="text-xs text-[var(--text-muted)] truncate">{lead.email}</p>
            {isAdmin && createdBy && (
              <p className="text-xs text-purple-400 truncate flex items-center gap-1">
                <Shield className="w-3 h-3" /> {createdBy.name}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          {canEdit ? (
            <button onClick={() => onEdit(lead)} className="p-1.5 rounded-lg hover:bg-[var(--bg-muted)] text-[var(--text-muted)]">
              <Pencil className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="p-1.5 text-[var(--text-muted)]/30"><Lock className="w-3.5 h-3.5" /></span>
          )}
          {isAdmin ? (
            <button onClick={() => onDelete(lead._id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="p-1.5 text-[var(--text-muted)]/30"><Trash2 className="w-3.5 h-3.5" /></span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2.5 ml-12">
        <StatusBadge status={lead.status} />
        <SourceBadge source={lead.source} />
        <span className="text-xs text-[var(--text-muted)] ml-auto">{formatRelativeTime(lead.createdAt)}</span>
      </div>
    </div>
  );
};
