import type { Transaction, MonthlySummary } from '../types';
import { format, parseISO, startOfMonth } from 'date-fns';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'dd MMM yyyy');
}

export function getMonthlySummaries(transactions: Transaction[]): MonthlySummary[] {
  const map = new Map<string, { income: number; expenses: number }>();

  transactions.forEach((tx) => {
    const key = format(startOfMonth(parseISO(tx.date)), 'MMM yyyy');
    const existing = map.get(key) ?? { income: 0, expenses: 0 };
    if (tx.type === 'income') existing.income += tx.amount;
    else existing.expenses += tx.amount;
    map.set(key, existing);
  });

  return Array.from(map.entries())
    .map(([month, { income, expenses }]) => ({
      month,
      income,
      expenses,
      balance: income - expenses,
    }))
    .reverse();
}

export function getCategoryBreakdown(transactions: Transaction[]) {
  const map = new Map<string, number>();
  transactions
    .filter((tx) => tx.type === 'expense')
    .forEach((tx) => {
      map.set(tx.category, (map.get(tx.category) ?? 0) + tx.amount);
    });
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function getTotals(transactions: Transaction[]) {
  const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  return { income, expenses, balance: income - expenses };
}

export function exportToCSV(transactions: Transaction[]) {
  const header = 'Date,Description,Category,Type,Amount\n';
  const rows = transactions
    .map((t) => `${t.date},"${t.description}",${t.category},${t.type},${t.amount}`)
    .join('\n');
  const blob = new Blob([header + rows], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'zorvyn-transactions.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToJSON(transactions: Transaction[]) {
  const blob = new Blob([JSON.stringify(transactions, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'zorvyn-transactions.json';
  a.click();
  URL.revokeObjectURL(url);
}
