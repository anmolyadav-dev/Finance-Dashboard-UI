import { motion, AnimatePresence } from 'framer-motion';
import type { Transaction } from '../types';
import { formatCurrency, formatDate } from '../utils';
import { Pencil, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  transaction: Transaction;
  isAdmin: boolean;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
  index: number;
}

const categoryColors: Record<string, string> = {
  Salary:          '#2F3A8F',
  Freelance:       '#6D5BD0',
  Investment:      '#C8A951',
  'Food & Dining': '#E87040',
  Shopping:        '#D4567F',
  Transport:       '#0EA5E9',
  Entertainment:   '#A855F7',
  Healthcare:      '#14B8A6',
  Utilities:       '#64748B',
  Rent:            '#F59E0B',
  Education:       '#10B981',
  Travel:          '#EF4444',
};

export function TransactionRow({ transaction, isAdmin, onEdit, onDelete, index }: Props) {
  const isIncome = transaction.type === 'income';
  const color = categoryColors[transaction.category] ?? '#94A3B8';

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.025, ease: 'easeOut' }}
      className="group"
      style={{ borderBottom: '1px solid var(--color-border)' }}
    >
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-sm"
            style={{ background: color }}
          >
            {isIncome ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              {transaction.description}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
              {transaction.category}
            </p>
          </div>
        </div>
      </td>

      <td className="py-3.5 px-4 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
        {formatDate(transaction.date)}
      </td>

      <td className="py-3.5 px-4">
        <span className={`badge ${isIncome ? 'badge-income' : 'badge-expense'}`}>
          {transaction.type}
        </span>
      </td>

      <td className="py-3.5 px-4 text-right">
        <span
          className="text-sm font-bold"
          style={{ color: isIncome ? 'var(--color-profit)' : 'var(--color-loss)' }}
        >
          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
        </span>
      </td>

      {isAdmin && (
        <td className="py-3.5 px-4 text-right">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onEdit(transaction)}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: 'var(--color-primary)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-primary-soft)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <Pencil size={13} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(transaction.id)}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: 'var(--color-loss)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(194,65,65,0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <Trash2 size={13} />
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </td>
      )}
    </motion.tr>
  );
}
