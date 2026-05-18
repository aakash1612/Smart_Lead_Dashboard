import { useQuery } from '@tanstack/react-query';
import {
  Users, TrendingUp, UserCheck, UserX, Zap,
  ArrowUpRight, Shield, User, Lock,
} from 'lucide-react';
import { leadsApi } from '@/api/leads';
import { useAuthStore } from '@/store/authStore';
import { Lead, LeadStatus } from '@/types';
import { StatusBadge, SourceBadge } from '@/components/StatusBadge';
import { PageLoader } from '@/components/Spinner';
import { formatRelativeTime } from '@/utils';
import { Link } from 'react-router-dom';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  change?: string;
  subtext?: string;
}

const StatCard = ({ label, value, icon: Icon, color, bgColor, change, subtext }: StatCardProps) => (
  <div className="card p-5 hover:shadow-md transition-shadow animate-slide-up">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-10 h-10 rounded-xl ${bgColor} flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      {change && (
        <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
          {change}
        </span>
      )}
    </div>
    <p className="text-3xl font-display font-bold text-[var(--text-primary)] mb-0.5">{value}</p>
    <p className="text-sm text-[var(--text-muted)]">{label}</p>
    {subtext && <p className="text-xs text-[var(--text-muted)] mt-1 italic">{subtext}</p>}
  </div>
);

const statusStats = (leads: Lead[]) => {
  const counts: Record<LeadStatus, number> = { New: 0, Contacted: 0, Qualified: 0, Lost: 0 };
  leads.forEach((l) => counts[l.status]++);
  return counts;
};

export const DashboardPage = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-leads', user?.role],
    queryFn: () => leadsApi.getLeads({ limit: 100 } as any),
    staleTime: 60_000,
  });

  const { data: recentData, isLoading: recentLoading } = useQuery({
    queryKey: ['dashboard-recent', user?.role],
    queryFn: () => leadsApi.getLeads({ sort: 'latest', page: 1 } as any),
    staleTime: 30_000,
  });

  if (isLoading) return <PageLoader />;

  const leads = (data?.data as Lead[]) || [];
  const recentLeads = (recentData?.data as Lead[]) || [];
  const stats = statusStats(leads);
  const total = data?.meta?.total || leads.length;
  const conversionRate = total > 0 ? Math.round((stats.Qualified / total) * 100) : 0;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">
            Good {greeting}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">
            {isAdmin
              ? 'You have full access to all leads and team activity.'
              : 'Showing stats for your leads only.'}
          </p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
          isAdmin
            ? 'bg-purple-500/10 text-purple-400 border-purple-500/25'
            : 'bg-sky-500/10 text-sky-400 border-sky-500/25'
        }`}>
          {isAdmin ? <Shield className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
          {isAdmin ? 'Admin' : 'Sales User'}
        </div>
      </div>

      {/* Role-scoping notice */}
      {!isAdmin ? (
        <div className="flex items-center gap-2.5 px-4 py-3 mb-6 rounded-lg bg-sky-500/8 border border-sky-500/20 text-sm text-sky-300">
          <Lock className="w-4 h-4 flex-shrink-0" />
          <span>
            You're in <strong>Sales mode</strong> — you can view, create, and edit <strong>your own leads only</strong>. Deleting leads requires Admin access.
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2.5 px-4 py-3 mb-6 rounded-lg bg-purple-500/8 border border-purple-500/20 text-sm text-purple-300">
          <Shield className="w-4 h-4 flex-shrink-0" />
          <span>
            You're in <strong>Admin mode</strong> — you can view all team leads, edit any lead, and delete leads.
          </span>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label={isAdmin ? 'Total Leads (All)' : 'Your Total Leads'}
          value={total}
          icon={Users}
          color="text-[var(--accent)]"
          bgColor="bg-[var(--accent)]/10"
          subtext={isAdmin ? 'Across all sales reps' : 'Only your leads'}
        />
        <StatCard label="Qualified" value={stats.Qualified} icon={UserCheck}
          color="text-green-400" bgColor="bg-green-500/10" change={`${conversionRate}% rate`} />
        <StatCard label="Contacted" value={stats.Contacted} icon={TrendingUp}
          color="text-yellow-400" bgColor="bg-yellow-500/10" />
        <StatCard label="Lost" value={stats.Lost} icon={UserX}
          color="text-red-400" bgColor="bg-red-500/10" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
            <div>
              <h2 className="font-display font-semibold text-[var(--text-primary)]">
                {isAdmin ? 'Recent Leads — All Users' : 'Your Recent Leads'}
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {isAdmin ? 'Latest across all sales reps' : 'Only leads you created are shown'}
              </p>
            </div>
            <Link to="/leads" className="text-xs text-[var(--accent)] hover:underline flex items-center gap-1 flex-shrink-0">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {recentLoading ? (
            <div className="p-8 flex justify-center">
              <div className="w-5 h-5 border-2 border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin" />
            </div>
          ) : recentLeads.length === 0 ? (
            <div className="p-8 text-center text-[var(--text-muted)] text-sm">No leads yet</div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {recentLeads.slice(0, 8).map((lead) => {
                const createdBy = typeof lead.createdBy === 'object' ? lead.createdBy : null;
                const isOwn = createdBy?._id === user?.id || lead.createdBy === user?.id;
                return (
                  <div key={lead._id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--bg-muted)]/50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-[var(--accent)]">{lead.name[0].toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">{lead.name}</p>
                      {isAdmin && createdBy ? (
                        <p className="text-xs text-[var(--text-muted)] truncate">
                          by <span className="text-purple-400 font-medium">{createdBy.name}</span>
                          {' · '}{lead.email}
                        </p>
                      ) : (
                        <p className="text-xs text-[var(--text-muted)] truncate">{lead.email}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <StatusBadge status={lead.status} />
                      {!isAdmin && isOwn && (
                        <span className="text-[10px] text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20">yours</span>
                      )}
                      <span className="text-xs text-[var(--text-muted)] hidden sm:block">{formatRelativeTime(lead.createdAt)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Status Breakdown */}
          <div className="card p-5">
            <h2 className="font-display font-semibold text-[var(--text-primary)] mb-4">Status Breakdown</h2>
            <div className="space-y-3">
              {([
                { status: 'New', count: stats.New, color: 'bg-blue-400' },
                { status: 'Contacted', count: stats.Contacted, color: 'bg-yellow-400' },
                { status: 'Qualified', count: stats.Qualified, color: 'bg-green-400' },
                { status: 'Lost', count: stats.Lost, color: 'bg-red-400' },
              ] as const).map(({ status, count, color }) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-[var(--text-secondary)]">{status}</span>
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        {count} <span className="text-[var(--text-muted)] font-normal text-xs">({pct}%)</span>
                      </span>
                    </div>
                    <div className="h-1.5 bg-[var(--bg-muted)] rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 pt-4 border-t border-[var(--border)] flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                <Zap className="w-4 h-4 text-[var(--accent)]" />
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)]">Conversion Rate</p>
                <p className="text-lg font-display font-bold text-[var(--text-primary)]">{conversionRate}%</p>
              </div>
            </div>
          </div>

          {/* Permissions card */}
          <div className="card p-5">
            <h2 className="font-display font-semibold text-[var(--text-primary)] mb-3">Your Permissions</h2>
            <div className="space-y-2">
              {[
                { label: 'View leads', allowed: true, note: isAdmin ? 'All users' : 'Yours only' },
                { label: 'Create leads', allowed: true },
                { label: 'Edit leads', allowed: true, note: isAdmin ? 'Any lead' : 'Yours only' },
                { label: 'Delete leads', allowed: isAdmin, note: isAdmin ? 'Any lead' : 'Admin only' },
                { label: 'Export CSV', allowed: true, note: isAdmin ? 'All data' : 'Your data' },
              ].map(({ label, allowed, note }) => (
                <div key={label} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${allowed ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                      {allowed ? '✓' : '✗'}
                    </div>
                    <span className={`text-sm ${allowed ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)] line-through'}`}>{label}</span>
                  </div>
                  {note && (
                    <span className={`text-[10px] px-2 py-0.5 rounded ${allowed ? 'text-[var(--text-muted)] bg-[var(--bg-muted)]' : 'text-red-400 bg-red-500/10'}`}>{note}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Source breakdown — admin only bonus */}
            {isAdmin && (
              <div className="mt-4 pt-4 border-t border-[var(--border)]">
                <p className="text-xs font-medium text-[var(--text-muted)] mb-2 uppercase tracking-wider">Source Breakdown</p>
                <div className="space-y-1.5">
                  {(['Website', 'Instagram', 'Referral'] as const).map((src) => {
                    const count = leads.filter((l) => l.source === src).length;
                    return (
                      <div key={src} className="flex items-center justify-between">
                        <SourceBadge source={src} />
                        <span className="text-sm font-medium text-[var(--text-primary)]">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
