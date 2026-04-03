import type { Transaction } from '../types';
import { formatCurrency, formatDate } from '../utils';
import { Pencil, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  transaction: Transaction;
  isAdmin: boolean;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  Salary: '#2F3A8F',
  Freelance: '#6D5BD0',
  Investment: '#C8A951',
  'Food & Dining': '#E87040',
  Shopping: '#D4567F',
  Transport: '#0EA5E9',
  Entertainment: '#A855F7',
  Healthcare: '#14B8A6',
  Utilities: '#64748B',
  Rent: '#F59E0B',
  Education: '#10B981',
  Travel: '#EF4444',
};

export function TransactionRow({ transaction, isAdmin, onEdit, onDelete }: Props) {
  const isIncome = transaction.type === 'income';
  const color = categoryColors[transaction.category] ?? '#94A3B8';

  return (
    <tr
      className="group transition-colors"
      style={{ borderBottom: '1px solid var(--color-border)' }}
    >
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white"
            style={{ background: color }}
          >
            {isIncome ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
              {transaction.description}
            </p>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
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
          className="text-sm font-semibold"
          style={{ color: isIncome ? 'var(--color-profit)' : 'var(--color-loss)' }}
        >
          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
        </span>
      </td>
      {isAdmin && (
        <td className="py-3.5 px-4 text-right">
          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(transaction)}
              className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              style={{ color: 'var(--color-primary)' }}
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => onDelete(transaction.id)}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--color-loss)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(194,65,65,0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </td>
      )}
    </tr>
  );
}
