import { useState, useCallback } from 'react';
import {
  Search, Plus, Download, Filter,
  ChevronDown, ArrowUpDown, Shield, User, Lock,
} from 'lucide-react';
import { useLeads, useDeleteLead } from '@/hooks/useLeads';
import { useDebounce } from '@/hooks/useDebounce';
import { useAuthStore } from '@/store/authStore';
import { leadsApi } from '@/api/leads';
import { Lead, LeadFilters, LeadStatus, LeadSource } from '@/types';
import { Pagination } from '@/components/Pagination';
import { EmptyState } from '@/components/EmptyState';
import { Spinner } from '@/components/Spinner';
import { LeadFormModal } from '@/components/LeadFormModal';
import { ConfirmModal } from '@/components/ConfirmModal';
import { LeadTableRow, LeadMobileCard } from '@/components/LeadTableRow';

const STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
const SOURCES: LeadSource[] = ['Website', 'Instagram', 'Referral'];

export const LeadsPage = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const [filters, setFilters] = useState<LeadFilters>({ sort: 'latest', page: 1 });
  const [searchInput, setSearchInput] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchInput, 400);
  const activeFilters = { ...filters, search: debouncedSearch || undefined };

  const { data, isLoading, isFetching } = useLeads(activeFilters);
  const deleteLead = useDeleteLead();

  const leads = (data?.data as Lead[]) || [];
  const meta = data?.meta;

  const updateFilter = useCallback(<K extends keyof LeadFilters>(key: K, val: LeadFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: val, page: 1 }));
  }, []);

  const handleEdit = (lead: Lead) => { setEditLead(lead); setModalOpen(true); };
  const handleNewLead = () => { setEditLead(null); setModalOpen(true); };
  const handleCloseModal = () => { setModalOpen(false); setEditLead(null); };
  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    await deleteLead.mutateAsync(deleteId);
    setDeleteId(null);
  };
  const handleExport = () => leadsApi.exportCSV({
    status: filters.status || undefined,
    source: filters.source || undefined,
    search: debouncedSearch || undefined,
  });

  const hasActiveFilters = !!(filters.status || filters.source || debouncedSearch);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">Leads</h1>
            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
              isAdmin
                ? 'bg-purple-500/10 text-purple-400 border-purple-500/25'
                : 'bg-sky-500/10 text-sky-400 border-sky-500/25'
            }`}>
              {isAdmin ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
              {isAdmin ? 'Admin — all leads visible' : 'Sales — your leads only'}
            </span>
          </div>
          <p className="text-[var(--text-muted)] text-sm mt-0.5">
            {meta
              ? isAdmin
                ? `${meta.total} total leads across all reps`
                : `${meta.total} leads you created`
              : 'Manage your sales pipeline'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExport} className="btn-ghost flex items-center gap-2 border border-[var(--border)]">
            <Download className="w-4 h-4" />
            <span className="hidden sm:block">Export CSV</span>
          </button>
          <button onClick={handleNewLead} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:block">New Lead</span>
          </button>
        </div>
      </div>

      {/* Role notice */}
      {!isAdmin ? (
        <div className="flex items-center gap-2 px-4 py-2.5 mb-4 rounded-lg bg-sky-500/8 border border-sky-500/20 text-xs text-sky-300">
          <Lock className="w-3.5 h-3.5 flex-shrink-0" />
          You can <strong className="mx-0.5">edit</strong> your own leads but <strong className="mx-0.5">cannot delete</strong> any lead. Click a lead to view its full details.
        </div>
      ) : (
        <div className="flex items-center gap-2 px-4 py-2.5 mb-4 rounded-lg bg-purple-500/8 border border-purple-500/20 text-xs text-purple-300">
          <Shield className="w-3.5 h-3.5 flex-shrink-0" />
          Admin view: all team leads visible. You can edit or delete any lead. Click a row to view full details.
        </div>
      )}

      {/* Filters */}
      <div className="card p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="input-base pl-9"
              placeholder="Search by name or email…"
            />
            {isFetching && debouncedSearch && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2"><Spinner size="sm" /></div>
            )}
          </div>
          <div className="relative">
            <select value={filters.status || ''} onChange={(e) => updateFilter('status', (e.target.value as LeadStatus) || undefined)}
              className="input-base pr-8 appearance-none min-w-[130px] cursor-pointer">
              <option value="">All Status</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)] pointer-events-none" />
          </div>
          <div className="relative">
            <select value={filters.source || ''} onChange={(e) => updateFilter('source', (e.target.value as LeadSource) || undefined)}
              className="input-base pr-8 appearance-none min-w-[130px] cursor-pointer">
              <option value="">All Sources</option>
              {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)] pointer-events-none" />
          </div>
          <button onClick={() => updateFilter('sort', filters.sort === 'latest' ? 'oldest' : 'latest')}
            className="btn-ghost flex items-center gap-2 border border-[var(--border)] min-w-[110px]">
            <ArrowUpDown className="w-3.5 h-3.5" />
            {filters.sort === 'latest' ? 'Latest' : 'Oldest'}
          </button>
          {hasActiveFilters && (
            <button onClick={() => { setFilters({ sort: 'latest', page: 1 }); setSearchInput(''); }}
              className="text-xs text-[var(--accent)] hover:underline flex items-center gap-1">
              <Filter className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20"><Spinner size="lg" /></div>
        ) : leads.length === 0 ? (
          <EmptyState
            title={hasActiveFilters ? 'No results found' : 'No leads yet'}
            description={hasActiveFilters ? 'Try adjusting your filters or search query.' : 'Create your first lead to get started.'}
            hasSearch={hasActiveFilters}
            action={!hasActiveFilters ? (
              <button onClick={handleNewLead} className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add First Lead
              </button>
            ) : undefined}
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--bg-muted)]/50">
                    <th className="text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider px-5 py-3">Lead</th>
                    <th className="text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider px-4 py-3">Status</th>
                    <th className="text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider px-4 py-3">Source</th>
                    {isAdmin ? (
                      <th className="text-left text-xs font-medium text-purple-400 uppercase tracking-wider px-4 py-3">
                        Created By <span className="normal-case text-[10px] opacity-60">(admin)</span>
                      </th>
                    ) : (
                      <th className="text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider px-4 py-3">Added</th>
                    )}
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {leads.map((lead, i) => (
                    <LeadTableRow
                      key={lead._id}
                      lead={lead}
                      isAdmin={isAdmin}
                      userId={user?.id ?? ''}
                      index={i}
                      onEdit={handleEdit}
                      onDelete={setDeleteId}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-[var(--border)]">
              {leads.map((lead) => (
                <LeadMobileCard
                  key={lead._id}
                  lead={lead}
                  isAdmin={isAdmin}
                  userId={user?.id ?? ''}
                  onEdit={handleEdit}
                  onDelete={setDeleteId}
                />
              ))}
            </div>

            {meta && (
              <Pagination meta={meta} onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))} />
            )}
          </>
        )}
      </div>

      <LeadFormModal isOpen={modalOpen} onClose={handleCloseModal} lead={editLead} />
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Lead"
        message="Are you sure you want to permanently delete this lead? This cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={deleteLead.isPending}
      />
    </div>
  );
};
