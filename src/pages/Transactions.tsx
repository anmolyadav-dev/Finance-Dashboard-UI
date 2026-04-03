import { useMemo, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { TransactionRow } from '../components/TransactionRow';
import { TransactionModal } from '../components/TransactionModal';
import type { Transaction } from '../types';
import { categories } from '../data/mockData';
import { exportToCSV, exportToJSON } from '../utils';
import { Plus, Search, SortAsc, SortDesc, Download } from 'lucide-react';

export function Transactions() {
  const { transactions, role, filters, setFilter, addTransaction, updateTransaction, deleteTransaction } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Transaction | null>(null);
  const isAdmin = role === 'admin';

  const filtered = useMemo(() => {
    let txs = [...transactions];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      txs = txs.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }
    if (filters.type !== 'all') txs = txs.filter((t) => t.type === filters.type);
    if (filters.category !== 'all') txs = txs.filter((t) => t.category === filters.category);

    txs.sort((a, b) => {
      const dir = filters.sortDir === 'asc' ? 1 : -1;
      if (filters.sortBy === 'date') {
        return dir * (new Date(a.date).getTime() - new Date(b.date).getTime());
      }
      return dir * (a.amount - b.amount);
    });
    return txs;
  }, [transactions, filters]);

  const handleEdit = (tx: Transaction) => {
    setEditTarget(tx);
    setModalOpen(true);
  };

  const handleSave = (tx: Omit<Transaction, 'id'> | Transaction) => {
    if ('id' in tx) {
      updateTransaction(tx.id, tx);
    } else {
      addTransaction(tx);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this transaction?')) deleteTransaction(id);
  };

  const toggleSort = (key: 'date' | 'amount') => {
    if (filters.sortBy === key) {
      setFilter('sortDir', filters.sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setFilter('sortBy', key);
      setFilter('sortDir', 'desc');
    }
  };

  return (
    <div className="p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-bold text-lg" style={{ color: 'var(--color-text-primary)' }}>All Transactions</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
            {filtered.length} of {transactions.length} shown
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Export buttons */}
          <div className="flex gap-1">
            <button className="btn-ghost !text-xs !py-1.5 !px-3 gap-1" onClick={() => exportToCSV(filtered)}>
              <Download size={12} /> CSV
            </button>
            <button className="btn-ghost !text-xs !py-1.5 !px-3 gap-1" onClick={() => exportToJSON(filtered)}>
              <Download size={12} /> JSON
            </button>
          </div>
          {isAdmin && (
            <button
              className="btn-primary !text-xs"
              onClick={() => { setEditTarget(null); setModalOpen(true); }}
            >
              <Plus size={14} /> Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-40">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-secondary)' }} />
          <input
            className="input pl-9 !text-xs"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
          />
        </div>
        <select
          className="input !w-auto !text-xs min-w-32"
          value={filters.type}
          onChange={(e) => setFilter('type', e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select
          className="input !w-auto !text-xs min-w-40"
          value={filters.category}
          onChange={(e) => setFilter('category', e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden animate-fade-up">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="text-4xl">🔍</div>
            <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>No transactions found</p>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Try adjusting your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-base)' }}>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>
                    Description
                  </th>
                  <th
                    className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider cursor-pointer select-none hover:opacity-70 transition-opacity"
                    style={{ color: 'var(--color-text-secondary)' }}
                    onClick={() => toggleSort('date')}
                  >
                    <span className="flex items-center gap-1">
                      Date {filters.sortBy === 'date' ? (filters.sortDir === 'asc' ? <SortAsc size={12} /> : <SortDesc size={12} />) : null}
                    </span>
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>
                    Type
                  </th>
                  <th
                    className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider cursor-pointer select-none hover:opacity-70 transition-opacity"
                    style={{ color: 'var(--color-text-secondary)' }}
                    onClick={() => toggleSort('amount')}
                  >
                    <span className="flex items-center justify-end gap-1">
                      Amount {filters.sortBy === 'amount' ? (filters.sortDir === 'asc' ? <SortAsc size={12} /> : <SortDesc size={12} />) : null}
                    </span>
                  </th>
                  {isAdmin && (
                    <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((tx) => (
                  <TransactionRow
                    key={tx.id}
                    transaction={tx}
                    isAdmin={isAdmin}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <TransactionModal
          initial={editTarget}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditTarget(null); }}
        />
      )}
    </div>
  );
}
