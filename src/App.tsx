import { useEffect } from 'react';
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
  const { activeView, theme } = useAppStore();

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
      <div className="hidden md:flex md:w-56 lg:w-60 flex-shrink-0 flex-col h-full">
        <Sidebar />
      </div>

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
