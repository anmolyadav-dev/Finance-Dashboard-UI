import type { Transaction } from '../types';

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const descriptions: Record<string, string[]> = {
  Salary: ['Monthly Salary', 'Payroll Deposit'],
  Freelance: ['Client Project – Alpha', 'Design Contract', 'Consulting Fee'],
  Investment: ['Dividend Payment', 'Stock Sale', 'ETF Return'],
  'Food & Dining': ['Zomato Order', 'Swiggy Delivery', 'Restaurant Dinner', 'Grocery Store', 'Coffee Shop'],
  Shopping: ['Amazon Purchase', 'Flipkart Order', 'H&M Clothing', 'Electronics Store'],
  Transport: ['Uber Ride', 'Metro Pass', 'Fuel Station', 'Ola Cab'],
  Entertainment: ['Netflix Premium', 'Spotify Subscription', 'Movie Tickets', 'Concert Tickets'],
  Healthcare: ['Pharmacy', 'Doctor Consultation', 'Lab Tests', 'Health Insurance'],
  Utilities: ['Electricity Bill', 'Water Bill', 'Internet Plan', 'Gas Bill'],
  Rent: ['Monthly Rent', 'Co-working Space'],
  Education: ['Udemy Course', 'Book Purchase', 'Online Subscription'],
  Travel: ['Hotel Booking', 'Flight Ticket', 'Train Ticket'],
};

function getRandomDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysAgo));
  return d.toISOString().split('T')[0];
}

export const mockTransactions: Transaction[] = (() => {
  const txs: Transaction[] = [];

  // Salary entries for last 6 months
  for (let i = 0; i < 6; i++) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    d.setDate(1);
    txs.push({
      id: crypto.randomUUID(),
      date: d.toISOString().split('T')[0],
      description: 'Monthly Salary',
      amount: 85000,
      type: 'income',
      category: 'Salary',
    });
  }

  // Freelance income
  const freelanceDates = [10, 25, 42, 65, 80, 100];
  freelanceDates.forEach((daysAgo) => {
    txs.push({
      id: crypto.randomUUID(),
      date: getRandomDate(daysAgo),
      description: descriptions['Freelance'][Math.floor(Math.random() * 3)],
      amount: Math.round(rand(15000, 45000)),
      type: 'income',
      category: 'Freelance',
    });
  });

  // Investment income
  [20, 50, 80].forEach((d) => {
    txs.push({
      id: crypto.randomUUID(),
      date: getRandomDate(d),
      description: descriptions['Investment'][Math.floor(Math.random() * 3)],
      amount: Math.round(rand(3000, 12000)),
      type: 'income',
      category: 'Investment',
    });
  });

  // Expenses
  const expenseCats = ['Food & Dining', 'Shopping', 'Transport', 'Entertainment', 'Healthcare', 'Utilities', 'Rent', 'Education', 'Travel'];
  const amounts: Record<string, [number, number]> = {
    'Food & Dining': [200, 2500],
    Shopping: [500, 8000],
    Transport: [100, 1500],
    Entertainment: [299, 3000],
    Healthcare: [500, 5000],
    Utilities: [800, 3500],
    Rent: [18000, 18000],
    Education: [299, 5000],
    Travel: [2000, 15000],
  };

  for (let i = 0; i < 80; i++) {
    const cat = expenseCats[Math.floor(Math.random() * expenseCats.length)];
    const [min, max] = amounts[cat];
    const descs = descriptions[cat];
    txs.push({
      id: crypto.randomUUID(),
      date: getRandomDate(180),
      description: descs[Math.floor(Math.random() * descs.length)],
      amount: Math.round(rand(min, max)),
      type: 'expense',
      category: cat,
    });
  }

  return txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
})();

export const categories = [
  'all', 'Salary', 'Freelance', 'Investment', 'Food & Dining', 'Shopping',
  'Transport', 'Entertainment', 'Healthcare', 'Utilities', 'Rent', 'Education', 'Travel',
];
