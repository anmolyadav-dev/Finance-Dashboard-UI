import {
  Banknote,
  Code,
  LineChart,
  Utensils,
  ShoppingBag,
  Bus,
  Film,
  HeartPulse,
  Zap,
  Home,
  GraduationCap,
  Plane,
  CircleDollarSign
} from 'lucide-react';

export function CategoryIcon({ category, size = 16, className = '' }: { category: string; size?: number; className?: string }) {
  switch (category) {
    case 'Salary': return <Banknote size={size} className={className} />;
    case 'Freelance': return <Code size={size} className={className} />;
    case 'Investment': return <LineChart size={size} className={className} />;
    case 'Food & Dining': return <Utensils size={size} className={className} />;
    case 'Shopping': return <ShoppingBag size={size} className={className} />;
    case 'Transport': return <Bus size={size} className={className} />;
    case 'Entertainment': return <Film size={size} className={className} />;
    case 'Healthcare': return <HeartPulse size={size} className={className} />;
    case 'Utilities': return <Zap size={size} className={className} />;
    case 'Rent': return <Home size={size} className={className} />;
    case 'Education': return <GraduationCap size={size} className={className} />;
    case 'Travel': return <Plane size={size} className={className} />;
    default: return <CircleDollarSign size={size} className={className} />;
  }
}
