# Anmol Finance Dashboard

A stunning, premium mock personal finance dashboard built strictly as an SPA using React 19, TypeScript, and Vite.

## 🚀 Features

- **Financial Summary**: High-level balance, income, and expenses cards.
- **Transactions Management**: Full-featured transaction table with robust filtering (Type, Category, Date), searching, and sorting.
- **Role-Based Access Control**: Fully functional simulated toggle between "Admin" and "Viewer" modes. Admins get edit/add rights, viewers are strictly read-only.
- **Insights & Visualizations**: Interactive Recharts integrations including balance area trend charts, category pie charts, and natural language smart insights.
- **Micro-Interactions**: Fluid, state-aware animations via Framer Motion for a truly premium "million-dollar app" feel.
- **Premium Aesthetics**: Sophisticated custom color variables, deep indigo/gold themes, gradient accents, and dark/light mode toggle.
- **Local Persistence**: State and preferences strictly persisted to LocalStorage via Zustand middleware.

## 🛠 Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Vanilla CSS custom variables
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **Date Handling**: date-fns

## 📦 Setup & Installation

Ensure you have Node.js 18+ installed.

1. Clone the repository and navigate to the directory:
   ```bash
   cd Desktop/zorvyn-intern
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open the application at [http://localhost:5173/](http://localhost:5173/).

## 💡 Architecture & Approach

This project focuses on **Extensibility** and **Premium UI**.
- **Zustand** was selected for state management due to its lightweight nature and incredibly simple persisting utilities, handling our mock backend flawlessly.
- **Framer Motion** was integrated deeply to make navigating between data feel liquid, utilizing stagger animations and layout transitions.
- **Tailwind** is augmented by native CSS Variables (`index.css`), keeping the theme dynamic while allowing arbitrary color toggles in JS.

## ✅ Requirements Fulfillment Checklist
- [x] Balance & transaction summaries
- [x] Transaction List + Filters (Category, Date, Type, Search)
- [x] Mock Roles (Admin vs User)
- [x] Distinct Insights & Visualizations
- [x] Fully Responsive Layout
- [x] LocalStorage Persistence *[Bonus]*
- [x] Dark Mode *[Bonus]*
- [x] Seamless Animations *[Bonus]*
- [x] Export to CSV/JSON *[Bonus]*
