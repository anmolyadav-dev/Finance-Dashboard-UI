import React from 'react';
import { formatCurrency } from '../utils';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  subtitle?: string;
  variant?: 'default' | 'income' | 'expense';
  icon: React.ReactNode;
  delay?: number;
}

export function StatCard({ title, value, subtitle, variant = 'default', icon, delay = 0 }: StatCardProps) {
  const colorMap = {
    default: { text: 'var(--color-primary)', bg: 'var(--color-primary-soft)', arrow: <Minus size={14} /> },
    income: { text: 'var(--color-profit)', bg: 'rgba(21,154,111,0.12)', arrow: <ArrowUpRight size={14} /> },
    expense: { text: 'var(--color-loss)', bg: 'rgba(194,65,65,0.12)', arrow: <ArrowDownRight size={14} /> },
  };
  const c = colorMap[variant];

  return (
    <div
      className="card p-5 animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: c.bg, color: c.text }}
        >
          {icon}
        </div>
        <span
          className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full"
          style={{ background: c.bg, color: c.text }}
        >
          {c.arrow} Live
        </span>
      </div>
      <div>
        <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>{title}</p>
        <p className="text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
          {formatCurrency(value)}
        </p>
        {subtitle && (
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>{subtitle}</p>
        )}
      </div>
    </div>
  );
}
