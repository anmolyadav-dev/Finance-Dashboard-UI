import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { StatCard } from '../components/StatCard';
import { getTotals, getMonthlySummaries, getCategoryBreakdown, formatCurrency } from '../utils';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

const CHART_COLORS_LIGHT = ['#2F3A8F', '#C8A951', '#159A6F', '#6D5BD0', '#E87040', '#0EA5E9', '#A855F7'];
const CHART_COLORS_DARK  = ['#5B6CFF', '#E6C36A', '#22C55E', '#A78BFA', '#FB923C', '#38BDF8', '#C084FC'];

function useChartColors() {
  const theme = useAppStore((s) => s.theme);
  return theme === 'dark' ? CHART_COLORS_DARK : CHART_COLORS_LIGHT;
}

interface TooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card !rounded-lg p-3 shadow-xl text-xs">
      <p className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span style={{ color: 'var(--color-text-secondary)' }}>{p.name}</span>
          <span className="font-bold" style={{ color: p.color }}>{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

function PieTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card !rounded-lg p-2.5 shadow-xl text-xs">
      <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{payload[0].name}</p>
      <p style={{ color: payload[0].color }}>{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

export function Dashboard() {
  const transactions = useAppStore((s) => s.transactions);
  const colors = useChartColors();

  const totals = useMemo(() => getTotals(transactions), [transactions]);
  const monthlySummaries = useMemo(() => getMonthlySummaries(transactions).slice(-6), [transactions]);
  const categoryBreakdown = useMemo(() => getCategoryBreakdown(transactions).slice(0, 7), [transactions]);
  const recentTxs = useMemo(() => transactions.slice(0, 5), [transactions]);

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Balance"
          value={totals.balance}
          subtitle="Net position across all accounts"
          variant="default"
          icon={<Wallet size={18} />}
          delay={0}
        />
        <StatCard
          title="Total Income"
          value={totals.income}
          subtitle="All-time income received"
          variant="income"
          icon={<TrendingUp size={18} />}
          delay={60}
        />
        <StatCard
          title="Total Expenses"
          value={totals.expenses}
          subtitle="All-time expenses paid"
          variant="expense"
          icon={<TrendingDown size={18} />}
          delay={120}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Area Chart */}
        <div className="card p-5 lg:col-span-2 animate-fade-up" style={{ animationDelay: '180ms' }}>
          <div className="mb-4">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>Balance Trend</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>Monthly income vs expenses</p>
          </div>
          {monthlySummaries.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlySummaries} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors[2]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={colors[2]} stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C24141" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#C24141" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="income" name="Income" stroke={colors[2]} strokeWidth={2} fill="url(#incomeGrad)" />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#C24141" strokeWidth={2} fill="url(#expenseGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart */}
        <div className="card p-5 animate-fade-up" style={{ animationDelay: '240ms' }}>
          <div className="mb-4">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>Spending Breakdown</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>By category</p>
          </div>
          {categoryBreakdown.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              No expense data
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryBreakdown.map((_, i) => (
                    <Cell key={i} fill={colors[i % colors.length]} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(val) => <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card p-5 animate-fade-up" style={{ animationDelay: '300ms' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>Recent Transactions</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>Last 5 transactions</p>
          </div>
          <button
            className="btn-ghost text-xs !py-1.5"
            onClick={() => useAppStore.getState().setActiveView('transactions')}
          >
            View All
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {recentTxs.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg transition-colors" style={{ background: 'var(--color-bg-base)' }}>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{tx.description}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{tx.category}</p>
              </div>
              <div className="text-right">
                <p
                  className="text-sm font-semibold"
                  style={{ color: tx.type === 'income' ? 'var(--color-profit)' : 'var(--color-loss)' }}
                >
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </p>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{tx.date}</p>
              </div>
            </div>
          ))}
          {recentTxs.length === 0 && (
            <p className="text-sm text-center py-8" style={{ color: 'var(--color-text-secondary)' }}>No transactions yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
