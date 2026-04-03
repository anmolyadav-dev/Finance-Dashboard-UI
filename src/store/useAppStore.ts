import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Transaction, Role } from '../types';

import { mockTransactions } from '../data/mockData';

interface AppState {
  transactions: Transaction[];
  role: Role;
  theme: 'light' | 'dark';
  activeView: string;
  filters: {
    search: string;
    type: 'all' | 'income' | 'expense';
    category: string;
    sortBy: 'date' | 'amount';
    sortDir: 'asc' | 'desc';
  };
  setRole: (role: Role) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setActiveView: (view: string) => void;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  setFilter: (key: string, value: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      transactions: mockTransactions,
      role: 'viewer',
      theme: 'light',
      activeView: 'dashboard',
      filters: {
        search: '',
        type: 'all',
        category: 'all',
        sortBy: 'date',
        sortDir: 'desc',
      },
      setRole: (role) => set({ role }),
      setTheme: (theme) => {
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ theme });
      },
      setActiveView: (activeView) => set({ activeView }),
      addTransaction: (tx) =>
        set((s) => ({
          transactions: [
            { ...tx, id: crypto.randomUUID() },
            ...s.transactions,
          ],
        })),
      updateTransaction: (id, tx) =>
        set((s) => ({
          transactions: s.transactions.map((t) =>
            t.id === id ? { ...t, ...tx } : t
          ),
        })),
      deleteTransaction: (id) =>
        set((s) => ({
          transactions: s.transactions.filter((t) => t.id !== id),
        })),
      setFilter: (key, value) =>
        set((s) => ({ filters: { ...s.filters, [key]: value } })),
    }),
    {
      name: 'zorvyn-app',
      partialize: (s) => ({
        transactions: s.transactions,
        role: s.role,
        theme: s.theme,
      }),
    }
  )
);
