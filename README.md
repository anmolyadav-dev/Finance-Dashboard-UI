# Zorvyn Finance Dashboard

A premium financial tracking dashboard built with React, TypeScript, Tailwind CSS, Recharts, and Zustand.

## 🚀 Setup

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

## ✨ Features

### Dashboard
- **Summary Cards** – Total Balance, Income, Expenses with live indicators
- **Balance Trend** – Area chart showing income vs. expenses over 6 months
- **Spending Breakdown** – Donut/pie chart by category
- **Recent Transactions** – Quick view of last 5 transactions

### Transactions
- **Full transaction list** with date, description, category, type, and amount
- **Search** – filter by keyword across description and category
- **Filter** – by transaction type (`income` / `expense`) and category
- **Sort** – by date or amount (ascending/descending)
- **Export** – download as CSV or JSON
- **Admin-only** – Add, Edit, and Delete transactions via modal

### Insights
- **Key Metric Cards** – highest spending category, savings rate, expense trend vs. prior month, total transaction count
- **Monthly Comparison** – grouped bar chart (income vs. expenses per month)
- **Spending Pattern** – radar chart across top categories
- **Category Breakdown** – animated progress bars showing % of total spending per category

## 🔐 Role-Based UI

Switch between roles using the **Role toggle** in the sidebar:

| Feature | Viewer | Admin |
|---|---|---|
| View dashboard, transactions, insights | ✅ | ✅ |
| Add transaction | ❌ | ✅ |
| Edit transaction | ❌ | ✅ |
| Delete transaction | ❌ | ✅ |

## 🎨 Theme

Toggle between **Light** and **Dark** mode via the sidebar. The chosen theme persists across sessions (via `localStorage`).

## 🗄️ State Management

Zustand store with `persist` middleware:
- Persists `transactions`, `role`, and `theme` to `localStorage`
- Centralized filters handled in-store
- Clean action-based API for mutations

## 📁 Project Structure

```
src/
├── components/
│   ├── Sidebar.tsx          # Navigation + role/theme toggles
│   ├── Topbar.tsx           # Page header + user role indicator
│   ├── StatCard.tsx         # Summary metric card
│   ├── TransactionRow.tsx   # Single table row (with admin actions)
│   └── TransactionModal.tsx # Add/Edit transaction form
├── pages/
│   ├── Dashboard.tsx        # Overview page
│   ├── Transactions.tsx     # Full transaction management
│   └── Insights.tsx         # Analytics and observations
├── store/
│   └── useAppStore.ts       # Zustand store
├── data/
│   └── mockData.ts          # Static mock transactions generator
├── types/
│   └── index.ts             # TypeScript types
└── utils/
    └── index.ts             # Formatting, export, aggregation helpers
```

## 🛠 Tech Stack

| Library | Purpose |
|---|---|
| React 19 + TypeScript | Core framework |
| Vite | Build tool |
| Tailwind CSS v4 | Utility-first styling |
| Recharts | Charts (Area, Bar, Pie, Radar) |
| Zustand | State management with persistence |
| Lucide React | Icons |
| date-fns | Date formatting and math |
