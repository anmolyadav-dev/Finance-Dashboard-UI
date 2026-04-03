import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/** Animated count-up hook */
function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const step = (ts: number) => {
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(eased * target));
      if (progress < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return value;
}

function formatINR(n: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);
}

type Variant = 'balance' | 'income' | 'expense';

interface MetaEntry {
  gradientCard: string;
  gradientIcon: string;
  tag: string;
  tagBg: string;
  tagColor: string;
}

const meta: Record<Variant, MetaEntry> = {
  balance: {
    gradientCard: 'stat-card-balance',
    gradientIcon: 'icon-ring-balance',
    tag: 'Net',
    tagBg: 'rgba(47,58,143,0.1)',
    tagColor: 'var(--color-primary)',
  },
  income: {
    gradientCard: 'stat-card-income',
    gradientIcon: 'icon-ring-income',
    tag: '↑ Income',
    tagBg: 'rgba(21,154,111,0.1)',
    tagColor: 'var(--color-profit)',
  },
  expense: {
    gradientCard: 'stat-card-expense',
    gradientIcon: 'icon-ring-expense',
    tag: '↓ Expenses',
    tagBg: 'rgba(194,65,65,0.1)',
    tagColor: 'var(--color-loss)',
  },
};

interface Props {
  title: string;
  value: number;
  subtitle?: string;
  variant?: Variant;
  icon: React.ReactNode;
  delay?: number;
}

export function StatCard({ title, value, subtitle, variant = 'balance', icon, delay = 0 }: Props) {
  const animated = useCountUp(value);
  const m = meta[variant];

  return (
    <motion.div
      className={`card card-hover ${m.gradientCard} p-6`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: delay / 1000 }}
    >
      <div className="flex items-start justify-between mb-5">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${m.gradientIcon}`}>
          {icon}
        </div>
        <span
          className="text-[0.68rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
          style={{ background: m.tagBg, color: m.tagColor }}
        >
          {m.tag}
        </span>
      </div>
      <p className="text-[0.78rem] font-semibold mb-1.5 tracking-wide uppercase" style={{ color: 'var(--color-text-secondary)' }}>
        {title}
      </p>
      <p className="text-[1.9rem] font-extrabold tracking-tight leading-none" style={{ color: 'var(--color-text-primary)' }}>
        {formatINR(animated)}
      </p>
      {subtitle && (
        <p className="text-xs mt-2" style={{ color: 'var(--color-text-secondary)' }}>{subtitle}</p>
      )}
    </motion.div>
  );
}
