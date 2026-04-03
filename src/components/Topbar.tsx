import { useAppStore } from '../store/useAppStore';
import { Bell, Search } from 'lucide-react';
import { formatDate } from '../utils';

const titles: Record<string, string> = {
  dashboard: 'Dashboard',
  transactions: 'Transactions',
  insights: 'Insights',
};

export function Topbar() {
  const { activeView, role } = useAppStore();
  const today = formatDate(new Date().toISOString().split('T')[0]);

  return (
    <header
      className="flex items-center justify-between px-6 py-4"
      style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-card)' }}
    >
      <div>
        <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
          {titles[activeView]}
        </h1>
        <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{today}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-secondary)' }} />
          <input
            className="input !w-52 pl-9 text-xs"
            placeholder="Quick search..."
            readOnly
            onClick={() => useAppStore.getState().setActiveView('transactions')}
          />
        </div>

        <button className="p-2 rounded-xl relative btn-ghost !px-2 !py-2">
          <Bell size={17} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: 'var(--color-gold)' }} />
        </button>

        <div className="flex items-center gap-2 pl-2" style={{ borderLeft: '1px solid var(--color-border)' }}>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold uppercase"
            style={{ background: role === 'admin' ? 'var(--color-primary)' : 'var(--color-chart-emerald)' }}
          >
            {role === 'admin' ? 'A' : 'V'}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold leading-tight" style={{ color: 'var(--color-text-primary)' }}>
              {role === 'admin' ? 'Admin User' : 'View Only'}
            </p>
            <p className="text-xs" style={{ color: role === 'admin' ? 'var(--color-primary)' : 'var(--color-chart-emerald)' }}>
              {role.toUpperCase()}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
