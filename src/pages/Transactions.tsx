import { useMemo, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { TransactionRow } from '../components/TransactionRow';
import { TransactionModal } from '../components/TransactionModal';
import type { Transaction } from '../types';
import { categories } from '../data/mockData';
import { exportToCSV, exportToJSON } from '../utils';
import { Plus, Search, SortAsc, SortDesc, Download, X } from 'lucide-react';
import { EmptyState } from './Dashboard';

// ── Debounce hook ──────────────────────────────────────────────────────────────
function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function Transactions() {
  const { transactions, role, filters, setFilter, addTransaction, updateTransaction, deleteTransaction } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Transaction | null>(null);
  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedSearch = useDebounce(searchInput, 280);
  const isAdmin = role === 'admin';

  // Sync debounced value into store
  useEffect(() => { setFilter('search', debouncedSearch); }, [debouncedSearch, setFilter]);

  const openAdd = useCallback(() => { setEditTarget(null); setModalOpen(true); }, []);

  const activeFilters: { key: string; label: string }[] = [];
  if (filters.type !== 'all') activeFilters.push({ key: 'type', label: `Type: ${filters.type}` });
  if (filters.category !== 'all') activeFilters.push({ key: 'category', label: `Category: ${filters.category}` });
  if (filters.search) activeFilters.push({ key: 'search', label: `"${filters.search}"` });

  const clearFilter = (key: string) => {
    if (key === 'search') { setSearchInput(''); setFilter('search', ''); }
    else setFilter(key, 'all');
  };

  const filtered = useMemo(() => {
    let txs = [...transactions];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      txs = txs.filter((t) => t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
    }
    if (filters.type !== 'all') txs = txs.filter((t) => t.type === filters.type);
    if (filters.category !== 'all') txs = txs.filter((t) => t.category === filters.category);
    txs.sort((a, b) => {
      const dir = filters.sortDir === 'asc' ? 1 : -1;
      if (filters.sortBy === 'date') return dir * (new Date(a.date).getTime() - new Date(b.date).getTime());
      return dir * (a.amount - b.amount);
    });
    return txs;
  }, [transactions, filters]);

  const handleEdit = (tx: Transaction) => { setEditTarget(tx); setModalOpen(true); };
  const handleSave = (tx: Omit<Transaction, 'id'> | Transaction) => {
    if ('id' in tx) updateTransaction(tx.id, tx);
    else addTransaction(tx);
  };
  const handleDelete = (id: string) => { if (confirm('Delete this transaction?')) deleteTransaction(id); };
  const toggleSort = (key: 'date' | 'amount') => {
    if (filters.sortBy === key) setFilter('sortDir', filters.sortDir === 'asc' ? 'desc' : 'asc');
    else { setFilter('sortBy', key); setFilter('sortDir', 'desc'); }
  };

  return (
    <div className="p-6 flex flex-col gap-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-extrabold text-xl" style={{ color: 'var(--color-text-primary)' }}>All Transactions</h2>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>{filtered.length}</span> of {transactions.length} shown
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button className="btn-ghost !text-xs !py-1.5 !px-3" onClick={() => exportToCSV(filtered)}><Download size={12} /> CSV</button>
          <button className="btn-ghost !text-xs !py-1.5 !px-3" onClick={() => exportToJSON(filtered)}><Download size={12} /> JSON</button>
          {isAdmin && (
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="btn-primary !text-xs" onClick={openAdd}>
              <Plus size={14} /> Add Transaction
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Sticky filter bar */}
      <div
        className="card p-4 flex flex-wrap gap-3"
        style={{ position: 'sticky', top: 0, zIndex: 10, backdropFilter: 'blur(12px)', background: 'var(--color-bg-card)' }}
      >
        <div className="relative flex-1 min-w-40">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-text-secondary)' }} />
          <input
            className="input pl-9 !text-xs relative"
            placeholder="Search transactions..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <select className="input !w-auto !text-xs min-w-32" value={filters.type} onChange={(e) => setFilter('type', e.target.value)}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select className="input !w-auto !text-xs min-w-40" value={filters.category} onChange={(e) => setFilter('category', e.target.value)}>
          {categories.map((c) => (
            <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>
          ))}
        </select>
      </div>

      {/* Active filter chips */}
      <AnimatePresence>
        {activeFilters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 -mt-2"
          >
            {activeFilters.map((f) => (
              <motion.span
                key={f.key}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                className="filter-chip"
              >
                {f.label}
                <button onClick={() => clearFilter(f.key)}>
                  <X size={11} />
                </button>
              </motion.span>
            ))}
            <button
              className="text-xs underline"
              style={{ color: 'var(--color-text-secondary)' }}
              onClick={() => { setSearchInput(''); setFilter('search', ''); setFilter('type', 'all'); setFilter('category', 'all'); }}
            >
              Clear all
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="card overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState emoji="🔍" title="No transactions found" subtitle="Try adjusting filters or clearing your search." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-base)' }}>
                  <th className="text-left py-3.5 px-4 text-[0.68rem] font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>Description</th>
                  <th
                    className="text-left py-3.5 px-4 text-[0.68rem] font-bold uppercase tracking-wider cursor-pointer hover:opacity-70 transition-opacity"
                    style={{ color: 'var(--color-text-secondary)' }}
                    onClick={() => toggleSort('date')}
                  >
                    <span className="flex items-center gap-1">
                      Date {filters.sortBy === 'date' ? (filters.sortDir === 'asc' ? <SortAsc size={12} /> : <SortDesc size={12} />) : null}
                    </span>
                  </th>
                  <th className="text-left py-3.5 px-4 text-[0.68rem] font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>Type</th>
                  <th
                    className="text-right py-3.5 px-4 text-[0.68rem] font-bold uppercase tracking-wider cursor-pointer hover:opacity-70 transition-opacity"
                    style={{ color: 'var(--color-text-secondary)' }}
                    onClick={() => toggleSort('amount')}
                  >
                    <span className="flex items-center justify-end gap-1">
                      Amount {filters.sortBy === 'amount' ? (filters.sortDir === 'asc' ? <SortAsc size={12} /> : <SortDesc size={12} />) : null}
                    </span>
                  </th>
                  {isAdmin && (
                    <th className="text-right py-3.5 px-4 text-[0.68rem] font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((tx, i) => (
                  <TransactionRow key={tx.id} transaction={tx} isAdmin={isAdmin} onEdit={handleEdit} onDelete={handleDelete} index={i} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Modal */}
      <TransactionModal initial={editTarget} onSave={handleSave} onClose={() => { setModalOpen(false); setEditTarget(null); }} open={modalOpen} />

      {/* FAB — admin only */}
      <AnimatePresence>
        {isAdmin && (
          <motion.button
            className="fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            onClick={openAdd}
            title="Add Transaction"
          >
            <Plus size={22} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
