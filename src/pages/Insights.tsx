import { useMemo } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { getTotals, getCategoryBreakdown, getMonthlySummaries, formatCurrency } from '../utils';
import { CategoryIcon } from '../components/CategoryIcon';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts';
import { Trophy, ArrowUp, ArrowDown, Zap, Lightbulb } from 'lucide-react';

const COLORS_LIGHT = ['#2F3A8F', '#C8A951', '#159A6F', '#6D5BD0', '#E87040', '#0EA5E9', '#A855F7'];
const COLORS_DARK  = ['#5B6CFF', '#E6C36A', '#22C55E', '#A78BFA', '#FB923C', '#38BDF8', '#C084FC'];

type InsightLevel = 'good' | 'warn' | 'info' | 'tip';

interface NLInsight {
  icon: React.ReactNode;
  text: string;
  level: InsightLevel;
}

const levelStyle: Record<InsightLevel, { bg: string; color: string; border: string }> = {
  good: { bg: 'rgba(21,154,111,0.08)', color: 'var(--color-profit)', border: 'rgba(21,154,111,0.2)' },
  warn: { bg: 'rgba(194,65,65,0.08)',  color: 'var(--color-loss)',   border: 'rgba(194,65,65,0.18)' },
  info: { bg: 'rgba(47,58,143,0.08)',  color: 'var(--color-primary)', border: 'rgba(47,58,143,0.15)' },
  tip:  { bg: 'rgba(200,169,81,0.1)',  color: 'var(--color-gold)',   border: 'rgba(200,169,81,0.2)' },
};

interface TooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card !rounded-xl p-3.5 shadow-2xl text-xs" style={{ minWidth: 150 }}>
      <p className="font-bold mb-1.5" style={{ color: 'var(--color-text-primary)' }}>{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex justify-between gap-4">
          <span style={{ color: 'var(--color-text-secondary)' }}>{p.name}</span>
          <span style={{ color: p.color, fontWeight: 700 }}>{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function Insights() {
  const transactions = useAppStore((s) => s.transactions);
  const theme = useAppStore((s) => s.theme);
  const colors = theme === 'dark' ? COLORS_DARK : COLORS_LIGHT;

  const totals = useMemo(() => getTotals(transactions), [transactions]);
  const categoryBreakdown = useMemo(() => getCategoryBreakdown(transactions), [transactions]);
  const monthlySummaries = useMemo(() => getMonthlySummaries(transactions).slice(-6), [transactions]);

  const topCategory = categoryBreakdown[0];
  const savingsRate = totals.income > 0 ? ((totals.balance / totals.income) * 100) : 0;

  const lastMonth = monthlySummaries[monthlySummaries.length - 1];
  const prevMonth = monthlySummaries[monthlySummaries.length - 2];
  const expenseDelta = lastMonth && prevMonth && prevMonth.expenses > 0
    ? ((lastMonth.expenses - prevMonth.expenses) / prevMonth.expenses * 100)
    : null;

  // Natural-language insights
  const nlInsights: NLInsight[] = [];
  if (topCategory) {
    nlInsights.push({
      icon: <Trophy size={15} />,
      text: `${topCategory.name} is your highest expense category at ${formatCurrency(topCategory.value)}, making up ${totals.expenses > 0 ? ((topCategory.value / totals.expenses) * 100).toFixed(0) : 0}% of total spending.`,
      level: 'warn',
    });
  }
  if (savingsRate > 0) {
    nlInsights.push({
      icon: <Zap size={15} />,
      text: `You saved ${savingsRate.toFixed(1)}% of your income${savingsRate >= 20 ? ' — excellent financial discipline! 🎉' : ' — try to push this above 20% for stronger savings.'}`,
      level: savingsRate >= 20 ? 'good' : 'info',
    });
  }
  if (expenseDelta !== null) {
    nlInsights.push({
      icon: expenseDelta > 0 ? <ArrowUp size={15} /> : <ArrowDown size={15} />,
      text: `Your spending ${expenseDelta > 0 ? 'increased' : 'decreased'} by ${Math.abs(expenseDelta).toFixed(1)}% compared to last month (${prevMonth?.month} → ${lastMonth?.month}).`,
      level: expenseDelta > 15 ? 'warn' : expenseDelta < 0 ? 'good' : 'info',
    });
  }
  if (totals.income > 0 && lastMonth) {
    const monthSavings = ((lastMonth.income - lastMonth.expenses) / (lastMonth.income || 1) * 100).toFixed(0);
    nlInsights.push({
      icon: <Lightbulb size={15} />,
      text: `This month you saved ${monthSavings}% of income. ${Number(monthSavings) > 25 ? 'Great month! 💪' : 'Consider reducing discretionary spending.'}`,
      level: Number(monthSavings) > 25 ? 'tip' : 'info',
    });
  }

  const radarData = categoryBreakdown.slice(0, 6).map((c) => ({ category: c.name.split(' ')[0], amount: c.value }));

  return (
    <div className="p-6 flex flex-col gap-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-extrabold text-xl" style={{ color: 'var(--color-text-primary)' }}>Financial Insights</h2>
        <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>Patterns and observations from your data</p>
      </motion.div>

      {/* Smart NL Insights */}
      {nlInsights.length > 0 && (
        <motion.div
          variants={container} initial="hidden" animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {nlInsights.map((ins, i) => {
            const s = levelStyle[ins.level];
            return (
              <motion.div
                key={i}
                variants={item}
                className="insight-card"
                style={{ background: s.bg, borderColor: s.border }}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: s.border, color: s.color }}
                >
                  {ins.icon}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
                  {ins.text}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* KPI cards */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Top Category', value: topCategory?.name ?? '—', sub: topCategory ? formatCurrency(topCategory.value) : '', color: 'var(--color-gold)' },
          { label: 'Savings Rate', value: `${savingsRate.toFixed(1)}%`, sub: 'of total income', color: savingsRate >= 20 ? 'var(--color-profit)' : 'var(--color-loss)' },
          { label: 'Expense Trend', value: expenseDelta !== null ? `${expenseDelta > 0 ? '↑' : '↓'} ${Math.abs(expenseDelta).toFixed(1)}%` : '—', sub: 'vs prior month', color: expenseDelta !== null && expenseDelta > 0 ? 'var(--color-loss)' : 'var(--color-profit)' },
          { label: 'Transactions', value: `${transactions.length}`, sub: `${transactions.filter(t => t.type === 'income').length} income · ${transactions.filter(t => t.type === 'expense').length} expenses`, color: 'var(--color-primary)' },
        ].map((k) => (
          <motion.div key={k.label} variants={item} className="card card-hover p-4">
            <p className="text-[0.68rem] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-secondary)' }}>{k.label}</p>
            <p className="text-2xl font-extrabold leading-none mb-1" style={{ color: k.color }}>{k.value}</p>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{k.sub}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div variants={item} className="card card-hover p-6">
          <div className="mb-5">
            <h3 className="font-bold text-base" style={{ color: 'var(--color-text-primary)' }}>Monthly Comparison</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>Income vs Expenses by month</p>
          </div>
          {monthlySummaries.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlySummaries} margin={{ top: 5, right: 5, left: 5, bottom: 5 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="income"   name="Income"   fill={colors[2]} radius={[6, 6, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill={colors[0]} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        <motion.div variants={item} className="card card-hover p-6">
          <div className="mb-5">
            <h3 className="font-bold text-base" style={{ color: 'var(--color-text-primary)' }}>Spending Pattern</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>Category radar overview</p>
          </div>
          {radarData.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} />
                <Radar name="Spending" dataKey="amount" stroke={colors[0]} fill={colors[0]} fillOpacity={0.22} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </motion.div>

      {/* Category Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="card card-hover p-6"
      >
        <h3 className="font-bold text-base mb-5" style={{ color: 'var(--color-text-primary)' }}>Expense by Category</h3>
        {categoryBreakdown.length === 0 ? (
          <p className="text-sm text-center py-8" style={{ color: 'var(--color-text-secondary)' }}>No expense data available</p>
        ) : (
          <div className="flex flex-col gap-4">
            {categoryBreakdown.map((c, i) => {
              const pct = totals.expenses > 0 ? (c.value / totals.expenses) * 100 : 0;
              return (
                <div key={c.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${colors[i % colors.length]}15`, color: colors[i % colors.length] }}>
                         <CategoryIcon category={c.name} size={13} />
                      </div>
                      <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{c.name}</span>
                    </div>
                    <div>
                      <span className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>{formatCurrency(c.value)}</span>
                      <span className="text-xs ml-2" style={{ color: 'var(--color-text-secondary)' }}>{pct.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.05 }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${colors[i % colors.length]}, ${colors[(i + 1) % colors.length]})` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
