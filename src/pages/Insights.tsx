import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { getTotals, getCategoryBreakdown, getMonthlySummaries, formatCurrency } from '../utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts';
import { Trophy, AlertCircle, TrendingDown, ArrowUp, ArrowDown } from 'lucide-react';

const COLORS_LIGHT = ['#2F3A8F', '#C8A951', '#159A6F', '#6D5BD0', '#E87040', '#0EA5E9', '#A855F7'];
const COLORS_DARK  = ['#5B6CFF', '#E6C36A', '#22C55E', '#A78BFA', '#FB923C', '#38BDF8', '#C084FC'];

interface TooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card !rounded-lg p-3 shadow-xl text-xs">
      <p className="font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex justify-between gap-4">
          <span style={{ color: 'var(--color-text-secondary)' }}>{p.name}</span>
          <span style={{ color: p.color }}>{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

function InsightCard({ icon, title, subtitle, value, color }: { icon: React.ReactNode; title: string; subtitle: string; value: string; color: string }) {
  return (
    <div className="card p-4 flex items-center gap-4 animate-fade-up">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `rgba(${color},0.12)`, color: `rgb(${color})` }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>{title}</p>
        <p className="text-sm font-bold truncate" style={{ color: 'var(--color-text-primary)' }}>{value}</p>
        <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{subtitle}</p>
      </div>
    </div>
  );
}

export function Insights() {
  const transactions = useAppStore((s) => s.transactions);
  const theme = useAppStore((s) => s.theme);
  const colors = theme === 'dark' ? COLORS_DARK : COLORS_LIGHT;

  const totals = useMemo(() => getTotals(transactions), [transactions]);
  const categoryBreakdown = useMemo(() => getCategoryBreakdown(transactions), [transactions]);
  const monthlySummaries = useMemo(() => getMonthlySummaries(transactions).slice(-6), [transactions]);

  const topCategory = categoryBreakdown[0];
  const savingsRate = totals.income > 0 ? ((totals.balance / totals.income) * 100).toFixed(1) : '0';

  // Month over month comparison
  const lastMonth = monthlySummaries[monthlySummaries.length - 1];
  const prevMonth = monthlySummaries[monthlySummaries.length - 2];
  const expenseDelta = lastMonth && prevMonth
    ? ((lastMonth.expenses - prevMonth.expenses) / prevMonth.expenses * 100).toFixed(1)
    : null;

  // Radar data
  const radarData = categoryBreakdown.slice(0, 6).map((c) => ({ category: c.name.split(' ')[0], amount: c.value }));

  return (
    <div className="p-6 flex flex-col gap-6">
      <div>
        <h2 className="font-bold text-lg" style={{ color: 'var(--color-text-primary)' }}>Financial Insights</h2>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>Patterns and observations from your data</p>
      </div>

      {/* Key Insights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {topCategory && (
          <InsightCard
            icon={<Trophy size={18} />}
            title="Top Spending Category"
            value={topCategory.name}
            subtitle={`${formatCurrency(topCategory.value)} total`}
            color="200,169,81"
          />
        )}
        <InsightCard
          icon={<TrendingDown size={18} />}
          title="Savings Rate"
          value={`${savingsRate}%`}
          subtitle="Of total income saved"
          color={Number(savingsRate) > 20 ? '21,154,111' : '194,65,65'}
        />
        {expenseDelta !== null && (
          <InsightCard
            icon={Number(expenseDelta) > 0 ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
            title="Expense Trend"
            value={`${Number(expenseDelta) > 0 ? '↑' : '↓'} ${Math.abs(Number(expenseDelta))}% vs last month`}
            subtitle={`${lastMonth?.month} vs ${prevMonth?.month}`}
            color={Number(expenseDelta) > 0 ? '194,65,65' : '21,154,111'}
          />
        )}
        <InsightCard
          icon={<AlertCircle size={18} />}
          title="Total Transactions"
          value={`${transactions.length}`}
          subtitle={`${transactions.filter((t) => t.type === 'income').length} income · ${transactions.filter((t) => t.type === 'expense').length} expenses`}
          color="47,58,143"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Comparison Bar Chart */}
        <div className="card p-5 animate-fade-up">
          <div className="mb-4">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>Monthly Comparison</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>Income vs Expenses by month</p>
          </div>
          {monthlySummaries.length === 0 ? (
            <div className="h-52 flex items-center justify-center" style={{ color: 'var(--color-text-secondary)' }}>No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlySummaries} margin={{ top: 5, right: 5, left: 10, bottom: 5 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="income" name="Income" fill={colors[2]} radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill={colors[0]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Radar / Spending Pattern */}
        <div className="card p-5 animate-fade-up">
          <div className="mb-4">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>Spending Pattern</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>Category radar overview</p>
          </div>
          {radarData.length === 0 ? (
            <div className="h-52 flex items-center justify-center" style={{ color: 'var(--color-text-secondary)' }}>No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} />
                <Radar name="Spending" dataKey="amount" stroke={colors[0]} fill={colors[0]} fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="card p-5 animate-fade-up">
        <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--color-text-primary)' }}>Expense by Category</h3>
        <div className="flex flex-col gap-3">
          {categoryBreakdown.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: 'var(--color-text-secondary)' }}>No expense data available</p>
          ) : (
            categoryBreakdown.map((c, i) => {
              const pct = totals.expenses > 0 ? (c.value / totals.expenses) * 100 : 0;
              return (
                <div key={c.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: colors[i % colors.length] }}
                      />
                      <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{c.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{formatCurrency(c.value)}</span>
                      <span className="text-xs ml-2" style={{ color: 'var(--color-text-secondary)' }}>{pct.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: colors[i % colors.length] }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
