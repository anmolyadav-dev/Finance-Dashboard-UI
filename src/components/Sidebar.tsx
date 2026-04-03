import { useAppStore } from '../store/useAppStore';
import {
  LayoutDashboard, ArrowLeftRight, Lightbulb,
  Sun, Moon, ShieldCheck, Eye,
} from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { id: 'dashboard',    label: 'Dashboard',    icon: <LayoutDashboard size={16} /> },
  { id: 'transactions', label: 'Transactions', icon: <ArrowLeftRight size={16} /> },
  { id: 'insights',     label: 'Insights',     icon: <Lightbulb size={16} /> },
];

export function Sidebar() {
  const { activeView, setActiveView, theme, setTheme, role, setRole } = useAppStore();

  return (
    <aside
      className="flex flex-col h-full py-6 px-3 gap-2"
      style={{
        borderRight: '1px solid var(--color-border)',
        background: 'var(--color-bg-card)',
      }}
    >
      {/* Logo */}
      <div className="px-3 mb-6">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-2xl flex items-center justify-center text-white text-sm font-extrabold shadow-lg"
            style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))' }}
          >
            Z
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight block" style={{ color: 'var(--color-text-primary)' }}>
              Zorvyn
            </span>
            <span className="text-[0.65rem] font-semibold tracking-widest uppercase" style={{ color: 'var(--color-gold)' }}>Finance</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        <p className="text-[0.65rem] font-bold uppercase tracking-widest px-3 mb-2" style={{ color: 'var(--color-text-secondary)' }}>
          Navigation
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
      <div className="flex flex-col gap-3 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
        {/* Role switcher */}
        <div className="px-1">
          <p className="text-[0.65rem] font-bold uppercase tracking-widest px-2 mb-2" style={{ color: 'var(--color-text-secondary)' }}>
            Role
          </p>
          <div className="flex rounded-xl overflow-hidden gap-1 p-1" style={{ background: 'var(--color-bg-base)', border: '1px solid var(--color-border)' }}>
            {(['viewer', 'admin'] as const).map((r) => (
              <motion.button
                key={r}
                onClick={() => setRole(r)}
                whileTap={{ scale: 0.96 }}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200"
                style={{
                  background: role === r
                    ? 'linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))'
                    : 'transparent',
                  color: role === r ? '#fff' : 'var(--color-text-secondary)',
                  boxShadow: role === r ? '0 2px 8px -2px rgba(47,58,143,0.4)' : 'none',
                }}
              >
                {r === 'admin' ? <ShieldCheck size={11} /> : <Eye size={11} />}
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Theme toggle */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="sidebar-link"
        >
          <motion.div
            animate={{ rotate: theme === 'dark' ? 0 : 180 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </motion.div>
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </motion.button>
      </div>
    </aside>
  );
}
