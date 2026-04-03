import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from './store/useAppStore';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Insights } from './pages/Insights';

const pages: Record<string, JSX.Element> = {
  dashboard: <Dashboard />,
  transactions: <Transactions />,
  insights: <Insights />,
};

export default function App() {
  const { activeView, theme, isMobileMenuOpen, setMobileMenuOpen } = useAppStore();

  // Sync theme class on mount
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: 'var(--color-bg-base)' }}
    >
      {/* Sidebar — hidden on mobile, shown on md+ */}
      <div className="hidden md:flex md:w-56 lg:w-60 flex-shrink-0 flex-col h-full z-10">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-white md:hidden shadow-2xl"
              style={{ background: 'var(--color-bg-base)' }}
            >
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          {pages[activeView] ?? <Dashboard />}
        </main>
      </div>
    </div>
  );
}
