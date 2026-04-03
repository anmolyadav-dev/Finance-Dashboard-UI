import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Transaction } from '../types';
import { categories } from '../data/mockData';
import { X } from 'lucide-react';

interface Props {
  initial?: Transaction | null;
  onSave: (tx: Omit<Transaction, 'id'> | Transaction) => void;
  onClose: () => void;
  open: boolean;
}

const categoryOptions = categories.filter((c) => c !== 'all');

export function TransactionModal({ initial, onSave, onClose, open }: Props) {
  const [form, setForm] = useState<Omit<Transaction, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: 0,
    type: 'expense',
    category: 'Food & Dining',
  });

  useEffect(() => {
    if (initial) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, ...rest } = initial;
      setForm(rest);
    } else {
      setForm({ date: new Date().toISOString().split('T')[0], description: '', amount: 0, type: 'expense', category: 'Food & Dining' });
    }
  }, [initial, open]);

  const set = (key: keyof typeof form, value: string | number) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description || !form.amount || !form.date) return;
    if (initial) {
      onSave({ ...form, id: initial.id } as Transaction);
    } else {
      onSave(form);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className="modal-box"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-extrabold" style={{ color: 'var(--color-text-primary)' }}>
                  {initial ? 'Edit Transaction' : 'Add Transaction'}
                </h2>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                  {initial ? 'Update the transaction details' : 'Record a new financial activity'}
                </p>
              </div>
              <motion.button whileTap={{ scale: 0.9 }} onClick={onClose} className="btn-ghost !p-1.5 !border-0">
                <X size={18} />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--color-text-secondary)' }}>Description</label>
                <input className="input" value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="e.g. Grocery Store" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--color-text-secondary)' }}>Amount (₹)</label>
                  <input className="input" type="number" min={1} value={form.amount || ''} onChange={(e) => set('amount', Number(e.target.value))} placeholder="0" required />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--color-text-secondary)' }}>Date</label>
                  <input className="input" type="date" value={form.date} onChange={(e) => set('date', e.target.value)} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--color-text-secondary)' }}>Type</label>
                  <select className="input" value={form.type} onChange={(e) => set('type', e.target.value as 'income' | 'expense')}>
                    <option value="income">✅ Income</option>
                    <option value="expense">🔴 Expense</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--color-text-secondary)' }}>Category</label>
                  <select className="input" value={form.category} onChange={(e) => set('category', e.target.value)}>
                    {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <motion.button whileTap={{ scale: 0.97 }} type="button" onClick={onClose} className="btn-ghost flex-1 justify-center">
                  Cancel
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }} type="submit" className="btn-primary flex-1 justify-center">
                  {initial ? 'Save Changes' : 'Add Transaction'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
