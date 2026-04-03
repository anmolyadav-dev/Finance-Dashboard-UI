export type Role = 'viewer' | 'admin';

export interface Transaction {
  id: string;
  date: string; // ISO date string
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}

export interface MonthlySummary {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}
