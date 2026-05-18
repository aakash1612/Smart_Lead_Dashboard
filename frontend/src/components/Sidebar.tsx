import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, Zap, Moon, Sun, Shield, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { cn } from '@/utils';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/leads', icon: Users, label: 'Leads' },
];

export const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className="w-60 flex-shrink-0 bg-[var(--bg-secondary)] border-r border-[var(--border)] flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-sm text-[var(--text-primary)] leading-none">SmartLeads</p>
            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Dashboard</p>
          </div>
        </div>
      </div>

      {/* Role banner — clearly visible below logo */}
      <div className={`mx-3 mt-3 px-3 py-2.5 rounded-lg border flex items-center gap-2.5 ${
        isAdmin
          ? 'bg-purple-500/10 border-purple-500/25'
          : 'bg-sky-500/10 border-sky-500/25'
      }`}>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isAdmin ? 'bg-purple-500/20' : 'bg-sky-500/20'
        }`}>
          {isAdmin
            ? <Shield className="w-3.5 h-3.5 text-purple-400" />
            : <User className="w-3.5 h-3.5 text-sky-400" />
          }
        </div>
        <div>
          <p className={`text-xs font-semibold ${isAdmin ? 'text-purple-300' : 'text-sky-300'}`}>
            {isAdmin ? 'Admin' : 'Sales User'}
          </p>
          <p className={`text-[10px] leading-tight ${isAdmin ? 'text-purple-400/70' : 'text-sky-400/70'}`}>
            {isAdmin ? 'Full access' : 'Limited to own leads'}
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
              isActive
                ? 'bg-[var(--accent)] text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)]'
            )}>
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Permissions quick-ref */}
      <div className="px-3 mb-3">
        <div className="rounded-lg bg-[var(--bg-muted)] px-3 py-3">
          <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider mb-2">Permissions</p>
          {[
            { label: 'View leads', ok: true, detail: isAdmin ? 'All' : 'Yours' },
            { label: 'Edit leads', ok: true, detail: isAdmin ? 'All' : 'Yours' },
            { label: 'Delete leads', ok: isAdmin, detail: isAdmin ? 'All' : 'No' },
          ].map(({ label, ok, detail }) => (
            <div key={label} className="flex items-center justify-between py-0.5">
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-bold ${ok ? 'text-green-400' : 'text-red-400'}`}>{ok ? '✓' : '✗'}</span>
                <span className={`text-[11px] ${ok ? 'text-[var(--text-muted)]' : 'text-[var(--text-muted)]/50 line-through'}`}>{label}</span>
              </div>
              <span className={`text-[10px] ${ok ? 'text-[var(--text-muted)]' : 'text-red-400/70'}`}>{detail}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-[var(--border)] space-y-1">
        <button onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)] transition-all">
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>

        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isAdmin ? 'bg-purple-500/20' : 'bg-sky-500/20'
          }`}>
            {isAdmin
              ? <Shield className="w-3.5 h-3.5 text-purple-400" />
              : <span className={`text-xs font-bold text-sky-400`}>{user?.name?.[0]?.toUpperCase()}</span>
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[var(--text-primary)] truncate">{user?.name}</p>
            <p className={`text-[10px] font-medium ${isAdmin ? 'text-purple-400' : 'text-sky-400'}`}>
              {isAdmin ? '● Admin' : '● Sales'}
            </p>
          </div>
          <button onClick={handleLogout}
            className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400 transition-colors"
            title="Logout">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
