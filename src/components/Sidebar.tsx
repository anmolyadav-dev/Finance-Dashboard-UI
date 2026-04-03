import { useAppStore } from '../store/useAppStore';
import {
  LayoutDashboard, ArrowLeftRight, Lightbulb,
  Sun, Moon, ShieldCheck, Eye,
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={17} /> },
  { id: 'transactions', label: 'Transactions', icon: <ArrowLeftRight size={17} /> },
  { id: 'insights', label: 'Insights', icon: <Lightbulb size={17} /> },
];

export function Sidebar() {
  const { activeView, setActiveView, theme, setTheme, role, setRole } = useAppStore();

  return (
    <aside
      className="flex flex-col h-full py-5 px-3 gap-2"
      style={{ borderRight: '1px solid var(--color-border)', background: 'var(--color-bg-card)' }}
    >
      {/* Logo */}
      <div className="px-3 mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold"
            style={{ background: 'var(--color-primary)' }}
          >
            Z
          </div>
          <span className="font-bold text-base tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
            Zorvyn
          </span>
        </div>
        <p className="text-xs mt-0.5 pl-10" style={{ color: 'var(--color-gold)' }}>Finance</p>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        <p className="text-xs font-semibold uppercase tracking-widest px-3 mb-2" style={{ color: 'var(--color-text-secondary)' }}>
          Menu
        </p>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`sidebar-link ${activeView === item.id ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom controls */}
      <div className="flex flex-col gap-2 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
        {/* Role switcher */}
        <div className="px-1">
          <p className="text-xs font-semibold uppercase tracking-widest px-2 mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Role</p>
          <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
            {(['viewer', 'admin'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold transition-all`}
                style={{
                  background: role === r ? 'var(--color-primary)' : 'transparent',
                  color: role === r ? '#fff' : 'var(--color-text-secondary)',
                }}
              >
                {r === 'admin' ? <ShieldCheck size={12} /> : <Eye size={12} />}
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="sidebar-link"
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>
    </aside>
  );
}
