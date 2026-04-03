import { useAppStore } from '../store/useAppStore';
import { Bell, Search, Menu } from 'lucide-react';
import { formatDate } from '../utils';
import { motion } from 'framer-motion';

const titles: Record<string, string> = {
  dashboard: 'Dashboard',
  transactions: 'Transactions',
  insights: 'Insights',
};

export function Topbar() {
  const { activeView, role, setMobileMenuOpen } = useAppStore();
  const today = formatDate(new Date().toISOString().split('T')[0]);
  const isAdmin = role === 'admin';

  return (
    <header
      className="flex items-center justify-between px-6 py-4"
      style={{
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-bg-card)',
      }}
    >
      <div className="flex items-center gap-3">
        <div className="md:hidden">
          <button 
            className="btn-ghost !p-2" 
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={20} style={{ color: 'var(--color-text-primary)' }} />
          </button>
        </div>
        <div>
          <h1 className="text-[1.35rem] font-extrabold tracking-tight leading-none" style={{ color: 'var(--color-text-primary)' }}>
            {titles[activeView]}
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>{today}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick search — only on sm+ */}
        <div className="relative hidden sm:block">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-text-secondary)' }} />
          <input
            className="input !w-48 pl-9 text-xs"
            placeholder="Quick search..."
            readOnly
            onClick={() => useAppStore.getState().setActiveView('transactions')}
          />
        </div>

        {/* Bell */}
        <motion.button whileTap={{ scale: 0.92 }} className="btn-ghost !px-2 !py-2 relative">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-gold)' }} />
        </motion.button>

        {/* Role indicator */}
        <div className="flex items-center gap-2.5 pl-3" style={{ borderLeft: '1px solid var(--color-border)' }}>
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold uppercase shadow-md"
            style={{
              background: isAdmin
                ? 'linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))'
                : 'linear-gradient(135deg, var(--color-profit), #0d9062)',
            }}
          >
            {isAdmin ? 'A' : 'V'}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-bold leading-none mb-1" style={{ color: 'var(--color-text-primary)' }}>
              {isAdmin ? 'Admin User' : 'View Only'}
            </p>
            <span
              className={`badge ${isAdmin ? 'role-badge-admin' : 'role-badge-viewer'} !text-[0.6rem] !py-0.5`}
            >
              {isAdmin ? '🔒 Admin Mode' : '👁 Viewer Mode'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
