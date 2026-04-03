import { useMemo } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { StatCard } from '../components/StatCard';
import { getTotals, getMonthlySummaries, getCategoryBreakdown, formatCurrency } from '../utils';
import { CategoryIcon } from '../components/CategoryIcon';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Wallet, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

const COLORS_LIGHT = ['#2F3A8F', '#C8A951', '#159A6F', '#6D5BD0', '#E87040', '#0EA5E9', '#A855F7'];
const COLORS_DARK  = ['#5B6CFF', '#E6C36A', '#22C55E', '#A78BFA', '#FB923C', '#38BDF8', '#C084FC'];

function useChartColors() {
  const theme = useAppStore((s) => s.theme);
  return theme === 'dark' ? COLORS_DARK : COLORS_LIGHT;
}

interface TooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card !rounded-xl p-3.5 shadow-2xl border text-xs" style={{ minWidth: 160 }}>
      <p className="font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4 mb-0.5">
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
    <div className="card !rounded-xl p-3 shadow-2xl text-xs">
      <p className="font-bold" style={{ color: 'var(--color-text-primary)' }}>{payload[0].name}</p>
      <p className="mt-0.5" style={{ color: payload[0].color }}>{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

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
        <StatCard title="Total Balance"  value={totals.balance}  variant="balance" icon={<Wallet size={18} />}     delay={0}   subtitle="Net position across all accounts" />
        <StatCard title="Total Income"   value={totals.income}   variant="income"  icon={<TrendingUp size={18} />}  delay={80}  subtitle="All-time income received" />
        <StatCard title="Total Expenses" value={totals.expenses} variant="expense" icon={<TrendingDown size={18} />} delay={160} subtitle="All-time expenses paid" />
      </div>

      {/* Charts row */}
      <motion.div
        variants={container} initial="hidden" animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
      >
        {/* Area Chart */}
        <motion.div variants={item} className="card card-hover p-6 lg:col-span-2">
          <div className="mb-5">
            <h3 className="font-bold text-base" style={{ color: 'var(--color-text-primary)' }}>Balance Trend</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>Monthly income vs expenses (last 6 months)</p>
          </div>
          {monthlySummaries.length === 0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={monthlySummaries} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={colors[2]} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={colors[2]} stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#C24141" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#C24141" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="income"   name="Income"   stroke={colors[2]} strokeWidth={2.5} fill="url(#incomeGrad)"  dot={false} activeDot={{ r: 5, fill: colors[2] }} />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#C24141"   strokeWidth={2.5} fill="url(#expenseGrad)" dot={false} activeDot={{ r: 5, fill: '#C24141' }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Pie Chart */}
        <motion.div variants={item} className="card card-hover p-6">
          <div className="mb-5">
            <h3 className="font-bold text-base" style={{ color: 'var(--color-text-primary)' }}>Spending Breakdown</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>By category</p>
          </div>
          {categoryBreakdown.length === 0 ? (
            <EmptyChart label="No expense data yet" />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={categoryBreakdown} cx="50%" cy="45%" innerRadius={50} outerRadius={76} paddingAngle={3} dataKey="value">
                  {categoryBreakdown.map((_, i) => (
                    <Cell key={i} fill={colors[i % colors.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend iconType="circle" iconSize={8} formatter={(val) => (
                  <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{val}</span>
                )} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="card card-hover p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-base" style={{ color: 'var(--color-text-primary)' }}>Recent Activity</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>Last 5 transactions</p>
          </div>
          <button
            className="btn-ghost text-xs !py-1.5 gap-1"
            onClick={() => useAppStore.getState().setActiveView('transactions')}
          >
            View All <ArrowRight size={12} />
          </button>
        </div>

        {recentTxs.length === 0 ? (
          <EmptyState
            emoji="💸"
            title="No transactions yet"
            subtitle="Add your first transaction to get started."
          />
        ) : (
          <div className="flex flex-col gap-2">
            {recentTxs.map((tx, i) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.38 + i * 0.05 }}
                className="flex items-center justify-between py-3 px-4 rounded-xl transition-all"
                style={{ background: 'var(--color-bg-base)' }}
              >
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{tx.description}</p>
                  <p className="text-xs mt-0.5 flex items-center gap-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                    <CategoryIcon category={tx.category} size={11} className="opacity-70" />
                    {tx.category} <span className="opacity-50">·</span> {tx.date}
                  </p>
                </div>
                <p
                  className="text-sm font-bold"
                  style={{ color: tx.type === 'income' ? 'var(--color-profit)' : 'var(--color-loss)' }}
                >
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function EmptyChart({ label = 'No data available' }: { label?: string }) {
  return (
    <div className="h-52 flex flex-col items-center justify-center gap-2 rounded-xl" style={{ background: 'var(--color-bg-base)' }}>
      <span className="text-2xl">📊</span>
      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{label}</p>
    </div>
  );
}

export function EmptyState({ emoji, title, subtitle }: { emoji: string; title: string; subtitle: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-14 gap-3"
    >
      <span className="text-4xl">{emoji}</span>
      <p className="font-bold text-base" style={{ color: 'var(--color-text-primary)' }}>{title}</p>
      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{subtitle}</p>
    </motion.div>
  );
}
